// Suggested images: friendly face/emoji illustrations, abstract mood backgrounds, or a soft illustration of a person thinking or speaking. Consider using illustrations from undraw.co or icons8.com for a modern, welcoming feel.

import React, { useState } from "react";
import { FaMicrophone, FaSmile, FaFrown, FaMeh, FaGrinStars } from "react-icons/fa";

const moods = [
  { label: "Happy", icon: <FaSmile className="text-yellow-400 text-3xl" /> },
  { label: "Sad", icon: <FaFrown className="text-blue-400 text-3xl" /> },
  { label: "Neutral", icon: <FaMeh className="text-gray-400 text-3xl" /> },
  { label: "Excited", icon: <FaGrinStars className="text-pink-400 text-3xl" /> },
];

export default function EmotionDetectionPage() {
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Placeholder: simple emotion feedback based on keywords
  const getEmotionFeedback = (input) => {
    if (/happy|joy|great|good|excited/i.test(input)) return { mood: "Happy", color: "text-yellow-500" };
    if (/sad|down|bad|unhappy|cry/i.test(input)) return { mood: "Sad", color: "text-blue-500" };
    if (/angry|mad|upset/i.test(input)) return { mood: "Angry", color: "text-red-500" };
    if (/love|amazing|awesome/i.test(input)) return { mood: "Excited", color: "text-pink-500" };
    return { mood: "Neutral", color: "text-gray-500" };
  };
  const feedback = getEmotionFeedback(text);

  return (
    <div className="min-h-screen relative flex items-center justify-center px-2 py-8 bg-[#f8fafc]">
      {/* SVG Pattern Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden fill="none">
        <defs>
          <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="#e0e7ef" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
      <div className="relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16 z-10">
        {/* Illustration (left on desktop, top on mobile) */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center">
          {/* Replace src with a real SVG/PNG for production */}
          <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-6 md:mb-0 animate-float-slow">
            {/* Example: undraw.co illustration or similar */}
            <img
              src="https://undraw.co/api/illustrations/undraw_feeling_proud_qne1.svg"
              alt="Mood illustration"
              className="w-full h-full object-contain drop-shadow-xl rounded-2xl bg-white/60"
              style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #e0e7ff 100%)' }}
            />
          </div>
          <div className="hidden md:block mt-4 text-lg text-gray-500 font-medium">Express your mood and get personalized food recommendations!</div>
        </div>
        {/* Main UI Card */}
        <div className="flex-1 w-full max-w-xl bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100 p-8 flex flex-col gap-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">How are you feeling today?</h1>
          <p className="text-gray-500 mb-4 text-base md:text-lg">Type your mood, pick an emoji, or use your voice. We'll help you find the perfect meal for your mood.</p>
          {/* Textbox with feedback */}
          <div>
            <textarea
              className="w-full min-h-[100px] rounded-xl border border-gray-200 p-4 text-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white/70 shadow"
              placeholder="Describe your mood or how you feel today..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <div className="mt-2 flex items-center gap-2">
              <span className={`font-semibold ${feedback.color}`}>Detected: {feedback.mood}</span>
              {feedback.mood === "Happy" && <FaSmile className="text-yellow-400" />}
              {feedback.mood === "Sad" && <FaFrown className="text-blue-400" />}
              {feedback.mood === "Angry" && <FaMeh className="text-red-400" />}
              {feedback.mood === "Excited" && <FaGrinStars className="text-pink-400" />}
              {feedback.mood === "Neutral" && <FaMeh className="text-gray-400" />}
            </div>
          </div>
          {/* Emoji/Mood Picker */}
          <div>
            <div className="mb-2 text-gray-700 font-medium">Or pick your mood:</div>
            <div className="flex gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 shadow-sm bg-white/70 hover:bg-orange-50 focus:outline-none ${selectedMood === mood.label ? "border-primary bg-orange-100" : "border-gray-200"}`}
                  onClick={() => setSelectedMood(mood.label)}
                  aria-label={mood.label}
                >
                  {mood.icon}
                  <span className="text-xs mt-1 text-gray-700">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Voice Input (Mic) */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <button
              className={`w-20 h-20 flex items-center justify-center rounded-full shadow-xl border-4 border-primary bg-gradient-to-tr from-orange-100 to-blue-100 text-primary text-4xl transition-all duration-200 hover:scale-110 focus:outline-none ${isRecording ? "animate-pulse bg-orange-200" : ""}`}
              onClick={() => setIsRecording(r => !r)}
              aria-label="Record emotion via voice"
            >
              <FaMicrophone className="animate-mic-bounce" />
            </button>
            <span className="text-gray-500 text-base font-medium">{isRecording ? "Listening..." : "Tap the mic to speak your mood"}</span>
          </div>
        </div>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes float-slow { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-16px);} }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        @keyframes fade-in { from{opacity:0;} to{opacity:1;} }
        .animate-fade-in { animation: fade-in 1s ease; }
        @keyframes mic-bounce { 0%,100%{transform:scale(1);} 50%{transform:scale(1.15);} }
        .animate-mic-bounce { animation: mic-bounce 1.2s infinite; }
      `}</style>
    </div>
  );
} 