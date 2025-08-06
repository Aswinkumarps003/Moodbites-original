import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellIcon,
  SearchIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";

const notifications = [
  { id: 1, text: "Order #1001 completed" },
  { id: 2, text: "New user registered" },
  { id: 3, text: "Meal plan updated" },
];

export default function Navbar({ onToggleTheme, theme }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center px-6 py-3 gap-4">
      {/* Search Bar */}
      <div className="flex-1 flex items-center max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none transition"
            aria-label="Search"
          />
          <SearchIcon className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-5 h-5" />
        </div>
      </div>
      {/* Notification Bell */}
      <div className="relative" ref={notifRef}>
        <button
          className="relative p-2 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900 transition focus:outline-none"
          aria-label="Notifications"
          onClick={() => setNotifOpen((o) => !o)}
        >
          <BellIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
        </button>
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
            >
              <div className="p-4 border-b font-bold text-gray-700 dark:text-gray-200 dark:border-gray-800">Notifications</div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((n) => (
                  <li key={n.id} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900 cursor-pointer">{n.text}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Theme Toggle */}
      <button
        className="ml-2 p-2 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900 transition focus:outline-none"
        aria-label="Toggle theme"
        onClick={onToggleTheme}
      >
        {theme === "dark" ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-500" />}
      </button>
      {/* Profile Dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900 transition focus:outline-none"
          aria-label="Admin profile menu"
          onClick={() => setProfileOpen((o) => !o)}
        >
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Admin Avatar"
            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 shadow"
          />
          <span className="font-semibold text-gray-700 dark:text-gray-200 hidden md:inline">Admin</span>
          <ChevronDownIcon className="w-4 h-4 text-gray-400 dark:text-gray-300" />
        </button>
        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
            >
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                <li className="px-4 py-3 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900 cursor-pointer">
                  <UserIcon className="w-4 h-4" /> Profile
                </li>
                <li className="px-4 py-3 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900 cursor-pointer">
                  <LogOutIcon className="w-4 h-4 text-red-500" /> Logout
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
} 