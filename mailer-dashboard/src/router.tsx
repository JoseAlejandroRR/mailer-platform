import { createBrowserRouter } from 'react-router-dom'

import DashboardPage from './pages/dashboard/DashboardPage'
import ErrorPage from './pages/ErrorPage'
import AdminLayout from './UI/layouts/AdminLayout'
import MailerPage from './pages/mailer/MailerPage'
import ProvidesPage from './pages/providers/ProvidesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path:'/',
        element: <DashboardPage />,
      },
      {
        path: '/mailer',
        element: <MailerPage />,
      },
      {
        path: '/providers',
        element: <ProvidesPage />,
      }
    ],
  }
])
