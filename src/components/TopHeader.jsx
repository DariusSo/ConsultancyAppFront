import React from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, eraseCookie } from "../modules/Cookies"; // Utility functions for cookies
import { FaUserCircle } from "react-icons/fa"; // Import profile icon

const TopHeader = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!getCookie("loggedIn"); // Check if "loggedIn" cookie exists

  const handleLogout = () => {
    eraseCookie("loggedIn"); // Remove the cookie
    navigate("/login"); // Redirect to the login page
  };

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between border-b border-gray-300 bg-white h-10 px-4">
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="text-sm text-gray-700 hover:text-gray-900"
      >
        Home
      </button>

      {/* Profile Icon and Authentication Buttons */}
      <div className="flex items-center">
        {isLoggedIn && (
          <button
            onClick={() => navigate("/consultant")}
            className="text-gray-700 hover:text-gray-900 mr-4"
            title="Profile"
          >
            <FaUserCircle size={20} /> {/* Profile Icon */}
          </button>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="mr-4 text-sm text-gray-700 hover:text-gray-900"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/registration")}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default TopHeader;
