import React from "react";
import mano from "../assets/mano.jpg"

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-200 font-sans min-h-screen py-10">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-500">About Us</h1>
          <p className="text-gray-400 mt-2 text-lg">
            Discover who we are and what drives us.
          </p>
        </header>
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-green-500 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-300">
                At <span className="text-green-500">Consultancy</span>, our
                mission is to connect individuals and businesses with expert
                consultants across a variety of fields. We aim to provide
                accessible, reliable, and innovative solutions tailored to your
                needs.
              </p>
            </div>
            <div>
              <img
                src="https://via.placeholder.com/600x400"
                alt="Our Mission"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-green-500 mb-6 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Darius Songaila", title: "CEO", img: mano },
              { name: "Darius Songaila", title: "CTO", img: mano },
              { name: "Darius Songaila", title: "COO", img: mano },
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-[#2F3136] rounded-lg shadow-lg p-6 text-center"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full mb-4"
                />
                <h3 className="text-xl font-bold text-green-500">
                  {member.name}
                </h3>
                <p className="text-gray-400">{member.title}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Integrity",
                description:
                  "We uphold the highest standards of integrity in every interaction.",
              },
              {
                title: "Innovation",
                description:
                  "We embrace technology to deliver modern and effective solutions.",
              },
              {
                title: "Commitment",
                description:
                  "We are dedicated to ensuring satisfaction for both clients and consultants.",
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-[#2F3136] rounded-lg shadow-lg p-6 text-center"
              >
                <h3 className="text-xl font-bold text-green-500 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="text-center mt-10">
          <h2 className="text-2xl font-semibold text-green-500 mb-4">
            Join Us Today
          </h2>
          <p className="text-gray-300 mb-6">
            Whether you're a consultant looking to expand your network or
            someone seeking expert advice, we're here to help.
          </p>
          <a
            href="/contact"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
