import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaUser, FaPhone, FaInfoCircle, FaList } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-[#232529] to-[#2E2F33] text-gray-200 shadow-md">
      {/* Navbar Container */}
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-8 items-center">
          {/* Categories Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 text-gray-200 hover:text-green-500 font-semibold">
              <FaList />
              <span>Categories</span>
            </button>
            <div className="absolute left-0 mt-2 w-40 bg-[#34373C] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ul className="py-2">
                <li>
                  <Link to="/category/ai" className="block px-4 py-2 hover:bg-green-500 hover:text-white">
                    AI Consultants
                  </Link>
                </li>
                <li>
                  <Link to="/category/finance" className="block px-4 py-2 hover:bg-green-500 hover:text-white">
                    Financial Advisors
                  </Link>
                </li>
                <li>
                  <Link to="/category/health" className="block px-4 py-2 hover:bg-green-500 hover:text-white">
                    Health Experts
                  </Link>
                </li>
                <li>
                  <Link to="/category/legal" className="block px-4 py-2 hover:bg-green-500 hover:text-white">
                    Legal Consultants
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Other Menu Items */}
          <Link
            to="/ai-consultants"
            className="flex items-center space-x-2 text-gray-200 hover:text-green-500 font-semibold"
          >
            <FaUser />
            <span>AI Consultants</span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center space-x-2 text-gray-200 hover:text-green-500 font-semibold"
          >
            <FaPhone />
            <span>Contact</span>
          </Link>
          <Link
            to="/about"
            className="flex items-center space-x-2 text-gray-200 hover:text-green-500 font-semibold"
          >
            <FaInfoCircle />
            <span>About Us</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-200 hover:text-green-500 text-2xl"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMobileMenuOpen ? "h-auto py-4" : "h-16"
        } md:hidden bg-[#34373C] text-gray-200 transition-all duration-300`}
      >
        <ul className={`${isMobileMenuOpen ? "space-y-2 px-4" : "hidden"}`}>
          <li>
            <Link to="/" className="flex items-center space-x-2 hover:text-green-500">
              <FaHome />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/ai-consultants"
              className="flex items-center space-x-2 hover:text-green-500"
            >
              <FaUser />
              <span>AI Consultants</span>
            </Link>
          </li>
          <li>
            <Link to="/contact" className="flex items-center space-x-2 hover:text-green-500">
              <FaPhone />
              <span>Contact</span>
            </Link>
          </li>
          <li>
            <Link to="/about" className="flex items-center space-x-2 hover:text-green-500">
              <FaInfoCircle />
              <span>About Us</span>
            </Link>
          </li>
          <li>
            {/* Categories Dropdown for Mobile */}
            <button
              className="flex items-center space-x-2 hover:text-green-500"
              onClick={toggleCategories}
            >
              <FaList />
              <span>Categories</span>
            </button>
            {isCategoriesOpen && (
              <ul className="mt-2 space-y-1 pl-6">
                <li>
                  <Link to="/category/ai" className="block hover:text-green-500">
                    AI Consultants
                  </Link>
                </li>
                <li>
                  <Link to="/category/finance" className="block hover:text-green-500">
                    Financial Advisors
                  </Link>
                </li>
                <li>
                  <Link to="/category/health" className="block hover:text-green-500">
                    Health Experts
                  </Link>
                </li>
                <li>
                  <Link to="/category/legal" className="block hover:text-green-500">
                    Legal Consultants
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
