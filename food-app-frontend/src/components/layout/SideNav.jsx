import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/admin" },
  { name: "Users", path: "/admin/users" },
  { name: "Dishes", path: "/admin/dishes" },
  { name: "Analytics", path: "/admin/analytics" },
  { name: "Settings", path: "/admin/settings" },
];

const SideNav = () => (
  <aside className="bg-gray-900 text-white w-56 min-h-screen p-4 flex flex-col gap-2">
    <div className="text-2xl font-bold mb-8">Admin</div>
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `px-4 py-2 rounded hover:bg-gray-700 transition ${isActive ? "bg-gray-800" : ""}`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default SideNav; 