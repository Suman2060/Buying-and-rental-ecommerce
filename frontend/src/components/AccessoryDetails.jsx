import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccessoryDetail, clearAccessoryDetail } from "../redux/slices/accessoryDetailSlice";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addItem } from "../redux/slices/cartSlice"; // Import the addItem action

const AccessoryDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessory, status, error } = useSelector((state) => state.accessoryDetail);
  const [otherAccessories, setOtherAccessories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    dispatch(fetchAccessoryDetail(id));

    return () => {
      dispatch(clearAccessoryDetail());
    };
  }, [dispatch, id]);

  // Fetch other accessories when button is clicked
  const loadOtherAccessories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/api/accessories/");
      setOtherAccessories(response.data);
    } catch (err) {
      console.error("Error fetching accessories:", err);
    }
  };

  // Handle Add to Cart with Redux and Popup Message
  const handleAddToCart = () => {
    if (accessory) {
      dispatch(addItem({ id: accessory._id, name: accessory.accessory_name, price: accessory.price }));
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Auto-hide after 3 seconds
    }
  };

  if (status === "loading") {
    return <div className="text-center py-20 text-gray-600 text-lg">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="text-center py-20 text-red-600 text-lg">Error: {error}</div>;
  }

  if (!accessory) {
    return <div className="text-center py-20 text-gray-600 text-lg">No accessory found</div>;
  }

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-6 md:px-12 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-900 transition"
        >
          ← Back
        </button>

        {/* Accessory Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-6 bg-white shadow-lg rounded-xl">
          {/* Image Section */}
          {accessory.image && (
            <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
              <img
                className="w-full h-full object-contain" // Ensures image fits container while keeping aspect ratio
                src={accessory.image}
                alt={accessory.accessory_name}
              />
            </div>
          )}
          
          {/* Details Section */}
          <div className="flex flex-col justify-between">
            <h1 className="text-4xl font-bold text-gray-800">{accessory.accessory_name}</h1>
            <p className="text-lg text-gray-600 mt-4">{accessory.description}</p>
            <p className="text-xl text-gray-600 mt-4">Compatible with: {accessory.compatible_with}</p>
            <p className="text-xl text-gray-600 mt-4">Material: {accessory.material}</p>
            <p className="text-xl text-gray-600 mt-4">Brand: {accessory.brand}</p>
            <p className="text-xl text-gray-600 mt-4">Category: {accessory.category}</p>
            <p className="text-2xl font-semibold text-green-700 mt-4">Rs. {accessory.price}</p>
            <button
              onClick={handleAddToCart}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Load Other Accessories Button */}
        <div className="text-center mt-10">
          <button
            onClick={loadOtherAccessories}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition"
          >
            Show Other Accessories
          </button>
        </div>

        {/* Display Other Accessories */}
        {otherAccessories.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherAccessories
              .filter(item => item._id !== accessory._id) // Exclude the current accessory
              .map(item => (
                <div key={item._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                  <img className="w-full h-48 object-cover rounded-md" src={item.image} alt={item.accessory_name} />
                  <h2 className="text-lg font-semibold text-gray-800 mt-3">{item.accessory_name}</h2>
                  <p className="text-gray-600">{item.brand}</p>
                  <p className="text-green-700 font-bold mt-2">Rs. {item.price}</p>
                  <button
                    onClick={() => navigate(`/accessory/${item._id}`)}
                    className="mt-3 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
                  >
                    View Details
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Add to Cart Popup Message */}
        {showPopup && (
          <div className="fixed bottom-10 right-10 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
            Item added to cart ✅
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default AccessoryDetails;
