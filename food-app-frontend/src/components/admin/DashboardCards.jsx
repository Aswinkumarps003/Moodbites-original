import React from "react";
import { motion } from "framer-motion";
import { UsersIcon, CakeIcon, CalendarIcon, HeartIcon } from "lucide-react";

const cards = [
  {
    label: "Total Users",
    value: 1240,
    icon: <UsersIcon className="text-blue-500 bg-blue-100 dark:bg-blue-900 p-2 rounded-full w-10 h-10" />,
    color: "from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-900",
  },
  {
    label: "Food Items Tracked",
    value: 320,
    icon: <CakeIcon className="text-orange-500 bg-orange-100 dark:bg-orange-900 p-2 rounded-full w-10 h-10" />,
    color: "from-orange-400 to-orange-600 dark:from-orange-700 dark:to-orange-900",
  },
  {
    label: "Active Meal Plans",
    value: 87,
    icon: <CalendarIcon className="text-green-500 bg-green-100 dark:bg-green-900 p-2 rounded-full w-10 h-10" />,
    color: "from-green-400 to-green-600 dark:from-green-700 dark:to-green-900",
  },
  {
    label: "Emotion-Based Suggestions Today",
    value: 42,
    icon: <HeartIcon className="text-pink-500 bg-pink-100 dark:bg-pink-900 p-2 rounded-full w-10 h-10" />,
    color: "from-pink-400 to-pink-600 dark:from-pink-700 dark:to-pink-900",
  },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 80 }}
          className={`relative overflow-hidden rounded-2xl shadow-xl p-6 flex flex-col items-start justify-center bg-gradient-to-tr ${card.color} text-white backdrop-blur-xl border border-white/30 dark:border-gray-800`}
          tabIndex={0}
          aria-label={card.label}
        >
          <div className="mb-3">{card.icon}</div>
          <div className="text-3xl font-extrabold mb-1 tracking-tight">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              {card.value}
            </motion.span>
          </div>
          <div className="text-white/80 dark:text-gray-200 font-medium text-sm uppercase tracking-wider">{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
} 