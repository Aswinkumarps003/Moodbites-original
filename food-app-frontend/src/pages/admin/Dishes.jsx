import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const dishes = [
  { name: "Pizza", cuisine: "Italian", rating: 4.8, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=facearea&w=80&h=80&q=80" },
  { name: "Sushi", cuisine: "Japanese", rating: 4.7, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=facearea&w=80&h=80&q=80" },
];

const cuisineColors = {
  Italian: "bg-red-100 text-red-700",
  Japanese: "bg-yellow-100 text-yellow-700",
};

const Dishes = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Dishes</h1>
      <p className="text-gray-500 mb-6">Manage all dishes and their details.</p>
      <div className="backdrop-blur bg-white border border-gray-200 rounded-2xl shadow p-2 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] divide-y divide-gray-200 text-base sm:text-lg rounded-xl overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-base font-bold text-gray-900 uppercase tracking-wider">Dish</th>
                <th className="px-4 sm:px-6 py-4 text-left text-base font-bold text-gray-900 uppercase tracking-wider">Cuisine</th>
                <th className="px-4 sm:px-6 py-4 text-left text-base font-bold text-gray-900 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish, i) => (
                <motion.tr
                  key={dish.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4, type: "spring" }}
                  className="hover:bg-gray-100 transition"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img src={dish.image} alt={dish.name} className="w-10 h-10 rounded-full border-2 border-white text-gray-900 shadow" />
                    <span className="font-semibold text-gray-900">{dish.name}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200 ${cuisineColors[dish.cuisine]}`}>{dish.cuisine}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap flex items-center gap-1">
                    <span className="font-bold text-gray-900">{dish.rating}</span>
                    <FaStar className="text-yellow-400" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Dishes; 