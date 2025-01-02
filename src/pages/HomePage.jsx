import React, { useState } from "react";
import ConsultantList from "../components/ConsultantList";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const [consultants, setConsultants] = useState([
    {
      id: 1,
      profilePicture: "https://via.placeholder.com/150",
      firstName: "John",
      lastName: "Doe",
      specialty: "Financial Advisor",
      category: "FINANCIAL",
      hourlyRate: 100,
      email: "john.doe@example.com",
      bio: "John has over 10 years of experience in financial planning and investment strategies.",
    },
    {
      id: 2,
      profilePicture: "https://via.placeholder.com/150",
      firstName: "Jane",
      lastName: "Smith",
      specialty: "Legal Consultant",
      category: "LEGAL",
      hourlyRate: 150,
      email: "jane.smith@example.com",
      bio: "Jane specializes in corporate law and has assisted numerous startups in legal matters.",
    },
  ]);

  return (
    <>
    <SearchBar/>
    <div className="min-h-screen bg-gradient-to-b from-[#232529] to-[#2E2F33] py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 text-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#E0E0E0]">Our Consultants</h1>
          <p className="text-gray-400 mt-2">
            Browse the newest consultants below or use the search to find the perfect match!
          </p>
        </div>
        <ConsultantList consultants={consultants} />
      </div>
    </div>
    </>
  );
};

export default HomePage;
