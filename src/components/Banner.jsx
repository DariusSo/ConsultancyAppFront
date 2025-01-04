import React from "react";
import banner from "../assets/banner2.png";

const Banner = () => {
  return (
    <div className="bg-black">
      <div className="relative text-center mt-[55px]">
        <img
          src={banner}
          alt="Banner"
          className="w-full h-auto opacity-30"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 px-4">
          <h1 className="text-gray-300 text-2xl sm:text-4xl md:text-5xl lg:text-8xl font-bold leading-snug text-center">
            AdvisorFlow
          </h1>
          <h3 className="hidden sm:block text-gray-300 text-xs sm:text-sm md:text-base font-medium text-center">
            Your Trusted Flow of Professional Guidance
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Banner;
