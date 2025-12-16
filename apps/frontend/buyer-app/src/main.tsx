import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './index.css'
import SelectRestaurantPage from './page/SelectRestaurantPage'
import RestaurantMenuPage from './page/RestaurantMenuPage'
import { CartProvider } from './context/CartContext'
import CartPage from './page/CartPage'
import PaymentPage from './page/PaymentPage'
import OrderHistoryPage from './page/OrderHistoryPage'
import { WebSocketProvider } from './context/WebSocketContext'
import { ToastProvider } from './context/ToastContext'

const router = createBrowserRouter([
{
    path: '/',
    element: (
      <WebSocketProvider >
        <CartProvider>
          <Outlet />
        </CartProvider>
      </WebSocketProvider>
    ),
    children: [
      {
        path: 'menu',
        element: <RestaurantMenuPage />
      },
      {
        path: 'cart',
        element: <CartPage />
      },
      {
        path: 'payment',
        element: <PaymentPage />
      }, 
      {
        path:'/',
        element:<SelectRestaurantPage />
      },{
        path:'/history', 
        element:<OrderHistoryPage />
      }
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
    <RouterProvider router={router} /> 
    </ToastProvider> 
  </StrictMode>,
)
