import React from 'react';
import { motion } from 'framer-motion';

export default function ChatMessage({ sender, text, timestamp }) {
  const isUser = sender === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-start' : 'justify-end'} w-full`}
    >
      <div className={`relative max-w-[80%] px-4 py-2 rounded-2xl shadow-md text-base ${isUser ? 'bg-white text-gray-800' : 'bg-gradient-to-tr from-orange-200/80 to-indigo-200/80 text-gray-900 backdrop-blur-md'} ${isUser ? 'rounded-bl-none' : 'rounded-br-none'}`}>
        <span>{text}</span>
        <span className="block text-xs text-gray-400 mt-1 text-right">{timestamp}</span>
        {/* Tail */}
        <span className={`absolute ${isUser ? '-left-2 bottom-2' : '-right-2 bottom-2'} w-0 h-0 border-t-8 border-t-transparent ${isUser ? 'border-r-8 border-r-white' : 'border-l-8 border-l-orange-200/80'} border-b-8 border-b-transparent`}></span>
      </div>
    </motion.div>
  );
} 