import { useState, useEffect } from 'react';
import image1 from "../assets/back.jpg"; // First image
import image2 from "../assets/hero1.jpg"; // Second image
import image3 from "../assets/hero2.jpg"; // Third image

const Hero = () => {
  const images = [image1, image2, image3]; // Array of images
  const [currentIndex, setCurrentIndex] = useState(0); // Default to the first image

  // Function to change the image automatically
  const changeImageAutomatically = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Use useEffect to set up an interval for automatic image change
  useEffect(() => {
    const interval = setInterval(changeImageAutomatically, 3000); // Change image every 5 seconds

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  // Function to toggle images manually
  const toggleImage = (direction) => {
    if (direction === 'left') {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  return (
    <div className="relative h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url(${images[currentIndex]})` }} // Dynamically change the background image
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-bold mb-4">Conquer Every Trail</h1>
        <p className="mb-6 text-lg">Explore our range of mountain bikes and gear.</p>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={() => toggleImage('left')}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full hover:bg-gray-700"
      >
        &lt;
      </button>

      <button
        onClick={() => toggleImage('right')}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full hover:bg-gray-700"
      >
        &gt;
      </button>
    </div>
  );
};

export default Hero;
