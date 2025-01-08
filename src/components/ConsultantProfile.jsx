import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { handleApproveConsultation, handleRemoveAvailableTime, handleAddAvailableTime, handleSaveInfo, handleUploadPhoto } from "../modules/ConsultantProfile";
import handleCancelConsultationAndRefund, {handleConnectToRoom, handleFetchUser } from "../modules/Consultations";
import { getCookie } from "../modules/Cookies";
import { Link } from "react-router-dom";

export default function ConsultantProfile({
  user,
  setUser,
  approvedConsultations,
  notApprovedConsultations,
  availableTimes,
  setAvailableTimes,
  newAvailableTime,
  setNewAvailableTime,
  setApprovedConsultations,
  setNotApprovedConsultations,
}) {
    const [userInfoMap, setUserInfoMap] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);
    const [editingUser, setEditingUser] = useState(null);

    const closePopup = () => {
      setErrorMessage(null);
    };

    const handleAddPhoto = () => {
      setShowPhotoModal(true);
    };

  // Open edit modal and initialize editingUser
  const handleEditInfo = () => {
    setEditingUser({ ...user }); // Clone current user into editingUser
    setShowEditModal(true);
  };

  // Close modal and discard unsaved changes
  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowPhotoModal(false); // Close the photo modal as well
    setEditingUser(null); // Reset editing user state
    setPhotoFile(null); // Clear the selected photo file
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
    }
  };

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

  const handleConnect = async (roomUuid) => {
    const isItTime = await handleConnectToRoom(roomUuid);
    if (!isItTime) {
      setErrorMessage("You can only connect 5 minutes before the consultation.");
    } else {
      window.location.href = `/room/${roomUuid}`;
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
        
        <button
        onClick={() => handleConnect(consultation.roomUuid)}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
      >
        Connect
      </button>
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
      <div className="bg-[#2F3136] rounded-lg shadow p-6 border border-gray-700 h-[510px]">
      {user ? (
        <>
          <img
            src={user.imageUrl || "https://via.placeholder.com/150"}
            alt={user.firstName}
            className="w-32 h-32 rounded-full mx-auto mb-4 border border-gray-600"
          />
          <h1 className="text-xl font-bold text-center">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-center text-gray-400">
            <strong>Speciality:</strong> {user.speciality}
          </p>
          <p className="text-center text-gray-400">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-center text-gray-400">
            <strong>Phone:</strong> {user.phone}
          </p>
          <p className="text-center text-gray-400">
            <strong>Description:</strong> {user.description}
          </p>
          <div className="mt-6 space-y-4">
          <Link to={"/consultant/" + user.id}>
              <button
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition transform hover:scale-105"
              >
                Forum
              </button>
            </Link>
            <button
              onClick={handleAddPhoto}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition transform hover:scale-105"
            >
              Add Photo
            </button>
            <button
              onClick={handleEditInfo}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition transform hover:scale-105"
            >
              Edit Profile
            </button>
          </div>
          </>
        ) : (
          <p>Loading user info...</p>
        )}

        {/* Styled Modals */}
        {(showEditModal || showPhotoModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-[#232529] to-[#2E2F33] p-6 rounded-lg shadow-lg border border-gray-700 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-200 mb-4 text-center">
                {showEditModal ? "Edit Info" : "Add Photo"}
              </h2>

              {showEditModal && (
                <form onSubmit={(e) => handleSaveInfo(e, editingUser, setErrorMessage, setEditingUser, setShowEditModal, setShowPhotoModal, setPhotoFile)}>
                  <label className="block mb-4">
                    <span className="text-gray-300">First Name:</span>
                    <input
                      type="text"
                      value={editingUser?.firstName || ""}
                      onChange={(e) =>
                        setEditingUser((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      className="w-full mt-1 p-2 bg-[#2F3136] border border-gray-600 rounded-lg text-gray-300"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-300">Last Name:</span>
                    <input
                      type="text"
                      value={editingUser?.lastName || ""}
                      onChange={(e) =>
                        setEditingUser((prev) => ({ ...prev, lastName: e.target.value }))
                      }
                      className="w-full mt-1 p-2 bg-[#2F3136] border border-gray-600 rounded-lg text-gray-300"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-300">Last Name:</span>
                    <input
                      type="text"
                      value={editingUser?.email || ""}
                      onChange={(e) =>
                        setEditingUser((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full mt-1 p-2 bg-[#2F3136] border border-gray-600 rounded-lg text-gray-300"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-300">Specialty:</span>
                    <input
                      type="text"
                      value={editingUser?.specialty || ""}
                      onChange={(e) =>
                        setEditingUser((prev) => ({ ...prev, specialty: e.target.value }))
                      }
                      className="w-full mt-1 p-2 bg-[#2F3136] border border-gray-600 rounded-lg text-gray-300"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-300">Description:</span>
                    <textarea
                      value={editingUser?.description || ""}
                      onChange={(e) =>
                        setEditingUser((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className="w-full mt-1 p-2 bg-[#2F3136] border border-gray-600 rounded-lg text-gray-300"
                    ></textarea>
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-300">Hourly Rate:</span>
                    <input
                      type="number"
                      value={editingUser?.hourlyRate || ""}
                      onChange={(e) =>
                        setEditingUser((prev) => ({ ...prev, hourlyRate: e.target.value }))
                      }
                      className="w-full mt-1 p-2 bg-[#2F3136] border border-gray-600 rounded-lg text-gray-300"
                    />
                  </label>
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
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
              )}
              {showPhotoModal && (
                <form onSubmit={(e) => handleUploadPhoto(e, photoFile, handleCloseModal, user, setUser)}>
                  <label className="block mb-4">
                    <span className="text-gray-300">Upload Photo:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full mt-1 p-2 bg-[#2F3136] border border-gray-600 rounded-lg text-gray-300"
                    />
                  </label>
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
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
