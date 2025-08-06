import React from "react";
import { motion } from "framer-motion";

const orders = [
  { id: "#1001", customer: "John Doe", avatar: "https://randomuser.me/api/portraits/men/32.jpg", status: "Completed", total: "$45.00" },
  { id: "#1002", customer: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/44.jpg", status: "Pending", total: "$32.50" },
];

const statusColors = {
  Completed: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  Pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
};

const Orders = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Orders</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">View and manage all customer orders.</p>
      <div className="backdrop-blur bg-white border border-gray-200 rounded-2xl shadow p-2 sm:p-6 text-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] divide-y divide-gray-200 text-base sm:text-lg rounded-xl overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-base font-bold text-gray-900 uppercase tracking-wider">Order ID</th>
                <th className="px-4 sm:px-6 py-4 text-left text-base font-bold text-gray-900 uppercase tracking-wider">Customer</th>
                <th className="px-4 sm:px-6 py-4 text-left text-base font-bold text-gray-900 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-4 text-left text-base font-bold text-gray-900 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4, type: "spring" }}
                  className="hover:bg-gray-100 transition"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{order.id}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img src={order.avatar} alt={order.customer} className="w-10 h-10 rounded-full border-2 border-white text-gray-900 shadow" />
                    <span className="text-gray-800 text-gray-900">{order.customer}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200`}>{order.status}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-700 text-gray-900 font-bold">{order.total}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Orders; 