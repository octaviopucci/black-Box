import { Navigate, Route, Routes } from 'react-router-dom'
import { QuizPage } from '@/pages/QuizPage'
import { QuizV2Page } from '@/pages/QuizV2Page'
import { PlanosPage } from '@/pages/PlanosPage'
import { CadastroPage } from '@/pages/CadastroPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz-v2" replace />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/quiz-v2" element={<QuizV2Page />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/planos" element={<PlanosPage />} />
      <Route path="/diagnostico" element={<Navigate to="/quiz-v2" replace />} />
      <Route path="/vendas" element={<Navigate to="/quiz-v2" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
