import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import { getCookie } from "../modules/Cookies";
import VideoChat from "../components/VideoChat";
import TopHeader from "../components/TopHeader";

export default function ConsultationRoom() {
  const params = useParams();
  const navigate = useNavigate();
  const roomUuid = params.id;
  const connectToChatRef = useRef(null);
  const connectToVideoRef = useRef(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const jwtToken = getCookie("loggedIn");
        const response = await fetch(
          `http://localhost:8080/auth/consultationRoom?roomUuid=${roomUuid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: jwtToken,
            },
          }
        );

        if (!response.ok) {
          console.error("Authentication failed:", response.status);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error authenticating user:", error);
        navigate("/login");
      }
    };

    authenticateUser();
  }, [roomUuid, navigate]);

  const handleParentButtonClick = () => {
    if (connectToChatRef.current) {
      connectToChatRef.current();
    }
    if (connectToVideoRef.current) {
      connectToVideoRef.current.connect(); // Correctly call the exposed `connect` function
    }
  };

  return (
    <>
      <TopHeader/>
      <VideoChat ref={connectToVideoRef} />
      <ChatWindow ref={connectToChatRef} />
      <button type="button" onClick={handleParentButtonClick}>
        Connect to Chat and Video
      </button>
    </>
  );
}
