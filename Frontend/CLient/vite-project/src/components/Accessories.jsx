import  { useState } from "react";

// Sample data for accessories (You can fetch this data from an API or database)
const accessories = [
  {
    id: 1,
    name: "Bike Helmet",
    price: 49.99,
    description: "Stay safe on the road with our lightweight helmet.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 2,
    name: "Cycling Gloves",
    price: 19.99,
    description: "Comfortable gloves for long rides.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 3,
    name: "Bike Lights",
    price: 29.99,
    description: "Bright LED lights for night riding.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 4,
    name: "Water Bottle Holder",
    price: 9.99,
    description: "Keep your bottle secure during rides.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 5,
    name: "Bike Lock",
    price: 24.99,
    description: "Secure your bike with a durable lock.",
    image: "https://via.placeholder.com/300x200",
  },
];

const Accessories = () => {
  // State to manage the cart
  const [cart, setCart] = useState([]);

  // Handle adding accessory to the cart
  const handleAddToCart = (accessory) => {
    // Check if item already exists in cart
    const itemExists = cart.find((item) => item.id === accessory.id);
    if (itemExists) {
      // If item exists, increase quantity
      setCart(
        cart.map((item) =>
          item.id === accessory.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // If item doesn't exist, add it to the cart
      setCart([...cart, { ...accessory, quantity: 1 }]);
    }
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Shop Accessories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {accessories.map((accessory) => (
            <div
              key={accessory.id}
              className="max-w-sm rounded overflow-hidden shadow-lg bg-white"
            >
              {/* Accessory Image */}
              <img
                className="w-full h-48 object-cover"
                src={accessory.image}
                alt={accessory.name}
              />
              <div className="px-6 py-4">
                {/* Accessory Name */}
                <h2 className="font-bold text-xl mb-2 text-gray-800">{accessory.name}</h2>
                {/* Accessory Description */}
                <p className="text-gray-600 text-base mb-4">{accessory.description}</p>
                {/* Accessory Price */}
                <p className="text-lg font-semibold text-gray-800">${accessory.price}</p>
              </div>
              <div className="px-6 pb-4">
                <button
                  onClick={() => handleAddToCart(accessory)}
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Display Cart Summary */}
        {cart.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            <ul className="list-none space-y-4 mt-4">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                  <span className="text-lg">{item.name}</span>
                  <span className="text-gray-600">x{item.quantity}</span>
                  <span className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-semibold">${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accessories;
