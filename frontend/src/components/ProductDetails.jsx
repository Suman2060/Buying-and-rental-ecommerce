import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail, clearProductDetail } from "../redux/slices/productDetailSlice";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addItem } from "../redux/slices/cartSlice"; // Import the addItem action

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, status, error } = useSelector((state) => state.productDetail);
  const [otherProducts, setOtherProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

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

  // Handle Add to Cart with Redux and Popup Message
  const handleAddToCart = () => {
    if (product) {
      dispatch(addItem({ id: product._id, name: product.productname, price: product.price }));
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
            <button
              onClick={handleAddToCart}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Add to Cart
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
