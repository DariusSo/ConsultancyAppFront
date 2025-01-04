import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ConsultantProfile from "../components/ConsultantProfile";
import ClientProfile from "../components/ClientProfile";
import TopHeader from "../components/TopHeader";
import { fetchAndProcessData } from "../modules/User";


const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [approvedConsultations, setApprovedConsultations] = useState([]);
  const [notApprovedConsultations, setNotApprovedConsultations] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [newAvailableTime, setNewAvailableTime] = useState(null);
  const [role, setRole] = useState("");
  const [userInfo, setUserInfo] = useState("");

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
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        ) : (
          <ClientProfile
            user={user}
            approvedConsultations={approvedConsultations}
            notApprovedConsultations={notApprovedConsultations}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        )}
      </div>
    </>
  );
};

export default UserProfilePage;
