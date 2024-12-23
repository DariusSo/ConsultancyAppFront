import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import date picker styles
import { getCookie } from "../modules/Cookies";

const ConsultantInfoRow = ({ consultant }) => {
  const {
    profilePicture,
    firstName,
    lastName,
    speciality,
    categories,
    hourlyRate,
    email,
    description,
    availableTime, // JSON string of available times
  } = consultant;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // Stores the selected date and time
  const [availableDates, setAvailableDates] = useState([]); // Stores the available dates
  const [timeSlotsByDate, setTimeSlotsByDate] = useState({}); // Stores times grouped by date

  // Parse availableTime into usable data when the modal opens
  useEffect(() => {
    if (!availableTime) return;

    try {
      const parsedAvailableTime = JSON.parse(availableTime || "[]");
      const dateMap = {};

      parsedAvailableTime.forEach(({ date }) => {
        const [datePart, timePart] = date.split(" ");
        if (!dateMap[datePart]) dateMap[datePart] = [];
        dateMap[datePart].push(new Date(`${datePart}T${timePart}`)); // Push exact time
      });
      console.log(selectedDate);
      setAvailableDates(Object.keys(dateMap).map((date) => new Date(date)));
      setTimeSlotsByDate(dateMap);
    } catch (error) {
      console.error("Error parsing available times:", error);
    }
  }, [availableTime]);

  // Dynamically get the times for the selected date
  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    console.log(selectedDate);
    const selectedDateKey = selectedDate.toLocaleDateString("en-CA");
    console.log(selectedDateKey);
    console.log(timeSlotsByDate);
  
    return timeSlotsByDate[selectedDateKey] || [];
  };

  // Handle booking confirmation
  const handleBooking = async () => {
    if (!selectedDate) {
      alert("Please select a valid date and time before booking.");
      return;
    }
  
    try {
      // Prepare the booking payload
      const bookingPayload = {
        title: "Consultation Appointment", // Adjust title dynamically if needed
        description: "Discuss specific issues with the consultant.", // Optional description
        category: consultant.categories, // Assuming `consultant` has a `category` field
        consultantId: consultant.id, // Consultant's ID
        timeAndDate: selectedDate.toISOString(), // Use ISO format for the date
        price: consultant.hourlyRate, // Assuming `hourlyRate` is in the consultant object
      };
  
      // Send the booking request to the backend
      const response = await fetch("http://localhost:8080/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getCookie("loggedIn")
        },
        body: JSON.stringify(bookingPayload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to book the appointment.");
      }
  
      const responseData = await response.text();
      alert(`Appointment successfully booked! ID: ${responseData.id}`);
      setIsModalOpen(false); // Close the modal after successful booking
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book the appointment. Please try again later.");
    }
  };
  

  // Open modal and initialize data
  const openModal = () => {
    setIsModalOpen(true);
    setSelectedDate(null); // Reset selection when opening modal
  };

  return (
    <>
      {/* Row Layout */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {/* Profile Picture */}
        <div className="flex-shrink-0 w-20 h-20">
          <img
            src={profilePicture || "https://via.placeholder.com/150"}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Consultant Details */}
        <div className="flex-1 px-4">
          <h2 className="text-lg font-semibold">{`${firstName} ${lastName}`}</h2>
          <p className="text-sm text-gray-500">{speciality}</p>
          <p className="text-sm text-gray-400">{categories}</p>
          <p className="text-sm text-gray-400">{email}</p>
        </div>

        {/* Description */}
        <div className="flex-1 px-4 hidden md:block">
          <p className="text-sm text-gray-600">
            {description.length > 100 ? `${description.substring(0, 100)}...` : description}
          </p>
        </div>

        {/* Hourly Rate */}
        <div className="text-center pr-4">
          <p className="text-sm text-gray-500">Hourly Rate</p>
          <p className="text-lg font-semibold">${hourlyRate}</p>
        </div>

        {/* More Info Button */}
        <div>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            More Info
          </button>
        </div>
      </div>

      {/* Modal for More Info */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg p-6 shadow-lg">
            <Dialog.Title className="text-xl font-bold mb-4">{`${firstName} ${lastName}`}</Dialog.Title>
            <img
              src={profilePicture || "https://via.placeholder.com/150"}
              alt={`${firstName} ${lastName}`}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            />
            <p className="text-sm text-gray-500 mb-2"><strong>Specialty:</strong> {speciality}</p>
            <p className="text-sm text-gray-500 mb-2"><strong>Category:</strong> {categories}</p>
            <p className="text-sm text-gray-500 mb-2"><strong>Email:</strong> {email}</p>
            <p className="text-sm text-gray-600 mb-4"><strong>Description:</strong> {description}</p>
            <p className="text-sm text-gray-500 mb-4"><strong>Hourly Rate:</strong> ${hourlyRate}</p>

            {/* Date Picker */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Available Time:
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                includeDates={availableDates}
                includeTimes={getAvailableTimes()}
                showTimeSelect
                timeIntervals={15} // Optional, to align with intervals
                dateFormat="Pp"
                placeholderText="Choose a date and time"
                toggleCalendarOnIconClick
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Booking Button */}
            <button
              onClick={handleBooking}
              disabled={!selectedDate}
              className={`px-4 py-2 rounded-md transition ${
                selectedDate
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedDate ? "Book Appointment" : "Select a Date"}
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ConsultantInfoRow;
