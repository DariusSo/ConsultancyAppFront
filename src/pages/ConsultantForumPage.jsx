import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dialog } from "@headlessui/react";
import DatePicker from "react-datepicker";
import handleBooking, { getAvailableTimes, pushAvailableTimesToDatePicker } from '../modules/ConsultantInfoRow';
import fetchForumMessages, { fetchConsultantInfo, fetchUserProfile, handlePostQuestion, handleReply } from '../modules/Forum';

const ConsultantForumPage = () => {
  const id = useParams().id; // Get consultant ID from URL
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyText, setReplyText] = useState({});
  const [role, setRole] = useState(null); // 'CLIENT' or 'CONSULTANT'
  const [userName, setUserName] = useState(''); // To store the user's name
  const [consultant, setConsultant] = useState(null); // To store consultant info
  const [isModalOpen, setIsModalOpen] = useState(false); // State for booking modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State for authentication modal
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [problemTitle, setProblemTitle] = useState(''); // State for problem title
  const [problemDescription, setProblemDescription] = useState(''); // State for problem description
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTime, setAvailableTime] = useState(null);
  const [timeSlotsByDate, setTimeSlotsByDate] = useState({});

 useEffect(() => {
     pushAvailableTimesToDatePicker(availableTime, setAvailableDates, setTimeSlotsByDate);
   }, [availableTime]);

  useEffect(() => {
    fetchUserProfile(setRole, setUserName, id);
    fetchConsultantInfo(setConsultant, setAvailableTime, id);
    fetchForumMessages(setQuestions, id);
  }, [id]);

  if (!consultant) {
    return <p className="text-gray-500">Loading consultant details...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-200 font-sans pt-7 px-4 sm:px-6">
      {/* Consultant Info */}
      <div className="bg-[#2F3136] rounded-lg shadow p-4 sm:p-6 mb-8 max-w-full sm:max-w-4xl mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-4">

        {/* Profile Picture */}
        <div className="flex-shrink-0 flex justify-center">
          <img
            src={consultant.imageUrl || "https://via.placeholder.com/150"}
            alt={`${consultant.firstName} ${consultant.lastName}'s profile`}
            className="w-32 h-32 rounded-full border-4 border-gray-500"
          />
        </div>

        {/* Consultant Details and Info */}
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-white mb-2">
            {consultant.firstName} {consultant.lastName}
          </h1>

          <p className="text-gray-400 italic mb-4">
            "{consultant.description || 'Providing the best consultancy service'}"
          </p>

          <div className="text-gray-400 space-y-1">
            <p><strong>Speciality:</strong> {consultant.speciality}</p>
            <p><strong>Email:</strong> {consultant.email}</p>
            <p><strong>Phone:</strong> {consultant.phone}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 flex justify-center lg:justify-end mt-4 lg:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg transition transform hover:scale-105"
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* Forum Section */}
      <div className="bg-[#2F3136] rounded-lg shadow p-6 max-w-[1600px] mx-auto">
        {/* CLIENT: Ask a Question */}
        {role === 'CLIENT' && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-300 mb-4 pl-2">Ask a Question</h3>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full p-3 bg-[#232529] border border-gray-600 rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Write your question here..."
            />
            <button
              onClick={() => handlePostQuestion(newQuestion, userName, id, setQuestions, setNewQuestion, questions)}
              className="py-2 px-4 pl-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition transform hover:scale-105"
            >
              Post Question
            </button>
          </div>
        )}
        {/* Questions and Answers */}
        <div>
          {questions.slice().reverse().map((question) => (
            <div
              key={question.id}
              className="bg-[#2F3136] p-4 rounded-lg shadow mb-4 border border-gray-600 relative overflow-hidden"
            >
              <p className="text-gray-400 text-sm absolute top-2 left-4">
                {new Date(question.questionAsked).toLocaleString()}
              </p>

              <div className="p-4 border border-gray-600 rounded-lg bg-[#1E1F23] mt-6">
                <h4 className="text-md font-semibold text-blue-500 mb-2 truncate">
                  {question.name}'s Question:
                </h4>
                <p className="text-gray-200 break-words">
                  {question.question}
                </p>
              </div>

              {question.answer ? (
                <div className="bg-[#232529] p-3 rounded-lg border border-gray-600 mt-2">
                  <h4 className="text-md font-semibold text-green-400 truncate">Consultant's Reply:</h4>
                  <p className="text-gray-300 mt-2 break-words">
                    {question.answer}
                  </p>
                </div>
              ) : (
                role === 'CONSULTANT' && (
                  <div className="mt-2">
                    <textarea
                      value={replyText[question.id] || ''}
                      onChange={(e) =>
                        setReplyText({ ...replyText, [question.id]: e.target.value })
                      }
                      className="w-full p-3 bg-[#232529] border border-gray-600 rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500 mb-2"
                      placeholder="Write your reply here..."
                    />
                    <button
                      onClick={() => handleReply(question.id, replyText, setQuestions, setReplyText, questions)}
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition transform hover:scale-105"
                    >
                      Post Reply
                    </button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>

      </div>
      {/* Booking Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4 font-sans">
          <Dialog.Panel className="w-full max-w-xl bg-[#2F3136] rounded-lg p-6 shadow-2xl relative text-gray-200 border border-gray-600">
            <Dialog.Title className="text-xl font-bold mb-4 text-[#E0E0E0]">
              {`${consultant?.firstName} ${consultant?.lastName}`}
            </Dialog.Title>

            {/* Description */}
            <div className="mb-4">
              <p className="text-sm text-gray-300">
                <strong>Description:</strong> {consultant?.description}
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
    </div>
  );
};

export default ConsultantForumPage;
