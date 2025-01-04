import React from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, eraseCookie } from "../modules/Cookies";
import { FaUserCircle } from "react-icons/fa";

const TopHeader = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!getCookie("loggedIn");

  const handleLogout = () => {
    eraseCookie("loggedIn");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between bg-[#232529] border-b border-gray-700 h-14 px-4 z-50">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-gray-300 hover:text-white font-semibold"
      >
        Home
      </button>
      <div className="flex items-center">
        {isLoggedIn && (
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-300 hover:text-white mr-4"
            title="Profile"
          >
            <FaUserCircle size={24} />
          </button>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-300 hover:text-white font-semibold"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="mr-4 text-sm text-gray-300 hover:text-white font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/registration")}
              className="text-sm text-gray-300 hover:text-white font-semibold"
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
