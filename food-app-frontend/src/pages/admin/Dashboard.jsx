import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import DashboardCards from "../../components/admin/DashboardCards";
import Charts from "../../components/admin/Charts";
import ActivityFeed from "../../components/admin/ActivityFeed";

export default function Dashboard() {
  // Theme state (light/dark)
  const [theme, setTheme] = useState("light");
  const handleToggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className={`min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-200 ${theme === "dark" ? "dark" : ""}`}>
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 ml-0 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <Navbar onToggleTheme={handleToggleTheme} theme={theme} />
        {/* Page Content with animation */}
        <motion.main
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8 flex flex-col gap-8"
        >
          {/* Dashboard Cards */}
          <DashboardCards />
          {/* Charts */}
          <Charts />
          {/* Recent Activity Feed */}
          <ActivityFeed />
        </motion.main>
      </div>
    </div>
  );
} 