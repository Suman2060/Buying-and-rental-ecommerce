import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const [logoutMessage, setLogoutMessage] = useState("");

  const handleLogout = () => {
    dispatch(logoutUser());
    setLogoutMessage("You have successfully logged out.");
    
    // Clear the message after 2 seconds
    setTimeout(() => {
      setLogoutMessage("");
    }, 2000);
  };

  return (
    <div>
      <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
        Logout
      </button>
      {logoutMessage && <p className="text-green-600 mt-2">{logoutMessage}</p>}
    </div>
  );
};

export default LogoutButton;
