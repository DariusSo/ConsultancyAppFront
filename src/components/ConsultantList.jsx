import React, { useState, useEffect } from "react";
import ConsultantInfoRow from "./ConsultantInfoRow";
import { apiURL } from "../modules/globals";

const ConsultantList = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch(apiURL + "consultant/newest");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setConsultants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultants();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400">Loading consultants...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (consultants.length === 0) {
    return <div className="text-center text-gray-400">No consultants found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
      {consultants.map((consultant) => (
        <div
          key={consultant.id}
          className="bg-[#2F3136] rounded-md shadow-sm border border-gray-600
                     hover:shadow-md transition"
        >
          <ConsultantInfoRow consultant={consultant} />
        </div>
      ))}
    </div>
  );
};

export default ConsultantList;
