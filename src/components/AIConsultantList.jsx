import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AIConsultantList = () => {
  const navigate = useNavigate();

  // Hardcoded list of AI consultants
  const consultants = [
    {
      id: 1,
      title: "AI Financial Advisor",
      description: "Expert in automating financial planning, risk analysis, and market predictions using AI.",
      category: "FINANCIAL",
    },
    {
      id: 2,
      title: "Healthcare AI Assistant",
      description: "Specializes in medical diagnostics, patient monitoring, and predictive healthcare insights.",
      category: "HEALTH",
    },
    {
      id: 3,
      title: "AI Marketing Strategist",
      description: "Focused on personalized marketing campaigns, consumer behavior analysis, and ad optimization.",
      category: "MARKETING",
    },
    {
      id: 4,
      title: "AI Legal Assistant",
      description: "Streamlines legal research, document drafting, and compliance analysis with AI solutions.",
      category: "LEGAL",
    },
    {
      id: 5,
      title: "AI IT Consultant",
      description: "Offers expert guidance on IT infrastructure, cloud solutions, and software development using AI-driven insights.",
      category: "IT",
    },
    {
      id: 6,
      title: "AI Career Coach",
      description: "Assists with resume optimization, interview preparation, and personalized career planning through AI technology.",
      category: "CAREER",
    },
    {
      id: 7,
      title: "AI Business Strategist",
      description: "Provides data-driven business insights, growth strategies, and market analysis with AI-powered tools.",
      category: "BUSINESS",
    }
  ];

  // Check if the user is logged in
  const isLoggedIn = !!document.cookie.split("; ").find((row) => row.startsWith("loggedIn="));

  // Redirect to chat or login
  const handleChatRedirect = (consultantId) => {
    if (!isLoggedIn) {
      alert("You need to log in to start a chat.");
      navigate("/login");
    } else {
      navigate(`/chat/${consultantId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#232529] to-[#2E2F33] py-8 px-4">
      <h1 className="text-3xl font-bold text-green-500 mb-8 text-center">AI Consultants</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultants.map((consultant) => (
          <div
            key={consultant.id}
            className="bg-[#34373C] rounded-lg shadow-md border border-gray-600 hover:shadow-lg p-6 transition duration-300"
          >
            <div className="text-center">
              {/* AI-themed image */}
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">AI</span>
              </div>

              {/* Consultant details */}
              <h2 className="text-lg font-bold text-gray-100">{consultant.title}</h2>
              <p className="text-sm text-gray-500 mt-2">{consultant.description}</p>
            </div>

            {/* Action button */}
            <div className="mt-4 flex justify-center">
              <Link to={"/ai/" + consultant.category}>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Start Chat
              </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIConsultantList;
