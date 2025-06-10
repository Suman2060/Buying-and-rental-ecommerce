
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-xl w-full">
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your payment has been successfully processed.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg transition duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
