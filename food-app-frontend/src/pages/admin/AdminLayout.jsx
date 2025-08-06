import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaBars, FaTimes, FaUsers, FaUtensils, FaChartPie, FaCog, FaTachometerAlt, FaClipboardList, FaBell, FaUserCircle, FaHistory } from "react-icons/fa";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
  { name: "Users", path: "/admin/users", icon: <FaUsers /> },
  { name: "Dishes", path: "/admin/dishes", icon: <FaUtensils /> },
  { name: "Orders", path: "/admin/orders", icon: <FaClipboardList /> },
  { name: "Analytics", path: "/admin/analytics", icon: <FaChartPie /> },
  { name: "Notifications", path: "/admin/notifications", icon: <FaBell /> },
  { name: "Profile", path: "/admin/profile", icon: <FaUserCircle /> },
  { name: "Activity Log", path: "/admin/activity-log", icon: <FaHistory /> },
  { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Mobile Hamburger Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full flex items-center z-50 bg-gradient-to-r from-white/90 to-gray-100/80 border-b border-gray-200 shadow-sm h-14 px-2" style={{minHeight:'3.5rem'}}>
        <button
          className="bg-white border border-gray-200 rounded-full p-2 shadow-lg mr-2"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <FaBars className="w-6 h-6 text-gray-700" />
        </button>
        <span className="font-bold text-gray-700 text-lg ml-1">Menu</span>
      </div>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 shadow-lg z-40 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:block md:translate-x-0`}
        style={{ minWidth: '16rem' }}
      >
        {/* Close button on mobile */}
        <button
          className="md:hidden absolute top-4 right-4 bg-white border border-gray-200 rounded-full p-2 shadow"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <FaTimes className="w-5 h-5 text-gray-700" />
        </button>
        <div className="text-2xl font-extrabold text-gray-900 mb-10 tracking-tight">Admin Panel</div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-100 text-gray-700 ${isActive ? "bg-gray-100 text-primary font-bold" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      {/* Main Content */}
      <div className="md:ml-64 ml-0 pt-14 md:pt-0 p-2 sm:p-4 md:p-10 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout; 