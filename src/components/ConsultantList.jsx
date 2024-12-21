import React, { useState, useEffect } from "react";
import ConsultantInfoRow from "./ConsultantInfoRow"; // The row component for each consultant

const ConsultantList = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch consultants from the API
    const fetchConsultants = async () => {
      try {
        const response = await fetch("http://localhost:8080/consultant/newest");
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
    return <div className="text-center text-gray-500">Loading consultants...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (consultants.length === 0) {
    return <div className="text-center text-gray-500">No consultants found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {consultants.map((consultant) => (
        <ConsultantInfoRow key={consultant.id} consultant={consultant} />
      ))}
    </div>
  );
};

export default ConsultantList;
