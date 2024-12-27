import React, { useState, useEffect } from 'react';
import { FaSearch, FaDollarSign, FaCalendarAlt, FaList } from 'react-icons/fa';

const SearchBar = () => {
  const [specialty, setSpecialty] = useState('');
  const [category, setCategory] = useState('ALL'); // Default category is "ALL"
  const [date, setDate] = useState('');
  const [hourlyRateFrom, setHourlyRateFrom] = useState('');
  const [hourlyRateTo, setHourlyRateTo] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // Tracks if a search has been made

  const fetchResults = async () => {
    // Validate hourly rate inputs
    if (hourlyRateFrom && hourlyRateTo && Number(hourlyRateFrom) > Number(hourlyRateTo)) {
      console.error('Hourly Rate "From" should be less than or equal to "To".');
      return;
    }

    // Construct the query string for the GET request
    const queryParams = new URLSearchParams({
      minPrice: hourlyRateFrom || 0, // Default to 0 if no input
      maxPrice: hourlyRateTo || Number.MAX_VALUE, // Default to a large number if no input
      speciality: specialty,
      category,
      date,
    }).toString();

    try {
      const response = await fetch(`http://localhost:8080/consultant/search?${queryParams}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.status}`);
      }

      const data = await response.json();
      setResults(data); // Update results state with the fetched data
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  // Trigger API call only if values are not default
  useEffect(() => {
    if (
      hasSearched && // Ensure the user has triggered a search
      (specialty || category !== 'ALL' || date || hourlyRateFrom || hourlyRateTo) // Ensure some value is not default
    ) {
      fetchResults();
    }
  }, [specialty, category, date, hourlyRateFrom, hourlyRateTo, hasSearched]);

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
    setHasSearched(true); // Mark as searched when any value changes
  };

  return (
    <section className="w-full bg-white py-12">
      <div className="container mx-auto px-4">
        <form
          onSubmit={(e) => e.preventDefault()} // Prevent form submission since it's dynamic
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6"
        >
          {/* Specialty Input */}
          <div className="relative w-full md:w-1/4">
            <FaList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="specialty"
              value={specialty}
              onChange={(e) => handleInputChange(e, setSpecialty)}
              placeholder="Specialty, e.g., Financial Advisor"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Select */}
          <div className="relative w-full md:w-1/4">
            <FaList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              id="category"
              value={category}
              onChange={(e) => handleInputChange(e, setCategory)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All</option>
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
              onChange={(e) => handleInputChange(e, setDate)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Hourly Rate From */}
          <div className="relative w-full md:w-1/8">
            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              id="hourlyRateFrom"
              value={hourlyRateFrom}
              onChange={(e) => handleInputChange(e, setHourlyRateFrom)}
              placeholder="Rate From"
              min="0"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Hourly Rate To */}
          <div className="relative w-full md:w-1/8">
            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              id="hourlyRateTo"
              value={hourlyRateTo}
              onChange={(e) => handleInputChange(e, setHourlyRateTo)}
              placeholder="Rate To"
              min="0"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        {/* Search Results */}
        <div className="mt-8">
          {hasSearched && results.length > 0 ? (
            <ul>
              {results.map((consultant, index) => (
                <li key={index} className="border-b py-2">
                  {consultant.name} - {consultant.speciality} - ${consultant.hourlyRate}/hour
                </li>
              ))}
            </ul>
          ) : hasSearched ? (
            <p>No results found.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
