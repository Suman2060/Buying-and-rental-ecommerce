import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [showMessage, setShowMessage] = useState(false); // State for popup message
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product for details
  const dispatch = useDispatch();
  const cartCount = useSelector(state => state.cart.reduce((total, item) => total + item.quantity, 0));

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/product/")
      .then((response) => {
        console.log(response.data); // Log the response data to check if productinfo is there
        setProducts(response.data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addItem({ id: product._id, name: product.productname, price: product.price }));

    setShowMessage(true); // Show success message
    setTimeout(() => setShowMessage(false), 2000); // Hide after 2 sec
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product); // Set the selected product for modal
  };

  const closeModal = () => {
    setSelectedProduct(null); // Close the modal
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Shop Our Bikes</h1>

        {/* Search Bar */}
        <div className="mb-8 text-center">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 w-full sm:w-80 text-gray-700 border border-gray-300 rounded-lg shadow-md"
            placeholder="Search for bikes..."
          />
        </div>

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

        {/* Product List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <img className="w-full h-48 object-cover" src={product.image} alt={product.productname} />
              <div className="px-6 py-4">
                <h2 className="font-bold text-xl mb-2 text-gray-800">{product.productname}</h2>
                <p className="text-lg font-semibold text-gray-800">Rs. {product.price}</p>
              </div>
              <div className="px-6 pb-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 mb-2"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleViewDetails(product)}
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
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.productname}</h2>
            <img
              className="w-full h-48 object-cover mb-4"
              src={selectedProduct.image}
              alt={selectedProduct.productname}
            />
            <p className="text-lg font-semibold text-gray-800 mb-4">Rs. {selectedProduct.price}</p>

            {/* Scrollable Product Details */}
            <div className="overflow-y-auto max-h-96 mb-4">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Brand:</h3>
                <p className="text-gray-700">{selectedProduct.productbrand || "No brand info available"}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Category:</h3>
                <p className="text-gray-700">{selectedProduct.productcategory || "No category info available"}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Info:</h3>
                <p className="text-gray-700">{selectedProduct.productinfo || "No additional information available"}</p> {/* Displaying productinfo */}
              </div>
            </div>

            <div className="flex justify-between mt-4">
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

export default ShopPage;
