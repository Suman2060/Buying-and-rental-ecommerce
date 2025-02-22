import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";  // Import motion

const LoginPopup = ({ onClose }) => {
  const { token } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close popup automatically when user logs in
  useEffect(() => {
    if (token) {
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
        navigate("/profile"); // Redirect user after login
      }, 1500);
    }
  }, [token, navigate, onClose]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      dispatch(loginUser({ email, password }))
        .unwrap()
        .then(() => {
          setShowSuccess(true);
        })
        .catch((error) => {
          setErrorMessage(error.message || "Login failed. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setErrorMessage("Please fill in both fields.");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
    navigate("/"); // Redirect only after logout
  };

  const handleViewProfile = () => {
    onClose();
    navigate("/profile");
  };

  // Reset form fields when popup closes
  const handleClose = () => {
    setEmail("");
    setPassword("");
    setErrorMessage("");
    setShowSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative transition-all transform ease-in-out duration-300">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          {token ? "Welcome Back!" : "Login"}
        </h2>

        {showSuccess && (
          <motion.div
            className="bg-green-100 border border-green-300 text-green-700 p-2 rounded mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            Login Successful! Redirecting...
          </motion.div>
        )}

        {errorMessage && !showSuccess && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {!token ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <button
                type="button"
                onClick={() => navigate("/change-password")}
                className="text-blue-500 hover:text-blue-700"
              >
                Forgot?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <div>
            <button
              onClick={handleViewProfile}
              className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none"
            >
              View Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-lg mt-4 hover:bg-red-600 focus:outline-none"
            >
              Logout
            </button>
          </div>
        )}

        <div className="text-center mt-4">
          {!token && (
            <>
              <p className="text-sm text-gray-500">Don't have an account?</p>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-500 hover:text-blue-700"
              >
                Register
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-black"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

LoginPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LoginPopup;