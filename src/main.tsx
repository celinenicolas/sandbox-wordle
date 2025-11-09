import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { WordleApp } from './WordleApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WordleApp maxAttempts={6} wordLength={5} />
  </StrictMode>,
)
