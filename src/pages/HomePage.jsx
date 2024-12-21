// src/pages/HomePage.jsx
import React, { useState } from "react";
import ConsultantList from "../components/ConsultantList";

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Consultants</h1>
      <ConsultantList consultants={consultants} />
    </div>
  );
};

export default HomePage;
