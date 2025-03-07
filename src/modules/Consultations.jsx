import { useNavigate } from "react-router-dom";
import { getCookie } from "./Cookies";
import { apiURL } from "./globals";

const handleCancelConsultationAndRefund = async (consultation) => {
  try {
    const response = await fetch(
      apiURL + `refund?appointmentId=${consultation.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
      }
    );
    if (response.ok) {
      window.location.href = "/refund/success";
      
    } else {
      console.error("Failed to approve consultation:", await response.text());
    }
  } catch (err) {
    console.error("Error approving consultation:", err);
  }
};

//Geting user info to show on appointment
export const handleFetchUser = async (appointmentId) => {
  try {
    const response = await fetch(
      apiURL + `appointments/info?appointmentId=${appointmentId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
      }
    );

    if (response.ok) {
      const info = await response.json();
      return info;
    } else {
      console.error("Failed to fetch user info:", await response.text());
    }
  } catch (err) {
    console.error("Error fetching user info:", err);
  }
  return null;
};

//Checking if its already time to connect to appointment by returning boolean
export const handleConnectToRoom = async (roomUuid) => {
  try {
    const response = await fetch(
      apiURL + `appointments/connect?roomUuid=${roomUuid}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
      }
    );

    if (response.ok) {
      const isItTime = await response.json();
      return isItTime; // Return the fetched user info for further use
    } else {
      console.error("Failed to fetch user info:", await response.text());
    }
  } catch (err) {
    console.error("Error fetching user info:", err);
  }
  return null; // Return null if there was an error
};

//Checking if user is authorized to connect to this consultation room
export const authenticateRoom = async (roomUuid) => {
      try {
        const response = await fetch(apiURL + `auth/consultationRoom?roomUuid=${roomUuid}`, {
          method: "GET",
          headers: {
            "Authorization": getCookie("loggedIn"),
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
            return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        alert("An unknown error occurred. Please try again later.");
      }
};


export default handleCancelConsultationAndRefund;