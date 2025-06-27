import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Brain, ArrowLeft, CheckCircle, Clock, Users, RotateCcw, Trophy, Star, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { askAzureText } from "../Utils/azureOpenAi";

export default function InterviewResults({ 
  selectedRole, 
  selectedLevel, 
  interviewQuestions, 
  userResponses, 
  aiFeedback, 
  timer, 
  timeLeft, 
  onStartNewInterview 
}) {
  const [interviewSummary, setInterviewSummary] = useState("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  // Generate comprehensive interview summary when component mounts
  useEffect(() => {
    const generateInterviewSummary = async () => {
      try {
        setIsLoadingSummary(true);
        
        // Prepare the data for summary generation
        const summaryData = {
          role: selectedRole,
          level: selectedLevel,
          totalQuestions: interviewQuestions.length,
          answeredQuestions: userResponses.length,
          duration: timer - timeLeft,
          feedback: aiFeedback
        };

        // Create a comprehensive prompt for the AI summary
        const summaryPrompt = `
        You are an expert interview coach providing a comprehensive summary of a candidate's interview performance.

        Interview Details:
        - Position: ${selectedRole}
        - Experience Level: ${selectedLevel}
        - Questions Asked: ${summaryData.totalQuestions}
        - Questions Answered: ${summaryData.answeredQuestions}
        - Interview Duration: ${Math.floor(summaryData.duration / 60)} minutes ${summaryData.duration % 60} seconds

        Questions, Answers, and Feedback:
        ${aiFeedback.map((item, index) => `
        Question ${index + 1}: "${item.question}"
        Candidate's Answer: "${item.userAnswer}"
        AI Feedback: "${item.feedback}"
        ${item.cameraFeedback ? `Body Language Analysis: "${item.cameraFeedback}"` : ''}
        `).join('\n')}

        Please provide a comprehensive interview summary that includes:
        1. Overall performance assessment
        2. Key strengths demonstrated
        3. Areas for improvement
        4. Communication skills evaluation
        5. Technical competency (if applicable)
        6. Confidence and presentation
        7. Final recommendation and next steps

        Keep the summary professional, constructive, and encouraging. Focus on actionable insights that will help the candidate improve their interview skills. Limit to 300-400 words. Please provide a clean response without any markdown formatting like ** or * or # signs.
        `;        const summary = await askAzureText(summaryPrompt);
        // Clean markdown formatting from the summary and bold main section headings
        const cleanSummary = summary
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
          .replace(/\*(.*?)\*/g, '$1') // Remove italic *text*
          .replace(/#{1,6}\s*(.*?)(\n|$)/g, '$1$2') // Remove headers # ## ###
          .replace(/^\s*[-*+]\s+/gm, '• ') // Convert bullet points to simple bullets
          .replace(/^\s*\d+\.\s+/gm, '• ') // Convert numbered lists to bullets
          // Bold main section headings
          .replace(/\b(Overall Performance Assessment|Key Strengths|Areas for Improvement|Communication Skills|Technical Competency|Confidence and Presentation|Final Recommendation|Next Steps)(\s*:)/gi, '<strong>$1$2</strong>');
        setInterviewSummary(cleanSummary);
      } catch (error) {
        console.error("Error generating interview summary:", error);
        setInterviewSummary("We encountered an issue generating your interview summary. However, your detailed feedback is available below.");
      } finally {
        setIsLoadingSummary(false);
      }
    };

    generateInterviewSummary();
  }, [selectedRole, selectedLevel, interviewQuestions.length, userResponses.length, timer, timeLeft, aiFeedback]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-teal-50 to-slate-50">
      {/* Header */}
     <header className="border-b border-slate-200/60 bg-white/90 backdrop-blur-md shadow-sm relative">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
    
    {/* Left side (Back link) */}
    <Link
      to="/"
      className="flex items-center space-x-2 text-slate-600 hover:text-purple-700 transition-colors group"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium">Back to Home</span>
    </Link>

    {/* Centered title */}
    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
      <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
        <Brain className="w-4 h-4 text-white" />
      </div>
      <h1 className="text-xl font-bold text-slate-900">Interview Results</h1>
    </div>

    {/* Right side (empty for spacing) */}
    <div className="w-[112px]"></div> {/* same width as back link for balance */}
    
  </div>
</header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">Interview Complete!</h1>
          <p className="text-xl text-emerald-700 mb-4">
            Excellent work! You've successfully completed your {selectedLevel} level {selectedRole} interview.
          </p>
          <p className="text-lg text-slate-600">
            Here's your comprehensive feedback and performance analysis.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardContent className="p-5 text-center mt-5">
              <Clock className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <div className="text-2xl font-bold text-emerald-800">{formatTime(timer - timeLeft)}</div>
              <div className="text-sm text-emerald-600">Duration</div>
            </CardContent>
          </Card>
          
          <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-blue-50">
            <CardContent className="p-5 mt-5 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-teal-600" />
              <div className="text-2xl font-bold text-teal-800">{userResponses.length}</div>
              <div className="text-sm text-teal-600">Questions Answered</div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-5 mt-5 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-800">{Math.round((userResponses.length / interviewQuestions.length) * 100)}%</div>
              <div className="text-sm text-purple-600">Completion Rate</div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="pt-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-800">{aiFeedback.filter(f => f.cameraFeedback).length}</div>
              <div className="text-sm text-orange-600">Camera Analyses</div>
            </CardContent>
          </Card>        </div>

        {/* Interview Summary */}
        <Card className="border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span>Interview Summary & Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 mt-5">
            {isLoadingSummary ? (
              <div className="flex items-center justify-center space-x-3 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 text-lg">Generating your comprehensive interview summary...</p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="prose prose-slate max-w-none">
                  <div 
                    className="text-slate-800 leading-relaxed text-lg whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: interviewSummary }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <Brain className="w-6 h-6 text-emerald-600" />
              <span>Detailed Interview Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 mt-5">
            <div className="space-y-8">
              {aiFeedback.map((feedback) => (
                <div key={feedback.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {feedback.questionNumber}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Question {feedback.questionNumber}
                        </h3>
                        {feedback.isFinal && (
                          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 rounded-full">
                            <span className="text-sm font-medium text-emerald-700">⭐ Final Assessment</span>
                          </div>
                        )}
                      </div>
                      <p className="text-slate-700 italic text-lg mb-4">"{feedback.question}"</p>
                    </div>
                  </div>

                  {/* Your Answer */}
                  <div className="mb-6">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span>Your Response</span>
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-slate-800 leading-relaxed">{feedback.userAnswer}</p>
                    </div>
                  </div>

                  {/* AI Feedback */}
                  <div className="mb-6">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center space-x-2">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                      <span>AI Feedback</span>
                    </h4>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <p className="text-slate-800 leading-relaxed">{feedback.feedback}</p>
                    </div>
                  </div>

                  {/* Camera Feedback */}
                  {feedback.cameraFeedback && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        <span>📸 Body Language & Posture Analysis</span>
                      </h4>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-slate-800 leading-relaxed">{feedback.cameraFeedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onStartNewInterview}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Start New Interview
              </Button>
              
              <Link to="/">
                <Button
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 shadow-sm hover:shadow-md transition-all duration-300"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
