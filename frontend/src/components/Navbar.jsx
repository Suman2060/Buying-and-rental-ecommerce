import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import cartLogo from "../assets/cart-logo.png";
import accountLogo from "../assets/account-logo.png";
import { logoutUser } from "../redux/slices/authSlice";
import LoginPopup from "./LoginPopup"; // Import the modal component

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State for login popup
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <nav className="bg-white text-blue shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Shop Logo" className="h-12 w-auto" />
          </Link>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-green-500">Home</Link>
          <Link to="/shop" className="hover:text-green-500">Shop</Link>
          <Link to="/rentals" className="hover:text-green-500">Rentals</Link>
          <Link to="/booking" className="hover:text-green-500">Booking</Link>
          <Link to="/accessories" className="hover:text-green-500">Accessories</Link>
          <Link to="/contact" className="hover:text-green-500">Contact</Link>
        </div>

        <div className="flex space-x-4">
          <Link to="/cart">
            <img src={cartLogo} alt="Cart" className="h-8 w-8 hover:text-yellow-500" />
          </Link>

          <div className="relative">
            {token ? (
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 hover:text-yellow-500"
              >
                <img src={accountLogo} alt="Account" className="h-8 w-8" />
                <span>Account</span>
              </button>
            ) : (
              <button onClick={() => setShowLoginPopup(true)}>
                <img src={accountLogo} alt="Account" className="h-8 w-8 hover:text-yellow-500" />
              </button>
            )}

            {isDropdownOpen && token && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md z-10">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
                <Link to="/change-password" className="block px-4 py-2 hover:bg-gray-200">Change Password</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button className="md:hidden focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white">
          <Link to="/" className="block px-4 py-2 hover:bg-gray-700">Home</Link>
          <Link to="/shop" className="block px-4 py-2 hover:bg-gray-700">Shop</Link>
          <Link to="/rentals" className="block px-4 py-2 hover:bg-gray-700">Rentals</Link>
          <Link to="/booking" className="block px-4 py-2 hover:bg-gray-700">Booking</Link>
          <Link to="/accessories" className="block px-4 py-2 hover:bg-gray-700">Accessories</Link>
          <Link to="/contact" className="block px-4 py-2 hover:bg-gray-700">Contact</Link>
        </div>
      )}

      {/* Render the login popup when showLoginPopup is true */}
      {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
    </nav>
  );
};

export default Navbar;
