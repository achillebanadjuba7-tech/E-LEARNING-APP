"""Connexion sans mot de passe : l'utilisateur saisit son email, reçoit un
code à 6 chiffres par email, puis l'entre pour accéder à son espace.

Remplace l'ancienne connexion par mot de passe (admin_login). Le mot de passe
reste utilisé à l'inscription (obligatoire pour créer un compte Django) mais
n'est plus jamais redemandé pour se connecter.
"""
import random
from datetime import datetime, timedelta

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.utils import timezone

from .models import User
from .views import get_dashboard_redirect, _log

OTP_VALIDITE_MINUTES = 10
OTP_MAX_TENTATIVES = 5


def _verify_context(request, user):
    """Contexte pour le template de vérification. Tant qu'aucun vrai SMTP
    n'est configuré (EMAIL_BACKEND = console), le code est affiché à l'écran
    en mode développement pour permettre de tester le flux sans boîte mail
    réelle (même logique que otp_dev sur la simulation PayGate)."""
    context = {'email': user.email}
    if settings.EMAIL_BACKEND == 'django.core.mail.backends.console.EmailBackend':
        context['otp_dev'] = request.session.get('login_otp_code')
    return context


def _generer_et_envoyer_otp(request, user):
    code = f"{random.randint(0, 999999):06d}"
    request.session['login_otp_code'] = code
    request.session['login_otp_user_id'] = user.id
    request.session['login_otp_expires'] = (timezone.now() + timedelta(minutes=OTP_VALIDITE_MINUTES)).isoformat()
    request.session['login_otp_tentatives'] = 0

    message = (
        f"Bonjour {user.prenom},\n\n"
        f"Votre code de connexion OpenEduVerse est : {code}\n\n"
        f"Ce code est valable {OTP_VALIDITE_MINUTES} minutes. Ne le partagez avec personne.\n\n"
        f"Si vous n'êtes pas à l'origine de cette demande, ignorez cet email."
    )
    send_mail(
        subject="Votre code de connexion OpenEduVerse",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=True,
    )


def demander_code(request):
    """Étape 1 : email + mot de passe. Si valides, un code est envoyé par
    email pour la seconde étape (double authentification)."""
    if request.user.is_authenticated:
        return get_dashboard_redirect(request.user)

    if request.method == 'POST':
        email = (request.POST.get('email') or '').strip().lower()
        password = request.POST.get('password') or ''
        user = authenticate(request, email=email, password=password)

        if not user or not user.is_active:
            messages.error(request, "Email ou mot de passe incorrect.")
            return render(request, 'react/login.html')

        _generer_et_envoyer_otp(request, user)
        messages.success(request, f"Un code de sécurité a été envoyé à {user.email}.")
        return redirect('verifier_code')

    return render(request, 'react/login.html')


def verifier_code(request):
    """Étape 2 : l'utilisateur saisit le code reçu par email."""
    user_id = request.session.get('login_otp_user_id')
    user = User.objects.filter(id=user_id).first() if user_id else None

    if not user:
        return redirect('admin_login')

    if request.method == 'POST':
        if 'renvoyer' in request.POST:
            _generer_et_envoyer_otp(request, user)
            messages.success(request, "Un nouveau code vous a été envoyé.")
            return render(request, 'react/verify_otp.html', _verify_context(request, user))

        expires_at = request.session.get('login_otp_expires')
        expire = not expires_at or timezone.now() > datetime.fromisoformat(expires_at)

        if expire:
            for key in ('login_otp_code', 'login_otp_user_id', 'login_otp_expires', 'login_otp_tentatives'):
                request.session.pop(key, None)
            messages.error(request, "Ce code a expiré. Veuillez recommencer.")
            return redirect('admin_login')

        tentatives = request.session.get('login_otp_tentatives', 0)
        if tentatives >= OTP_MAX_TENTATIVES:
            for key in ('login_otp_code', 'login_otp_user_id', 'login_otp_expires', 'login_otp_tentatives'):
                request.session.pop(key, None)
            messages.error(request, "Trop de tentatives. Veuillez recommencer.")
            return redirect('admin_login')

        code_saisi = (request.POST.get('code') or '').strip()
        if code_saisi == request.session.get('login_otp_code'):
            for key in ('login_otp_code', 'login_otp_user_id', 'login_otp_expires', 'login_otp_tentatives'):
                request.session.pop(key, None)
            login(request, user)
            _log(request, user, "Connexion réussie (code email)")
            return get_dashboard_redirect(user)

        request.session['login_otp_tentatives'] = tentatives + 1
        messages.error(request, "Code incorrect. Veuillez réessayer.")

    return render(request, 'react/verify_otp.html', _verify_context(request, user))
