import image from "../assets/back.jpg"; // Ensure the path to the image is correct

const Hero = () => (
  <div
    className="relative h-[500px] bg-cover bg-center h-" 
    style={{ backgroundImage: `url(${image})` }} // Properly formatted backgroundImage
  >
    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold mb-4">Conquer Every Trail</h1>
      <p className="mb-6 text-lg">Explore our range of mountain bikes and gear.</p>
      <a
        href="/shop"
        className="bg-red-600 hover:bg-blue-800 text-white px-6 py-3 rounded"
      >
        Shop Now
      </a>
    </div>
  </div>
);

export default Hero;
