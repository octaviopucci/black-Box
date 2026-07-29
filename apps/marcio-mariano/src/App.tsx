import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

const PropertyDetailPage = lazy(() =>
  import('./pages/PropertyDetailPage').then((m) => ({ default: m.PropertyDetailPage })),
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
          <div className="flex min-h-screen items-center justify-center bg-chalk text-navy">
            <p className="font-display text-2xl">Márcio Mariano</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/imovel/:slug" element={<PropertyDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

