import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../redux/slices/authSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Validate the form fields
  const validateForm = () => {
    const errors = {};
    if (!oldPassword) errors.oldPassword = "Old password is required.";
    if (!newPassword) errors.newPassword = "New password is required.";
    if (newPassword !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const passwordData = { old_password: oldPassword, new_password: newPassword };
      dispatch(changePassword(passwordData));
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>

      {/* Success and Error Messages */}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Old Password */}
        <div className="mb-4">
          <label htmlFor="oldPassword" className="block">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {formErrors.oldPassword && (
            <p className="text-red-500 text-sm">{formErrors.oldPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label htmlFor="newPassword" className="block">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {formErrors.newPassword && (
            <p className="text-red-500 text-sm">{formErrors.newPassword}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {formErrors.confirmPassword && (
            <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Changing password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
