import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './styles/global.css'


// Define las rutas principales
// Usamos HashRouter para evitar conflictos con la configuración de servidor de Nginx
const router = createHashRouter([
  {
    path: '/*',
    element: <App />,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)