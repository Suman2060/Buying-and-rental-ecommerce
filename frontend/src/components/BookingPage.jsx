import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import KhaltiCheckout from "khalti-checkout-web";

const BASE_URL = "http://127.0.0.1:8000"; // Backend URL

const BookingPage = () => {
  const { state } = useLocation(); // Get the bike details from navigation state
  const selectedBike = state?.bike;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    startDate: "",
    endDate: "",
  });
  const [paymentInitiated, setPaymentInitiated] = useState(false); // State to control the payment flow
  const [isBookingLoading, setIsBookingLoading] = useState(false); // Loading state for booking

  const userToken = localStorage.getItem("userToken"); // Assuming the user token is stored in localStorage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotalPrice = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end - start) / (1000 * 3600 * 24)); // Days difference
    return days * selectedBike?.price_per_day; // Total price based on the selected bike's daily rental rate
  };

  // Function to get access token from local storage
  const getAccessToken = () => {
    const tokenObj = localStorage.getItem("token"); // Get token object from localStorage
    if (!tokenObj) {
      throw new Error("No access token found. Please log in.");
    }
    const parsedTokenObj = JSON.parse(tokenObj); // Parsing the token string if it's stored as JSON
    const token = parsedTokenObj?.accessToken;  // Accessing the accessToken
    if (!token) {
      throw new Error("No access token found. Please log in.");
    }
    return token;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      setIsBookingLoading(true); // Set loading state when booking is in progress
      const token = getAccessToken(); // Get the access token
      const bookingData = {
        bike: selectedBike?.id, // Bike ID
        start_date: formData.startDate,
        end_date: formData.endDate,
        total_price: calculateTotalPrice(),
      };

      // Send the booking request with the access token
      axios
        .post(`${BASE_URL}/api/rentals/bikes/`, bookingData, {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token for authentication
          },
        })
        .then((response) => {
          console.log("Booking Successful:", response.data);
          setIsBookingLoading(false); // Remove loading state when booking is done
          setPaymentInitiated(true); // Initiate payment after booking
        })
        .catch((error) => {
          console.error("Error booking bike:", error);
          setIsBookingLoading(false); // Remove loading state on error
          alert("There was an error processing your booking.");
        });
    } catch (error) {
      console.error("Authentication error:", error);
      setIsBookingLoading(false); // Remove loading state if error occurs
      alert("Please log in to make a booking.");
    }
  };

  const handlePayment = () => {
    const config = {
      publicKey: "8c4fca29b4ce4679b996c420ca7bffcd", // Replace with your Khalti public key
      productIdentity: selectedBike?.id,
      productName: selectedBike?.name,
      productUrl: "http://your-product-url.com", // Optional
      eventHandler: {
        onSuccess(payload) {
          console.log("Payment Success:", payload);
          sendPaymentToBackend(payload); // Send payment info to backend for verification
        },
        onError(error) {
          console.log("Payment Error:", error);
          alert("Payment failed. Please try again.");
        },
        onClose() {
          console.log("Payment widget closed");
        },
      },
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    };

    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount: calculateTotalPrice() * 100 }); // Convert to paisa (100 paisa = 1 rupee)
  };

  const sendPaymentToBackend = (paymentData) => {
    // Send the payment details to the backend
    axios
      .post(`${BASE_URL}/api/rentals/verify_payment/`, {
        booking_id: selectedBike?.id, // Your booking ID
        payment_id: paymentData.paymentID, // Payment ID from Khalti
        amount: paymentData.amount, // The amount paid in paisa
      })
      .then((response) => {
        console.log("Payment verified successfully:", response.data);
        alert("Payment Successful!");
        // Optionally redirect to a confirmation page
      })
      .catch((error) => {
        console.error("Error verifying payment:", error);
        alert("There was an error verifying your payment.");
      });
  };

  if (!selectedBike) {
    return <div>No bike selected.</div>;
  }

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Book Your Bike Rental
        </h1>
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Bike: {selectedBike?.name}
          </h2>
          <p className="text-lg text-gray-600">Price: Rs. {selectedBike?.price_per_day} / day</p>

          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Your Full Name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Your Email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="startDate">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="endDate">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
                disabled={isBookingLoading}
              >
                {isBookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>

          {paymentInitiated && (
            <div className="mt-4">
              <button
                onClick={handlePayment}
                className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Pay Now with Khalti
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
