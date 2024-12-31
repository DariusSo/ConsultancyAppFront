import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = ({ message = "Something went wrong. Please try again later." }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{message}</p>
        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
