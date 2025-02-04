import AboutUs from "../components/About";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const Home = () => {
  // const products = [
  //   {
  //     name: "Mountain Bike X200",
  //     price: 999.99,
  //     image: "https://via.placeholder.com/400x300",
  //   },
  //   {
  //     name: "Trail Blazer 300",
  //     price: 799.99,
  //     image: "https://via.placeholder.com/400x300",
  //   },
  //   {
  //     name: "Road Master Pro",
  //     price: 1199.99,
  //     image: "https://via.placeholder.com/400x300",
  //   },
  // ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <div className="container mx-auto py-8 ">
        <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          
            <ProductCard />
          
        </div>
      </div>
      <AboutUs/>
      <Footer />
    </div>
  );
};

export default Home;

