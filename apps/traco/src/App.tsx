import { Navigate, Route, Routes } from 'react-router-dom'
import { GalleryPage } from '@/pages/GalleryPage'
import { LandingPage } from '@/pages/LandingPage'
import { StudioPage } from '@/pages/StudioPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/studio/:docId" element={<StudioPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
