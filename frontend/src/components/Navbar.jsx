import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import cartLogo from "../assets/cart-logo.png";
import accountLogo from "../assets/account-logo.png";
import { logoutUser } from "../redux/slices/authSlice";
import LoginPopup from "./LoginPopup";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setLogoutMessage("You have successfully logged out.");
    
    setTimeout(() => {
      setLogoutMessage("");
      navigate("/");
    }, 2000);
  };

  return (
    <nav className="bg-white text-blue shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/">
          <img src={logo} alt="Shop Logo" className="h-12 w-auto" />
        </Link>
        
        <div className="hidden md:flex space-x-6">
          {["Home", "Shop", "Rentals", "Accessories", "Contact"].map((item) => (
            <Link key={item} to={`/${item.toLowerCase()}`} className="hover:text-green-500">
              {item}
            </Link>
          ))}
        </div>
        
        <div className="flex space-x-4">
          <Link to="/cart">
            <img src={cartLogo} alt="Cart" className="h-8 w-8" />
          </Link>
          
          <div className="relative dropdown">
            {token ? (
              <>
                <button onClick={() => setIsDropdownOpen((prev) => !prev)} className="flex items-center">
                  <img src={accountLogo} alt="Account" className="h-8 w-8" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">View Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200">
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button onClick={() => setShowLoginPopup(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      
      <button className="md:hidden focus:outline-none" onClick={() => setIsMenuOpen((prev) => !prev)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white">
          {["Home", "Shop", "Rentals", "Booking", "Accessories", "Contact"].map((item) => (
            <Link key={item} to={`/${item.toLowerCase()}`} className="block px-4 py-2 hover:bg-gray-700">
              {item}
            </Link>
          ))}
        </div>
      )}

      {logoutMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
          {logoutMessage}
        </div>
      )}

      {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
    </nav>
  );
};

export default Navbar;
