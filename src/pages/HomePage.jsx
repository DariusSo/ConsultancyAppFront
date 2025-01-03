import React, { useState } from "react";
import ConsultantList from "../components/ConsultantList";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const [consultants, setConsultants] = useState([]);

  return (
    <>
    <SearchBar/>
    <div className="min-h-screen bg-gradient-to-b from-[#232529] to-[#2E2F33] py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 text-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#E0E0E0]">Our Newest Consultants</h1>
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
