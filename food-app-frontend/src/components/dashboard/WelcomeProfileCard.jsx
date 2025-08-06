import React from 'react';
import { motion } from 'framer-motion';

const WelcomeProfileCard = ({ greeting, name, age, goal, dietaryPreference, mood, moodEmoji, healthFocus }) => (
  <motion.div
    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 flex flex-col gap-3 items-start min-w-[280px]"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center gap-3 w-full">
      <div className="text-2xl font-bold text-primary flex-1">
        {greeting}, {name} <span className="text-lg">👋</span>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${mood?.color || 'bg-blue-100 text-blue-700'}`}
        title={mood?.label || 'Mood'}>
        {moodEmoji} {mood?.label}
      </span>
    </div>
    <div className="flex flex-wrap gap-4 text-sm text-zinc-700 dark:text-zinc-200">
      <div><span className="font-semibold">Age:</span> {age}</div>
      <div><span className="font-semibold">Goal:</span> {goal}</div>
      <div><span className="font-semibold">Diet:</span> {dietaryPreference}</div>
    </div>
    <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
      <span className="font-semibold">Current Focus:</span> {healthFocus}
    </div>
  </motion.div>
);

export default WelcomeProfileCard; 