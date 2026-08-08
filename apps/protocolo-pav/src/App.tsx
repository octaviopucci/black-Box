import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { ArenaPage } from '@/pages/ArenaPage'
import { GamePage } from '@/pages/GamePage'
import { ProtocoloPage } from '@/pages/ProtocoloPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/arena" element={<ArenaPage />} />
      <Route path="/arena/:gameId" element={<GamePage />} />
      <Route path="/protocolo" element={<ProtocoloPage />} />
      <Route path="/protocolopav" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
