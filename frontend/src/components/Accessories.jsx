import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from "react-router-dom";

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(state => state.cart.reduce((total, item) => total + item.quantity, 0));

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/api/accessories/")
      .then((response) => setAccessories(response.data))
      .catch((error) => console.error("Error fetching accessories:", error));
  }, []);

  const handleAddToCart = (accessory) => {
    dispatch(addItem({ id: accessory._id, name: accessory.accessory_name, price: accessory.price }));
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const handleViewDetails = (accessory) => {
    navigate(`/accessory/${accessory._id}`);
  };

  const filteredAccessories = accessories.filter(accessory =>
    accessory.accessory_name.toLowerCase().includes(filter.toLowerCase()) &&
    (categoryFilter === "" || accessory.category === categoryFilter) &&
    (brandFilter === "" || accessory.brand === brandFilter)
  );

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Shop Accessories</h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 w-full sm:w-80 text-gray-700 border border-gray-300 rounded-lg shadow-md"
            placeholder="Search accessories..."
          />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)} 
            className="p-3 border border-gray-300 rounded-lg shadow-md">
            <option value="">All Categories</option>
            {[...new Set(accessories.map(a => a.category))].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select 
            value={brandFilter} 
            onChange={(e) => setBrandFilter(e.target.value)} 
            className="p-3 border border-gray-300 rounded-lg shadow-md">
            <option value="">All Brands</option>
            {[...new Set(accessories.map(a => a.brand))].map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Cart Button with Count */}
        <div className="text-right mb-4">
          <button onClick={() => navigate('/cart')} className="relative bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
            🛒 Cart ({cartCount})
          </button>
        </div>

        {/* Success Message */}
        {showMessage && (
          <div className="fixed top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
            ✅ Item added to cart!
          </div>
        )}

        {/* Accessories List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredAccessories.map((accessory) => (
            <div key={accessory._id} className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <LazyLoadImage
                src={accessory.image}
                alt={accessory.accessory_name}
                effect="blur"
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => handleViewDetails(accessory)}
              />
              <div className="px-6 py-4">
                <h2 className="font-bold text-xl mb-2 text-gray-800 cursor-pointer" onClick={() => handleViewDetails(accessory)}>{accessory.accessory_name}</h2>
                <p className="text-lg font-semibold text-gray-800">Rs. {accessory.price}</p>
              </div>
              <div className="px-6 pb-4">
                <button
                  onClick={() => handleAddToCart(accessory)}
                  className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 mb-2"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleViewDetails(accessory)}
                  className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accessories;
