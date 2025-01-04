import React, { useState, useEffect, useRef } from "react";
import VideoChat from "../components/VideoChat";
import ChatWindow from "../components/ChatWindow";
import { useNavigate, useParams } from "react-router-dom";
import { authenticateRoom } from "../modules/Consultations";

function MainPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // Track connection state
  const videoChatRef = useRef(null);
  const chatRef = useRef(null);
  const roomUuid = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      let flag = await authenticateRoom(roomUuid);
      if(flag != true){
        navigate("/login");
      }
    }
    checkAuth();
  }, []);

  const handleConnectToVideoAndChat = () => {
    if (videoChatRef.current && chatRef.current) {
      videoChatRef.current.connect(); // Connect to video chat
      videoChatRef.current.startCall();
      chatRef.current.connectToChat(); // Connect to chat
      setIsConnected(true); // Update state to connected
    } else {
      console.error("VideoChat or ChatWindow ref is not available.");
    }
  };

  const handleDisconnectVideoAndChat = () => {
    if (videoChatRef.current && chatRef.current) {
      videoChatRef.current.disconnect(); // Disconnect video chat
      setIsConnected(false); // Update state to disconnected
    } else {
      console.error("VideoChat or ChatWindow ref is not available.");
    }
  };

  // Detect screen size and update state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 968); // Treat width <= 968px as mobile
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-200 font-sans relative">
      {/* Layout for PC */}
      {!isMobile ? (
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Video Section */}
          <div className="flex-1 p-4">
            <VideoChat ref={videoChatRef} />
          </div>

          {/* Chat Section */}
          <div className="w-1/3 p-4 border-l border-gray-700">
            <ChatWindow ref={chatRef} />
          </div>
        </div>
      ) : (
        /* Layout for Mobile */
        <>
          <div className="flex h-[calc(100vh-4rem)]">
            {/* Video Section */}
            <div className="flex-1 p-4">
              <VideoChat ref={videoChatRef} />
            </div>
          </div>

          <div className="flex h-[calc(100vh-4rem)]">
            {/* Chat Section */}
            <div className="flex-1 p-4 border-t border-gray-700">
              <ChatWindow ref={chatRef} />
            </div>
          </div>
        </>
      )}

      {/* Sticky Connect/Disconnect Button */}
      <div className="sticky bottom-0 w-full text-center py-5 transition">
        {isConnected ? (
          <button
            onClick={handleDisconnectVideoAndChat}
            className="w-full text-lg font-semibold bg-red-600 hover:bg-red-700 text-white py-3 rounded-none"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={handleConnectToVideoAndChat}
            className="w-full text-lg font-semibold bg-green-600 hover:bg-green-700 text-white py-3 rounded-none"
          >
            Connect to Video and Chat
          </button>
        )}
      </div>
    </div>
  );
}

export default MainPage;
