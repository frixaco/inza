import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { App } from './app'
import { applyTheme, type Theme } from './settings'
import './styles.css'
import './receipt.css'

applyTheme((localStorage.getItem('inza-theme') as Theme) ?? 'system')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
