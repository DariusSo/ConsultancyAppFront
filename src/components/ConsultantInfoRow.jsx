import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import date picker styles
import { getCookie } from "../modules/Cookies";
import { loadStripe } from "@stripe/stripe-js";

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

  const [isModalOpen, setIsModalOpen] = useState(false); // Booking modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Authentication modal
  const [selectedDate, setSelectedDate] = useState(null); // Selected date and time
  const [availableDates, setAvailableDates] = useState([]); // Stores the available dates
  const [timeSlotsByDate, setTimeSlotsByDate] = useState({}); // Stores times grouped by date
  const [problemTitle, setProblemTitle] = useState(""); // Problem Title
  const [problemDescription, setProblemDescription] = useState(""); // Problem Description

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
      setAvailableDates(Object.keys(dateMap).map((date) => new Date(date)));
      setTimeSlotsByDate(dateMap);
    } catch (error) {
      console.error("Error parsing available times:", error);
    }
  }, [availableTime]);

  // Dynamically get the times for the selected date
  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    const selectedDateKey = selectedDate.toLocaleDateString("en-CA");
    return timeSlotsByDate[selectedDateKey] || [];
  };

  // Handle booking confirmation
  const handleBooking = async () => {
    if (!selectedDate) {
      alert("Please select a valid date and time before booking.");
      return;
    }

    const authToken = getCookie("loggedIn");
    if (!authToken) {
      setIsAuthModalOpen(true); // Open authentication modal
      return;
    }

    const stripe = await loadStripe("pk_test_51PlEGq2KAAK191iLnqMx4EzwlRUP93zGEFdyBKynSDBAtbQcJTR2TwbWiKYVSHLVWL0kBq7jK3vyWABKrHB8ZvRm00Kd1TqbuX");
    if (!stripe) {
      console.error("Failed to initialize Stripe");
      return;
    }

    const formattedDate = formatDateForBackend(selectedDate);
    const bookingPayload = {
      title: problemTitle, // Added title
      description: problemDescription, // Added description
      category: consultant.categories, // Assuming `consultant` has a `category` field
      consultantId: consultant.id, // Consultant's ID
      timeAndDate: formattedDate,
      price: consultant.hourlyRate, // Assuming `hourlyRate` is in the consultant object
    };

    try {
      const response = await fetch("http://localhost:8080/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to book the appointment.");
      }

      const session = await response.json();
      const sessionId = session.id;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Stripe Checkout error:", error.message);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book the appointment. Please try again later.");
    }
  };

  // Open modal and initialize data
  const openModal = async () => {
    try {
      setIsModalOpen(true);
      setSelectedDate(null); // Reset the selected date when opening the modal

      const response = await fetch(`http://localhost:8080/consultant/dates?id=${consultant.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch available dates.");
      }

      const availableTimesFromApi = await response.json();
      const dateMap = {};
      availableTimesFromApi.forEach(({ date }) => {
        const [datePart, timePart] = date.split(" ");
        if (!dateMap[datePart]) dateMap[datePart] = [];
        dateMap[datePart].push(`${datePart}T${timePart}`);
      });

      setAvailableDates(Object.keys(dateMap).map((date) => new Date(date)));
      setTimeSlotsByDate(dateMap);
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
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

        {/* Hourly Rate */}
        <div className="text-center pr-4">
          <p className="text-sm text-gray-500">Hourly Rate</p>
          <p className="text-lg font-semibold">${hourlyRate}</p>
        </div>

        {/* More Info Button */}
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          More Info
        </button>
      </div>

      {/* Booking Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <div className="fixed inset-0 bg-black bg-opacity-25" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg p-6 shadow-lg">
      <Dialog.Title className="text-xl font-bold mb-4">{`${firstName} ${lastName}`}</Dialog.Title>

      {/* Consultant Description */}
      <div className="mb-4">
        <p className="text-sm text-gray-700">
          <strong>Description:</strong> {description}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Appointment Title
        </label>
        <input
          type="text"
          value={problemTitle}
          onChange={(e) => setProblemTitle(e.target.value)}
          placeholder="Enter a title for your problem"
          className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Problem Description
        </label>
        <textarea
          value={problemDescription}
          onChange={(e) => setProblemDescription(e.target.value)}
          placeholder="Describe your problem briefly"
          className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        ></textarea>
      </div>

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
          timeIntervals={15}
          dateFormat="Pp"
          placeholderText="Choose a date and time"
          className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

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
<Dialog open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold text-center mb-4">
              Please Log In or Register
            </Dialog.Title>
            <p className="text-sm text-gray-600 text-center mb-6">
              You need to log in or register to book an appointment.
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Log In
              </button>
              <button
                onClick={() => (window.location.href = "/registration")}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Register
              </button>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="mt-4 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

const formatDateForBackend = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export default ConsultantInfoRow;
