import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from the backend API when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/product/') // Replace with your actual API endpoint
      .then((response) => {
        setProducts(response.data); // Set the products data
      })
      .catch((error) => {
        console.error('There was an error fetching the products:', error);
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-center mb-8">Product List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white w-full h-[300px] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between items-center p-4"
          >
            <img
              src={product.image}
              alt={product.productname}
              className="w-full h-3/5 object-cover rounded-lg mb-4"
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.productname}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
              <p className="font-bold text-lg text-green-600">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
