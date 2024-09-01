"use client";
import React from "react";
import "./banner.css"; // Ensure you have the CSS file with custom styles
import { useWindowSize } from "@/app/hooks/use-weindowSize";

const Banner: React.FC = () => {
  const windowSize = useWindowSize()[0];
  return (
    <div className="relative min-h-[calc(100vh-75px)] bg-liquid-black flex flex-col liquid-lg:flex-row  items-center liquid-lg:mt-[-20px] justify-center gap-x-20 gap-y-10 overflow-hidden w-full">
      <div className="flex flex-col items-center justify-center font-liquid-regular text-liquid-dark-white text-liquid-title">
        <h1
          className="text-liquid-banner-header-mobile liquid-md:text-liquid-banner-header font-liquid-bold text-liquid-blue"
          style={{ transform: "translateY(-20%)" }}
        >
          Liquid.
        </h1>
        <p className="">Instant liquidity.</p>
        <p>
          Any time, any <span className="text-liquid-blue">token</span>.
        </p>
      </div>
      {windowSize > 500 && <div className="flex items-center justify-center relative">
        {" "}
        <div className={`circle`}>
          <div className="wave" />
        </div>
      </div>}
    </div>
  );
};

export default Banner;
