import React, { useState } from 'react';
import setCookie from '../modules/Cookies';

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

    const formData = {
      email,
      password,
      role,
    };

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
        setResponseMessage("Logged in successfully!");
        setCookie("loggedIn", text)

        // Optionally clear the form on success
        setEmail('');
        setPassword('');
        setRole('CLIENT');
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Role selection */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setRole('CONSULTANT')}
            className={`px-4 py-2 text-sm font-medium rounded-l ${
              role === 'CONSULTANT'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Login as Consultant
          </button>
          <button
            type="button"
            onClick={() => setRole('CLIENT')}
            className={`px-4 py-2 text-sm font-medium rounded-r ${
              role === 'CLIENT'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Login as Client
          </button>
        </div>

        <p className="mb-4 text-center text-gray-700">
          You are logging in as a <span className="font-semibold">{role}</span>.
        </p>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded text-white transition-colors ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Log In'}
        </button>

        {responseMessage && (
          <div
            className={`mt-4 p-2 rounded ${
              responseType === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {responseMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
