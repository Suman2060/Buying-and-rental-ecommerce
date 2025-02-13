// import React from "react";

const Contact = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Contact Us
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Contact Details */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions or want to know more? Feel free to contact us!
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-blue-600 text-xl mr-4">
                  <i className="fas fa-phone"></i>
                </span>
                <span className="text-gray-700">123-456-789</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 text-xl mr-4">
                  <i className="fas fa-envelope"></i>
                </span>
                <span className="text-gray-700">info@bikefarm.com</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 text-xl mr-4">
                  <i className="fas fa-map-marker-alt"></i>
                </span>
                <span className="text-gray-700">
                  Jhamsikhel Lalitpur
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>
            <form className="space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your Name"
                />
              </div>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your Email"
                />
              </div>
              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your Message"
                ></textarea>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
