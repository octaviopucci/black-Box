import { Navigate, Route, Routes } from 'react-router-dom'
import { QuizPage } from '@/pages/QuizPage'
import { PlanosPage } from '@/pages/PlanosPage'
import { CadastroPage } from '@/pages/CadastroPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz" replace />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/planos" element={<PlanosPage />} />
      <Route path="/diagnostico" element={<Navigate to="/quiz" replace />} />
      <Route path="/vendas" element={<Navigate to="/quiz" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
