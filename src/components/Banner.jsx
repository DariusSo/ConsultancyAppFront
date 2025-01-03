import React from "react";
import banner from "../assets/banner2.png";

const Banner = () => {
  return (
    <div className="bg-black">
      <div className="relative text-center mt-[55px]">
        {/* Banner Image */}
        <img
          src={banner}
          alt="Banner"
          className="w-full h-auto opacity-30"
        />

        {/* Overlay Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
          <h1 className="text-gray-300 text-8xl font-bold">
            AdvisorFlow
          </h1>
          <h3 className="text-gray-300 text-lg font-medium">
            Your Trusted Flow of Professional Guidance
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Banner;
