import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import handleCancelConsultationAndRefund from "../modules/Consultations";
import handleBooking from "../modules/ClientProfile";
import { handleFetchUser } from "../modules/Consultations";

export default function ClientProfile({
  user,
  approvedConsultations,
  notApprovedConsultations,
  userInfo,
  setUserInfo,
}) {
  const [userInfoMap, setUserInfoMap] = useState({}); // Map to store user info by appointmentId

  // Fetch user info for a specific appointmentId
  const fetchUserInfo = async (appointmentId) => {
    if (!userInfoMap[appointmentId]) {
      const response = await handleFetchUser(appointmentId);
      if (response) {
        setUserInfoMap((prev) => ({ ...prev, [appointmentId]: response }));
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
    <li key={consultation.id} className="border-b border-gray-700 py-4">
      <div className="text-gray-300">
        <strong>Client:</strong>{" "}
        {userInfoMap[consultation.id]?.firstName}{" "}
        {userInfoMap[consultation.id]?.lastName || "Loading..."}
      </div>
      <div className="text-gray-300">
        <strong>Title:</strong> {consultation.title}
      </div>
      <div className="text-gray-300">
        <strong>Description:</strong> {consultation.description}
      </div>
      <div className="text-gray-300">
        <strong>Date & Time:</strong>{" "}
        {new Date(consultation.timeAndDate).toLocaleString()}
      </div>
      <div className="text-gray-300">
        <strong>Price:</strong> ${consultation.price.toFixed(2)}
      </div>
      {isApproved ? (
        <Link to={`/room/${consultation.roomUuid}`}>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
            Connect
          </button>
        </Link>
      ) : (
        <div>
          <button
            onClick={() => handleCancelConsultationAndRefund(consultation)}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Cancel
          </button>
          {!consultation.paid && (
            <button
              onClick={() => handleBooking(consultation)}
              className="mt-4 bg-green-500 text-white px-4 py-2 ml-5 rounded-md hover:bg-green-700 transition"
            >
              Pay
            </button>
          )}
        </div>
      )}
    </li>
  );

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-200 font-sans">
      {/* Left Section: User Info */}
      <div className="bg-[#2F3136] rounded-lg shadow p-6">
        {user ? (
          <>
            <img
              src="https://via.placeholder.com/150"
              alt={user.firstName}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h1 className="text-xl font-bold text-center text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-4 text-gray-400">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-400">
              <strong>Phone:</strong> {user.phone}
            </p>
          </>
        ) : (
          <p className="text-gray-400">Loading user info...</p>
        )}
      </div>

      {/* Middle Section: Consultations */}
      <div className="bg-[#2F3136] rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4 text-white">Consultations</h2>

        {/* Approved Consultations */}
        <div className="mb-6">
          <h3 className="text-md font-semibold text-green-400">Approved</h3>
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
          <h3 className="text-md font-semibold text-red-400">Not Approved</h3>
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
    </div>
  );
}
