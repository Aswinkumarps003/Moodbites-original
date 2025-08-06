import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import { HeartIcon, TrendingUpIcon, BarChart2Icon } from "lucide-react";

const pieData = [
  { name: "Happy", value: 400 },
  { name: "Sad", value: 300 },
  { name: "Excited", value: 300 },
  { name: "Neutral", value: 200 },
];
const pieColors = ["#6366f1", "#f59e42", "#34d399", "#a78bfa"];

const lineData = [
  { day: "Mon", recs: 120 },
  { day: "Tue", recs: 210 },
  { day: "Wed", recs: 180 },
  { day: "Thu", recs: 250 },
  { day: "Fri", recs: 300 },
  { day: "Sat", recs: 200 },
  { day: "Sun", recs: 170 },
];

const barData = [
  { plan: "Keto", engagement: 80 },
  { plan: "Vegan", engagement: 120 },
  { plan: "Paleo", engagement: 60 },
  { plan: "Mediterranean", engagement: 150 },
];

export default function Charts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/40 dark:border-gray-800 rounded-2xl shadow-xl p-6 flex flex-col items-center"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <HeartIcon className="text-pink-400" /> User Emotion Distribution
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/40 dark:border-gray-800 rounded-2xl shadow-xl p-6 flex flex-col items-center"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <TrendingUpIcon className="text-blue-400" /> Daily Recommendations Trend
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="recs" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/40 dark:border-gray-800 rounded-2xl shadow-xl p-6 flex flex-col items-center"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <BarChart2Icon className="text-green-400" /> Meal Plan Engagement
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="plan" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Legend />
            <Bar dataKey="engagement" fill="#34d399" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
} 