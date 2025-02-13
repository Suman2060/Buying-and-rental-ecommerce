import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = axios.get("http://127.0.0.1:8000/api/api/product/");
    const fetchAccessories = axios.get("http://127.0.0.1:8000/api/api/accessories/");

    Promise.all([fetchProducts, fetchAccessories])
      .then(([productRes, accessoryRes]) => {
        const products = productRes.data.map((p) => ({ ...p, type: "product" }));
        const accessories = accessoryRes.data.map((a) => ({ ...a, type: "accessory" }));

        const combinedItems = [...products, ...accessories].sort(() => Math.random() - 0.5);
        setItems(combinedItems);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleClick = (item) => {
    navigate(item.type === "product" ? "/shop" : "/accessories");
  };

  return (
    <div className="container mx-auto px-8 py-10">
      <h2 className="text-4xl font-bold text-center mb-8">Explore Our Collection</h2>

      {/* Product Showcase Section */}
      <div className="flex overflow-x-auto space-x-6 scrollbar-hide">
        {items.map((item) => (
          <div
            key={item._id}
            onClick={() => handleClick(item)}
            className="flex-shrink-0 cursor-pointer text-center"
          >
            <img
              src={item.image}
              alt={item.productname || item.accessory_name}
              className="w-[220px] h-[220px] object-contain mx-auto"
            />
            <h3 className="text-lg font-semibold text-gray-900">{item.productname || item.accessory_name}</h3>
            <p className="text-sm text-gray-600">{item.productcategory || item.category}</p>
            <p className="text-lg font-bold text-green-600">Rs. {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
