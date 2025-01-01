import { getCookie } from "./Cookies";

export const fetchUserData = async () => {
    const response = await fetch("http://localhost:8080/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getCookie("loggedIn"),
      },
    });
  
    if (response.status === 401) {
      window.location.href = "/login";
      return null; // Prevent further processing
    }
  
    const data = await response.json();
    return data;
  };
export const fetchAppointments = async () => {
    const response = await fetch("http://localhost:8080/appointments", {
      headers: {
        Authorization: getCookie("loggedIn"),
      },
    });
  
    if (!response.ok) {
      console.error("Failed to fetch appointments:", response.status);
      return [];
    }
  
    const data = await response.json();
    return data;
  };
  
export const processUserData = (data, setRole, setUser, setAvailableTimes, setApprovedConsultations, setNotApprovedConsultations) => {
    setRole(data.role);
    setUser(data);
  
    if (data.role === "CONSULTANT") {
      const parsedTimes = JSON.parse(data.availableTime);
      setAvailableTimes(parsedTimes || []);
    }
  };
  
export const processAppointments = (data, setApprovedConsultations, setNotApprovedConsultations) => {
    const approved = [];
    const notApproved = [];
    data.forEach((appointment) => {
      if (appointment.accepted) {
        approved.push(appointment);
      } else {
        notApproved.push(appointment);
      }
    });
    setApprovedConsultations(approved);
    setNotApprovedConsultations(notApproved);
  };

export default fetchUserData;