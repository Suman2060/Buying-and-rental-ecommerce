import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeItem } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";

const AddToCartPage = () => {
  const cartItems = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(updateQuantity({ id: itemId, quantity }));
  };

  const handleRemoveItem = (itemId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(removeItem(itemId));
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Cart</h1>

      {cartItems.length > 0 ? (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
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
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800">Total Price:</h2>
            <p className="text-2xl font-bold text-gray-800">Rs. {getTotalPrice().toFixed(2)}</p>
          </div>

          <div className="mt-8 text-center">
            <button
              className="bg-green-600 text-white text-xl px-8 py-3 rounded-full hover:bg-green-700 transition-all duration-200"
              onClick={() => {
                if (!user) {
                  navigate("/login");
                } else {
                  alert("Proceeding to checkout");
                }
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center text-gray-600">
          <img
            src="https://www.svgrepo.com/show/397340/empty-cart-shopping.svg"
            alt="Empty Cart"
            className="w-52 h-52 mb-6"
          />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty!</h2>
          <p className="mb-6 text-gray-500">Looks like you haven't added any items yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all"
          >
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartPage;
