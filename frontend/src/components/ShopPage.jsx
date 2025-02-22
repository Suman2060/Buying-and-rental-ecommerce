import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/blur.css";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State for the success popup message

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get authentication state from Redux
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/api/product/")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleAddToCart = async (product) => {
    if (!token) {
      navigate("/login"); // Redirect to login if the user is not authenticated
      return;
    }

    setLoadingProductId(product._id); // Set loading state for the product being added to the cart

    try {
      const payload = {
        item_id: product._id,              // Product ID
        item_type: "product",               // Item type is "product"
        item_name: product.productname,     // Product name
        item_price: product.price,          // Product price
        quantity: 1,                        // Default quantity (can be adjusted if needed)
      };

      // Make the API call to add the product to the cart
      const response = await axios.post(
        "http://127.0.0.1:8000/api/cart/add/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header with the token
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response from the server
      if (response && response.data && response.data.cart_item) {
        console.log("Product added to cart:", response.data.cart_item);
        dispatch(fetchCart(token)); // Update Redux with the new cart state
        setShowPopup(true); // Show success popup
        setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
      } else {
        throw new Error("Unexpected response from the server");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error.response?.data || error.message);
      alert("Error adding product to cart: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingProductId(null); // Reset loading state after request is completed
    }
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.productname.toLowerCase().includes(filter.toLowerCase()) &&
      (categoryFilter === "" || product.productcategory === categoryFilter) &&
      (brandFilter === "" || product.productbrand === brandFilter)
  );

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Shop Our Bikes</h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 w-full sm:w-80 text-gray-700 border border-gray-300 rounded-lg shadow-md focus:outline-none"
            placeholder="Search for bikes..."
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none"
          >
            <option value="">All Categories</option>
            {[...new Set(products.map((p) => p.productcategory))].map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none"
          >
            <option value="">All Brands</option>
            {[...new Set(products.map((p) => p.productbrand))].map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <LazyLoadImage src={product.image} alt={product.productname} effect="blur" className="w-full h-48 object-cover" />
              <div className="px-6 py-4">
                <h2 className="font-bold text-xl mb-2 text-gray-800">{product.productname}</h2>
                <p className="text-lg font-semibold text-gray-800">Rs. {product.price}</p>
              </div>
              <div className="px-6 pb-4 flex justify-between">
                <button
                  onClick={() => handleViewDetails(product)}
                  className="text-blue-600 font-semibold hover:underline transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`font-semibold px-4 py-1 rounded-lg transition ${
                    loadingProductId === product._id ? "bg-gray-400 cursor-not-allowed" : token ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!token || loadingProductId === product._id}
                >
                  {loadingProductId === product._id ? "Adding..." : token ? "Add to Cart" : "Login to Add"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Success Popup Message */}
        {showPopup && (
          <div className="fixed bottom-10 right-10 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
            Item added to cart ✅
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
