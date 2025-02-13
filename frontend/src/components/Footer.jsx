
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-6 md:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">About Us</h3>
            <p className="text-sm">
              We provide top-quality cycles and accessories for every type of rider. From beginners to pros, we’ve got you covered.
            </p>
          </div>
          {/* Links Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li><a href="/shop" className="hover:text-blue-400">Shop</a></li>
              <li><a href="/rentals" className="hover:text-blue-400">Rentals</a></li>
              <li><a href="/about" className="hover:text-blue-400">About</a></li>
              <li><a href="/contact" className="hover:text-blue-400">Contact</a></li>
            </ul>
          </div>
          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Us</h3>
            <p className="text-sm">Bike-Farm Nepal, Jhamsikhel</p>
            <p className="text-sm">Email: info@bikefarm.com</p>
            <p className="text-sm">Phone: 123-456-7890</p>
          </div>
        </div>
        {/* Divider */}
        <hr className="my-6 border-gray-600" />
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {new Date().getFullYear()} Bike-Farm Nepal. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-facebook"></i> Facebook
            </a>
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-instagram"></i> Instagram
            </a>
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-twitter"></i> Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
