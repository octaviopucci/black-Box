import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { ContentsPage } from '@/pages/ContentsPage'
import { ContentDetailPage } from '@/pages/ContentDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projetos/:slug" element={<ProjectDetailPage />} />
          <Route path="/conteudos" element={<ContentsPage />} />
          <Route path="/conteudos/:slug" element={<ContentDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
