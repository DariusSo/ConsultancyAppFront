import React from "react";
import { Dialog } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingModal = ({
  isOpen,
  onClose,
  consultant,
  selectedDate,
  setSelectedDate,
  availableDates,
  timeSlotsByDate,
  problemTitle,
  setProblemTitle,
  problemDescription,
  setProblemDescription,
  handleBooking,
  setIsAuthModalOpen,
}) => {
  const { firstName, lastName, description } = consultant;

  return (
    <Dialog open={isOpen} onClose={onClose}>
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
              onClick={() =>
                handleBooking(
                  selectedDate,
                  consultant,
                  setIsAuthModalOpen,
                  problemTitle,
                  problemDescription
                )
              }
              disabled={!selectedDate}
              className={`px-4 py-2 rounded-md transition ${
                selectedDate
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {selectedDate ? "Book Appointment" : "Select a Date"}
            </button>

            <button
              onClick={onClose}
              className="bg-[#E0E0E0] text-gray-900 px-4 py-2 rounded-md hover:bg-[#CFCFCF] transition"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookingModal;
