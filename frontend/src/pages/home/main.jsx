import { createRoot } from 'react-dom/client'
import '../../shared/branding.css'
import Nav from '../../shared/Nav'
import Footer from '../../shared/Footer'
import Home from './Home'

createRoot(document.getElementById('react-root')).render(
  <>
    <Nav />
    <Home />
    <Footer />
  </>
)
