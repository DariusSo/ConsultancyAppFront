import React from 'react';

const TopHeader = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-end border-b border-gray-300 bg-white h-10 px-4">
      <button className="mr-4 text-sm text-gray-700 hover:text-gray-900">Login</button>
      <button className="text-sm text-gray-700 hover:text-gray-900">Register</button>
    </header>
  );
};

export default TopHeader;