import React from "react";
import { motion } from "framer-motion";

const users = [
  { name: "John Doe", email: "john@example.com", role: "Admin", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Jane Smith", email: "jane@example.com", role: "User", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
];

const roleColors = {
  Admin: "bg-blue-100 text-blue-700",
  User: "bg-green-100 text-green-700",
};

const Users = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Users</h1>
      <p className="text-gray-500 mb-6">Manage all registered users and their roles.</p>
      <div className="backdrop-blur bg-white border border-gray-200 rounded-2xl shadow p-2 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] divide-y divide-gray-200 text-base sm:text-lg rounded-xl overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-base font-bold text-gray-900 uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-4 text-left text-base font-bold text-gray-900 uppercase tracking-wider">Email</th>
                <th className="px-4 sm:px-6 py-4 text-left text-base font-bold text-gray-900 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr
                  key={user.email}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4, type: "spring" }}
                  className="hover:bg-gray-100 transition"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white text-gray-900 shadow" />
                    <span className="font-semibold text-gray-900">{user.name}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900">{user.email}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200 ${roleColors[user.role]}`}>{user.role}</span>
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

export default Users; 