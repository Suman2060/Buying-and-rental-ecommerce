
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch logout action
  };

  return (
    <div className="logout-container">
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
