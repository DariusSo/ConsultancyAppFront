import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { handleBooking, openModal, getAvailableTimes, pushAvailableTimesToDatePicker } from "../modules/ConsultantInfoRow"
import { Link } from "react-router-dom";

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
        <Link to={"/consultant/" + consultant.id}>
          <button
            className="bg-green-500 text-gray-900 px-3 py-2 md:px-4 md:py-2 rounded-md hover:bg-green-700 transition text-sm"
          >
            More Info
          </button>
        </Link>
      </div>
    </div>
    </>
  );
};

export default ConsultantInfoRow;
