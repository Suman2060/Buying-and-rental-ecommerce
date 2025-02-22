import { useState, useEffect } from "react";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector for Redux
import "react-lazy-load-image-component/src/effects/blur.css";

const BASE_URL = "http://127.0.0.1:8000"; // Backend URL

const RentalsPage = () => {
  const [bikes, setBikes] = useState([]);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [loadingBikeId, setLoadingBikeId] = useState(null); // For loading state

  const navigate = useNavigate();

  // Get authentication state from Redux
  const { token } = useSelector((state) => state.auth); // Assuming you store token in the auth slice

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/bikes/`)
      .then((response) => setBikes(response.data))
      .catch((error) => console.error("Error fetching bikes:", error));
  }, []);

  const handleBookNow = (bike) => {
    if (!token) {
      navigate("/login"); // Redirect to login if the user is not authenticated
      return;
    }

    setLoadingBikeId(bike.id); // Set loading state for the bike being booked
    navigate("/booking", { state: { bike } }); // Proceed with booking if user is authenticated
  };

  const filteredBikes = bikes.filter(
    (bike) =>
      bike.name.toLowerCase().includes(filter.toLowerCase()) &&
      (categoryFilter === "" || bike.category === categoryFilter) &&
      (brandFilter === "" || bike.brand === brandFilter)
  );

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Available Rental Bikes
        </h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 w-full sm:w-80 text-gray-700 border border-gray-300 rounded-lg shadow-md focus:outline-none"
            placeholder="Search for bikes..."
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none"
          >
            <option value="">All Categories</option>
            {[...new Set(bikes.map((bike) => bike.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none"
          >
            <option value="">All Brands</option>
            {[...new Set(bikes.map((bike) => bike.brand))].map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Bike Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBikes.map((bike) => {
            const imageUrl = bike.image ? `${BASE_URL}${bike.image}` : "https://via.placeholder.com/150";

            return (
              <div
                key={bike.id}
                className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
              >
                <LazyLoadImage
                  src={imageUrl}
                  alt={bike.name}
                  effect="blur"
                  className="w-full h-48 object-cover"
                  placeholderSrc="https://via.placeholder.com/150"
                />
                <div className="px-6 py-4">
                  <h2 className="font-bold text-xl mb-2 text-gray-800">{bike.name}</h2>
                  <p className="text-lg font-semibold text-gray-800">Rs. {bike.price_per_day} / day</p>
                  <p className="text-sm text-gray-600">{bike.description}</p>
                  <div className="mt-2">
                    {bike.is_available ? (
                      <span className="text-green-600 font-semibold">Available</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Not Available</span>
                    )}
                  </div>
                </div>
                <div className="px-6 pb-4 flex justify-between">
                  <button
                    onClick={() => handleViewDetails(bike)}
                    className="text-blue-600 font-semibold hover:underline transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleBookNow(bike)}
                    className={`font-semibold px-4 py-1 rounded-lg transition ${
                      bike.is_available && token
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!bike.is_available || !token}
                  >
                    {token ? "Book Now" : "Login to Book"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RentalsPage;
