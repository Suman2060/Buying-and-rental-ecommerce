import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white-900 text-red-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/"> {/* Use Link instead of <a> */}
            <img src={logo} alt='Shop Logo' className='h-12 w-auto' />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className='hidden md:flex space-x-6'>
          <Link to="/" className="hover:text-blue-500">Home</Link> {/* Change <a> to <Link> */}
          <Link to="/shop" className="hover:text-blue-500">Shop</Link>
          <Link to="/rentals" className="hover:text-blue-500">Rentals</Link>
          <Link to="/booking" className="hover:text-blue-500">Booking</Link>
          <Link to="/accessories" className="hover:text-blue-500">Accessories</Link>
          <Link to="/contact" className="hover:text-blue-500">Contact</Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>      

        {/* User Options */}
        <div className="flex space-x-4">
          <Link to="/cart" className="hover:text-yellow-500">Cart</Link> {/* Use Link here */}
          <Link to="/account" className="hover:text-yellow-500">Account</Link> {/* Use Link here */}
        </div>

        {/* Hamburger Menu */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white">
          <Link to="/" className="block px-4 py-2 hover:bg-gray-700">Home</Link>
          <Link to="/shop" className="block px-4 py-2 hover:bg-gray-700">Shop</Link>
          <Link to="/rentals" className="block px-4 py-2 hover:bg-gray-700">Rentals</Link>
          <Link to="/booking" className="block px-4 py-2 hover:bg-gray-700">Booking</Link>
          <Link to="/about" className="block px-4 py-2 hover:bg-gray-700">About Us</Link>
          <Link to="/contact" className="block px-4 py-2 hover:bg-gray-700">Contact</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
