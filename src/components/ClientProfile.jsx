import React, { useEffect, useState } from "react";
import { handleFetchUser, handleConnectToRoom } from "../modules/Consultations";
import handleCancelConsultationAndRefund from "../modules/Consultations";
import { handleSaveInfo, handleUploadPhoto } from "../modules/ClientProfile";

export default function ClientProfile({
  user,
  setUser,
  approvedConsultations,
  notApprovedConsultations,
}) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState({ ...user }); // For editing modal
  const [userInfoMap, setUserInfoMap] = useState({}); // Store consultant info
  const [isAddingPhoto, setIsAddingPhoto] = useState(false); // Toggle add photo modal
  const [photoFile, setPhotoFile] = useState(null); // File for photo upload

  useEffect(() => {
    if (user) {
      setTempUser(user);
    }
  }, [user]);

  // Fetch consultant information for consultations
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
    allAppointments.forEach((consultation) => fetchUserInfo(consultation.id));
  }, [approvedConsultations, notApprovedConsultations]);

  const handleOpenEditModal = () => {
    setTempUser({ ...user });
    setIsEditing(true);
  };

  const handleCloseEditModal = () => {
    setIsEditing(false);
  };

  

  const handleConnect = async (roomUuid) => {
    const canConnect = await handleConnectToRoom(roomUuid);
    if (!canConnect) {
      setErrorMessage("You can only connect 5 minutes before the consultation.");
    } else {
      window.location.href = `/room/${roomUuid}`;
    }
  };

  const closePopup = () => {
    setErrorMessage(null);
  };

  const renderConsultationActions = (consultation, isApproved) => (
    <div className="flex justify-between mt-4">
      {isApproved ? (
        <button
          onClick={() => handleConnect(consultation.roomUuid)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105"
        >
          Connect
        </button>
      ) : (
        <>
          <button
            onClick={() => handleCancelConsultationAndRefund(consultation)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105"
          >
            Cancel
          </button>
          {!consultation.paid && (
            <button
              onClick={() => alert("Pay Now")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105"
            >
              Pay
            </button>
          )}
        </>
      )}
    </div>
  );

  const renderConsultationItem = (consultation, isApproved) => (
    <li key={consultation.id} className="bg-[#3A3C40] p-4 rounded-lg shadow">
      <p className="text-white font-semibold">{consultation.title}</p>
      <p className="text-gray-400 text-sm">
        Date: {new Date(consultation.timeAndDate).toLocaleString()}
      </p>
      <p className="text-gray-400 text-sm">
        Consultant:{" "}
        {userInfoMap[consultation.id]
          ? `${userInfoMap[consultation.id].firstName} ${userInfoMap[consultation.id].lastName}`
          : "Loading..."}
      </p>
      <p className="text-gray-400 text-sm">
        Price: ${consultation.price.toFixed(2)}
      </p>
      {renderConsultationActions(consultation, isApproved)}
    </li>
  );

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-200 font-sans animate-fade-in">
      {/* Left Section: User Info */}
      <div className="bg-[#2F3136] rounded-lg shadow p-6 h-auto md:h-[380px]">
        <div className="text-center">
          <img
            src={user?.imageUrl || "https://via.placeholder.com/150"}
            alt={user?.firstName || "User"}
            className="w-24 h-24 rounded-full mx-auto mb-4 border border-gray-600"
          />
          <h1 className="text-xl font-bold text-white">
            Welcome, {user?.firstName || "User"}!
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            <strong>Email:</strong> {user?.email || "Not Provided"}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            <strong>Phone:</strong> {user?.phone || "Not Provided"}
          </p>
          <div className="mt-6 space-y-4">
            <button
              onClick={() => setIsAddingPhoto(true)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition transform hover:scale-105 mt-4"
            >
              Add Photo
            </button>
            <button
              onClick={handleOpenEditModal}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition transform hover:scale-105"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section: Consultations */}
      <div className="bg-[#2F3136] rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4 text-white border-b border-gray-600 pb-2">
          Your Consultations
        </h2>

        <div className="mb-6">
          <h3 className="text-md font-semibold text-green-400">
            Approved Consultations
          </h3>
          {approvedConsultations.length > 0 ? (
            <ul className="mt-2 space-y-4">
              {approvedConsultations.map((consultation) =>
                renderConsultationItem(consultation, true)
              )}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No approved consultations.</p>
          )}
        </div>

        <div>
          <h3 className="text-md font-semibold text-red-400">
            Pending Consultations
          </h3>
          {notApprovedConsultations.length > 0 ? (
            <ul className="mt-2 space-y-4">
              {notApprovedConsultations.map((consultation) =>
                renderConsultationItem(consultation, false)
              )}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No pending consultations.</p>
          )}
        </div>
      </div>

      {/* Right Section: Insights */}
      <div className="bg-[#2F3136] rounded-lg shadow p-6 h-auto md:h-[550px]">
        <h2 className="text-lg font-bold mb-4 text-white">Your Insights</h2>
        <p className="text-gray-400 mb-2">
          <strong>Total Hours:</strong> {approvedConsultations.length} hrs
        </p>
        <p className="text-gray-400 mb-2">
          <strong>Total Spent:</strong> $
          {approvedConsultations
            .reduce((sum, consultation) => sum + consultation.price, 0)
            .toFixed(2)}
        </p>
        <div className="mt-4 bg-[#3A3C40] p-4 rounded-lg">
          <p className="italic text-gray-300 text-center">
            "Success is the sum of small efforts repeated day in and day out."
          </p>
        </div>

        {/* New Content: Top Performing Consultants */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-white mb-2">
            Top Performing Consultants
          </h3>
          <ul className="space-y-2">
            {[
              { name: "Alex Johnson", hours: 50, earnings: 1000 },
              { name: "Maria Gomez", hours: 45, earnings: 900 },
              { name: "Sam Lee", hours: 40, earnings: 800 },
            ].map((consultant, index) => (
              <li
                key={index}
                className="bg-[#3A3C40] p-3 rounded-lg text-sm flex justify-between text-gray-300"
              >
                <span>{consultant.name}</span>
                <span>
                  {consultant.hours} hrs / ${consultant.earnings}
                </span>
              </li>
            ))}
          </ul>
        </div>

  {/* Personal Goal Progress */}
  <div className="mt-6">
    <h3 className="text-md font-semibold text-white">Your Goals</h3>
    <div className="mt-4">
      <label className="text-gray-400 text-sm">Sessions Completed:</label>
      <progress
        value={approvedConsultations.length}
        max="10"
        className="w-full h-2 rounded-lg overflow-hidden bg-gray-600 mt-2"
      ></progress>
    </div>
  </div>
</div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2F3136] rounded-lg shadow p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
            <form onSubmit={(e) => {e.preventDefault(); handleSaveInfo(e, tempUser, setUser, setIsEditing, setErrorMessage)}}>
              <label className="block mb-4">
                <span className="text-gray-400">First Name:</span>
                <input
                  type="text"
                  value={tempUser.firstName}
                  onChange={(e) =>
                    setTempUser((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 bg-[#232529] border border-gray-600 rounded-lg text-gray-300"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-400">Email:</span>
                <input
                  type="email"
                  value={tempUser.email}
                  onChange={(e) =>
                    setTempUser((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 bg-[#232529] border border-gray-600 rounded-lg text-gray-300"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-400">Phone:</span>
                <input
                  type="tel"
                  value={tempUser.phone}
                  onChange={(e) =>
                    setTempUser((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 bg-[#232529] border border-gray-600 rounded-lg text-gray-300"
                />
              </label>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal for Adding Photo */}
      {isAddingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2F3136] rounded-lg shadow p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-4">Add Photo</h2>
            <form
              onSubmit={(e) =>
                handleUploadPhoto(e, photoFile, () => setIsAddingPhoto(false), user, setUser, setErrorMessage)
              }
            >
              <label className="block mb-4">
                <span className="text-gray-400">Upload Photo:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  className="w-full mt-1 p-2 bg-[#232529] border border-gray-600 rounded-lg text-gray-300 focus:ring-2 focus:ring-yellow-500"
                />
              </label>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddingPhoto(false)}
                  className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition transform hover:scale-105"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Error Pop-up */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#2F3136] text-gray-200 p-6 rounded-lg shadow-lg">
            <p>{errorMessage}</p>
            <button
              onClick={closePopup}
              className="mt-4 bg-green-500 px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
