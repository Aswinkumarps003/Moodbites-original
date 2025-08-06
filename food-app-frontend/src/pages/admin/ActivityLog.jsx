import React from "react";
import { motion } from "framer-motion";
import { FaHistory } from "react-icons/fa";

const logs = [
  { date: "2024-06-01", text: "Admin logged in" },
  { date: "2024-06-01", text: "User Jane Smith updated profile" },
  { date: "2024-06-01", text: "Order #1002 marked as completed" },
];

const ActivityLog = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-2 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2 text-gray-900"><FaHistory className="text-purple-400" /> Activity Log</h1>
      <p className="text-gray-500 mb-4 sm:mb-6">Recent admin and user activities.</p>
      <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-full">
        <ul className="space-y-2 sm:space-y-3">
          {logs.map((log, i) => (
            <motion.li
              key={log.text}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4, type: "spring" }}
              className="flex items-center gap-2 text-gray-900 text-sm sm:text-base"
            >
              <span className="font-semibold">[{log.date}]</span> <span className="text-gray-500">{log.text}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ActivityLog; 