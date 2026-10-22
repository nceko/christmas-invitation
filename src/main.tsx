import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Penanda sumber mudah diverifikasi dari browser Developer Tools.
console.info('%cNATAL DIGITAL V5 RED CHRISTMAS — SUMBER BARU AKTIF', 'background:#9e2134;color:#ffe1aa;padding:8px 12px;font-weight:bold')

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
