import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCookie } from "../modules/Cookies";
import { format } from "date-fns"; // Install date-fns for easier date formatting
import { Navigate } from "react-router-dom";
import ConsultantProfile from "../components/ConsultantProfile";
import ClientProfile from "../components/ClientProfile";
import { processUserData, processAppointments, fetchUserData, fetchAppointments } from "../modules/User";

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
export default UserProfilePage;
