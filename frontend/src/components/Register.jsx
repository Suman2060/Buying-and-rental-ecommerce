import  { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    tc: false,
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    tc: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.password) errors.password = "Password is required.";
    if (formData.password !== formData.password2) errors.password2 = "Passwords must match.";
    if (!formData.tc) errors.tc = "You must accept the terms and conditions.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { name, email, password } = formData;
      dispatch(registerUser({ name, email, password }))
        .then(() => {
          // Redirect after successful registration
          navigate("/login"); // You can redirect to login page or home page
        })
        .catch(() => {
          // Handle failed registration (if needed)
        });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      {/* Success and Error Messages */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label htmlFor="password2" className="block">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formErrors.password2 && <p className="text-red-500 text-sm">{formErrors.password2}</p>}
        </div>

        {/* Terms and Conditions */}
        <div className="mb-4">
          <label htmlFor="tc" className="block flex items-center">
            <input
              type="checkbox"
              id="tc"
              name="tc"
              checked={formData.tc}
              onChange={handleChange}
              className="mr-2"
            />
            I agree to the Terms and Conditions
          </label>
          {formErrors.tc && <p className="text-red-500 text-sm">{formErrors.tc}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
