import React from "react";
import { motion } from "framer-motion";

const AdminNotFound = () => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-gradient-to-br from-orange-50 to-blue-100 rounded-2xl shadow-2xl p-8">
      {/* Fun SVG illustration */}
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="mb-6">
        <circle cx="60" cy="60" r="58" fill="#f59e42" fillOpacity="0.12" stroke="#6366f1" strokeWidth="4" />
        <ellipse cx="60" cy="80" rx="32" ry="12" fill="#6366f1" fillOpacity="0.10" />
        <circle cx="60" cy="54" r="28" fill="#fff" stroke="#6366f1" strokeWidth="2" />
        <ellipse cx="60" cy="54" rx="18" ry="10" fill="#f59e42" fillOpacity="0.15" />
        <circle cx="48" cy="50" r="4" fill="#6366f1" />
        <circle cx="72" cy="50" r="4" fill="#6366f1" />
        <rect x="52" y="62" width="16" height="6" rx="3" fill="#6366f1" fillOpacity="0.2" />
      </svg>
      <h1 className="text-6xl font-extrabold text-primary mb-4 drop-shadow-lg">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</p>
      <p className="text-gray-500 mb-8">Sorry, the admin page you're looking for does not exist.</p>
      <a href="/admin" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-orange-600 transition text-lg">Return to Dashboard</a>
    </motion.div>
  );
};

export default AdminNotFound; 