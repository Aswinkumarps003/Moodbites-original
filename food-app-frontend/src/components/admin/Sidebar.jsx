import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  UsersIcon,
  CakeIcon,
  CalendarIcon,
  HeartIcon,
  BarChart2Icon,
  Cog6ToothIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: <HomeIcon /> },
  { name: "Users", path: "/admin/users", icon: <UsersIcon /> },
  { name: "Food Items", path: "/admin/dishes", icon: <CakeIcon /> },
  { name: "Meal Plans", path: "/admin/meal-plans", icon: <CalendarIcon /> },
  { name: "Emotion Insights", path: "/admin/emotion-insights", icon: <HeartIcon /> },
  { name: "Reports", path: "/admin/reports", icon: <BarChart2Icon /> },
  { name: "Settings", path: "/admin/settings", icon: <Cog6ToothIcon /> },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`h-screen fixed top-0 left-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 shadow-lg flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
      aria-label="Sidebar Navigation"
    >
      {/* Collapse/Expand Button */}
      <button
        className="absolute -right-4 top-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full shadow p-1 z-50 focus:outline-none"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <AnimatePresence initial={false}>
          {collapsed ? (
            <motion.span key="right" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 10, opacity: 0 }}>
              <ChevronRightIcon className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span key="left" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}>
              <ChevronLeftIcon className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      {/* Logo */}
      <div className={`flex items-center gap-2 px-6 py-6 font-extrabold text-2xl text-primary tracking-tight ${collapsed ? "justify-center" : ""}`}>
        <span className="inline-block w-8 h-8 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-full" />
        {!collapsed && <span className="dark:text-white">Food Admin</span>}
      </div>
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-900 text-gray-700 dark:text-gray-200 group ${
                isActive || location.pathname === item.path ? "bg-orange-100 dark:bg-orange-900 text-primary dark:text-orange-400 font-bold" : ""
              } ${collapsed ? "justify-center px-2" : ""}`
            }
            aria-label={item.name}
          >
            <span className="text-xl">{item.icon}</span>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>
      {/* Logout Button */}
      <div className="mt-auto mb-6 px-6">
        <button className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-all duration-200 ${collapsed ? "justify-center px-2" : ""}`}
          aria-label="Logout"
        >
          <LogOutIcon className="text-xl" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
} 