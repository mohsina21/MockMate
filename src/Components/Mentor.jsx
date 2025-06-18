import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Mentor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("text");
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const videoRef = useRef(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Camera access error:", err);
      });
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt =
        "You are an AI interview coach helping users practice and improve their responses. Be constructive and friendly.";
      const fullInput = systemPrompt + "\nUser: " + input;

      const result = await model.generateContent(fullInput);
      const response = await result.response;
      const reply = response.text() || "Sorry, I didn't get that.";

      setMessages((prev) => [...prev, { type: "ai", text: reply }]);

      // Posture Analysis
      const img = captureImage();
      if (img) {
        const postureFeedback = await sendToGeminiWithImage(img);
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: `📸 Posture Feedback:\n${postureFeedback}` },
        ]);
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Error contacting Gemini API." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Try using Google Chrome for Best Experience ");
      return;
    }

    // If already listening, don't restart
    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("🎤 Voice recognition started");
      setIsListening(true);
      recognitionRef.current = recognition;
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("📝 Transcript:", transcript);
      setInput(transcript);

      setTimeout(() => {
        handleSend();
      }, 100);
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        console.log("🛑 Recognition aborted");
        return;
      }
      console.error("⚠️ Voice recognition error:", event.error);
      alert("Voice error: " + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("🎤 Voice recognition ended");
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort(); // This triggers onend
    }
  };

  // VIDEO PART
  const captureImage = () => {
  const canvas = document.createElement("canvas");
  const video = videoRef.current;

  if (!video) return null;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg"); // base64 image
};
 const sendToGeminiWithImage = async (imageBase64) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision" });

    const prompt = "Give feedback on posture and hand gestures for a mock interview. Be constructive and helpful.";

    const imagePart = {
      inlineData: {
        data: imageBase64.split(",")[1],
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([
      { role: "user", parts: [{ text: prompt }, imagePart] },
    ]);

    const response = await result.response;
    return response.text();
  };




  return (
     <div className="relative w-full min-h-screen overflow-hidden text-white font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg p-6 flex flex-col">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6 tracking-wide font-mono">
          🚀 Interview Arena
        </h1>

        {/* Camera Feed */}
        <div className="flex justify-center mb-6">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-64 h-48 rounded-xl border border-purple-700"
          />
        </div>

        {/* Mode Switch */}
        <div className="flex justify-center gap-4 mb-6">
          {["text", "voice"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-6 py-2 rounded-full transition font-semibold ${mode === m ? "bg-fuchsia-700" : "bg-gray-800 hover:bg-fuchsia-800"}`}
            >
              {m === "text" ? "Text Mode" : "Voice Mode"}
            </button>
          ))}
        </div>

        {/* Chat Box */}
        <div className="flex-1 bg-[#1a1a2c]/70 rounded-xl p-4 overflow-y-auto space-y-4 border border-purple-900">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-xl p-3 rounded-lg ${msg.type === "user"
                ? "ml-auto bg-fuchsia-600 text-right"
                : "mr-auto bg-slate-800 text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="text-sm italic text-purple-300">Thinking...</div>
          )}
        </div>

        {/* Input Section */}
        {mode === "text" && (
          <div className="mt-6 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 bg-[#241e3f] text-white px-4 py-3 rounded-lg border border-[#271E37] outline-none"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-fuchsia-600 px-6 py-3 rounded-lg hover:bg-fuchsia-800 transition"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        )}

        {mode === "voice" && (
          <div className="mt-6 flex flex-col items-center gap-3 text-center text-gray-300">
            <button
              onClick={handleVoiceInput}
              className="bg-purple-800 px-6 py-3 rounded-full text-lg hover:bg-purple-900 transition"
            >
              🎙️ Tap to Speak
            </button>
            <p className="italic text-sm text-gray-400">
              Speak your answer — it will convert to text and be sent automatically 👇
            </p>

            {isListening && (
              <button
                onClick={stopListening}
                className="mt-2 bg-red-600 px-6 py-2 rounded-full hover:bg-red-700 transition"
              >
                🛑 Stop Listening
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentor;
