import React from "react";
import { motion } from "framer-motion";
import { FaCog } from "react-icons/fa";

const Settings = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-2 sm:p-6 max-w-xl w-full">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2 text-gray-900"><FaCog className="text-gray-400" /> Settings</h1>
      <p className="text-gray-500 mb-4 sm:mb-6">Manage admin dashboard settings.</p>
      <form className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 w-full">
        <div>
          <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Site Name</label>
          <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter site name" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Admin Email</label>
          <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter admin email" />
        </div>
        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition">Save Changes</button>
      </form>
    </motion.div>
  );
};

export default Settings; 