import React, { useState, useEffect } from 'react';
import { FaDollarSign, FaCalendarAlt, FaList } from 'react-icons/fa';
import ConsultantInfoRow from './ConsultantInfoRow';
import fetchResults from '../modules/SearchBar';

const SearchBar = () => {
  const [specialty, setSpecialty] = useState('');
  const [category, setCategory] = useState('ALL');
  const [date, setDate] = useState('');
  const [hourlyRateFrom, setHourlyRateFrom] = useState('');
  const [hourlyRateTo, setHourlyRateTo] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const isAllDefault =
      !specialty &&
      category === 'ALL' &&
      !date &&
      !hourlyRateFrom &&
      !hourlyRateTo;

    if (isAllDefault) {
      setResults([]);
      setHasSearched(false);
    } else if (hasSearched) {
      fetchResults(date, specialty, category, hourlyRateFrom, hourlyRateTo, hasSearched, results, setResults);
    }
  }, [specialty, category, date, hourlyRateFrom, hourlyRateTo, hasSearched]);

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
    setHasSearched(true);
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#232529] to-[#2E2F33] py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row rounded-lg shadow-md overflow-hidden border border-gray-700 bg-[#2F3136]">
          <div className="w-full lg:w-1/3 p-6 bg-[#34373C]">
            <h2 className="text-xl font-bold text-[#E0E0E0] mb-4">Find a Consultant</h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5 text-gray-200">
              <div className="relative">
                <FaList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="specialty"
                  value={specialty}
                  onChange={(e) => handleInputChange(e, setSpecialty)}
                  placeholder="Specialty, e.g. Financial Advisor"
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-[#2F3136]
                             rounded-md focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                             placeholder-gray-500 text-gray-200"
                />
              </div>
              <div className="relative">
                <FaList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  id="category"
                  value={category}
                  onChange={(e) => handleInputChange(e, setCategory)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-[#2F3136]
                             rounded-md focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                             text-gray-200 placeholder-gray-500"
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
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => handleInputChange(e, setDate)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-[#2F3136]
                             rounded-md focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                             text-gray-200 placeholder-gray-500"
                />
              </div>

              <div className="flex space-x-4">
                <div className="relative w-1/2">
                  <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    id="hourlyRateFrom"
                    value={hourlyRateFrom}
                    onChange={(e) => handleInputChange(e, setHourlyRateFrom)}
                    placeholder="Rate From"
                    min="0"
                    className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-[#2F3136]
                               rounded-md focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                               text-gray-200 placeholder-gray-500"
                  />
                </div>
                <div className="relative w-1/2">
                  <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    id="hourlyRateTo"
                    value={hourlyRateTo}
                    onChange={(e) => handleInputChange(e, setHourlyRateTo)}
                    placeholder="Rate To"
                    min="0"
                    className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-[#2F3136]
                               rounded-md focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
                               text-gray-200 placeholder-gray-500"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="w-full lg:w-2/3 p-6 text-gray-200">
            {hasSearched && results.length > 0 ? (
              <div>
                <h1 className="text-xl font-bold text-[#E0E0E0] mb-4">Search Results</h1>
                <ul className="space-y-4">
                  {results.map((consultant, index) => (
                    <li
                      key={index}
                      className="border border-gray-600 rounded-md p-4 bg-[#2F3136]
                                 hover:shadow-md transition"
                    >
                      <ConsultantInfoRow key={consultant.id} consultant={consultant} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : hasSearched ? (
              <div className="italic text-gray-400">No results found.</div>
            ) : (
              <div className="italic text-gray-400">
                Start by selecting any criteria on the left.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
