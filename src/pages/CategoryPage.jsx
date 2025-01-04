import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ConsultantInfoRow from "../components/ConsultantInfoRow";

const CategoryPage = () => {
  const { category } = useParams(); // Get the category from URL params
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/consultant/category?category=${category.toUpperCase()}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#232529] to-[#2E2F33] text-gray-200">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#232529] to-[#2E2F33] py-8 px-4">
      <h1 className="text-3xl font-bold text-green-500 mb-8 text-center capitalize">
        {category} Consultants
      </h1>
  
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((consultant) => (
            <div
              key={consultant.id}
              className="bg-[#34373C] rounded-lg shadow hover:shadow-md border border-gray-600 transition duration-300"
            >
              <ConsultantInfoRow consultant={consultant} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg">
          No consultants found for this category.
        </p>
      )}
    </div>
  );

};

export default CategoryPage;
