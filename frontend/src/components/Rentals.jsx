import  { useState } from "react";

// Sample bike data for rentals (You can fetch this data from an API in real-world applications)
const rentalBikes = [
  {
    id: 1,
    name: "Mountain Bike X200",
    price: 20,
    description: "Perfect for rocky trails and mountain adventures.",
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 2,
    name: "Road Bike Z100",
    price: 15,
    description: "Lightweight bike for smooth, fast road rides.",
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 3,
    name: "Hybrid Bike Y300",
    price: 18,
    description: "A versatile bike designed for both road and trail use.",
    image: "https://via.placeholder.com/400x300",
  },
];

const RentalsPage = () => {
  const [selectedBike, setSelectedBike] = useState(null);

  const handleBookNow = (bike) => {
    setSelectedBike(bike);
    // Redirect to booking page or show a modal with booking options (this can be customized)
    alert(`You selected ${bike.name} for booking.`);
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Rental Bikes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rentalBikes.map((bike) => (
            <div
              key={bike.id}
              className="max-w-sm rounded overflow-hidden shadow-lg bg-white"
            >
              {/* Bike Image */}
              <img
                className="w-full h-48 object-cover"
                src={bike.image}
                alt={bike.name}
              />
              <div className="px-6 py-4">
                {/* Bike Name */}
                <h2 className="font-bold text-xl mb-2 text-gray-800">{bike.name}</h2>
                {/* Bike Description */}
                <p className="text-gray-600 text-base mb-4">{bike.description}</p>
                {/* Rental Price */}
                <p className="text-lg font-semibold text-gray-800">
                  ${bike.price} / day
                </p>
              </div>
              <div className="px-6 pb-4">
                <button
                  onClick={() => handleBookNow(bike)}
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Conditional render of selected bike information */}
        {selectedBike && (
          <div className="mt-8 p-6 bg-white rounded shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
            <p className="text-lg text-gray-600 mt-4">
              You have selected the {selectedBike.name} for rental.
            </p>
            <p className="text-lg text-gray-600 mt-2">
              Rental Price: ${selectedBike.price} / day
            </p>
            <button
              onClick={() => alert("Proceeding to booking...")}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
            >
              Proceed to Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalsPage;
