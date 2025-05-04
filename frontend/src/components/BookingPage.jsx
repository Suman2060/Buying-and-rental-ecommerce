import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000"; // Django Backend URL

const BookingPage = () => {
  const { state } = useLocation();
  const selectedBike = state?.bike;
  const navigate = useNavigate(); // Hook for navigation

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    startDate: "",
    endDate: "",
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const getAccessToken = () => {
    const tokenObj = localStorage.getItem("token");
    const parsedTokenObj = JSON.parse(tokenObj);
    return parsedTokenObj?.accessToken;
  };

  const calculateTotalPrice = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end - start) / (1000 * 3600 * 24));
    return days * selectedBike?.price_per_day;
  };

  const sendBookingEmail = () => {
    axios
      .post(`${BASE_URL}/api/send-booking-email/`, {
        name: formData.name,
        email: formData.email,
        bike_name: selectedBike?.name,
        start_date: formData.startDate,
        end_date: formData.endDate,
      })
      .then((res) => {
        console.log("Email sent!");
      })
      .catch((err) => {
        console.error("Failed to send email:", err);
        alert("Failed to send confirmation email.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setIsBookingLoading(true);
      const token = getAccessToken();
      const bookingData = {
        bike: selectedBike?.id,
        start_date: formData.startDate,
        end_date: formData.endDate,
        total_price: calculateTotalPrice(),
      };

      // Send booking data to backend
      axios
        .post(`${BASE_URL}/api/rentals/bikes/`, bookingData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Booking Successful:", response.data);
          setBookingSuccess(true);

          // Once booking is successful, send the booking email
          sendBookingEmail(); // Send email with the response data

          setIsBookingLoading(false);

          // Redirect to the main rental page after successful booking
          setTimeout(() => {
            navigate("/rentals"); // Redirect to main rental page
          }, 2000); // Wait for 2 seconds before redirecting
        })
        .catch((error) => {
          console.error("Error booking bike:", error);
          setIsBookingLoading(false);
          alert("There was an error processing your booking.");
        });
    } catch (error) {
      console.error("Authentication error:", error);
      setIsBookingLoading(false);
      alert("Please log in to make a booking.");
    }
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
          {bookingSuccess ? (
            <div className="text-green-600 text-xl font-semibold text-center">
              Booking Successful! Please check your email. Bring your citizenship card during pickup.
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Bike: {selectedBike?.name}
              </h2>
              <p className="text-lg text-gray-600">Price: Rs. {selectedBike?.price_per_day} / day</p>

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {/* Email */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {/* Dates */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
