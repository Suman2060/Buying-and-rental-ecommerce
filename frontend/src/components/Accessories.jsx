import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice"; // Action to fetch updated cart
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/blur.css";

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [loadingProductId, setLoadingProductId] = useState(null); // Track loading state per accessory
  const [showMessage, setShowMessage] = useState(false); // Success popup

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get authentication state from Redux
  const { token } = useSelector((state) => state.auth);

  // Fetch accessories data from API on mount
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/api/accessories/")
      .then((response) => setAccessories(response.data))
      .catch((error) => console.error("Error fetching accessories:", error));
  }, []);

  // Handle Add to Cart
  const handleAddToCart = async (accessory) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoadingProductId(accessory._id); // Set loading state for this accessory

    try {
      const payload = {
        item_id: accessory._id,                // Accessory ID
        item_type: "accessory",                // Specify this is an accessory
        item_name: accessory.accessory_name,   // Accessory name
        item_price: accessory.price,           // Accessory price
        quantity: 1,                           // Default quantity (adjust if needed)
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/cart/add/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data && response.data.cart_item) {
        console.log("Item added to cart:", response.data.cart_item);
        // Optionally, update the cart state in Redux
        dispatch(fetchCart(token));
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      } else {
        throw new Error("Unexpected response from the server");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      alert("Error adding to cart: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingProductId(null); // Reset loading state
    }
  };

  const handleViewDetails = (accessory) => {
    navigate(`/accessory/${accessory._id}`);
  };

  const filteredAccessories = accessories.filter(
    (accessory) =>
      accessory.accessory_name.toLowerCase().includes(filter.toLowerCase()) &&
      (categoryFilter === "" || accessory.category === categoryFilter) &&
      (brandFilter === "" || accessory.brand === brandFilter)
  );

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Shop Accessories</h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 w-full sm:w-80 text-gray-700 border border-gray-300 rounded-lg shadow-md focus:outline-none"
            placeholder="Search accessories..."
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none"
          >
            <option value="">All Categories</option>
            {[...new Set(accessories.map((a) => a.category))].map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none"
          >
            <option value="">All Brands</option>
            {[...new Set(accessories.map((a) => a.brand))].map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Success Popup Message */}
        {showMessage && (
          <div className="fixed top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
            ✅ Item added to cart!
          </div>
        )}

        {/* Accessories List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredAccessories.map((accessory) => (
            <div
              key={accessory._id}
              className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <LazyLoadImage
                src={accessory.image}
                alt={accessory.accessory_name}
                effect="blur"
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => handleViewDetails(accessory)}
              />
              <div className="px-6 py-4">
                <h2
                  className="font-bold text-xl mb-2 text-gray-800 cursor-pointer hover:text-blue-500"
                  onClick={() => handleViewDetails(accessory)}
                >
                  {accessory.accessory_name}
                </h2>
                <p className="text-lg font-semibold text-gray-800">Rs. {accessory.price}</p>
              </div>
              <div className="px-6 pb-4 flex justify-between gap-4">
                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(accessory)}
                  className={`w-full py-2 px-4 text-center rounded-md font-semibold transition-all duration-300 ease-in-out focus:outline-none ${
                    loadingProductId === accessory._id
                      ? "bg-gray-300 cursor-not-allowed"
                      : token
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!token || loadingProductId === accessory._id}
                >
                  {loadingProductId === accessory._id
                    ? "Adding..."
                    : token
                    ? "Add to Cart"
                    : "Login to Add"}
                </button>
                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(accessory)}
                  className="w-full py-2 px-4 bg-gray-600 text-white rounded-md font-semibold transition-all duration-300 ease-in-out hover:bg-gray-700 focus:outline-none"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accessories;
