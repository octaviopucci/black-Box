import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { BrandMark } from './components/BrandMark'
import { Experience } from './pages/Experience'

const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
const ServicesPage = lazy(() =>
  import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
)
const ExperienceV2 = lazy(() =>
  import('./v2/pages/ExperienceV2').then((m) => ({ default: m.ExperienceV2 })),
)
const ServicesPageV2 = lazy(() =>
  import('./v2/pages/ServicesPageV2').then((m) => ({ default: m.ServicesPageV2 })),
)

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => window.clearTimeout(timer)
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
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-night">
            <BrandMark className="h-16 w-16" invert />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Experience />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/v2" element={<ExperienceV2 />} />
          <Route path="/v2/servicos" element={<ServicesPageV2 />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
