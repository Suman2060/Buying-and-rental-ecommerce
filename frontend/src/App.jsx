import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Rental from './pages/Rental';
import Booking from './pages/Booking';
import Contact_us from './pages/Contact_us';
import AcessoriesSection from './pages/AcessoriesSection';
import AccessoryDetails from './components/AccessoryDetails';
import ProductDetails from './components/ProductDetails';
import Profile from './components/Profile';
import Account from './pages/Account'; // Include Account page for authentication flow
import ProtectedRoute from './components/ProtectedRoute'; // Protect Profile route
import RegisterPage from './pages/RegisterPage'; // Import RegisterPage
import PasswordChange from './pages/PasswordChange'; // Import Change Password Page
import AddToCartPage from './components/Addtocart';
import PaymentSuccess from "./pages/PaymentSuccess";

// import AddToCartPage from './pages/AddtoCart';

const App = () => {
  return (
    <BrowserRouter>
      {/* Optionally, include Navbar here */}
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/rentals" element={<Rental />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact_us />} />
        <Route path="/accessories" element={<AcessoriesSection />} />
        <Route path="/accessory/:id" element={<AccessoryDetails />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="Cart/" element={<AddToCartPage/>}/>
        {/* Authentication Routes */}
        <Route path="/account/*" element={<Account />} /> {/* Handles login, register, etc. */}
        <Route path="/register" element={<RegisterPage />} /> {/* Register Page Route */}
        <Route path="/change-password" element={<PasswordChange />} /> {/* Change Password Route */}
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Protected Routes */}
        <Route
          path="/Profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for other routes */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
