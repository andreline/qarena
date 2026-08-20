import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App.tsx'
import { ToastProvider } from '@/components/ui/Toast'
import './index.css'

console.log(
  '%cQArena%c\nSe você chegou até aqui pelo DevTools, já está pensando como QA. Bom sinal.\nSão 33 bugs plantados. Boa caçada.',
  'font-size: 20px; font-weight: bold; color: #22d3ee;',
  'font-size: 13px; color: #9a9ab0;',
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
