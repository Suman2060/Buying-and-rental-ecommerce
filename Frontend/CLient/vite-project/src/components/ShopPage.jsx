import { useState } from "react";

// Sample product data for the shop (You can replace this with data fetched from an API)
const products = [
  {
    id: 1,
    name: "Mountain Bike X200",
    price: 999.99,
    description: "Perfect for rocky trails and mountain adventures.",
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 2,
    name: "Road Bike Z100",
    price: 799.99,
    description: "Lightweight bike for smooth, fast road rides.",
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 3,
    name: "Hybrid Bike Y300",
    price: 899.99,
    description: "A versatile bike designed for both road and trail use.",
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 4,
    name: "Electric Bike E500",
    price: 1499.99,
    description: "An eco-friendly e-bike for an effortless ride.",
    image: "https://via.placeholder.com/400x300",
  },
];

const ShopPage = () => {
  const [filter, setFilter] = useState(""); // Filter for product names or price range
  const [cart, setCart] = useState([]); // Cart state to manage the cart items

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Handle adding product to the cart
  const handleAddToCart = (product) => {
    // Check if product already exists in cart
    const itemExists = cart.find((item) => item.id === product.id);
    if (itemExists) {
      // If item exists, increase quantity
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // If item doesn't exist, add it to the cart
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleViewDetails = (product) => {
    alert(`You selected ${product.name}`);
    // Redirect to product details page or open a modal with more info
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Shop Our Bikes</h1>

        {/* Filter Section */}
        <div className="mb-8 text-center">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 w-80 text-gray-700 border border-gray-300 rounded"
            placeholder="Search for bikes..."
          />
        </div>

        {/* Product List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="max-w-sm rounded overflow-hidden shadow-lg bg-white"
            >
              {/* Product Image */}
              <img
                className="w-full h-48 object-cover"
                src={product.image}
                alt={product.name}
              />
              <div className="px-6 py-4">
                {/* Product Name */}
                <h2 className="font-bold text-xl mb-2 text-gray-800">{product.name}</h2>
                {/* Product Description */}
                <p className="text-gray-600 text-base mb-4">{product.description}</p>
                {/* Product Price */}
                <p className="text-lg font-semibold text-gray-800">${product.price}</p>
              </div>
              <div className="px-6 pb-4">
                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(product)}
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mb-2"
                >
                  View Details
                </button>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
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

export default ShopPage;
