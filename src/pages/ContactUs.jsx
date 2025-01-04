import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-200 font-sans min-h-screen py-10">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-500">Contact Us</h1>
          <p className="text-gray-400 mt-2 text-lg">
            We'd love to hear from you! Reach out to us with any questions or concerns.
          </p>
        </header>
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-[#2F3136] p-6 rounded-lg shadow-lg">
              <FaPhoneAlt className="text-green-500 text-4xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold text-gray-200">Phone</h2>
              <p className="text-gray-400 mt-2">+37063076806</p>
            </div>
            <div className="bg-[#2F3136] p-6 rounded-lg shadow-lg">
              <FaEnvelope className="text-green-500 text-4xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold text-gray-200">Email</h2>
              <p className="text-gray-400 mt-2">darius.songaila1@gmail.com</p>
            </div>
            <div className="bg-[#2F3136] p-6 rounded-lg shadow-lg">
              <FaMapMarkerAlt className="text-green-500 text-4xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold text-gray-200">Address</h2>
              <p className="text-gray-400 mt-2">
                Kauno g. 1234, Kauno raj. <br />
                Kaunas, Lithuania
              </p>
            </div>
          </div>
        </section>
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-green-500 text-center mb-6">
            Send Us a Message
          </h2>
          <form className="max-w-2xl mx-auto bg-[#2F3136] p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-400 font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-[#3A3C40] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-400 font-semibold mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-[#3A3C40] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-400 font-semibold mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                rows="5"
                placeholder="Enter your message"
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-[#3A3C40] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Send Message
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
