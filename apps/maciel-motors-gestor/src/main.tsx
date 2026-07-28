import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { isInteractive } from './config/variant'
import './styles/index.css'

if (isInteractive) {
  document.title = 'Maciel Motors Gestor X · Interativo'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
