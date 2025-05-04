import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import KhaltiCheckout from "khalti-checkout-web";

const AddToCartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchCartData();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchCartData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cart/view/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.cart_items);
      setTotalPrice(response.data.total_price);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch cart items.");
      setLoading(false);
    }
  };

  const handleRemoveItem = async (item) => {
    let item_id = null;
    let item_name = null;
    let item_type = null;
  
    // Check if the item is a product
    if (item.product) {
      item_id = item.product._id;  // Using product._id directly
      item_name = item.product.product_name;  // Using product_name directly
      item_type = "product";
    }
    // Check if the item is an accessory
    else if (item.accessory) {
      item_id = item.accessory._id;  // Using accessory._id directly
      item_name = item.accessory.accessory_name;  // Using accessory_name directly
      item_type = "accessory";
    }
  
    // Log the item data for debugging
    console.log("Item data:", item);
    console.log("Item ID:", item_id);
    console.log("Item Name:", item_name);
    console.log("Item Type:", item_type);
  
    // Ensure we are sending either item_id or item_name
    if (!item_id && !item_name) {
      console.error("Item ID or Item Name is required");
      return;
    }
  
    const data = {
      item_id: item_id || undefined,   // Only include item_id if it exists
      item_name: item_name || undefined, // Only include item_name if it exists
      item_type,
    };
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/cart/remove/", data, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token for authorization
        },
      });
  
      if (response.status === 200) { // Check for successful removal
        fetchCartData(); // Refresh cart data after removing item
      } else {
        console.error("Failed to remove item", response.data);
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error.response || error);
    }
  };
  
  
  const handleKhaltiPayment = () => {
    const config = {
      publicKey: "<3fee18a64e664e3fa2ac5b7cff1c6c48>", // Use the correct public key here
      productIdentity: "12456",
      productName: "Shopping Cart Checkout",
      productUrl: "localhost:5173/cart",
      eventHandler: {
        onSuccess(payload) {
          sendPaymentToBackend(payload);
        },
        onError(error) {
          alert("Payment failed. Please try again.");
        },
        onClose() {
          console.log("Payment widget closed.");
        },
      },
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    };
  
    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount: totalPrice * 100 });
  };
  

  const sendPaymentToBackend = (paymentData) => {
    axios
      .post(
        "http://127.0.0.1:8000/api/khalti/verifypayment/",
        {
          cart_id: "cart_payment",
          payment_id: paymentData.token,
          amount: paymentData.amount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Payment Successful!");
        clearCart();
        navigate("/order-confirmation");
      })
      .catch(() => {
        alert("Error verifying your payment. Please contact support.");
      });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;  // Don't allow quantity to be less than 1
  
    // Initialize variables for item details
    let item_id = null;
    let item_name = null;
    let item_type = null;
  
    // Check if the item contains 'product' or 'accessory' dynamically
    if (item.product) {
      item_id = item.id;  // Use product ID instead of cart_item id
      item_name = item.product.product_name;  // Use product name
      item_type = "product";
    } else if (item.accessory) {
      item_id = item.id;  // Use accessory ID instead of cart_item id
      item_name = item.accessory.accessory_name;  // Use accessory name
      item_type = "accessory";
    }
  
    // Ensure we are sending item_id and item_name
    if (!item_id || !item_name) {
      console.error("Item ID and Name are required");
      return;
    }
  
    // Log item details for debugging
    console.log("Item ID:", item_id);
    console.log("Item Name:", item_name);
    console.log("Item Type:", item_type);
  
    // Prepare the payload for the request
    const data = {
      item_id,       // Send product_id (or accessory_id)
      item_name,     // Send product_name (or accessory_name)
      item_type,     // Either "product" or "accessory"
      quantity: newQuantity, // New quantity to update
    };
  
    console.log("Payload being sent: ", data); // Log the payload for debugging
  
    try {
      // Make the API call to update the cart
      const response = await axios.post(
        "http://127.0.0.1:8000/api/cart/update/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Authorization header with the JWT token
            "Content-Type": "application/json",  // Ensure correct content type
          },
        }
      );
  
      // If the update was successful, refresh the cart data
      if (response.data.message === "Cart updated successfully") {
        fetchCartData();  // Refresh cart data after successful update
      } else {
        console.error("Failed to update cart:", response.data.error);
      }
    } catch (error) {
      console.error("Failed to update cart item:", error.response || error);
    }
  };
  
  
  
  

  if (loading) {
    return <div className="text-center py-20 text-gray-600 text-lg">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600 text-lg">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Navbar />
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Your Cart</h1>
        {cartItems.length > 0 ? (
          <ul className="space-y-6">
            {cartItems.map((item) => {
              const isAccessory = item.is_accessory;
              let imageUrl = "";
              let name = "";
              let brand = "";
              let price = "";

              if (isAccessory) {
                if (item.accessory) {
                  imageUrl = item.accessory.image ? `http://127.0.0.1:8000${item.accessory.image}` : "";
                  name = item.accessory.accessory_name || item.productname;
                  brand = item.accessory.brand || "N/A";
                  price = item.accessory.price || item.product_price;
                }
              } else {
                if (item.product) {
                  imageUrl = item.product.image ? `http://127.0.0.1:8000${item.product.image}` : "";
                  name = item.product.productname || item.productname;
                  brand = item.product.brand || "N/A";
                  price = item.product.price || item.product_price;
                }
              }

              return (
                <li key={item.id} className="flex items-center justify-between space-x-6 p-6 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-all">
                  <div className="flex items-center space-x-4">
                    {imageUrl && (
                      <img src={imageUrl} alt={name} className="w-20 h-20 object-cover rounded-md" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                      <p className="text-sm text-gray-500">Brand: {brand}</p>
                      <span className="text-sm text-gray-500">Rs. {price}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                  <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        if (newQuantity >= 1) { // Only allow positive values
                          handleUpdateQuantity(item, newQuantity);
                        }
                      }}
                      className="w-16 text-center p-2 border rounded-md"
                      min="1"
                    />
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-red-600 hover:text-red-800 transition-all"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-800">
                      Rs. {(parseFloat(price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-xl text-gray-500">Your cart is empty.</p>
        )}

        <div className="flex justify-between items-center mt-8">
          <span className="text-2xl font-semibold text-gray-800">Total: Rs. {totalPrice.toFixed(2)}</span>
          <button
            onClick={handleKhaltiPayment}
            className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition-all"
          >
            Proceed to Checkout
          </button>
        </div>

        <div className="text-right mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartPage;