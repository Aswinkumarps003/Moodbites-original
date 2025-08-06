import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import ChatMessage from './ChatMessage';

export default function ChatWindow({ isOpen, onClose, messages, onSend, onVoiceInput, input, setInput }) {
  const chatEndRef = useRef(null);
  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed z-50 bottom-8 right-8 w-[95vw] max-w-md bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-white/30"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-md border-b border-white/20">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
              <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              MoodBites Assistant
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl focus:outline-none">
              <FaTimes />
            </button>
          </div>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-br from-white/60 to-white/30 max-h-[500px] min-h-[250px]">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} {...msg} />
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* Input Area */}
          <form
            className="flex items-center gap-2 px-4 py-3 bg-white/60 backdrop-blur-md border-t border-white/20"
            onSubmit={e => { e.preventDefault(); onSend(); }}
          >
            <input
              type="text"
              className="flex-1 bg-white rounded-full px-4 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus={isOpen}
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, boxShadow: '0 0 0 4px #fbbf24' }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-indigo-400 text-white text-xl shadow-md focus:outline-none"
              onClick={onVoiceInput}
              aria-label="Voice input"
            >
              <FaMicrophone />
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-indigo-400 text-white text-xl shadow-md focus:outline-none"
              aria-label="Send message"
            >
              <FaPaperPlane />
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 