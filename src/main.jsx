// main.jsx - Ponto de entrada da aplicação React
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Renderiza o componente raiz na div#root do index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
