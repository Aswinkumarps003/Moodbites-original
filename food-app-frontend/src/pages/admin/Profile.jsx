import React from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-2 sm:p-6 max-w-xl w-full">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2 text-gray-900"><FaUserCircle className="text-blue-400" /> Profile</h1>
      <p className="text-gray-500 mb-4 sm:mb-6">Update your admin profile information.</p>
      <form className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 w-full">
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin Avatar" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white text-gray-900 shadow" />
          <span className="font-semibold text-base sm:text-lg text-gray-900">Admin Name</span>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Name</label>
          <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Admin Name" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Email</label>
          <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="admin@example.com" />
        </div>
        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition">Update Profile</button>
      </form>
    </motion.div>
  );
};

export default Profile; 