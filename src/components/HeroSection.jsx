// src/components/BannerSection.jsx
import React from 'react';

const BannerSection = () => {
  return (
    <section className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-20">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center">
        {/* Image/Logo Section */}
        <div className="lg:w-1/2 w-full mb-10 lg:mb-0">
          <img
            src="https://via.placeholder.com/600x400" // Replace with your image or logo URL
            alt="Consultancy Banner"
            className="w-full h-auto rounded-lg shadow-xl"
          />
        </div>

        {/* Text Content Section */}
        <div className="lg:w-1/2 w-full lg:pl-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Transform Your Future</h2>
          <p className="text-lg mb-6">
            Partner with our expert consultants to unlock your potential. From financial planning to career advancement, our dedicated professionals are here to guide you every step of the way.
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors font-semibold"
          >
            Start Your Journey
          </a>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
