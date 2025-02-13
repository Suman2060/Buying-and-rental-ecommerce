import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { createBrowserRouter,RouterProvider} from 'react-router-dom'
import  { StrictMode } from 'react'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Rental from './pages/Rental.jsx'
import Booking from './pages/Booking.jsx'
import Contact_us from './pages/Contact_us.jsx'
import AcessoriesSection from './pages/AcessoriesSection.jsx'
import Account from './pages/Account.jsx'
import AddtoCart from './pages/AddtoCart.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import AccessoryDetails from './components/AccessoryDetails.jsx'
import ProductDetails from './components/ProductDetails.jsx'




const router =createBrowserRouter([
  
  {
    path: '/',
    element:  <Home />
  },
  {
    path: '/shop',
    element: <Shop />,
  },
  {
    path: '/rentals',
    element:<Rental/>
  },
  {
    path:'/booking',
    element:<Booking/>
  },
  {
    path: '/accessories',
    element:<AcessoriesSection/>
  },
  {
    path: '/contact',
    element:<Contact_us/>
  },
  {
    path: '/account',
    element: <Account/>
  },
  {
    path: '/cart',
    element: <AddtoCart/>
  },
  {
    path: '/accessory/:id',
    element:<AccessoryDetails />
  },
  {
    path:'/product/:id',
    element:<ProductDetails/>
  }




])

createRoot(document.getElementById('root')).render(
       <StrictMode>
        <Provider store={store}>
           <RouterProvider router={router}/>
        </Provider>
        
        

       </StrictMode>
)
