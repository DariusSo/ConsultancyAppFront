import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    availableTime,
  } = consultant;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlotsByDate, setTimeSlotsByDate] = useState({});
  const [problemTitle, setProblemTitle] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  useEffect(() => {
    if (!availableTime) return;
    try {
      const parsedAvailableTime = JSON.parse(availableTime || "[]");
      const dateMap = {};

      parsedAvailableTime.forEach(({ date }) => {
        const [datePart, timePart] = date.split(" ");
        if (!dateMap[datePart]) {
          dateMap[datePart] = [];
        }
        dateMap[datePart].push(new Date(`${datePart}T${timePart}`));
      });
      setAvailableDates(Object.keys(dateMap).map((dt) => new Date(dt)));
      setTimeSlotsByDate(dateMap);
    } catch (error) {
      console.error("Error parsing available times:", error);
    }
  }, [availableTime]);

  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    const selectedDateKey = selectedDate.toLocaleDateString("en-CA");
    return timeSlotsByDate[selectedDateKey] || [];
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      alert("Please select a valid date and time before booking.");
      return;
    }

    const authToken = getCookie("loggedIn");
    if (!authToken) {
      setIsAuthModalOpen(true);
      return;
    }

    const stripe = await loadStripe("pk_test_51PlEGq2KAAK191iLnqMx4EzwlRUP93zGEFdyBKynSDBAtbQcJTR2TwbWiKYVSHLVWL0kBq7jK3vyWABKrHB8ZvRm00Kd1TqbuX");
    if (!stripe) {
      console.error("Failed to initialize Stripe");
      return;
    }

    const formattedDate = formatDateForBackend(selectedDate);
    const bookingPayload = {
      title: problemTitle,
      description: problemDescription,
      category: consultant.categories,
      consultantId: consultant.id,
      timeAndDate: formattedDate,
      price: consultant.hourlyRate,
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

  const openModal = async () => {
    try {
      setIsModalOpen(true);
      setSelectedDate(null);

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
        if (!dateMap[datePart]) {
          dateMap[datePart] = [];
        }
        dateMap[datePart].push(`${datePart}T${timePart}`);
      });
      setAvailableDates(Object.keys(dateMap).map((d) => new Date(d)));
      setTimeSlotsByDate(dateMap);
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
  };

  return (
    <>
      {/* Row layout in a dark card with a modern sans font */}
    <div className="flex items-center p-4 hover:bg-[#3D3F43] transition text-gray-200 font-sans border border-gray-600 rounded-lg">
      {/* Profile Picture */}
      <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex justify-center items-center">
        <img
          src={profilePicture || "https://via.placeholder.com/150"}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full rounded-full object-cover"
        />
      </div>

      {/* Consultant Details */}
      <div className="flex-1 px-4">
        <h2 className="text-sm md:text-lg font-semibold text-gray-100">
          {`${firstName} ${lastName}`}
        </h2>
        <p className="text-xs md:text-sm text-gray-400">{speciality}</p>
        <p className="text-xs text-gray-500 uppercase">{categories}</p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>

      {/* Hourly Rate + Button */}
      <div className="flex flex-col items-end space-y-2">
        <div>
          <p className="text-xs md:text-sm text-gray-400">Hourly Rate</p>
          <p className="text-sm md:text-lg font-semibold text-gray-100">
            ${hourlyRate}
          </p>
        </div>
        <button
          onClick={openModal}
          className="bg-[#E0E0E0] text-gray-900 px-3 py-2 md:px-4 md:py-2 rounded-md hover:bg-[#CFCFCF] transition text-sm"
        >
          More Info
        </button>
      </div>
    </div>

      {/* Booking Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* Dark overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4 font-sans">
          <Dialog.Panel className="w-full max-w-xl bg-[#2F3136] rounded-lg p-6 shadow-2xl relative text-gray-200 border border-gray-600">
            <Dialog.Title className="text-xl font-bold mb-4 text-[#E0E0E0]">
              {`${firstName} ${lastName}`}
            </Dialog.Title>

            {/* Description */}
            <div className="mb-4">
              <p className="text-sm text-gray-300">
                <strong>Description:</strong> {description}
              </p>
            </div>

            {/* Problem Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Appointment Title
              </label>
              <input
                type="text"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder="Enter a title for your problem"
                className="w-full border border-gray-600 bg-[#3A3C40] rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                           text-gray-200 placeholder-gray-400"
              />
            </div>

            {/* Problem Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Problem Description
              </label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe your problem briefly"
                className="w-full border border-gray-600 bg-[#3A3C40] rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                           text-gray-200 placeholder-gray-400"
                rows={3}
              ></textarea>
            </div>

            {/* Select Available Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Select Available Time
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
                className="w-full border border-gray-600 bg-[#3A3C40] rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                           text-gray-200 placeholder-gray-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleBooking}
                disabled={!selectedDate}
                className={
                  `px-4 py-2 rounded-md transition ` +
                  (selectedDate
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed")
                }
              >
                {selectedDate ? "Book Appointment" : "Select a Date"}
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-[#E0E0E0] text-gray-900 px-4 py-2 rounded-md hover:bg-[#CFCFCF] transition"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Authentication Modal */}
      <Dialog open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4 font-sans">
          <Dialog.Panel className="w-full max-w-sm bg-[#2F3136] rounded-lg p-6 shadow-2xl border border-gray-600 text-gray-200">
            <Dialog.Title className="text-lg font-bold text-center mb-4 text-[#E0E0E0]">
              Please Log In or Register
            </Dialog.Title>
            <p className="text-sm text-gray-300 text-center mb-4">
              You need to log in or register to book an appointment.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-[#E0E0E0] text-gray-900 px-4 py-2 rounded-md hover:bg-[#CFCFCF] transition"
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
              className="mt-4 w-full bg-gray-600 text-gray-200 px-4 py-2 rounded-md
                         hover:bg-gray-500 transition"
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
