import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaHeart, FaBullseye } from 'react-icons/fa';

const WelcomeProfile = ({ greeting, currentMood, currentTime }) => {
  // Mock user data - in real app, this would come from context/API
  const user = {
    name: "Achu",
    age: 28,
    fitnessGoal: "Muscle Gain",
    dietaryPreference: "Vegetarian",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  };

  const moodConfig = {
    happy: { emoji: '😊', color: 'bg-green-100 text-green-700', label: 'Happy' },
    stressed: { emoji: '😰', color: 'bg-red-100 text-red-700', label: 'Stressed' },
    tired: { emoji: '😴', color: 'bg-gray-100 text-gray-700', label: 'Tired' },
    energetic: { emoji: '⚡', color: 'bg-yellow-100 text-yellow-700', label: 'Energetic' },
    anxious: { emoji: '😟', color: 'bg-orange-100 text-orange-700', label: 'Anxious' },
    neutral: { emoji: '😐', color: 'bg-blue-100 text-blue-700', label: 'Neutral' }
  };

  const currentMoodConfig = moodConfig[currentMood] || moodConfig.neutral;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Greeting and User Info */}
        <div className="flex items-center gap-4">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-16 h-16 rounded-full border-3 border-indigo-200 shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {greeting}, {user.name} 👋
            </h1>
            <p className="text-gray-600 text-sm">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Mood Status Badge */}
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentMoodConfig.color}`}>
            {currentMoodConfig.emoji} {currentMoodConfig.label}
          </span>
        </div>
      </div>

      {/* Profile Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FaUser className="text-indigo-600" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Age</p>
            <p className="font-semibold text-gray-900">{user.age} years</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FaBullseye className="text-green-600" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Fitness Goal</p>
            <p className="font-semibold text-gray-900">{user.fitnessGoal}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FaHeart className="text-red-600" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Diet</p>
            <p className="font-semibold text-gray-900">{user.dietaryPreference}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeProfile;
