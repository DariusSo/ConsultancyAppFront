import { getCookie } from "./Cookies";
import { apiURL } from "./globals";

export const fetchUserData = async () => {
    const response = await fetch(apiURL + "auth/profile", {
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
    const response = await fetch(apiURL + "appointments", {
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
  
export const processUserData = (data, { setRole, setUser, setAvailableTimes, setApprovedConsultations, setNotApprovedConsultations }) => {
    console.log(data);
    setRole(data.role);
    setUser(data);
  
    if (data.role === "CONSULTANT") {
      const parsedTimes = JSON.parse(data.availableTime);
      setAvailableTimes(parsedTimes || []);
    }
  };
  
export const processAppointments = (data, setApprovedConsultations, setNotApprovedConsultations, role) => {
    const approved = [];
    const notApproved = [];
    data.forEach((appointment) => {
      console.log(appointment);
      console.log(role);
      if (appointment.accepted) {
        approved.push(appointment);
      } else {
        if(role == "CONSULTANT" && !appointment.paid){

        }else{
          notApproved.push(appointment);
        }
      }
    });
    setApprovedConsultations(approved);
    setNotApprovedConsultations(notApproved);
  };

  export const fetchAndProcessData = async ({ setRole, setUser, setAvailableTimes, setApprovedConsultations, setNotApprovedConsultations, role }) => {
    try {
      const userData = await fetchUserData();
      console.log(userData);
      var roleVar = userData.role;
      if (userData) {
        processUserData(userData, { setRole, setUser, setAvailableTimes, setApprovedConsultations, setNotApprovedConsultations });
      }

      const appointmentsData = await fetchAppointments();
      processAppointments(appointmentsData, setApprovedConsultations, setNotApprovedConsultations, roleVar);
    } catch (err) {
      console.error("Error during data fetching:", err);
    }
  };

export default fetchUserData;