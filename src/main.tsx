import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/big-shoulders-display/latin-900'
import '@fontsource/big-shoulders-display/latin-700'
import '@fontsource/archivo/latin-400'
import '@fontsource/archivo/latin-600'
import '@fontsource/archivo/latin-700'
import '@fontsource/jetbrains-mono/latin-400'
import '@fontsource/jetbrains-mono/latin-600'
import '@fontsource/instrument-serif/latin-400'
import '@fontsource/instrument-serif/latin-400-italic'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
