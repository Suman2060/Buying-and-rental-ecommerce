import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthPage from './AuthPage'; // Authentication page (Login/Register)

// Account component that conditionally renders authentication page or user profile
const Account = () => {
  const { token } = useSelector((state) => state.auth); // Check if user is logged in

  return (
    <div>
      <Navbar />
      {!token ? (
        // If not logged in, show authentication page (Login/Register)
        <AuthPage />
      ) : (
        // If logged in, show link to user profile
        <div className="flex justify-center items-center p-8">
          <Link
            to="/profile"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Go to Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default Account;
