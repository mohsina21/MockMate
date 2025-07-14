import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card"
import { ArrowRight, Users, Brain, Trophy, Star, Zap, Shield, Award } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button1 from "./UI/Buttons1";
import { auth } from "../Utils/Firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

export default function MainPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
    const [x, setX] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setX((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/");
  };

  const handleStartInterview = () => {
    if (user) {
      navigate("/interview");
    } else {
      navigate("/auth");
    }
  };
  
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: { 
      y: -8, 
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-teal-50 to-slate-50">
      <header className="border-b border-slate-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm ">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-teal-700 bg-clip-text text-transparent">
              MockMate
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-purple-700 transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-purple-700 transition-colors font-medium">
              How it Works
            </a>
            <a href="#testimonials" className="text-slate-600 hover:text-purple-700 transition-colors font-medium">
              Reviews
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {!user ? (
              <Link to="/auth">
                <Button
                  variant="outline"
                  className="border-slate-300 text-purple-700 hover:bg-purple-50 active:bg-purple-200 focus:bg-purple-200 px-6 py-2 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Login / Sign In
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-slate-300 text-purple-700 hover:bg-purple-50 active:bg-purple-200 focus:bg-purple-200 px-6 py-2 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
              >
                Sign Out
              </Button>
            )}
            <Button
              onClick={handleStartInterview}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Interview
            </Button>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-teal-600/5 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="container mx-auto text-center max-w-4xl relative">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-teal-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-6 border border-purple-200/50">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Interview Practice</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
              Master Your Next
            </span>
            <motion.span
      className="block text-transparent bg-clip-text"
      style={{
        backgroundImage: "linear-gradient(90deg, #9333ea, #14b8a6, #9333ea)",
        backgroundSize: "200% 100%",
        display: "inline-block",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeIn",
      }}
    >
      Interview
    </motion.span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Practice with our AI-powered interview bot. Get personalized feedback, improve your skills, and land your
            dream job with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/interview">
              <Button1 >
                 Start Free Interview
              </Button1>
            </Link>
          </div>
        </div>
      </section>

      <motion.section 
        id="features" 
        className="py-20 px-4 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium text-teal-700 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-4 h-4" />
              <span>Premium Features</span>
            </motion.div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose InterviewAI?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven interview techniques
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Brain,
                title: "AI-Powered Feedback",
                description: "Get instant, personalized feedback on your responses, body language, and communication skills.",
                gradient: "from-purple-500 to-purple-600",
                hoverColor: "hover:border-purple-200"
              },
              {
                icon: Users,
                title: "Industry-Specific",
                description: "Practice with questions tailored to your field, from tech and finance to healthcare and education.",
                gradient: "from-teal-500 to-teal-600",
                hoverColor: "hover:border-teal-200"
              },
              {
                icon: Trophy,
                title: "Track Progress",
                description: "Monitor your improvement over time with detailed analytics and performance metrics.",
                gradient: "from-emerald-500 to-emerald-600",
                hoverColor: "hover:border-emerald-200"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card className={`border-slate-200 hover:shadow-xl transition-all duration-300 group ${feature.hoverColor} h-full`}>
                  <CardContent className="p-8 mt-5 text-center h-full flex flex-col">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      whileHover={{ 
                        scale: 1.1 
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        id="how-it-works" 
        className="py-20 px-4 bg-gradient-to-br from-slate-50 to-purple-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full text-sm font-medium text-slate-700 mb-4 shadow-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-4 h-4" />
              <span>Simple Process</span>
            </motion.div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Simple steps to interview success</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                number: "1",
                title: "Choose Your Role",
                description: "Select your target position and industry for personalized questions",
                gradient: "from-purple-600 to-purple-700"
              },
              {
                number: "2",
                title: "Practice Interview",
                description: "Engage with our AI interviewer in a realistic interview simulation",
                gradient: "from-teal-600 to-teal-700"
              },
              {
                number: "3",
                title: "Get Feedback",
                description: "Receive detailed analysis and tips to improve your performance",
                gradient: "from-emerald-600 to-emerald-700"
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="text-center group"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className={`w-16 h-16 bg-gradient-to-br ${step.gradient} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0] 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {step.number}
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        id="testimonials" 
        className="py-20 px-4 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-coral-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium text-coral-700 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4" />
              <span>Success Stories</span>
            </motion.div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Success Stories</h2>
            <p className="text-xl text-slate-600">See how MockMate helped others land their dream jobs</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Yash Srivastava",
                role: "Academic Trainne at KPMG",
                avatar: "https://media.licdn.com/dms/image/v2/D5603AQGSYFegbRYc9Q/profile-displayphoto-shrink_400_400/B56ZXtjfKtGoAg-/0/1743447258345?e=1756339200&v=beta&t=-Aa_jThoOM7LDemxfcgmylyP7Aw1tv_jVQBS-OID--s",
                linkedin: "https://www.linkedin.com/in/yashsrivasta7a/",
                gradient: "from-purple-500 to-teal-500",
                quote: "MockMate helped me prepare for my software engineering interviews. The feedback was incredibly detailed and helped me identify areas I never knew I needed to work on.",
                hoverColor: "hover:border-purple-400"
              },
              {
                name: "Roshan Rawat",
                role: "Software Enginner at Google",
                avatar: "https://media.licdn.com/dms/image/v2/D5603AQH85W6IWTxj8g/profile-displayphoto-scale_400_400/B56ZftSp1pGoAk-/0/1752032781492?e=1758153600&v=beta&t=g8R4zByJGuuMW3L_KDKcnTQZ-XHaJj5CMzhImamAcOQ",
                linkedin: "https://www.linkedin.com/in/roshan-rawat-493091255/",
                gradient: "from-teal-500 to-emerald-500",
                quote: "As a recent graduate, I was nervous about interviews. This platform gave me the confidence and skills I needed to succeed in my job search.",
                hoverColor: "hover:border-teal-200"
              }
            ].map((testimonial, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card className={`border-slate-200 hover:shadow-xl transition-all duration-300 ${testimonial.hoverColor} h-full`}>
                  <CardContent className="mt-5 p-8 h-full flex flex-col">
                    <motion.div 
                      className="flex items-center mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        </motion.div>
                      ))}
                    </motion.div>
                    <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center">
                      <motion.div 
                        className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-slate-200 hover:ring-purple-300 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">{testimonial.name}</p>
                          <a
                            href={testimonial.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </div>
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-purple-700 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-teal-600/20 backdrop-blur-sm"></div>
        <div className="container mx-auto text-center relative">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Ace Your Next Interview?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who used InterviewAI to land their dream jobs
          </p>
          <Link to="/interview">
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-slate-50 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Start Your Free Interview Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-purple-900 text-white py-6 px-4 text-center text-sm">
  <div>
    © 2025 All rights reserved.
  </div>
  <div className="mt-1">
    Made by{" "}
    <a
      href="https://www.linkedin.com/in/mohsina-parveen-577367203/"
      target="_blank"
      rel="noopener noreferrer"
      className=" hover:text-purple-600 font-semibold transition-colors duration-200"
    >
      Mohsina Parveen 
    </a>
    {" "}&{" "}
    <a
      href="https://www.linkedin.com/in/ronit-bali-xe/"
      target="_blank"
      rel="noopener noreferrer"
      className=" hover:text-purple-600 font-semibold transition-colors duration-200"
    >
      Ronit Bali
    </a>
  </div>
</footer>
    </div>
  );
}