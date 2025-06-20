import React from "react";
import { motion } from "framer-motion";
import Card from "./card";

const AboutSection = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-20 z-10 bg-background">
      <Card className="max-w-4xl w-full text-center p-10 shadow-lg bg-card">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6 text-primary"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "Orbitron, sans-serif",
            textShadow: "0 0 12px #a78bfa, 0 0 20px #a78bfa",
          }}
        >
          About MockMate
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          MockMate is your personal AI-powered interview partner — designed to
          simulate real interview experiences using voice or text, and give instant
          feedback that helps you grow faster.
          <br className="hidden md:inline" />
          Whether you're prepping for your first internship or your dream job at
          FAANG, MockMate’s got your back. 🚀
        </motion.p>
      </Card>
    </section>
  );
};

export default AboutSection;
