import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeItem } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom"; // for redirecting to login page
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa"; // For icons

const AddToCartPage = () => {
  const cartItems = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user); // Assuming user information is stored in auth slice
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    if (!user) {
      navigate("/login"); // Redirect to login if user is not logged in
      return;
    }
    dispatch(updateQuantity({ id: itemId, quantity }));
  };

  const handleRemoveItem = (itemId) => {
    if (!user) {
      navigate("/login"); // Redirect to login if user is not logged in
      return;
    }
    dispatch(removeItem(itemId));
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Cart</h1>

      <div className="space-y-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.imageUrl || "/default-product.jpg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Rs. {item.price}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200"
                  disabled={item.quantity === 1}
                >
                  <FaMinus />
                </button>
                <span className="text-lg">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200"
                >
                  <FaPlus />
                </button>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-800 transition-all duration-200"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        )}
      </div>

      <div className="mt-8 flex justify-between items-center bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800">Total Price:</h2>
        <p className="text-2xl font-bold text-gray-800">Rs. {getTotalPrice().toFixed(2)}</p>
      </div>

      {cartItems.length > 0 && (
        <div className="mt-8 text-center">
          <button
            className="bg-green-600 text-white text-xl px-8 py-3 rounded-full hover:bg-green-700 transition-all duration-200"
            onClick={() => {
              if (!user) {
                navigate("/login"); // Redirect to login if not logged in
              } else {
                alert("Proceeding to checkout");
              }
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartPage;
