import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { ArenaPage } from '@/pages/ArenaPage'
import { GamePage } from '@/pages/GamePage'
import { ProtocoloPage } from '@/pages/ProtocoloPage'
import { QuizPage } from '@/pages/QuizPage'
import { QuizV2Page } from '@/pages/QuizV2Page'
import { PlanosPage } from '@/pages/PlanosPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz-v2" replace />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/quiz-v2" element={<QuizV2Page />} />
      <Route path="/planos" element={<PlanosPage />} />
      <Route path="/diagnostico" element={<Navigate to="/quiz-v2" replace />} />
      <Route path="/vendas" element={<HomePage />} />
      <Route path="/arena" element={<ArenaPage />} />
      <Route path="/arena/:gameId" element={<GamePage />} />
      <Route path="/protocolo" element={<ProtocoloPage />} />
      <Route path="/protocolopav" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
