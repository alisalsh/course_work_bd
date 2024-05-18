import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Film from './pages/Film.tsx'
import Screening from './pages/Screening.tsx'
import Notfound from './pages/Notfound.tsx'
import Login from './pages/Login.tsx'
import Admin from './pages/Admin.tsx'
import Registr from './pages/Registr.tsx'
import TicketPay from './pages/TicketPay.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Film />,
    errorElement: <Notfound />,
  },
  {
    path: '/screening',
    element: <Screening />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/addfilms/adminpage',
    element: <Admin />
  },
  {
    path: '/registration',
    element: <Registr />,
  },
  {
    path: '/ticketpayment',
    element: <TicketPay />,
  },
  
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} /> 
  </React.StrictMode>,
)
