import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, logoutUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSignOutAlt, FaHome } from 'react-icons/fa';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const { purchaseHistory } = user || {};

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Your Profile</h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {user && (
          <div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold text-blue-700">User Information</h3>
              <div className="mt-4 space-y-2 text-gray-700">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {/* <p><strong>Address:</strong> {user.address || 'Not provided'}</p> */}
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
                <FaShoppingCart className="mr-2" /> Your Purchase History
              </h3>
              {purchaseHistory && purchaseHistory.length > 0 ? (
                <ul className="space-y-4">
                  {purchaseHistory.map((purchase, index) => (
                    <li key={index} className="p-4 border rounded-lg shadow-sm bg-white">
                      <p><strong>Product:</strong> {purchase.productName}</p>
                      <p><strong>Purchased on:</strong> {new Date(purchase.date).toLocaleDateString()}</p>
                      <p><strong>Price:</strong> ${purchase.price}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No purchase history available.</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleLogout}
                className="flex items-center px-5 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
              <button
                onClick={handleBackToHome}
                className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
              >
                <FaHome className="mr-2" /> Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
