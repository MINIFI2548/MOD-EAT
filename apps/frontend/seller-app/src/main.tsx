import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet, 
  }
  from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { RestaurantProvider } from './context/RestaurantContext';

const routers = createBrowserRouter([
  {
    path: '/',
    element: 
    <RestaurantProvider>
      <Outlet />
    </RestaurantProvider>,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />
      },

      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path:'/dashboard', 
        element:<DashboardPage />
                 
      }
    ],
  },
]);
  
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routers} />
  </StrictMode>,
)
