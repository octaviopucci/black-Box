import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Experience } from './pages/Experience'

const VehiclePage = lazy(() =>
  import('./pages/VehiclePage').then((m) => ({ default: m.VehiclePage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-ink">
            <p className="font-display text-5xl font-bold tracking-tight text-paper-soft sm:text-6xl">
              NA
            </p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Experience />} />
          <Route path="/veiculo/:id" element={<VehiclePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
