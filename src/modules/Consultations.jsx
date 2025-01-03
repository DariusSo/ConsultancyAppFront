import { getCookie } from "./Cookies";

const handleCancelConsultationAndRefund = async (consultation) => {
      try {
        const response = await fetch(
          `http://localhost:8080/refund?appointmentId=${consultation.id}`,
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

export const handleFetchUser = async (appointmentId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/appointments/info?appointmentId=${appointmentId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
      }
    );

    if (response.ok) {
      const info = await response.json();
      return info; // Return the fetched user info for further use
    } else {
      console.error("Failed to fetch user info:", await response.text());
    }
  } catch (err) {
    console.error("Error fetching user info:", err);
  }
  return null; // Return null if there was an error
};

export const handleConnectToRoom = async (roomUuid) => {
  try {
    const response = await fetch(
      `http://localhost:8080/appointments/connect?roomUuid=${roomUuid}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
      }
    );

    if (response.ok) {
      const isItTime = await response.json();
       if(isItTime){
        window.location.href = "/room/" + roomUuid;
       }else{
        return false;
       }
    } else {
    }
  } catch (err) {
    console.error("Error fetching user info:", err);
  }
  return null; // Return null if there was an error
};


export default handleCancelConsultationAndRefund;