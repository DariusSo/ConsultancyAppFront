import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-300">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-green-500 mb-4">About Us</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            We connect you with the best consultants in AI, finance, health, and legal fields to
            help you achieve your goals efficiently.
          </p>
        </div>

        {/* Support & Resources Section */}
        <div>
          <h3 className="text-lg font-semibold text-green-500 mb-4">Support & Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/help-center" className="hover:text-green-500 transition">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-green-500 transition">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="hover:text-green-500 transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-green-500 transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg font-semibold text-green-500 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-green-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-green-500 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-green-500 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/registration" className="hover:text-green-500 transition">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div>
          <h3 className="text-lg font-semibold text-green-500 mb-4">Follow Us</h3>
          <p className="text-sm text-gray-400 mb-4">
            Stay connected with us through our social media channels.
          </p>
          <div className="flex space-x-4 text-2xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 transition"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 transition"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-8 py-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Consultancy Services. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
