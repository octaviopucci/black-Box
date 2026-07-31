import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

const SobrePage = lazy(() =>
  import('./pages/SobrePage').then((m) => ({ default: m.SobrePage })),
)
const EndodontiaPage = lazy(() =>
  import('./pages/EndodontiaPage').then((m) => ({ default: m.EndodontiaPage })),
)
const EspacoPage = lazy(() =>
  import('./pages/EspacoPage').then((m) => ({ default: m.EspacoPage })),
)
const AgendarPage = lazy(() =>
  import('./pages/AgendarPage').then((m) => ({ default: m.AgendarPage })),
)
const PrivacidadePage = lazy(() =>
  import('./pages/PrivacidadePage').then((m) => ({ default: m.PrivacidadePage })),
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
          <div className="flex min-h-screen items-center justify-center bg-wine-deep">
            <p className="font-display text-4xl tracking-tight text-rose-soft sm:text-5xl">
              Danielle
            </p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/endodontia" element={<EndodontiaPage />} />
          <Route path="/espaco" element={<EspacoPage />} />
          <Route path="/agendar" element={<AgendarPage />} />
          <Route path="/privacidade" element={<PrivacidadePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
