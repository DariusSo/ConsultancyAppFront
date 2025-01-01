import React from "react";
import { useNavigate } from "react-router-dom";

const RefundSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Refund Processed Successfully</h1>
        <p className="text-gray-700 mb-6">
          Your refund has been successfully processed. If you have any further questions, feel free to contact our support team.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default RefundSuccessPage;
