import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeItem } from "../redux/slices/cartSlice";

const AddToCartPage = () => {
  const cartItems = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Cart</h1>

      <div className="space-y-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4">
                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                <p className="text-gray-600 text-sm">Rs. {item.price}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))} className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700" disabled={item.quantity === 1}>-</button>
                <span className="text-lg">{item.quantity}</span>
                <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))} className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700">+</button>
                <button onClick={() => dispatch(removeItem(item.id))} className="text-red-600 hover:text-red-800">Remove</button>
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
          <button className="bg-green-600 text-white text-xl px-8 py-3 rounded-full hover:bg-green-700" onClick={() => alert("Proceeding to checkout")}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartPage;
