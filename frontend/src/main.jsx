import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { IoTProvider } from './context/IoTContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <IoTProvider>
          <App />
        </IoTProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
