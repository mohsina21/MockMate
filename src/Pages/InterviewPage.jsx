"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { Mic, MicOff, Send, ArrowLeft, Play, RotateCcw, Brain, Zap, Target } from "lucide-react"
import { Link } from "react-router-dom"

export default function InterviewPage() {
  const [isStarted, setIsStarted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentInput, setCurrentInput] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const messagesEndRef = useRef(null)

  const interviewQuestions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this position?",
    "What are your greatest strengths?",
    "Describe a challenging situation you faced and how you handled it.",
    "Where do you see yourself in 5 years?",
    "Do you have any questions for me?",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startInterview = () => {
    if (!selectedRole || !selectedLevel) return

    setIsStarted(true)
    const welcomeMessage = {
      id: Date.now().toString(),
      type: "bot",
      content: `Hello! I'm your AI interviewer. Today we'll be conducting a ${selectedLevel} level interview for a ${selectedRole} position. I'll ask you ${interviewQuestions.length} questions. Take your time with each response. Let's begin with the first question: ${interviewQuestions[0]}`,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  const sendMessage = () => {
    if (!currentInput.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentInput("")

    // Simulate AI response
    setTimeout(() => {
      let botResponse = ""

      if (currentQuestion < interviewQuestions.length - 1) {
        botResponse = `Thank you for that response. Let me ask you the next question: ${interviewQuestions[currentQuestion + 1]}`
        setCurrentQuestion((prev) => prev + 1)
      } else {
        botResponse =
          "Thank you for completing the interview! That concludes our session. You'll receive detailed feedback shortly."
        setIsComplete(true)
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1500)
  }

  const resetInterview = () => {
    setIsStarted(false)
    setMessages([])
    setCurrentQuestion(0)
    setIsComplete(false)
    setCurrentInput("")
  }

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
              <h1 className="text-xl font-bold text-slate-900">Interview Setup</h1>
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
                <CardTitle className="text-2xl text-slate-900">Setup Your Mock Interview</CardTitle>
                <p className="text-slate-600">Configure your interview preferences to get started</p>
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
                      <SelectItem value="software-engineer">Software Engineer</SelectItem>
                      <SelectItem value="product-manager">Product Manager</SelectItem>
                      <SelectItem value="data-scientist">Data Scientist</SelectItem>
                      <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                      <SelectItem value="sales-representative">Sales Representative</SelectItem>
                      <SelectItem value="business-analyst">Business Analyst</SelectItem>
                      <SelectItem value="designer">UX/UI Designer</SelectItem>
                      <SelectItem value="consultant">Management Consultant</SelectItem>
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
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
                      <SelectItem value="executive">Executive Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-6 rounded-xl border border-purple-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-slate-900">What to Expect:</h3>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>{interviewQuestions.length} behavioral and role-specific questions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                      <span>Real-time feedback and suggestions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-coral-500 rounded-full"></div>
                      <span>15-20 minute interview duration</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span>Detailed performance analysis at the end</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={startInterview}
                  disabled={!selectedRole || !selectedLevel}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  Start Interview
                  <Play className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
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
            </div>
          </div>
          <div className="text-sm font-medium text-slate-600 bg-white/60 px-3 py-1 rounded-full">
            Question {currentQuestion + 1} of {interviewQuestions.length}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-teal-50 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-slate-900">Interview Session</CardTitle>
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
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.type === "user" ? "text-purple-200" : "text-slate-500"}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              {!isComplete && (
                <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                  <div className="flex space-x-3">
                    <Textarea
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Type your response here..."
                      className="flex-1 min-h-[60px] border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                    />
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsRecording(!isRecording)}
                        className={`border-slate-300 transition-all duration-300 ${
                          isRecording
                            ? "bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={sendMessage}
                        disabled={!currentInput.trim()}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
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
                    <span>Ask clarifying questions if needed</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Show enthusiasm and confidence</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {isComplete && (
              <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-800 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span>Interview Complete!</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-emerald-700 mb-4 leading-relaxed">
                    Great job completing the interview! Your detailed feedback and performance analysis will be
                    available shortly.
                  </p>
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
  )
}
