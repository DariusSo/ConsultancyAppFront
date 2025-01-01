import React, { useState } from 'react';
import TopHeader from '../components/TopHeader';

const Register = () => {
  const [role, setRole] = useState('CLIENT'); // 'CLIENT' or 'CONSULTANT'

  // Common fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Client-specific fields
  const [birthDate, setBirthDate] = useState('');

  // Consultant-specific fields
  const [categories, setCategories] = useState('FINANCIAL');
  const [availableTimes, setAvailableTimes] = useState(['']);
  const [speciality, setSpeciality] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  // For showing response messages
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  const handleAddAvailableTime = () => {
    setAvailableTimes([...availableTimes, '']);
  };

  const handleAvailableTimeChange = (index, value) => {
    const updatedTimes = [...availableTimes];
    updatedTimes[index] = value;
    setAvailableTimes(updatedTimes);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');
    setResponseType('');

    // Check password match before sending
    if (password !== confirmPassword) {
      setLoading(false);
      setResponseType('error');
      setResponseMessage('Passwords do not match.');
      return;
    }

    const formData = {
      role,
      firstName,
      lastName,
      email,
      phone,
      password,
    };

    if (role === 'CLIENT') {
      formData.birthDate = birthDate;
    } else {
      formData.categories = categories;
      formData.availableTime; // Not used in your code yet, but presumably you’d handle it like availableTimes
      formData.speciality = speciality;
      formData.description = description;
      formData.hourlyRate = hourlyRate;
    }

    try {
      let endpoint = '';
      if (role === 'CONSULTANT') {
        endpoint = 'http://localhost:8080/auth/consultant';
      } else {
        endpoint = 'http://localhost:8080/auth/client';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text(); // Backend returns a string message

      if (!response.ok) {
        // Error responses (e.g., 400, etc.)
        setResponseType('error');
        setResponseMessage(text);
      } else {
        // Successful response
        setResponseType('success');
        setResponseMessage(text);
        window.location.href = '/login';
      }
    } catch (error) {
      setResponseType('error');
      setResponseMessage('An unexpected error occurred. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/** Sticky TopHeader */}
      <TopHeader />

      {/**
       * The main container now has extra top padding or margin 
       * (e.g., 'pt-20' or 'mt-20') so the form isn't hidden beneath 
       * the sticky header.
       */}
      <div className="min-h-screen bg-gradient-to-b from-[#232529] to-[#2E2F33] font-sans pt-20">
        {/**
         * We use a flex container + items-center + justify-center 
         * if we want it vertically centered below the header
         */}
        <div className="flex items-center justify-center">
          {/** Dark card container */}
          <form
            onSubmit={handleRegister}
            className="w-full max-w-md bg-[#2F3136] text-gray-200 p-6 rounded shadow-md border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

            {/* Role selection */}
            <div className="flex justify-center mb-6">
              <button
                type="button"
                onClick={() => setRole('CONSULTANT')}
                className={`px-4 py-2 text-sm font-medium border border-gray-600 rounded-l 
                  ${
                    role === 'CONSULTANT'
                      ? 'bg-[#E0E0E0] text-gray-900'
                      : 'bg-[#3A3C40] text-gray-200 hover:bg-[#4A4C50]'
                  }`}
              >
                Register as Consultant
              </button>
              <button
                type="button"
                onClick={() => setRole('CLIENT')}
                className={`px-4 py-2 text-sm font-medium border border-gray-600 rounded-r 
                  ${
                    role === 'CLIENT'
                      ? 'bg-[#E0E0E0] text-gray-900'
                      : 'bg-[#3A3C40] text-gray-200 hover:bg-[#4A4C50]'
                  }`}
              >
                Register as Client
              </button>
            </div>

            <p className="mb-4 text-center text-gray-400">
              You are registering as a <span className="font-semibold text-gray-200">{role}</span>.
            </p>

            {/* Common Fields */}
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-200">First Name</label>
              <input
                type="text"
                className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                           focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                           text-gray-200 placeholder-gray-400"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-200">Last Name</label>
              <input
                type="text"
                className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                           focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                           text-gray-200 placeholder-gray-400"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-200">Email</label>
              <input
                type="email"
                className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                           focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                           text-gray-200 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-200">Phone Number</label>
              <input
                type="tel"
                className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                           focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                           text-gray-200 placeholder-gray-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Password Fields */}
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-200">Password</label>
              <input
                type="password"
                className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                           focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                           text-gray-200 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-200">Confirm Password</label>
              <input
                type="password"
                className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                           focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                           text-gray-200 placeholder-gray-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {role === 'CLIENT' && (
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-200">Birth Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                             focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                             text-gray-200 placeholder-gray-400"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}

            {role === 'CONSULTANT' && (
              <>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-200">
                    Categories of Specialization
                  </label>
                  <select
                    className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                               focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                               text-gray-200 placeholder-gray-400"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="FINANCIAL">FINANCIAL</option>
                    <option value="LEGAL">LEGAL</option>
                    <option value="IT">IT</option>
                    <option value="CAREER">CAREER</option>
                    <option value="HEALTH">HEALTH</option>
                    <option value="MARKETING">MARKETING</option>
                    <option value="BUSINESS">BUSINESS</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-200">Speciality</label>
                  <input
                    type="text"
                    className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                               focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                               text-gray-200 placeholder-gray-400"
                    placeholder="e.g., Financial Advisor"
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-200">Description</label>
                  <textarea
                    className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                               focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                               text-gray-200 placeholder-gray-400"
                    placeholder="Describe your background and experience"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-1 font-medium text-gray-200">
                    Hourly Price Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                               focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                               text-gray-200 placeholder-gray-400"
                    placeholder="e.g., 100.00"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className={`w-full py-2 rounded font-semibold transition-colors
                ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Register'}
            </button>

            {responseMessage && (
              <div
                className={`mt-4 p-2 rounded 
                  ${
                    responseType === 'success'
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }
                `}
              >
                {responseMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
