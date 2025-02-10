import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode> //useEffect 2번 호출되는거 막기위해 주석
    <App />
  // </StrictMode>,
)
