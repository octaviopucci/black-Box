import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

const PropertiesPage = lazy(() =>
  import('./pages/PropertiesPage').then((m) => ({ default: m.PropertiesPage })),
)
const PropertyDetailPage = lazy(() =>
  import('./pages/PropertyDetailPage').then((m) => ({ default: m.PropertyDetailPage })),
)
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ServicesPage = lazy(() =>
  import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
)
const AppraisalPage = lazy(() =>
  import('./pages/AppraisalPage').then((m) => ({ default: m.AppraisalPage })),
)
const ListPropertyPage = lazy(() =>
  import('./pages/ListPropertyPage').then((m) => ({ default: m.ListPropertyPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-paper text-blue-deep">
            <p className="font-display text-2xl font-semibold">Márcio Mariano</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/imoveis" element={<PropertiesPage />} />
          <Route path="/imovel/:slug" element={<PropertyDetailPage />} />
          <Route path="/empresa" element={<AboutPage />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/avaliacao" element={<AppraisalPage />} />
          <Route path="/anunciar" element={<ListPropertyPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
