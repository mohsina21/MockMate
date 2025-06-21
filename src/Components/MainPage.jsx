import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card"
import { ArrowRight, Users, Brain, Trophy, Star, Zap, Shield, Award } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button1 from "./UI/Buttons1";
import { auth } from "../Utils/Firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function MainPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-teal-50 to-slate-50">
      {/* Header */}
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

      {/* Hero Section */}
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
            <span className="bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent block">
              Interview
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Practice with our AI-powered interview bot. Get personalized feedback, improve your skills, and land your
            dream job with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/interview">
              {/* <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Interview
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button> */}
              <Button1 >
                 Start Free Interview
              </Button1>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-8 text-slate-600">
            <div className="flex items-center space-x-2 bg-white/60 px-4 py-2 rounded-full shadow-sm">
              <Users className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium">10,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 px-4 py-2 rounded-full shadow-sm">
              <Star className="w-5 h-5 text-coral-500 fill-current" />
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 px-4 py-2 rounded-full shadow-sm">
              <Trophy className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium">85% Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium text-teal-700 mb-4">
              <Award className="w-4 h-4" />
              <span>Premium Features</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose InterviewAI?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven interview techniques
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-purple-200">
              <CardContent className="p-8 mt-5 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">AI-Powered Feedback</h3>
                <p className="text-slate-600 leading-relaxed">
                  Get instant, personalized feedback on your responses, body language, and communication skills.
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-teal-200">
              <CardContent className="mt-5 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Industry-Specific</h3>
                <p className="text-slate-600 leading-relaxed">
                  Practice with questions tailored to your field, from tech and finance to healthcare and education.
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-emerald-200">
              <CardContent className=" mt-5 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Track Progress</h3>
                <p className="text-slate-600 leading-relaxed">
                  Monitor your improvement over time with detailed analytics and performance metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full text-sm font-medium text-slate-700 mb-4 shadow-sm">
              <Shield className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Simple steps to interview success</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Choose Your Role</h3>
              <p className="text-slate-600 leading-relaxed">
                Select your target position and industry for personalized questions
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Practice Interview</h3>
              <p className="text-slate-600 leading-relaxed">
                Engage with our AI interviewer in a realistic interview simulation
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Get Feedback</h3>
              <p className="text-slate-600 leading-relaxed">
                Receive detailed analysis and tips to improve your performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-coral-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium text-coral-700 mb-4">
              <Star className="w-4 h-4" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Success Stories</h2>
            <p className="text-xl text-slate-600">See how InterviewAI helped others land their dream jobs</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-slate-200 hover:shadow-xl transition-all duration-300 hover:border-purple-200">
              <CardContent className="mt-5 p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-coral-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  "InterviewAI helped me prepare for my software engineering interviews. The feedback was incredibly
                  detailed and helped me identify areas I never knew I needed to work on."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">SM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Sarah Martinez</p>
                    <p className="text-sm text-slate-600">Software Engineer at Google</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 hover:shadow-xl transition-all duration-300 hover:border-teal-200">
              <CardContent className="mt-5 p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-coral-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  "As a recent graduate, I was nervous about interviews. This platform gave me the confidence and skills
                  I needed to succeed in my job search."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">James Davis</p>
                    <p className="text-sm text-slate-600">Marketing Manager at Microsoft</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                  MockMate
                </span>
              </div>
              <p className="text-slate-400">Empowering careers through AI-powered interview preparation.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-slate-200">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-slate-200">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-slate-200">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 MockMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}