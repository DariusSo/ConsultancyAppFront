import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCookie } from "../modules/Cookies";
import { format } from "date-fns"; // Install date-fns for easier date formatting
import { Navigate } from "react-router-dom";
import ConsultantProfile from "../components/ConsultantProfile";
import ClientProfile from "../components/ClientProfile";
import { processUserData, processAppointments, fetchUserData, fetchAppointments } from "../modules/User";
import TopHeader from "../components/TopHeader";
import { fetchAndProcessData } from "../modules/User";


const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [approvedConsultations, setApprovedConsultations] = useState([]);
  const [notApprovedConsultations, setNotApprovedConsultations] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [newAvailableTime, setNewAvailableTime] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    
    fetchAndProcessData({setRole, setUser, setAvailableTimes, setApprovedConsultations, setNotApprovedConsultations, role});
    console.log(notApprovedConsultations);
  }, []);

  return (
    <>
      <TopHeader />
      <div className="bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-200 font-sans min-h-screen p-6">
        {role === 'CONSULTANT' ? (
          <ConsultantProfile
            user={user}
            approvedConsultations={approvedConsultations}
            notApprovedConsultations={notApprovedConsultations}
            availableTimes={availableTimes}
            setAvailableTimes={setAvailableTimes}
            newAvailableTime={newAvailableTime}
            setNewAvailableTime={setNewAvailableTime}
            setApprovedConsultations={setApprovedConsultations}
            setNotApprovedConsultations={setNotApprovedConsultations}
          />
        ) : (
          <ClientProfile
            user={user}
            approvedConsultations={approvedConsultations}
            notApprovedConsultations={notApprovedConsultations}
          />
        )}
      </div>
    </>
  );
};

export default UserProfilePage;
