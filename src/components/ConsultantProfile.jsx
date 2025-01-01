import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCookie } from "../modules/Cookies";
import { Link, Navigate } from "react-router-dom";

import ClientProfile from "../components/ClientProfile";
import handleCancelConsultationAndRefund from "../modules/Consultations";
import { handleRemoveAvailableTime, handleAddAvailableTime, handleApproveConsultation } from "../modules/ConsultantProfile";

export default function ConsultantProfile({user, approvedConsultations, notApprovedConsultations, availableTimes, setAvailableTimes, newAvailableTime, setNewAvailableTime, setApprovedConsultations, setNotApprovedConsultations}){

  return (
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Section: Consultant Info */}
      <div className="bg-white rounded-lg shadow p-6">
        {user ? (
          <>
            <img
              src="https://via.placeholder.com/150"
              alt={user.firstName}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h1 className="text-xl font-bold text-center">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-center text-gray-500">{user.specialty}</p>
            <p className="mt-4">
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Description:</strong> {user.description}
            </p>
          </>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>

      {/* Middle Section: Consultations */}
      <div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-lg font-bold mb-4">Consultations</h2>

  {/* Approved Consultations */}
  <div className="mb-6">
    <h3 className="text-md font-semibold text-green-600">Approved</h3>
    {approvedConsultations.length > 0 ? (
      <ul className="mt-2">
        {approvedConsultations.map((consultation, index) => (
          <li key={index} className="border-b border-gray-200 py-2">
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
            <Link to={'/room/' + consultation.roomUuid}>
              <button
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Connect
              </button>
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 mt-2">No approved consultations.</p>
    )}
  </div>

  {/* Not Approved Consultations */}
  <div>
  <h3 className="text-md font-semibold text-red-600">Not Approved</h3>
  {notApprovedConsultations.length > 0 ? (
    <ul className="mt-2">
      {notApprovedConsultations.map((consultation, index) => (
        <li key={index} className="border-b border-gray-200 py-2">
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
          <button
            onClick={() => handleApproveConsultation(consultation, setApprovedConsultations, setNotApprovedConsultations)}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Approve
          </button>
          <button
            onClick={() => handleCancelConsultationAndRefund(consultation)}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Cancel
          </button>

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
            timeIntervals={60}
            dateFormat="Pp"
            placeholderText="Choose a date and time"
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleAddAvailableTime(availableTimes, setAvailableTimes, newAvailableTime)}
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
                    onClick={() => handleRemoveAvailableTime(time, availableTimes, setAvailableTimes)}
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
    )
}