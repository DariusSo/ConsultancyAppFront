import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCookie } from "../modules/Cookies";
import { format } from "date-fns"; // Install date-fns for easier date formatting
import { Navigate } from "react-router-dom";

const ConsultantProfilePage = () => {
  const [consultant, setConsultant] = useState(null);
  const [approvedConsultations, setApprovedConsultations] = useState([]);
  const [notApprovedConsultations, setNotApprovedConsultations] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [newAvailableTime, setNewAvailableTime] = useState(null);

  useEffect(() => {


    // Fetch consultant data
    const fetchConsultantData = async () => {
      try {
        const response = await fetch("http://localhost:8080/consultant", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: getCookie("loggedIn"),
          },
        });
        const data = await response.json();
        console.log(response.status)
        if(response.status == 401){
          window.location.href = "/login";
        }
        console.log(JSON.parse(data.availableTime));
        setConsultant(data);
        const parsedTimes = JSON.parse(data.availableTime);
        setAvailableTimes(parsedTimes || []);
        setApprovedConsultations(data.approvedConsultations || []);
        setNotApprovedConsultations(data.notApprovedConsultations || []);
      } catch (err) {
        console.error("Failed to fetch consultant data:", err);
      }
    };

    fetchConsultantData();
  }, []);

  const handleAddAvailableTime = async () => {
    if (newAvailableTime) {
      const formattedDate = format(newAvailableTime, "yyyy-MM-dd HH:mm");
      const availableTime = { date: formattedDate }; // Customize time range as needed
      const updatedTimes = [...availableTimes, availableTime]; // Create the updated list
      setAvailableTimes(updatedTimes); // Update the state
      console.log("Updated Times:", updatedTimes); // Log the updated list
      updateAvailableTime(updatedTimes);

    }
  };

  const handleRemoveAvailableTime = (timeToRemove) => {

    const updatedTimes = availableTimes.filter((time) => time.date !== timeToRemove.date);

    setAvailableTimes(updatedTimes);
    updateAvailableTime(updatedTimes);
  };

  const updateAvailableTime = async (updatedTimes) => {
    try {
      const response = await fetch("http://localhost:8080/consultant/dates", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
        body: JSON.stringify(updatedTimes),
      });
      const data = await response.text();
    } catch (err) {
      console.error("Failed to update dates:", err);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Section: Consultant Info */}
      <div className="bg-white rounded-lg shadow p-6">
        {consultant ? (
          <>
            <img
              src="https://via.placeholder.com/150"
              alt={consultant.firstName}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h1 className="text-xl font-bold text-center">
              {consultant.firstName} {consultant.lastName}
            </h1>
            <p className="text-center text-gray-500">{consultant.specialty}</p>
            <p className="mt-4">
              <strong>Email:</strong> {consultant.email}
            </p>
            <p>
              <strong>Phone:</strong> {consultant.phone}
            </p>
            <p>
              <strong>Description:</strong> {consultant.description}
            </p>
          </>
        ) : (
          <p>Loading consultant info...</p>
        )}
      </div>

      {/* Middle Section: Consultations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Consultations</h2>

        <div className="mb-6">
          <h3 className="text-md font-semibold text-green-600">Approved</h3>
          {approvedConsultations.length > 0 ? (
            <ul className="mt-2">
              {approvedConsultations.map((consultation, index) => (
                <li key={index} className="border-b border-gray-200 py-2">
                  {consultation}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No approved consultations.</p>
          )}
        </div>

        <div>
          <h3 className="text-md font-semibold text-red-600">Not Approved</h3>
          {notApprovedConsultations.length > 0 ? (
            <ul className="mt-2">
              {notApprovedConsultations.map((consultation, index) => (
                <li key={index} className="border-b border-gray-200 py-2">
                  {consultation}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No pending consultations.</p>
          )}
        </div>
      </div>

      {/* Right Section: Available Times */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Manage Available Times</h2>

        {/* Add Available Time */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Available Time
          </label>
          <DatePicker
            selected={newAvailableTime}
            onChange={(date) => setNewAvailableTime(date)}
            showTimeSelect
            timeIntervals={30}
            dateFormat="Pp"
            placeholderText="Choose a date and time"
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddAvailableTime}
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
                  className="flex justify-between items-center border-b border-gray-200 py-2"
                >
                  <span>{time.date}</span>
                  <button
                    onClick={() => handleRemoveAvailableTime(time)}
                    className="text-red-600 hover:underline"
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
};

export default ConsultantProfilePage;
