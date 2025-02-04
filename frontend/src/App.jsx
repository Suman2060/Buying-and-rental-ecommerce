// route ko lagi import
import { Routes, Route  } from "react-router";
import { BrowserRouter } from "react-router";

// import Navbar from "./components/Navbar";
import "./index.css";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Rental from "./pages/Rental";
import Booking from "./pages/Booking";
import Contact_us from "./pages/Contact_us";
import Accessories from "./page/AcessoriesSection";


function App() {
;

  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/shop" element={<Shop />}/>
        <Route path="/rentals" element={<Rental />}/>
        <Route path="/booking" element={<Booking />}/>
        <Route path="/accessories" element={<Accessories  />}/>
        <Route path="/contact" element={<Contact_us />}/>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
