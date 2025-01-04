import React, { useState } from 'react';
import setCookie, { getCookie } from '../modules/Cookies';
import TopHeader from '../components/TopHeader';
import { Navigate } from 'react-router-dom';
import handleLogin from '../modules/LoginAndRegistration';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <>
      <TopHeader />
      {/* Dark gradient background + modern sans-serif font */}
      <div className="min-h-screen bg-gradient-to-b from-[#232529] to-[#2E2F33] flex items-center justify-center font-sans">
        <form
          onSubmit={(e) => handleLogin(e, { email, password, role }, {
            setEmail,
            setPassword,
            setRole,
            setResponseMessage,
            setResponseType,
            setLoading,
          })}
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
