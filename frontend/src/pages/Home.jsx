import AboutUs from "../components/About";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <Hero />

      {/* Full-width product section */}
      <div className="container mx-auto py-8 w-full">
        {/* <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1> */}
        
        {/* ProductCard now takes full width */}
        <div className="w-full">
          <ProductCard />
        </div>
      </div>
      
      <AboutUs />
      <Footer />
    </div>
  );
};

export default Home;
