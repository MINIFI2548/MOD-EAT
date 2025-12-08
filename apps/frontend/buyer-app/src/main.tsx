import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './index.css'
import SelectRestaurantPage from './page/SelectRestaurantPage'
import RestaurantMenuPage from './page/RestaurantMenuPage'
import { CartProvider } from './context/CartContext'
import CartPage from './page/CartPage'
import PaymentPage from './page/PaymentPage'

const router = createBrowserRouter([
{
    path: '/',
    element: (
      <CartProvider>
        <Outlet />
      </CartProvider>
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
      },
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />  
  </StrictMode>,
)
