import React, { useState, useCallback } from 'react';
import ChatWidgetFloatingIcon from './ChatWidgetFloatingIcon';
import ChatWindow from './ChatWindow';

const DUMMY_BOT_REPLIES = [
  "Hello! How can I help you today?",
  "I'm here to assist you with recipes, fridge scanning, and more!",
  "Try asking me about food recommendations or how to use the app."
];

export default function ChatWidgetProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: DUMMY_BOT_REPLIES[0], timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [botReplyIdx, setBotReplyIdx] = useState(1);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(msgs => [
      ...msgs,
      { sender: 'user', text: input, timestamp: now },
      { sender: 'bot', text: DUMMY_BOT_REPLIES[botReplyIdx % DUMMY_BOT_REPLIES.length], timestamp: now }
    ]);
    setInput('');
    setBotReplyIdx(idx => idx + 1);
  }, [input, botReplyIdx]);

  const handleVoiceInput = useCallback(() => {
    setInput('');
    // Placeholder: could show a toast or animation
  }, []);

  return (
    <>
      <ChatWidgetFloatingIcon onClick={handleOpen} isOpen={isOpen} />
      <ChatWindow
        isOpen={isOpen}
        onClose={handleClose}
        messages={messages}
        onSend={handleSend}
        onVoiceInput={handleVoiceInput}
        input={input}
        setInput={setInput}
      />
    </>
  );
} 