import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Resume from './pages/Resume.tsx'
import ResumeMaker from './pages/ResumeMaker.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/resume-maker" element={<ResumeMaker />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
