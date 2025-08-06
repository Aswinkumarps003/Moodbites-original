import React from 'react';
import { motion } from 'framer-motion';

const EmotionMoodPanel = ({ latestMood, trendGraph, onManualInput, moodInsights }) => (
  <motion.div
    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 flex flex-col gap-4 min-w-[320px]"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    <div className="flex items-center gap-2">
      <span className="text-lg">Latest Mood:</span>
      <span className="text-2xl" title={latestMood?.label}>{latestMood?.emoji}</span>
      <span className="text-sm font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">{latestMood?.label}</span>
    </div>
    <div className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400">
      {/* Placeholder for trend graph */}
      {trendGraph || 'Mood Trend Graph'}
    </div>
    <div className="flex flex-col gap-2">
      <span className="font-semibold">Manual Mood Input:</span>
      {/* Placeholder for emoji picker, slider, notes */}
      <div className="flex gap-2 items-center">
        <span className="text-2xl">🙂</span>
        <input type="range" min="1" max="5" className="w-24" onChange={onManualInput} />
        <input type="text" placeholder="Notes..." className="border rounded px-2 py-1 text-xs" onChange={onManualInput} />
      </div>
    </div>
    <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3 mt-2 text-xs text-blue-800 dark:text-blue-200">
      <span className="font-semibold">Mood Insights:</span> {moodInsights}
    </div>
  </motion.div>
);

export default EmotionMoodPanel; 