import React from "react";
import Button from "./button";
import Card from "./card";
import {
  ArrowRight,
  Users,
  Brain,
  Trophy,
  Star,
  Zap,
  Shield,
  Award,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Utils/Firebase";
import Squares from "./Squares.jsx";

const MainPage = () => {
  const navigate = useNavigate();

  const handleStartMockInterview = () => {
    if (auth.currentUser) {
      navigate("/mentor");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      {/* 🔳 Animated background */}
      <Squares
        direction="diagonal"
        speed={0.6}
        borderColor="#271E37"
        squareSize={40}
        hoverFillColor="#333"
      />

      {/* 💬 Centered Text Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-widest drop-shadow-glow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: "Orbitron, sans-serif",
            color: "#ffffff",
            textShadow: "0 0 15px #6634DD, 0 0 30px #6634DD",
          }}
        >
          MockMate
        </motion.h1>

        <motion.p
          className="mt-4 md:mt-6 text-lg md:text-2xl text-gray-300 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Your AI-powered mock interview partner.
        </motion.p>

        {/* 🚀 Start Mock Interview Button */}
        <motion.button
          className="mt-8 px-8 py-4 rounded-lg bg-fuchsia-700 hover:bg-fuchsia-800 text-xl font-bold transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartMockInterview}
        >
          Start Mock Interview
        </motion.button>
      </div>
    </div>
  );
};

export default MainPage;
