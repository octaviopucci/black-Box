import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Experience } from './pages/Experience'
import { BrandMark } from './components/BrandMark'

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
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy">
            <BrandMark className="h-20 w-20" />
            <p className="font-brand text-3xl font-bold text-sun">G&amp;L Locações</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Experience />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
