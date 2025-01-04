import React, { useEffect, useState } from "react";
import handleCancelConsultationAndRefund from "../modules/Consultations";
import handleBooking, { handleSaveInfo } from "../modules/ClientProfile";
import { handleFetchUser, handleConnectToRoom } from "../modules/Consultations";
import { getCookie } from "../modules/Cookies";

export default function ClientProfile({
  user,
  setUser,
  approvedConsultations,
  notApprovedConsultations,
}) {
  const [userInfoMap, setUserInfoMap] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editableUser, setEditableUser] = useState(user); // Local editable copy

  useEffect(() => {
    if (user) {
      setEditableUser(user);
    }
  }, [user]);

  const fetchUserInfo = async (appointmentId) => {
    if (!userInfoMap[appointmentId]) {
      const response = await handleFetchUser(appointmentId);
      if (response) {
        setUserInfoMap((prev) => ({ ...prev, [appointmentId]: response }));
      }
    }
  };

  useEffect(() => {
    const allAppointments = [
      ...approvedConsultations,
      ...notApprovedConsultations,
    ];
    allAppointments.forEach((consultation) => {
      fetchUserInfo(consultation.id);
    });
  }, [approvedConsultations, notApprovedConsultations]);

  const handleConnect = async (roomUuid) => {
    const isItTime = await handleConnectToRoom(roomUuid);
    if (!isItTime) {
      setErrorMessage("You can only connect 5 minutes before the consultation.");
    } else {
      window.location.href = `/room/${roomUuid}`;
    }
  };

  const closePopup = () => {
    setErrorMessage(null);
  };

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
        <button
          onClick={() => handleConnect(consultation.roomUuid)}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Connect
        </button>
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
      {editableUser ? (
        <>
          <h1 className="text-xl font-bold text-center text-white">
            {isEditing ? (
              <input
                type="text"
                value={editableUser.firstName}
                onChange={(e) =>
                  setEditableUser((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                className="w-full mt-2 p-2 bg-[#232529] border border-gray-600 rounded-lg text-gray-300"
              />
            ) : (
              `${editableUser.firstName} ${editableUser.lastName}`
            )}
          </h1>
          <p className="mt-4 text-gray-400">
            <strong>Email:</strong>{" "}
            {isEditing ? (
              <input
                type="email"
                value={editableUser.email}
                onChange={(e) =>
                  setEditableUser((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full mt-2 p-2 bg-[#232529] border border-gray-600 rounded-lg text-gray-300"
              />
            ) : (
              editableUser.email
            )}
          </p>
          <p className="text-gray-400">
            <strong>Phone:</strong>{" "}
            {isEditing ? (
              <input
                type="tel"
                value={editableUser.phone}
                onChange={(e) =>
                  setEditableUser((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="w-full mt-2 p-2 bg-[#232529] border border-gray-600 rounded-lg text-gray-300"
              />
            ) : (
              editableUser.phone
            )}
          </p>
          {!isEditing && (
            <>
              <div className="mt-4">
                <strong>Approved Consultations:</strong> {approvedConsultations.length}
              </div>
              <div className="mt-2">
                <strong>Not Approved Consultations:</strong> {notApprovedConsultations.length}
              </div>
            </>
          )}
          {isEditing && (
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => {setIsEditing(false); setEditableUser(user);}}
                className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={(e) => handleSaveInfo(e, editableUser, setUser, setIsEditing)}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          )}
          {!isEditing && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Edit Info
              </button>
            </div>
          )}
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

      {/* Error Pop-up */}
      {errorMessage && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 font-sans">
        <div className="bg-[#2F3136] text-gray-200 p-6 rounded-lg shadow-lg border border-gray-600">
          <p className="text-sm text-gray-300">{errorMessage}</p>
          <button
            onClick={closePopup}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Close
          </button>
        </div>
      </div>
      
      )}
    </div>
  );
}
