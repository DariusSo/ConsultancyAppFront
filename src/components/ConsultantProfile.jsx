import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import {
  handleApproveConsultation,
  handleRemoveAvailableTime,
  handleAddAvailableTime,
} from "../modules/ConsultantProfile";
import handleCancelConsultationAndRefund, {
  handleFetchUser,
} from "../modules/Consultations";

export default function ConsultantProfile({
  user,
  approvedConsultations,
  notApprovedConsultations,
  availableTimes,
  setAvailableTimes,
  newAvailableTime,
  setNewAvailableTime,
  setApprovedConsultations,
  setNotApprovedConsultations,
}) {
  const [userInfoMap, setUserInfoMap] = useState({}); // Map to store user info by consultation ID

  // Fetch user info for a specific consultation
  const fetchUserInfo = async (appointmentId) => {
    if (!userInfoMap[appointmentId]) {
      const userInfo = await handleFetchUser(appointmentId);
      if (userInfo) {
        setUserInfoMap((prev) => ({
          ...prev,
          [appointmentId]: userInfo,
        }));
      }
    }
  };

  useEffect(() => {
    // Fetch user info for all consultations
    const allAppointments = [
      ...approvedConsultations,
      ...notApprovedConsultations,
    ];
    allAppointments.forEach((consultation) => {
      fetchUserInfo(consultation.id);
    });
  }, [approvedConsultations, notApprovedConsultations]);

  // Render consultation item
  const renderConsultationItem = (consultation, isApproved) => (
    <li key={consultation.id} className="border-b border-gray-600 py-4 text-gray-400">
      <div>
        <strong>Client:</strong>{" "}
        {userInfoMap[consultation.id]?.firstName}{" "}
        {userInfoMap[consultation.id]?.lastName || "Loading..."}
      </div>
      <div>
        <strong>Title:</strong> {consultation.title}
      </div>
      <div>
        <strong>Description:</strong> {consultation.description}
      </div>
      <div>
        <strong>Date & Time:</strong>{" "}
        {new Date(consultation.timeAndDate).toLocaleString()}
      </div>
      <div>
        <strong>Price:</strong> ${consultation.price.toFixed(2)}
      </div>
      {isApproved ? (
        <Link to={`/room/${consultation.roomUuid}`}>
          <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
            Connect
          </button>
        </Link>
      ) : (
        <div className="flex space-x-4 mt-2">
          <button
            onClick={() =>
              handleApproveConsultation(
                consultation,
                setApprovedConsultations,
                setNotApprovedConsultations
              )
            }
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Approve
          </button>
          <button
            onClick={() => handleCancelConsultationAndRefund(consultation)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </li>
  );

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-200 font-sans">
      {/* Left Section: Consultant Info */}
      <div className="bg-[#2F3136] rounded-lg shadow p-6 border border-gray-700">
        {user ? (
          <>
            <img
              src="https://via.placeholder.com/150"
              alt={user.firstName}
              className="w-32 h-32 rounded-full mx-auto mb-4 border border-gray-600"
            />
            <h1 className="text-xl font-bold text-center">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-center text-gray-400">{user.specialty}</p>
            <p className="mt-4">
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Description:</strong> {user.description}
            </p>
          </>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>

      {/* Middle Section: Consultations */}
      <div className="bg-[#2F3136] rounded-lg shadow p-6 border border-gray-700">
        <h2 className="text-lg font-bold mb-4">Consultations</h2>

        {/* Approved Consultations */}
        <div className="mb-6">
          <h3 className="text-md font-semibold text-green-500">Approved</h3>
          {approvedConsultations.length > 0 ? (
            <ul className="mt-2">
              {approvedConsultations.map((consultation) =>
                renderConsultationItem(consultation, true)
              )}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No approved consultations.</p>
          )}
        </div>

        {/* Not Approved Consultations */}
        <div>
          <h3 className="text-md font-semibold text-red-500">Not Approved</h3>
          {notApprovedConsultations.length > 0 ? (
            <ul className="mt-2">
              {notApprovedConsultations.map((consultation) =>
                renderConsultationItem(consultation, false)
              )}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No pending consultations.</p>
          )}
        </div>
      </div>

      {/* Right Section: Available Times */}
      <div className="bg-[#2F3136] rounded-lg shadow p-6 border border-gray-700">
        <h2 className="text-lg font-bold mb-4">Manage Available Times</h2>

        {/* Add Available Time */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Add Available Time
          </label>
          <DatePicker
            selected={newAvailableTime}
            onChange={(date) => setNewAvailableTime(date)}
            showTimeSelect
            timeIntervals={60}
            dateFormat="Pp"
            placeholderText="Choose a date and time"
            className="w-full border border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#3A3C40] text-gray-200 placeholder-gray-400"
          />
          <button
            onClick={() =>
              handleAddAvailableTime(
                availableTimes,
                setAvailableTimes,
                newAvailableTime
              )
            }
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Time
          </button>
        </div>

        {/* Display Available Times */}
        <div className="mb-6">
          <h3 className="text-md font-semibold">Available Times</h3>
          {availableTimes.length > 0 ? (
            <ul className="mt-2">
              {availableTimes.map((time, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b border-gray-600 py-2 text-gray-400"
                >
                  <span>{new Date(time.date).toLocaleString()}</span>
                  <button
                    onClick={() =>
                      handleRemoveAvailableTime(
                        time,
                        availableTimes,
                        setAvailableTimes
                      )
                    }
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No available times added.</p>
          )}
        </div>
      </div>
    </div>
  );
}
