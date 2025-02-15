import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, logoutUser } from '../redux/slices/authSlice'; // Adjust the path to your authSlice
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const { purchaseHistory } = user || {}; // Assuming purchaseHistory is part of the user object

  useEffect(() => {
    dispatch(getUserProfile()); // Fetch user profile data on component mount
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch logout action
    navigate('/'); // Redirect to home page after logout
  };

  const handleBackToHome = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="profile-container p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message text-red-500">{error}</p>}

      {user && (
        <div>
          <div className="profile-details mb-8">
            <h3 className="text-xl font-semibold">User Information</h3>
            <div className="user-info mt-4">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
              {/* Add other user fields if needed */}
            </div>
          </div>

          <div className="purchase-history mb-8">
            <h3 className="text-xl font-semibold mb-4">Your Purchase History</h3>
            {purchaseHistory && purchaseHistory.length > 0 ? (
              <ul className="space-y-4">
                {purchaseHistory.map((purchase, index) => (
                  <li key={index} className="p-4 border rounded-lg shadow-md">
                    <p><strong>Product:</strong> {purchase.productName}</p>
                    <p><strong>Purchased on:</strong> {new Date(purchase.date).toLocaleDateString()}</p>
                    <p><strong>Price:</strong> ${purchase.price}</p>
                    {/* Add more details like quantity, payment status, etc., if needed */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No purchase history available.</p>
            )}
          </div>

          {/* Logout and Back to Home Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
            <button
              onClick={handleBackToHome}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
