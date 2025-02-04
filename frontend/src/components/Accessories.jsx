import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [showMessage, setShowMessage] = useState(false); // For success message
  const [selectedAccessory, setSelectedAccessory] = useState(null); // State for selected accessory
  const dispatch = useDispatch();
  const cartCount = useSelector((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0)
  );

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/accessories/")
      .then((response) => setAccessories(response.data))
      .catch((error) => console.error("Error fetching accessories:", error));
  }, []);

  const handleAddToCart = (accessory) => {
    dispatch(
      addItem({
        id: accessory._id,
        name: accessory.accessory_name,
        price: accessory.price,
        image: accessory.image,
      })
    );

    setShowMessage(true); // Show success message
    setTimeout(() => setShowMessage(false), 2000); // Hide after 2 sec
  };

  const handleViewDetails = (accessory) => {
    setSelectedAccessory(accessory); // Set selected accessory for details
  };

  const closeModal = () => {
    setSelectedAccessory(null); // Close the modal
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Shop Accessories
        </h1>

        {/* Cart Button with Count */}
        <div className="text-right mb-4">
          <button className="relative bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
            🛒 Cart ({cartCount})
          </button>
        </div>

        {/* Success Message */}
        {showMessage && (
          <div className="fixed top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
            ✅ Item added to cart!
          </div>
        )}

        {/* Accessories List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {accessories.map((accessory) => (
            <div
              key={accessory._id}
              className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <img
                className="w-full h-48 object-cover"
                src={accessory.image}
                alt={accessory.accessory_name}
              />
              <div className="px-6 py-4">
                <h2 className="font-bold text-xl mb-2 text-gray-800">
                  {accessory.accessory_name}
                </h2>
                <p className="text-lg font-semibold text-gray-800">
                  Rs. {accessory.price}
                </p>
              </div>
              <div className="px-6 pb-4">
                <button
                  onClick={() => handleAddToCart(accessory)}
                  className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 mb-2"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleViewDetails(accessory)}
                  className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Product Details */}
      {selectedAccessory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">{selectedAccessory.accessory_name}</h2>
            <img
              className="w-full h-48 object-cover mb-4"
              src={selectedAccessory.image}
              alt={selectedAccessory.accessory_name}
            />
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Rs. {selectedAccessory.price}
            </p>
            <p className="text-gray-700 mb-4">{selectedAccessory.description}</p>
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accessories;
