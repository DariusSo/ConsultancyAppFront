import React, { useState } from 'react';
import TopHeader from '../components/TopHeader';

const Register = () => {
  const [role, setRole] = useState('CLIENT'); // 'CLIENT' or 'CONSULTANT'
  
  // Common fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]  = useState('');
  const [email, setEmail]        = useState('');
  const [phone, setPhone]        = useState('');
  const [password, setPassword]  = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Client-specific fields
  const [birthDate, setBirthDate] = useState('');
  
  // Consultant-specific fields
  const [categories, setCategories]     = useState('FINANCIAL');
  const [availableTimes, setAvailableTimes] = useState(['']);
  const [speciality, setSpeciality]     = useState('');
  const [description, setDescription]   = useState('');
  const [hourlyRate, setHourlyRate]     = useState('');

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
      setResponseMessage("Passwords do not match.");
      return;
    }

    const formData = {
      role,
      firstName,
      lastName,
      email,
      phone,
      password
    };
    
    if (role === 'CLIENT') {
      formData.birthDate = birthDate;
    } else {
      formData.categories = categories;
      formData.availableTime;
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
        // Error responses (e.g., 400, 502, etc.)
        setResponseType('error');
        setResponseMessage(text);
      } else {
        // Successful response (HTTP 200)
        setResponseType('success');
        setResponseMessage(text);
        window.location.href = "/login";
      }
    } catch (error) {
      // Network or unexpected error
      setResponseType('error');
      setResponseMessage('An unexpected error occurred. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <TopHeader/>
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form 
        onSubmit={handleRegister} 
        className="w-full max-w-md bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Role selection */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setRole('CONSULTANT')}
            className={`px-4 py-2 text-sm font-medium rounded-l 
              ${role === 'CONSULTANT' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Register as Consultant
          </button>
          <button
            type="button"
            onClick={() => setRole('CLIENT')}
            className={`px-4 py-2 text-sm font-medium rounded-r 
              ${role === 'CLIENT' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Register as Client
          </button>
        </div>

        <p className="mb-4 text-center text-gray-700">
          You are registering as a <span className="font-semibold">{role}</span>.
        </p>

        {/* Common Fields */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">First Name</label>
          <input 
            type="text"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Last Name</label>
          <input 
            type="text"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input 
            type="email"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
          <input 
            type="tel"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        {/* Password Fields */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input 
            type="password"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
          <input 
            type="password"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {role === 'CLIENT' && (
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Birth Date</label>
            <input 
              type="date"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        )}

        {role === 'CONSULTANT' && (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">Categories of Specialization</label>
              <select
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                value={categories}
                onChange={e => setCategories(e.target.value)}
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
              <label className="block mb-1 font-medium text-gray-700">Speciality</label>
              <input 
                type="text"
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="e.g., Financial Advisor"
                value={speciality}
                onChange={e => setSpeciality(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">Description</label>
              <textarea
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="Describe your background and experience"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-medium text-gray-700">Hourly Price Rate</label>
              <input 
                type="number"
                step="0.01"
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="e.g., 100.00"
                value={hourlyRate}
                onChange={e => setHourlyRate(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </>
        )}

        <button 
          type="submit"
          className={`w-full py-2 rounded text-white transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Register'}
        </button>

        {responseMessage && (
          <div className={`mt-4 p-2 rounded ${responseType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {responseMessage}
          </div>
        )}
      </form>
    </div>
    </>
    
  );
};

export default Register;
