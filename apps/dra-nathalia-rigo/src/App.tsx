import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from '@/components/Shell'

const HomePage = lazy(() => import('@/pages/HomePage'))
const ProcedimentosPage = lazy(() => import('@/pages/ProcedimentosPage'))
const ProcedimentoPage = lazy(() => import('@/pages/ProcedimentoPage'))
const SobrePage = lazy(() => import('@/pages/SobrePage'))
const ContatoPage = lazy(() => import('@/pages/ContatoPage'))
const PrivacidadePage = lazy(() => import('@/pages/PrivacidadePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export default function App() {
  return (
    <Shell>
      <Suspense fallback={<div className="min-h-[50vh] bg-cream" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/procedimentos" element={<ProcedimentosPage />} />
          <Route path="/procedimentos/:slug" element={<ProcedimentoPage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="/privacidade" element={<PrivacidadePage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/protocolos" element={<Navigate to="/procedimentos" replace />} />
          <Route path="/protocolos/:slug" element={<Navigate to="/procedimentos" replace />} />
          <Route path="/nathalia" element={<Navigate to="/sobre" replace />} />
          <Route path="/espaco" element={<Navigate to="/contato" replace />} />
          <Route path="/avaliacao" element={<Navigate to="/contato" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </Shell>
  )
}
