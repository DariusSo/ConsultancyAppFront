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

export default handleCancelConsultationAndRefund;