import React from "react";
import { Link } from "react-router-dom";

const ThankYouPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-200 font-sans">
      <div className="bg-[#2F3136] shadow-lg rounded-lg p-6 text-center border border-gray-700">
        <h1 className="text-2xl font-bold text-green-500 mb-4">Thank You!</h1>
        <p className="text-gray-300">
          Thank you for booking an appointment with us. The consultant will review and approve your appointment soon.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
