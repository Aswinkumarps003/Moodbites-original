import React from "react";
import { motion } from "framer-motion";
import { FaChartBar } from "react-icons/fa";

const Analytics = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-2 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2 text-gray-900"><FaChartBar className="text-blue-400" /> Analytics</h1>
      <p className="text-gray-500 mb-4 sm:mb-6">Analytics summary and charts will appear here.</p>
      <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[200px] w-full max-w-full">
        <span className="text-3xl sm:text-5xl text-gray-300 mb-2"><FaChartBar /></span>
        <span className="text-gray-400 text-sm sm:text-base">No analytics data yet. Connect your data source.</span>
      </div>
    </motion.div>
  );
};

export default Analytics; 