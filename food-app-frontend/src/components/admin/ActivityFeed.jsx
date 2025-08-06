import React from "react";
import { motion } from "framer-motion";

const activities = [
  { user: "John Doe", avatar: "https://randomuser.me/api/portraits/men/32.jpg", action: "updated profile", time: "2m ago" },
  { user: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/44.jpg", action: "created a meal plan", time: "10m ago" },
  { user: "Admin", avatar: "https://randomuser.me/api/portraits/men/31.jpg", action: "added new food item", time: "1h ago" },
];

export default function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/40 dark:border-gray-800 rounded-2xl shadow-xl p-6 mt-8"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Activity</h2>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {activities.map((a, i) => (
          <motion.li
            key={a.user + a.time}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.4, type: "spring" }}
            className="flex items-center gap-4 py-3"
          >
            <img src={a.avatar} alt={a.user} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 shadow" />
            <div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{a.user}</span> <span className="text-gray-500 dark:text-gray-400">{a.action}</span>
              <div className="text-xs text-gray-400 dark:text-gray-500">{a.time}</div>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
} 