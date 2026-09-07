"""API JSON pour les 4 pages publiques (accueil, cours, à propos, contact)
reconstruites en React. Pas de DRF : suit la même convention JsonResponse
"faite main" déjà utilisée ailleurs dans views.py (fetch_notifications,
check_nouveaux_messages, ...).
"""
import json

from django.core.paginator import Paginator
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from .models import Cours, Inscription, ContactMessage


@require_GET
def public_session(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'authenticated': False,
            'login_url': reverse('admin_login'),
            'register_url': reverse('register'),
        })

    return JsonResponse({
        'authenticated': True,
        'role': user.role,
        'prenom': user.prenom,
        'nom': user.nom,
        'dashboard_url': reverse('dashboard'),
        'logout_url': reverse('admin_logout'),
    })


@require_GET
def public_courses(request):
    cours_list = Cours.objects.select_related('categorie', 'enseignant').order_by('-date_publication', '-id')

    paginator = Paginator(cours_list, 6)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    inscriptions_existantes = set()
    if request.user.is_authenticated and request.user.is_etudiant:
        inscriptions_existantes = set(
            Inscription.objects.filter(etudiant=request.user.etudiant).values_list('cours_id', flat=True)
        )

    def serialize(cours):
        return {
            'id': cours.id,
            'titre': cours.titre,
            'niveau': cours.niveau,
            'image_url': cours.image.url if cours.image else None,
            'est_premium': cours.est_premium,
            'prix': str(cours.prix),
            'categorie': cours.categorie.nom if cours.categorie else None,
            'enseignant_nom': f"{cours.enseignant.prenom} {cours.enseignant.nom}",
            'date_publication': cours.date_publication.isoformat(),
            'deja_inscrit': cours.id in inscriptions_existantes,
            'achat_url': reverse('acheter_cours_premium', args=[cours.id]),
            'inscription_url': reverse('inscription_cours', args=[cours.id]),
        }

    return JsonResponse({
        'results': [serialize(c) for c in page_obj],
        'page': page_obj.number,
        'num_pages': paginator.num_pages,
        'has_previous': page_obj.has_previous(),
        'has_next': page_obj.has_next(),
        'count': paginator.count,
        'authenticated': request.user.is_authenticated,
        'is_etudiant': request.user.is_authenticated and request.user.is_etudiant,
        'login_url': reverse('admin_login'),
        'dashboard_url': reverse('dashboard'),
        'mes_courses_url': reverse('mes_courses'),
    })


@require_POST
def public_contact(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({'ok': False, 'errors': {'__all__': 'Requête invalide.'}}, status=400)

    nom = (data.get('nom') or '').strip()
    email = (data.get('email') or '').strip()
    message = (data.get('message') or '').strip()

    errors = {}
    if not nom:
        errors['nom'] = 'Le nom est obligatoire.'
    if not email or '@' not in email:
        errors['email'] = 'Adresse email invalide.'
    if not message:
        errors['message'] = 'Le message est obligatoire.'

    if errors:
        return JsonResponse({'ok': False, 'errors': errors}, status=400)

    ContactMessage.objects.create(nom=nom, email=email, message=message)
    return JsonResponse({'ok': True})
