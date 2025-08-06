import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";
import { FaUsers, FaUtensils, FaChartPie, FaCog } from "react-icons/fa";

const stats = [
  { label: "Total Users", value: 1240, icon: <FaUsers className="text-blue-500 text-3xl bg-blue-100 p-2 rounded-full shadow" /> },
  { label: "Total Dishes", value: 320, icon: <FaUtensils className="text-orange-500 text-3xl bg-orange-100 p-2 rounded-full shadow" /> },
  { label: "Active Orders", value: 87, icon: <FaChartPie className="text-green-500 text-3xl bg-green-100 p-2 rounded-full shadow" /> },
  { label: "Settings", value: "-", icon: <FaCog className="text-gray-500 text-3xl bg-gray-100 p-2 rounded-full shadow" /> },
];

const lineData = [
  { name: "Jan", users: 400, dishes: 240 },
  { name: "Feb", users: 300, dishes: 139 },
  { name: "Mar", users: 200, dishes: 980 },
  { name: "Apr", users: 278, dishes: 390 },
  { name: "May", users: 189, dishes: 480 },
  { name: "Jun", users: 239, dishes: 380 },
  { name: "Jul", users: 349, dishes: 430 },
];

const pieData = [
  { name: "Pizza", value: 400 },
  { name: "Sushi", value: 300 },
  { name: "Tacos", value: 300 },
  { name: "Other", value: 200 },
];

const COLORS = ["#6366f1", "#f59e42", "#34d399", "#a78bfa"];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: "spring", stiffness: 80 } }),
};

const AdminDashboard = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated SVG background with gradients and shapes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none animate-pulse-slow" aria-hidden fill="none">
        <defs>
          <linearGradient id="bg-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f3f4f6" />
            <stop offset="1" stopColor="#e0e7ff" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-gradient)" />
        <circle cx="80%" cy="10%" r="140" fill="#6366f1" fillOpacity="0.10" className="animate-float" />
        <circle cx="10%" cy="90%" r="100" fill="#f59e42" fillOpacity="0.10" className="animate-float-reverse" />
        <ellipse cx="50%" cy="50%" rx="180" ry="60" fill="#a78bfa" fillOpacity="0.07" />
      </svg>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-lg md:text-xl font-bold text-black mb-6 text-left relative z-10 tracking-tight"
      >
        Admin Dashboard
      </motion.h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12 relative z-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 rgba(99,102,241,0.15)" }}
            className="backdrop-blur-2xl bg-white/80 border border-white/50 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center group relative overflow-hidden transition-all duration-300 hover:bg-gradient-to-tr hover:from-primary/20 hover:to-orange-200"
          >
            <div className="mb-4 group-hover:scale-110 transition-transform duration-200">{stat.icon}</div>
            <div className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight drop-shadow-lg">{stat.value}</div>
            <div className="text-gray-500 font-semibold text-base uppercase tracking-widest">{stat.label}</div>
            <span className="absolute right-6 top-6 w-3 h-3 rounded-full bg-gradient-to-tr from-primary to-orange-400 animate-pulse opacity-40" />
          </motion.div>
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          whileHover={{ scale: 1.02, boxShadow: "0 8px 32px 0 rgba(99,102,241,0.10)" }}
          className="backdrop-blur-2xl bg-white/90 border border-white/50 rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3 tracking-tight">
            <FaUsers className="text-blue-400 text-2xl" /> User & Dish Growth
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={4} dot={{ r: 6 }} />
              <Line type="monotone" dataKey="dishes" stroke="#f59e42" strokeWidth={4} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          whileHover={{ scale: 1.02, boxShadow: "0 8px 32px 0 rgba(245,158,66,0.10)" }}
          className="backdrop-blur-2xl bg-white/90 border border-white/50 rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3 tracking-tight">
            <FaChartPie className="text-green-400 text-2xl" /> Popular Dishes
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#6366f1"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
