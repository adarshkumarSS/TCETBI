import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const stories = [
  {
    title: "Revolutionary Water Purification",
    description:
      "EcoTech Solutions developed an innovative water purification system that has provided clean water access to over 50,000 rural households across Tamil Nadu.",
    image: "/asset/SuccessStoryimages/water.jpg",
    sector: "Environmental Technology",
  },
  {
    title: "Smart Energy Grids",
    description:
      "ClusterPower enabled MSMEs to trade energy with blockchain-backed transparency.",
    image: "/asset/SuccessStoryimages/energy.jpg",
    sector: "Clean Energy",
  },
  {
    title: "Agro AI for Farmers",
    description:
      "IoT + AI-powered crop analytics increased yields by 25% across clusters.",
    image: "/asset/SuccessStoryimages/farm.jpg",
    sector: "AgriTech",
  },
  {
    title: "Healthcare Access",
    description:
      "AI-enabled telemedicine solutions expanded rural access to doctors.",
    image: "/asset/SuccessStoryimages/health.jpg",
    sector: "HealthTech",
  },
];

export default function SpinningWheel() {
  const [angle, setAngle] = useState(0);
  const radius = 380; // distance from center

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => prev + 1); // continuous spin
    }, 30); // adjust speed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[600px]">
      <div className="relative w-72 h-96 perspective-[1200px]">
        <motion.div
          className="absolute w-full h-full transform-style-preserve-3d"
          style={{
            transform: `rotateY(${angle}deg)`,
          }}
        >
          {stories.map((story, i) => {
            const step = 360 / stories.length;
            const rotation = i * step;
            return (
              <div
                key={i}
                className="absolute w-72 h-96 rounded-2xl shadow-xl overflow-hidden bg-white"
                style={{
                  transform: `rotateY(${rotation}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold">{story.title}</h2>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {story.description}
                  </p>
                  <span className="mt-2 inline-block text-xs font-semibold text-green-600">
                    {story.sector}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
      <div className="mt-6">
        <button
          onClick={() =>
            setAngle((prev) => prev + Math.floor(Math.random() * 720 + 720))
          }
          className="px-5 py-3 bg-green-600 text-white rounded-lg shadow-md"
        >
          🎰 Spin
        </button>
      </div>
    </div>
  );
}
