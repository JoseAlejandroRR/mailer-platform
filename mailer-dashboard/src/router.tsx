import { createBrowserRouter } from 'react-router-dom'

import DashboardPage from './pages/dashboard/DashboardPage'
import ErrorPage from './pages/ErrorPage'
import AdminLayout from './UI/layouts/AdminLayout'

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
    ],
  },
  /*{
    path:'/login',
    element: <LoginPage />
  },*/
])
