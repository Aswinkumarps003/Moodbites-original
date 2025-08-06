import React from "react";
import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";

const notifications = [
  { status: "success", text: "Order #1001 has been completed." },
  { status: "warning", text: "Order #1002 is pending payment." },
];

const statusColors = {
  success: "bg-green-400",
  warning: "bg-yellow-400",
};

const Notifications = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-2 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2 text-gray-900"><FaBell className="text-yellow-400" /> Notifications</h1>
      <p className="text-gray-500 mb-4 sm:mb-6">Latest system and order notifications.</p>
      <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-full">
        <ul className="space-y-3 sm:space-y-4">
          {notifications.map((n, i) => (
            <motion.li
              key={n.text}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4, type: "spring" }}
              className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              <span className={`inline-block w-3 h-3 rounded-full ${statusColors[n.status]}`}></span>
              <span className="text-gray-900">{n.text}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Notifications; 