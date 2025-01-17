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
    <div className="container mx-auto p-100 m-100">
      <h2 className="text-3xl font-bold text-center mb-8">Product List</h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-8 w-full">
          {products.map((product) => (
            <div key={product.id} className="flex-none bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-72">
              <img 
                src={product.image} 
                alt={product.productname} 
                className="w-full h-80 object-cover rounded-lg mb-6"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{product.productname}</h3>
              <p className="text-lg text-gray-600 mb-4">{product.category}</p>
              <p className="font-bold text-xl text-green-600">${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
