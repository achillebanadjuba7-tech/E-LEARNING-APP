import { createRoot } from 'react-dom/client'
import '../../shared/branding.css'
import Nav from '../../shared/Nav'
import Footer from '../../shared/Footer'
import About from './About'

createRoot(document.getElementById('react-root')).render(
  <>
    <Nav />
    <About />
    <Footer />
  </>
)
