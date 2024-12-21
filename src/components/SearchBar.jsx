// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { FaSearch, FaDollarSign, FaCalendarAlt, FaList } from 'react-icons/fa'; // Importing icons from react-icons

const SearchBar = () => {
  const [specialty, setSpecialty] = useState('');
  const [category, setCategory] = useState('FINANCIAL');
  const [date, setDate] = useState('');
  const [hourlyRateFrom, setHourlyRateFrom] = useState('');
  const [hourlyRateTo, setHourlyRateTo] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    // Validate hourly rate inputs
    if (hourlyRateFrom && hourlyRateTo && Number(hourlyRateFrom) > Number(hourlyRateTo)) {
      alert('Hourly Rate "From" should be less than or equal to "To".');
      return;
    }

    // Construct search parameters
    const searchParams = {
      specialty,
      category,
      date,
      hourlyRate: {
        from: hourlyRateFrom,
        to: hourlyRateTo,
      },
    };

    console.log('Search Parameters:', searchParams);

    // TODO: Implement search functionality (e.g., API call)
  };

  return (
    <section className="w-full bg-white py-12">
      <div className="container mx-auto px-4">
        <form
          onSubmit={handleSearch}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6"
        >
          {/* Specialty Input */}
          <div className="relative w-full md:w-1/4">
            <FaList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Specialty, e.g., Financial Advisor"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category Select */}
          <div className="relative w-full md:w-1/4">
            <FaList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="FINANCIAL">Financial</option>
              <option value="LEGAL">Legal</option>
              <option value="IT">IT</option>
              <option value="CAREER">Career</option>
              <option value="HEALTH">Health</option>
              <option value="MARKETING">Marketing</option>
              <option value="BUSINESS">Business</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="relative w-full md:w-1/4">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Hourly Rate From */}
          <div className="relative w-full md:w-1/8">
            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              id="hourlyRateFrom"
              value={hourlyRateFrom}
              onChange={(e) => setHourlyRateFrom(e.target.value)}
              placeholder="Rate From"
              min="0"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Hourly Rate To */}
          <div className="relative w-full md:w-1/8">
            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              id="hourlyRateTo"
              value={hourlyRateTo}
              onChange={(e) => setHourlyRateTo(e.target.value)}
              placeholder="Rate To"
              min="0"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <FaSearch className="mr-2" />
              Search
            </button>
          </div>
        </form>

        {/* Optional: Display Search Results */}
        {/* <SearchResults results={results} /> */}
      </div>
    </section>
  );
};

export default SearchBar;
