// import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12 text-center">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-gray-800 mb-6">About Us</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          At <span className="font-semibold text-blue-600">Bike-Farm Nepal</span>, we believe every ride tells a story. 
          From seasoned cyclists to first-time riders, our mission is to provide top-quality bikes, accessories, 
          and services to make your adventures unforgettable.
        </p>

        {/* Highlight Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Point 1 */}
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.428 15.341A8 8 0 118.659 4.572M16 8v8m0 0l-3-3m3 3l3-3"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Top-Quality Products</h3>
            <p className="text-gray-600 text-center">
              We offer a wide range of bikes and gear from leading brands, ensuring you ride with confidence.
            </p>
          </div>

          {/* Point 2 */}
          <div className="flex flex-col items-center">
            <div className="bg-green-600 text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v8m0 0l-3-3m3 3l3-3M16 8v8m0 0l-3-3m3 3l3-3"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Support</h3>
            <p className="text-gray-600 text-center">
              Our team of experienced professionals is here to help with everything from bike selection to maintenance.
            </p>
          </div>

          {/* Point 3 */}
          <div className="flex flex-col items-center">
            <div className="bg-red-600 text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v8m0 0l-3-3m3 3l3-3M16 8v8m0 0l-3-3m3 3l3-3"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Passion for Cycling</h3>
            <p className="text-gray-600 text-center">
              We’re more than a shop—we’re a community of cyclists who share your love for the sport.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
