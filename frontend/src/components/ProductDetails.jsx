import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail, clearProductDetail } from "../redux/slices/productDetailSlice";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchCart } from "../redux/slices/cartSlice"; // Import correct action for fetching cart items

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, status, error } = useSelector((state) => state.productDetail);
  const [otherProducts, setOtherProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for add to cart
  const [quantity, setQuantity] = useState(1); // State to track selected quantity
  const [loadingProductId, setLoadingProductId] = useState(null); // Loading state for product being added to cart

  // Get authentication state from Redux
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProductDetail(id));

    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, id]);

  // Fetch other products when button is clicked
  const loadOtherProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/api/product/");
      setOtherProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Handle Add to Cart with API and Popup Message (updated)
  const handleAddToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoadingProductId(product._id); // Set loading state for the product being added to the cart

    try {
      const payload = {
        item_id: product._id,              // Product ID
        item_type: "product",               // Item type is "product"
        item_name: product.productname,     // Product name
        item_price: product.price,          // Product price
        quantity: quantity,                // Selected quantity
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
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000); // Auto-hide after 3 seconds
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

  if (status === "loading") {
    return <div className="text-center py-20 text-gray-600 text-lg">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="text-center py-20 text-red-600 text-lg">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-600 text-lg">No product found</div>;
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

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 bg-white shadow-lg rounded-xl">
          {product.image && (
            <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
              <img
                className="w-full h-full object-contain"
                src={product.image}
                alt={product.productname}
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">{product.productname}</h1>
            <p className="text-lg text-gray-600 mt-4">{product.productinfo}</p>
            <p className="text-sm text-gray-500 mt-2">Brand: {product.productbrand}</p>
            <p className="text-sm text-gray-500 mt-2">Category: {product.productcategory}</p>

            <p className="text-2xl font-semibold text-green-700 mt-4">Rs. {product.price}</p>

            {/* Quantity Selection */}
            <div className="mt-4 flex items-center gap-4">
              <label className="text-lg text-gray-600">Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} // Ensure quantity is at least 1
                min="1"
                className="p-2 border border-gray-300 rounded-md w-20 text-center"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className={`mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition ${loadingProductId === product._id || loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
              disabled={loadingProductId === product._id || loading}
            >
              {loadingProductId === product._id || loading ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Load Other Products Button */}
        <div className="text-center mt-10">
          <button
            onClick={loadOtherProducts}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition"
          >
            Show Other Products
          </button>
        </div>

        {/* Display Other Products */}
        {otherProducts.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherProducts
              .filter(item => item._id !== product._id) // Exclude the current product
              .map(item => (
                <div key={item._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                  <img className="w-full h-48 object-cover rounded-md" src={item.image} alt={item.productname} />
                  <h2 className="text-lg font-semibold text-gray-800 mt-3">{item.productname}</h2>
                  <p className="text-gray-600">{item.productbrand}</p>
                  <p className="text-green-700 font-bold mt-2">Rs. {item.price}</p>
                  <button
                    onClick={() => navigate(`/product/${item._id}`)}
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

export default ProductDetails;
