import React, { useState } from 'react';
import setCookie from '../modules/Cookies';
import TopHeader from '../components/TopHeader';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT'); // 'CLIENT' or 'CONSULTANT'
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');
    setResponseType('');

    const formData = { email, password, role };

    try {
      // Select endpoint based on role
      const endpoint =
        role === 'CONSULTANT'
          ? 'http://localhost:8080/auth/login/consultant'
          : 'http://localhost:8080/auth/login/client';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text(); // Backend returns a string message

      if (!response.ok) {
        setResponseType('error');
        setResponseMessage(text);
      } else {
        setResponseType('success');
        setResponseMessage('Logged in successfully!');
        setCookie('loggedIn', text);

        // Optionally clear the form on success
        setEmail('');
        setPassword('');
        setRole('CLIENT');
        window.location.href = '/profile';
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
      <TopHeader />
      {/* Dark gradient background + modern sans-serif font */}
      <div className="min-h-screen bg-gradient-to-b from-[#232529] to-[#2E2F33] flex items-center justify-center font-sans">
        <form
          onSubmit={handleLogin}
          // Dark card container
          className="w-full max-w-sm bg-[#2F3136] text-gray-200 p-6 rounded shadow-md border border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          {/* Role selection */}
          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => setRole('CONSULTANT')}
              className={`px-4 py-2 text-sm font-medium border border-gray-600
                rounded-l 
                ${
                  role === 'CONSULTANT'
                    ? 'bg-[#E0E0E0] text-gray-900'
                    : 'bg-[#3A3C40] text-gray-200 hover:bg-[#4A4C50]'
                }
              `}
            >
              Consultant
            </button>
            <button
              type="button"
              onClick={() => setRole('CLIENT')}
              className={`px-4 py-2 text-sm font-medium border border-gray-600
                rounded-r 
                ${
                  role === 'CLIENT'
                    ? 'bg-[#E0E0E0] text-gray-900'
                    : 'bg-[#3A3C40] text-gray-200 hover:bg-[#4A4C50]'
                }
              `}
            >
              Client
            </button>
          </div>

          <p className="mb-4 text-center text-gray-400">
            You are logging in as a <span className="font-semibold text-gray-200">{role}</span>.
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-200">Email</label>
            <input
              type="email"
              className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40] 
                         focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                         text-gray-200 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@example.com"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-200">Password</label>
            <input
              type="password"
              className="w-full border border-gray-600 p-2 rounded bg-[#3A3C40]
                         focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                         text-gray-200 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 rounded text-gray-900 
              transition-colors font-semibold 
              ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                  : 'bg-[#E0E0E0] hover:bg-[#CFCFCF]'
              }`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Log In'}
          </button>

          {/* Response Message */}
          {responseMessage && (
            <div
              className={`mt-4 p-2 rounded ${
                responseType === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {responseMessage}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Login;
