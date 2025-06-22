import React, { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Brain, ArrowLeft, Video, VideoOff, Zap, Target, RotateCcw, Send, Mic, MicOff, CheckCircle, Clock, Users, Play, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Utils/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { askAzureText, askAzureWithImage } from "../Utils/azureOpenAi";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "./select";
import { Textarea } from "./textarea";

export default function Mentor() {
  const [isStarted, setIsStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [mode, setMode] = useState("text");
  const [user, setUser] = useState(null);
  const [timer, setTimer] = useState(null); // total seconds
  const [timeLeft, setTimeLeft] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera(); // Cleanup on unmount
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOn(true);
        
        // Ensure video plays
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.error("Play error:", err);
          });
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to access camera. Please check permissions and try again.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !isCameraOn) return null;

    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg");
    }    return null;
  };

  // Generate AI questions based on role and level
  const generateInterviewQuestions = async (role, level, numQuestions = 6) => {
    try {      const prompt = `You are an experienced HR interviewer. Generate exactly ${numQuestions} interview questions for a ${level} level ${role} position. 

Make the questions:
- Realistic and relevant to the role
- Appropriate for the experience level
- Professional and clear
- Varied in type (behavioral, technical, situational)

For ${level} level positions:
- Entry Level: Focus on basic knowledge, learning ability, motivation, and potential
- Mid Level: Include technical skills, problem-solving, past experience, and teamwork
- Senior Level: Cover leadership, architecture, mentoring, and strategic thinking  
- Executive Level: Focus on vision, leadership, business impact, and strategic planning

Return ONLY the questions, each on a new line, without numbers or bullet points.

Role: ${role}
Experience Level: ${level}`;
      
      console.log("Generating questions with Azure OpenAI...");
      const response = await askAzureText(prompt);
      console.log("Azure response:", response);
      
      // Parse the response to extract questions
      const questions = response
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 0 && q.includes('?'))
        .slice(0, numQuestions);
      
      console.log("Parsed questions:", questions);
      
      // If we got good questions, return them
      if (questions.length >= 3) {
        return questions;
      }
      
      // Fallback: Use default questions if AI response wasn't good
      console.log("Using fallback questions");
      return questions.length > 0 ? questions : [
        "Tell me about yourself and your background.",
        "Why are you interested in this position?",
        "What are your greatest strengths?",
        "Describe a challenging situation you faced and how you handled it.",
        "Where do you see yourself in 5 years?",
        "Do you have any questions for me?"
      ];
    } catch (error) {
      console.error("Error generating questions:", error);
      // Return default questions as fallback
      return [
        "Tell me about yourself and your background.",
        "Why are you interested in this position?",
        "What are your greatest strengths?",
        "Describe a challenging situation you faced and how you handled it.",
        "Where do you see yourself in 5 years?",
        "Do you have any questions for me?"
      ];    }
  };
  const startInterview = async () => {
    if (!selectedRole || !selectedLevel) return;

    setIsLoading(true);
    const questions = await generateInterviewQuestions(selectedRole, selectedLevel, 6);
    setInterviewQuestions(questions); // Fix: Set the questions in state
    
    setIsStarted(true);
    const welcomeMessage = {
      id: Date.now().toString(),
      type: "bot",
      content: `Hello! I'm your AI interviewer. Today we'll be conducting a ${selectedLevel} level interview for a ${selectedRole} position. I'll ask you ${questions.length} questions tailored specifically for this role. Take your time with each response. Let's begin with the first question: ${questions[0]}`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setIsLoading(false);
  };

  // Voice-to-text handler
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("🎤 Listening...");
      setIsListening(true);
      recognitionRef.current = recognition;
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCurrentInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      if (event.error !== "aborted") {
        console.error("Voice error:", event.error);
        alert("Voice error: " + event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("🎤 Stopped");
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
  };

  const sendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentInput("");
    setIsLoading(true);

    try {
      // Generate AI response based on the answer
      let botResponse = "";
      
      if (currentQuestion < interviewQuestions.length - 1) {
        const feedbackPrompt = `As an experienced interviewer, provide brief constructive feedback (2-3 sentences) on this candidate's response to the question "${interviewQuestions[currentQuestion]}": "${userMessage.content}". Then ask the next question: "${interviewQuestions[currentQuestion + 1]}"`;
        
        botResponse = await askAzureText(feedbackPrompt);
        setCurrentQuestion((prev) => prev + 1);
      } else {
        const finalFeedbackPrompt = `As an experienced interviewer, provide a brief final assessment (3-4 sentences) of this candidate's overall interview performance based on their responses. Be constructive and encouraging.`;
        
        botResponse = await askAzureText(finalFeedbackPrompt);
        setIsComplete(true);
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Capture image for posture analysis if video is available
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        const img = captureImage();
        if (img) {
          try {
            const imageFeedback = await askAzureWithImage(
              "Analyze this candidate's posture and body language in a mock interview setting. Provide 2-3 brief, constructive tips for improvement. Focus on professional presentation.",
              img
            );
            
            const postureMessage = {
              id: (Date.now() + 2).toString(),
              type: "bot",
              content: `📸 **Posture & Body Language Feedback:**\n${imageFeedback}`,
              timestamp: new Date(),
            };
            
            setMessages((prev) => [...prev, postureMessage]);
          } catch (imageError) {
            console.error("Image analysis error:", imageError);
          }
        }
      }
    } catch (error) {
      console.error("Error generating response:", error);
      let fallbackResponse = "";
      
      if (currentQuestion < interviewQuestions.length - 1) {
        fallbackResponse = `Thank you for that response. Let me ask you the next question: ${interviewQuestions[currentQuestion + 1]}`;
        setCurrentQuestion((prev) => prev + 1);
      } else {
        fallbackResponse = "Thank you for completing the interview! That concludes our session. You've done well.";
        setIsComplete(true);
      }
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: fallbackResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetInterview = () => {
    setIsStarted(false);
    setMessages([]);
    setCurrentQuestion(0);
    setIsComplete(false);
    setCurrentInput("");
    setInterviewQuestions([]);
    setMode("text");
  };

  // Set timer based on number of questions (1 min per question as example)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isStarted && interviewQuestions.length > 0) {
      const minutes = interviewQuestions.length; // 1 min per question
      setTimer(minutes * 60);
      setTimeLeft(minutes * 60);
    }
  }, [isStarted, interviewQuestions.length]);

  // Countdown logic
  useEffect(() => {
    if (!isStarted || isComplete || timeLeft === null) return;
    if (timeLeft <= 0) {
      setIsComplete(true);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted, isComplete, timeLeft]);

  // Format time as MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-teal-50 to-slate-50">
        <header className="border-b border-slate-200/60 bg-white/90 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center space-x-2 text-slate-600 hover:text-purple-700 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">AI Interview Setup</h1>
            </div>
            <div></div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center bg-gradient-to-r from-purple-50 to-teal-50 border-b border-slate-100">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Setup Your AI Mock Interview</CardTitle>
                <p className="text-slate-600">AI will generate personalized questions for your role</p>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-3">
                    What role are you interviewing for?
                  </label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 h-12">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                      <SelectItem value="Product Manager">Product Manager</SelectItem>
                      <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                      <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                      <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                      <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                      <SelectItem value="UX/UI Designer">UX/UI Designer</SelectItem>
                      <SelectItem value="Management Consultant">Management Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-3">Experience Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 h-12">
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="Mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="Senior">Senior Level (6+ years)</SelectItem>
                      <SelectItem value="Executive">Executive Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-6 rounded-xl border border-purple-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-slate-900">AI-Powered Features:</h3>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>AI-generated questions tailored to your role & level</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                      <span>Real-time AI feedback on your responses</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-coral-500 rounded-full"></div>
                      <span>Voice input support for natural conversation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span>Body language & posture analysis via webcam</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={startInterview}
                  disabled={!selectedRole || !selectedLevel || isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Brain className="mr-2 w-5 h-5 animate-pulse" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      Start AI Interview
                      <Play className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-teal-50 to-slate-50">
      <header className="border-b border-slate-200/60 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={resetInterview}
              className="text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Reset
            </Button>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50">
                {selectedRole}
              </Badge>
              <Badge variant="outline" className="border-teal-300 text-teal-700 bg-teal-50">
                {selectedLevel}
              </Badge>
              {isCameraOn && (
                <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                  <Video className="w-3 h-3 mr-1" />
                  Camera Active
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isStarted && (
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-lg shadow-lg border-2 border-white focus:outline-none"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #14b8a6 100%)", // purple to teal
                  color: "#fff",
                  boxShadow: "0 0 16px #8b5cf6, 0 0 32px #14b8a6",
                  transition: "box-shadow 0.3s",
                }}
                tabIndex={-1}
                aria-label="Interview Timer"
              >
                <Clock className="w-6 h-6 text-white drop-shadow" />
                <span className="tracking-widest">{formatTime(timeLeft ?? 0)}</span>
              </button>
            )}
            {!user && (
              <Link to="/auth">
                <Button
                  variant="outline"
                  className="border-slate-300 text-purple-700 hover:bg-purple-50 active:bg-purple-200 focus:bg-purple-200 px-6 py-2 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Login / Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Webcam Feed */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
                <CardTitle className="text-lg text-slate-900 flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span>Video Feed</span>
                </CardTitle>
              </CardHeader>              <CardContent className="p-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-48 rounded-lg border border-slate-200 bg-slate-100 object-cover"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-slate-500">
                    Used for posture analysis feedback
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isCameraOn ? stopCamera : startCamera}
                    className={`transition-all duration-300 ${
                      isCameraOn
                        ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {isCameraOn ? (
                      <>
                        <VideoOff className="w-4 h-4 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-teal-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg text-slate-900">AI Interview Session</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={mode === "text" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMode("text")}
                      className="text-xs"
                    >
                      Text
                    </Button>
                    <Button
                      variant={mode === "voice" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMode("voice")}
                      className="text-xs"
                    >
                      Voice
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                          : "bg-white border border-slate-200 text-slate-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.type === "user" ? "text-purple-200" : "text-slate-500"}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
                        <span className="text-sm text-slate-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>              {!isComplete && (
                <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-slate-600">
                      Question {currentQuestion + 1} of {interviewQuestions.length}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsComplete(true)}
                      className="text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                    >
                      Finish Interview
                    </Button>
                  </div>
                  {mode === "text" ? (
                    <div className="flex space-x-3">
                      <Textarea
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Type your response here..."
                        className="flex-1 min-h-[60px] border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <div className="flex flex-col space-y-2">
                        <Button
                          onClick={sendMessage}
                          disabled={!currentInput.trim() || isLoading}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          size="sm"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex space-x-3 w-full">
                        <Textarea
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          placeholder="Voice input will appear here..."
                          className="flex-1 min-h-[60px] border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!currentInput.trim() || isLoading}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          size="sm"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex space-x-3">
                        {!isListening ? (
                          <Button
                            onClick={handleVoiceInput}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Mic className="w-4 h-4 mr-2" />
                            Start Speaking
                          </Button>
                        ) : (
                          <Button
                            onClick={stopListening}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <MicOff className="w-4 h-4 mr-2" />
                            Stop Listening
                          </Button>
                        )}
                      </div>
                      {isListening && (
                        <div className="text-sm text-slate-600 animate-pulse">
                          🎤 Listening... Speak your answer now
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Progress & Tips */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-slate-100">
                <CardTitle className="text-lg text-slate-900 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-teal-600" />
                  <span>Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Questions Completed</span>
                    <span className="text-slate-900 font-semibold">
                      {currentQuestion + (messages.filter((m) => m.type === "user").length > 0 ? 1 : 0)} /{" "}
                      {interviewQuestions.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${((currentQuestion + (messages.filter((m) => m.type === "user").length > 0 ? 1 : 0)) / interviewQuestions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-coral-50 border-b border-slate-100">
                <CardTitle className="text-lg text-slate-900 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span>Interview Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="text-sm text-slate-700 space-y-3">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Be specific with examples</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use the STAR method (Situation, Task, Action, Result)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-coral-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Take your time to think</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                 <span>Maintain eye contact and confident body posture</span>
                  </li>                </ul>
              </CardContent>
            </Card>

            {isComplete && (
              <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg animate-in slide-in-from-right duration-500">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-800 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span>Interview Complete!</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-emerald-700 mb-4 leading-relaxed">
                    Excellent work! You've completed all {interviewQuestions.length} questions. Your responses showed great depth and thoughtfulness.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                      <div className="font-semibold text-emerald-800">Duration</div>
                      <div className="text-emerald-600">~{Math.ceil(messages.length * 0.5)} min</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <Users className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                      <div className="font-semibold text-emerald-800">Responses</div>
                      <div className="text-emerald-600">{messages.filter(m => m.type === 'user').length}</div>
                    </div>
                  </div>
                  <Button
                    onClick={resetInterview}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start New Interview
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
