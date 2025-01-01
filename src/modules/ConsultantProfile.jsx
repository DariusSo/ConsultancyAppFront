import { getCookie } from "./Cookies";
import { format } from "date-fns"; // Install date-fns for easier date formatting

export const handleAddAvailableTime = async (availableTimes, setAvailableTimes, newAvailableTime) => {
    if (newAvailableTime) {
      const formattedDate = format(newAvailableTime, "yyyy-MM-dd HH:mm");
      const availableTime = { date: formattedDate }; // Customize time range as needed
      const updatedTimes = [...availableTimes, availableTime]; // Create the updated list
      setAvailableTimes(updatedTimes); // Update the state
      console.log("Updated Times:", updatedTimes); // Log the updated list
      updateAvailableTime(updatedTimes);

    }
  };

export const handleRemoveAvailableTime = (timeToRemove, availableTimes, setAvailableTimes) => {

    const updatedTimes = availableTimes.filter((time) => time.date !== timeToRemove.date);

    setAvailableTimes(updatedTimes);
    updateAvailableTime(updatedTimes);
  };

  const updateAvailableTime = async (updatedTimes) => {
    try {
      const response = await fetch("http://localhost:8080/consultant/dates", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
        body: JSON.stringify(updatedTimes),
      });
      const data = await response.text();
    } catch (err) {
      console.error("Failed to update dates:", err);
    }
  }

export const handleApproveConsultation = async (consultation, setApprovedConsultations, setNotApprovedConsultations) => {
    try {
      const response = await fetch(
        `http://localhost:8080/appointments?appointmentId=${consultation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: getCookie("loggedIn"),
          },
        }
      );
  
      if (response.ok) {
        // Move the consultation to the approved list
        setApprovedConsultations((prevApproved) => [...prevApproved, consultation]);
        setNotApprovedConsultations((prevNotApproved) =>
          prevNotApproved.filter((c) => c.id !== consultation.id)
        );
      } else {
        console.error("Failed to approve consultation:", await response.text());
      }
    } catch (err) {
      console.error("Error approving consultation:", err);
    }
  };
  export default handleAddAvailableTime;