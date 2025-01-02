import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { getCookie } from "../modules/Cookies"; // Utility to get cookies
import TopHeader from "./TopHeader";

const AIChat = () => {
  const {consultantCategory} = useParams(); // Extract category from the URL params
  const [messages, setMessages] = useState([
    { sender: "AI", content: "Hello! How can I assist you today?" },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (userMessage.trim() === "") return;

    // Add user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "You", content: userMessage },
    ]);

    const currentMessage = userMessage; // Save current message for async call
    setUserMessage("");
    setLoading(true);

    try {
      // API call to fetch AI response
      const token = getCookie("loggedIn"); // Replace with your actual cookie name
      const response = await fetch(
        `http://localhost:8080/ai?message=${encodeURIComponent(
          currentMessage
        )}&consultantCategory=${encodeURIComponent(consultantCategory)}`, // Use category from URL
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.text(); // Assuming the response is plain text

      // Add AI's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "AI", content: data },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "AI", content: "I'm sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      <TopHeader />
      <div className="min-h-screen bg-gradient-to-b from-[#232529] to-[#2E2F33] flex flex-col pt-14">
        {/* Chat Header */}
        <div
          className="bg-[#34373C] py-4 px-6 border-b border-gray-700 text-white text-lg font-bold sticky top-14 z-10"
        >
          AI Chat Assistant - {consultantCategory} {/* Display category */}
        </div>
  
        {/* Chat Messages Container */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-4"
          style={{ maxHeight: "calc(100vh - 144px)" }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg shadow ${
                  msg.sender === "You"
                    ? "bg-green-600 text-white"
                    : "bg-[#3A3C40] text-gray-200"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] px-4 py-2 rounded-lg shadow bg-[#3A3C40] text-gray-200">
                <p className="text-sm italic">Typing...</p>
              </div>
            </div>
          )}
        </div>
  
        {/* Chat Input */}
        <div className="bg-[#34373C] p-4 border-t border-gray-700 flex items-center">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type your message here..."
            className="flex-1 bg-[#3A3C40] text-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`ml-4 px-4 py-2 rounded-md transition ${
              loading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
  
  
  
  
};

export default AIChat;