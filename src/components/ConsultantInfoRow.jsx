import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { handleBooking, openModal, getAvailableTimes, pushAvailableTimesToDatePicker } from "../modules/ConsultantInfoRow"

const ConsultantInfoRow = ({ consultant }) => {
  const {
    imageUrl,
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

    pushAvailableTimesToDatePicker(availableTime, setAvailableDates, setTimeSlotsByDate);
    
  }, [availableTime]);

  return (
    <>
    <div className="flex items-center p-4 hover:bg-[#3D3F43] transition text-gray-200 font-sans border border-gray-600 rounded-lg">
      <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex justify-center items-center">
        <img
          src={imageUrl || "https://via.placeholder.com/150"}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <div className="flex-1 px-4">
        <h2 className="text-sm md:text-lg font-semibold text-gray-100">
          {`${firstName} ${lastName}`}
        </h2>
        <p className="text-xs md:text-sm text-gray-400">{speciality}</p>
        <p className="text-xs text-gray-500 uppercase">{categories}</p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <div>
          <p className="text-xs md:text-sm text-gray-400">Hourly Rate</p>
          <p className="text-sm md:text-lg font-semibold text-gray-100">
            ${hourlyRate}
          </p>
        </div>
        <button
          onClick={() => openModal({setIsModalOpen, setSelectedDate, consultant, setAvailableDates, setTimeSlotsByDate})}
          className="bg-green-500 text-gray-900 px-3 py-2 md:px-4 md:py-2 rounded-md hover:bg-green-700 transition text-sm"
        >
          More Info
        </button>
      </div>
    </div>

      {/* Booking Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
                includeTimes={getAvailableTimes(selectedDate, timeSlotsByDate)}
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
                onClick={() => handleBooking(selectedDate, consultant, setIsAuthModalOpen, problemTitle, problemDescription)}
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

export default ConsultantInfoRow;
