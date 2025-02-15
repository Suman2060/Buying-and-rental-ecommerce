import { Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import ChangePassword from '../components/ChangePassword';
import Profile from '../components/Profile';

const AuthPage = () => {
  return (
    <div>
      <Routes>
        {/* Define routes for different authentication-related pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </div>
  );
};

export default AuthPage;
