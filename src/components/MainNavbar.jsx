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
    <nav className="bg-gradient-to-r from-[#232529] to-[#2E2F33] text-gray-200 shadow-md relative">
      {/* Navbar Container */}
      <div className="container mx-auto px-4 flex items-center justify-between h-16 relative z-50">
        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-8 items-center">
          {/* Categories Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 text-gray-200 hover:text-green-500 font-semibold">
              <FaList />
              <span>Categories</span>
            </button>
            <div className="absolute left-0 mt-2 w-40 bg-[#34373C] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <ul className="py-2">
                <li>
                  <Link to="/category/financial" className="block px-4 py-2 hover:bg-green-500 hover:text-white">
                    Financial Advisors
                  </Link>
                </li>
                <li>
                  <Link to="/category/health" className="block px-4 py-2 hover:bg-green-500 hover:text-white">
                    Health Experts
                  </Link>
                </li>
                <li>
                  <Link to="/category/it" className="block px-4 py-2 hover:bg-green-500 hover:text-white">
                    IT Specialists
                  </Link>
                </li>
                <li>
                  <Link to="/category/career" className="block px-4 py-2 hover:bg-green-500 hover:text-white">
                    Career Advisors
                  </Link>
                </li>
                <li>
                  <Link to="/category/marketing" className="block px-4 py-2 hover:bg-green-500 hover:text-white">
                    Marketing Experts
                  </Link>
                </li>
                <li>
                  <Link to="/category/business" className="block px-4 py-2 hover:bg-green-500 hover:text-white">
                    Business Experts
                  </Link>
                </li>
                <li>
                  <Link to="/category/other" className="block px-4 py-2 hover:bg-green-500 hover:text-white">
                    Other Specialists
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Other Menu Items */}
          <Link
            to="/ai"
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
        } md:hidden bg-[#34373C] text-gray-200 transition-all duration-300 z-40 relative`}
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
                  <Link to="/category/it" className="block hover:text-green-500">
                    IT Specialists
                  </Link>
                </li>
                <li>
                  <Link to="/category/career" className="block hover:text-green-500">
                    Career Advisors
                  </Link>
                </li>
                <li>
                  <Link to="/category/marketing" className="block hover:text-green-500">
                    Marketing Experts
                  </Link>
                </li>
                <li>
                  <Link to="/category/business" className="block hover:text-green-500">
                    Business Experts
                  </Link>
                </li>
                <li>
                  <Link to="/category/other" className="block hover:text-green-500">
                    Other Specialists
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
