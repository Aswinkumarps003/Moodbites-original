import React from 'react';
import { FaComments, FaMicrophone } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidgetFloatingIcon({ onClick, isOpen }) {
  return (
    <div className="fixed z-50 bottom-6 right-6 flex flex-col items-end">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={onClick}
            className="relative flex items-center group focus:outline-none"
            aria-label="Open chat assistant"
          >
            <span className="absolute right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 text-gray-700 px-4 py-2 rounded-full shadow-lg text-sm font-medium pointer-events-none">
              How may I help you?
            </span>
            <span className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-indigo-400 shadow-xl text-white text-3xl hover:scale-110 transition-transform duration-200">
              <FaComments />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
} 