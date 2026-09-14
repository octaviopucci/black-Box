import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { APP_DESCRIPTION, APP_NAME, isInteractive } from './config/variant'
import { setMarketProvider } from './services/providers'
import { ParallelumMarketProvider } from './services/fipe'
import './styles/index.css'

setMarketProvider(new ParallelumMarketProvider())

document.title = APP_NAME
const metaDescription = document.querySelector('meta[name="description"]')
if (metaDescription) metaDescription.setAttribute('content', APP_DESCRIPTION)
else if (isInteractive) {
  const meta = document.createElement('meta')
  meta.name = 'description'
  meta.content = APP_DESCRIPTION
  document.head.appendChild(meta)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
