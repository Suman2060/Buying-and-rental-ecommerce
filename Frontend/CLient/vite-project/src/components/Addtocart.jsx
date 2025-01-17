import  { useState } from "react";

const AddToCartPage = () => {
  // Sample cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Mountain Bike X200",
      price: 999.99,
      image: "https://via.placeholder.com/150",
      quantity: 1,
    },
    {
      id: 2,
      name: "Mountain Bike X300",
      price: 1299.99,
      image: "https://via.placeholder.com/150",
      quantity: 2,
    },
  ]);

  // Update quantity of items
  const updateQuantity = (id, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Cart</h1>
      
      {/* Cart Items */}
      <div className="space-y-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Price: ${item.price}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="w-12 text-center border border-gray-300 rounded-md"
                  min="1"
                />
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        )}
      </div>

      {/* Cart Summary */}
      <div className="mt-8 flex justify-between items-center bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800">Total Price:</h2>
        <p className="text-2xl font-bold text-gray-800">${getTotalPrice().toFixed(2)}</p>
      </div>

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <div className="mt-8 text-center">
          <button
            className="bg-green-600 text-white text-xl px-8 py-3 rounded-full hover:bg-green-700"
            onClick={() => alert("Proceeding to checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartPage;
