import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSmile, FaFrown, FaMeh, FaChartLine, FaPlus } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MoodTrackingPanel = ({ currentMood, onMoodChange }) => {
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [moodNotes, setMoodNotes] = useState('');

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'energetic', emoji: '⚡', label: 'Energetic', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'tired', emoji: '😴', label: 'Tired', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'anxious', emoji: '😟', label: 'Anxious', color: 'bg-orange-100 text-orange-700 border-orange-200' }
  ];

  // Mock mood trend data
  const moodTrendData = [
    { day: 'Mon', mood: 7, label: 'Happy' },
    { day: 'Tue', mood: 5, label: 'Neutral' },
    { day: 'Wed', mood: 8, label: 'Energetic' },
    { day: 'Thu', mood: 4, label: 'Tired' },
    { day: 'Fri', mood: 6, label: 'Neutral' },
    { day: 'Sat', mood: 9, label: 'Happy' },
    { day: 'Sun', mood: 7, label: 'Happy' }
  ];

  const handleMoodSelect = (moodId) => {
    onMoodChange(moodId);
    setShowMoodInput(false);
  };

  const currentMoodData = moods.find(m => m.id === currentMood) || moods[2];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FaSmile className="text-indigo-600" />
          Emotion & Mood Tracking
        </h2>
        <button
          onClick={() => setShowMoodInput(!showMoodInput)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FaPlus className="text-sm" />
          Update Mood
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Current Mood Display */}
        <div className="space-y-4">
          <div className="text-center">
            <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl border-2 ${currentMoodData.color}`}>
              <span className="text-3xl">{currentMoodData.emoji}</span>
              <div>
                <p className="font-semibold text-lg">Current Mood</p>
                <p className="text-sm opacity-75">{currentMoodData.label}</p>
              </div>
            </div>
          </div>

          {/* Manual Mood Input */}
          {showMoodInput && (
            <motion.div
              className="bg-gray-50 rounded-lg p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-sm font-medium text-gray-700 mb-3">How are you feeling?</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      currentMood === mood.id ? mood.color : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
              <textarea
                value={moodNotes}
                onChange={(e) => setMoodNotes(e.target.value)}
                placeholder="Add notes about your mood..."
                className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
                rows="2"
              />
            </motion.div>
          )}

          {/* Mood Insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Mood Insights</h3>
            <p className="text-sm text-gray-600">
              This week you've been mostly happy and energetic. Your mood tends to improve after eating protein-rich meals.
            </p>
          </div>
        </div>

        {/* Mood Trend Chart */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Weekly Mood Trend</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis domain={[1, 10]} stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name, props) => [props.payload.label, 'Mood']}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MoodTrackingPanel;
