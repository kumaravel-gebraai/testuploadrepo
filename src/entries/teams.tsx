import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Teams from '../pages/Teams'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Teams />
  </StrictMode>,
)
