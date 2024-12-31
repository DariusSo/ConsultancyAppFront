import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCookie } from "../modules/Cookies";
import { format } from "date-fns"; // Install date-fns for easier date formatting
import { Navigate } from "react-router-dom";
import ConsultantProfile from "../components/ConsultantProfile";
import ClientProfile from "../components/ClientProfile";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [approvedConsultations, setApprovedConsultations] = useState([]);
  const [notApprovedConsultations, setNotApprovedConsultations] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [newAvailableTime, setNewAvailableTime] = useState(null);
  const [role, setRole] = useState("");


  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const userData = await fetchUserData();
        if (userData) {
          processUserData(userData, setRole, setUser, setAvailableTimes, setApprovedConsultations, setNotApprovedConsultations);
        }
  
        const appointmentsData = await fetchAppointments();
        processAppointments(appointmentsData, setApprovedConsultations, setNotApprovedConsultations);
      } catch (err) {
        console.error("Error during data fetching:", err);
      }
    };
    
    fetchAndProcessData();
    console.log(notApprovedConsultations);
  }, []);
  

  return (
    <div>
      {role == 'CONSULTANT' ? (<ConsultantProfile user={user} 
                                                  approvedConsultations={approvedConsultations}
                                                  notApprovedConsultations={notApprovedConsultations}
                                                  availableTimes={availableTimes}
                                                  setAvailableTimes={setAvailableTimes}
                                                  newAvailableTime={newAvailableTime}
                                                  setNewAvailableTime={setNewAvailableTime}
                                                  setApprovedConsultations={setApprovedConsultations}
                                                  setNotApprovedConsultations={setNotApprovedConsultations}
                                />
                              ) : (<ClientProfile user={user} 
                                                  approvedConsultations={approvedConsultations}
                                                  notApprovedConsultations={notApprovedConsultations}
                                    />
                                  )}
    </div>
  );
};

const fetchUserData = async () => {
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

const fetchAppointments = async () => {
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

const processUserData = (data, setRole, setUser, setAvailableTimes, setApprovedConsultations, setNotApprovedConsultations) => {
  setRole(data.role);
  setUser(data);

  if (data.role === "CONSULTANT") {
    const parsedTimes = JSON.parse(data.availableTime);
    setAvailableTimes(parsedTimes || []);
  }
};

const processAppointments = (data, setApprovedConsultations, setNotApprovedConsultations) => {
  const approved = [];
  const notApproved = [];
  data.forEach((appointment) => {
    if (appointment.accepted) {
      approved.push(appointment);
    } else {
      notApproved.push(appointment);
    }
  });
  console.log("Not::::::::::::::::", notApproved);
  setApprovedConsultations(approved);
  setNotApprovedConsultations(notApproved);
};

export default UserProfilePage;
