import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { isInteractive } from './config/variant'
import { setMarketProvider } from './services/providers'
import { ParallelumMarketProvider } from './services/fipe'
import './styles/index.css'

setMarketProvider(new ParallelumMarketProvider())

if (isInteractive) {
  document.title = 'LP Motors Gestor'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
