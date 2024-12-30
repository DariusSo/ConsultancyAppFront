import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import { getCookie } from "../modules/Cookies"; // Assuming you have a getCookie function

export default function ConsultationRoom() {
  const params = useParams();
  const navigate = useNavigate();
  const roomUuid = params.id;

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const jwtToken = getCookie("loggedIn"); // Replace with your method of retrieving the token
        const response = await fetch(`http://localhost:8080/auth/consultationRoom?roomUuid=${roomUuid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: jwtToken,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error("Unauthorized access");
            navigate("/login"); // Redirect to login page
          } else {
            console.error("Authentication failed with status:", response.status);
          }
          navigate("/login");
        }
      } catch (error) {
        console.error("Error authenticating user:", error);
        navigate("/login"); // Redirect to login on any error
      }
    };

    authenticateUser();
  }, [roomUuid, navigate]);

  return (
    <>
      <ChatWindow />
    </>
  );
}
