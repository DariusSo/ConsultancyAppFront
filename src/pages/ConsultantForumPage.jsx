import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie } from '../modules/Cookies';

const ConsultantForumPage = () => {
  const { id } = useParams(); // Get consultant ID from URL
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyText, setReplyText] = useState({});
  const [role, setRole] = useState(null); // 'CLIENT' or 'CONSULTANT'
  const [userName, setUserName] = useState(''); // To store the user's name
  const [consultant, setConsultant] = useState(null); // To store consultant info

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/auth/profile', {
          headers: {
            Authorization: getCookie("loggedIn"),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
          setUserName(data.firstName); // Save the user's name
        } else {
          console.error('Failed to fetch profile:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchConsultantInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/consultant/id?id=${id}`, {
          headers: {
            Authorization: getCookie("loggedIn"),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setConsultant(data); // Save consultant info
        } else {
          console.error('Failed to fetch consultant info:', response.status);
        }
      } catch (error) {
        console.error('Error fetching consultant info:', error);
      }
    };

    const fetchForumMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/forum?consultantId=${id}`);
        if (response.ok) {
          const messages = await response.json();
          setQuestions(messages);
        } else {
          console.error('Failed to fetch forum messages:', response.status);
        }
      } catch (error) {
        console.error('Error fetching forum messages:', error);
      }
    };

    fetchUserProfile();
    fetchConsultantInfo();
    fetchForumMessages();
  }, [id]);

  const handlePostQuestion = async (text) => {
    if (text.trim() === '') return;

    const forumMessage = {
      name: userName, // Pass the user's name
      question: text,
      answer: null,
      consultantId: id, // Use the consultant ID from URL
    };

    try {
      const response = await fetch('http://localhost:8080/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forumMessage),
      });

      if (response.ok) {
        const newQuestionEntry = {
          id: questions.length + 1,
          ...forumMessage,
          questionAsked: new Date().toISOString(),
        };
        setQuestions([...questions, newQuestionEntry]);
        setNewQuestion('');
      } else {
        console.error('Failed to create question:', response.status);
      }
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleReply = async (messageId) => {
    if (!replyText[messageId] || replyText[messageId].trim() === '') return;

    try {
      const response = await fetch(`http://localhost:8080/forum?messageId=${messageId}&message=${encodeURIComponent(replyText[messageId])}`, {
        method: 'PUT',
        headers: {
          Authorization: getCookie("loggedIn"),
        },
      });

      if (response.ok) {
        setQuestions(
          questions.map((question) =>
            question.id === messageId ? { ...question, answer: replyText[messageId] } : question
          )
        );
        setReplyText({ ...replyText, [messageId]: '' });
      } else {
        console.error('Failed to save answer:', response.status);
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  if (!consultant) {
    return <p className="text-gray-500">Loading consultant details...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-200 font-sans">
      {/* Consultant Info */}
      <div className="bg-[#2F3136] rounded-lg shadow p-6 mb-8 flex flex-col items-center">
        <img
          src={consultant.imageUrl || "https://via.placeholder.com/150"}
          alt={`${consultant.firstName} ${consultant.lastName}'s profile`}
          className="w-32 h-32 rounded-full mb-4 border-4 border-gray-500"
        />
        <h1 className="text-2xl font-bold text-center text-white">{consultant.firstName} {consultant.lastName}</h1>
        <p className="text-center text-gray-400 mt-2 italic">"{consultant.description || 'Providing the best consultancy service'}"</p>
        <p className="text-center text-gray-400 mt-2">Speciality: {consultant.speciality}</p>
        <p className="text-center text-gray-400">Email: {consultant.email}</p>
        <p className="text-center text-gray-400">Phone: {consultant.phone}</p>
        <div className="mt-4 text-center">
          <button className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition transform hover:scale-105">
            Contact Consultant
          </button>
        </div>
      </div>

      {/* Forum Section */}
      <div className="bg-[#2F3136] rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-white mb-4">Forum</h2>

        {/* Questions and Answers */}
        <div>
          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-[#2F3136] p-4 rounded-lg shadow mb-4 border border-gray-600"
            >
              <div className="mb-2">
                <h4 className="text-md font-semibold text-white">{question.name}</h4>
                <p className="text-gray-400 text-sm">{new Date(question.questionAsked).toLocaleString()}</p>
              </div>
              <p className="text-gray-300 mb-4">{question.question}</p>

              {question.answer ? (
                <div className="bg-[#232529] p-3 rounded-lg border border-gray-600">
                  <h4 className="text-md font-semibold text-green-400">Consultant's Reply</h4>
                  <p className="text-gray-300 mt-2">{question.answer}</p>
                </div>
              ) : (
                role === 'CONSULTANT' && (
                  <div className="mt-4">
                    <textarea
                      value={replyText[question.id] || ''}
                      onChange={(e) =>
                        setReplyText({ ...replyText, [question.id]: e.target.value })
                      }
                      className="w-full p-3 bg-[#232529] border border-gray-600 rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500 mb-2"
                      placeholder="Write your reply here..."
                    />
                    <button
                      onClick={() => handleReply(question.id)}
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

        {/* CLIENT: Ask a Question */}
        {role === 'CLIENT' && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-300 mb-2">Ask a Question</h3>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full p-3 bg-[#232529] border border-gray-600 rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Write your question here..."
            />
            <button
              onClick={() => handlePostQuestion(newQuestion)}
              className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition transform hover:scale-105"
            >
              Post Question
            </button>
          </div>
        )}

        {role === null && <p className="text-gray-500">Loading...</p>}
      </div>
    </div>
  );
};

export default ConsultantForumPage;
