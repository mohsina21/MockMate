import React from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="relative w-full min-h-screen  text-white flex items-center justify-center px-6 py-20 z-10">
      <div className="max-w-4xl text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "Orbitron, sans-serif",
            textShadow: "0 0 12px #7b6cff, 0 0 20px #7b6cff",
          }}
        >
          About MockMate
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          MockMate is your personal AI-powered interview partner — designed to simulate real interview experiences using voice or text, and give instant feedback that helps you grow faster.
          <br className="hidden md:inline" />
          Whether you're prepping for your first internship or your dream job at FAANG, MockMate’s got your back. 🚀
        </motion.p>
      </div>
    </section>
  );
};

export default AboutSection;
