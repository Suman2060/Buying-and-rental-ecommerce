import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LoginPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To handle error message
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigation

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      dispatch(loginUser({ email, password }))
        .unwrap()
        .then(() => {
          onClose(); // Close the modal on successful login
          navigate("/"); // Redirect to the homepage after successful login
        })
        .catch((error) => {
          setErrorMessage(error); // Set error message on failure
        });
    } else {
      setErrorMessage("Please fill in both fields.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative transition-all transform ease-in-out duration-300">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Login</h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

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
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">Dont have an account?</p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:text-blue-700"
          >
            Register
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
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
