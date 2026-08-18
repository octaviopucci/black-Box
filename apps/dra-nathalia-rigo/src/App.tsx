import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Atelier } from '@/components/Atelier'

const HomePage = lazy(() => import('@/pages/HomePage'))
const ProtocolosPage = lazy(() => import('@/pages/ProtocolosPage'))
const ProtocoloPage = lazy(() => import('@/pages/ProtocoloPage'))
const NathaliaPage = lazy(() => import('@/pages/NathaliaPage'))
const EspacoPage = lazy(() => import('@/pages/EspacoPage'))
const AvaliacaoPage = lazy(() => import('@/pages/AvaliacaoPage'))
const PrivacidadePage = lazy(() => import('@/pages/PrivacidadePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export default function App() {
  return (
    <Atelier>
      <Suspense fallback={<div className="min-h-dvh bg-fog" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/protocolos" element={<ProtocolosPage />} />
          <Route path="/protocolos/:slug" element={<ProtocoloPage />} />
          <Route path="/nathalia" element={<NathaliaPage />} />
          <Route path="/espaco" element={<EspacoPage />} />
          <Route path="/avaliacao" element={<AvaliacaoPage />} />
          <Route path="/privacidade" element={<PrivacidadePage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </Atelier>
  )
}
