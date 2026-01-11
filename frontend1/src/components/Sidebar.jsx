import React from "react";
import { NavLink, Link } from "react-router-dom";
import { 
  AiFillHome, 
  AiOutlineLike, 
  AiOutlineHistory, 
  AiOutlineVideoCamera, 
  AiOutlineFolder,
  AiOutlineUser,
  AiOutlineSetting // 👈 New Icon for Settings
} from "react-icons/ai"; 
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  // Navigation Items Array
  const navItems = [
    { name: "Home", path: "/", icon: <AiFillHome /> },
    { name: "Liked Videos", path: "/liked-videos", icon: <AiOutlineLike /> },
    { name: "History", path: "/history", icon: <AiOutlineHistory /> },
    { name: "My Content", path: "/dashboard", icon: <AiOutlineVideoCamera /> },
    { name: "Collections", path: "/collections", icon: <AiOutlineFolder /> },
    { name: "Subscribers", path: "/subscribers", icon: <AiOutlineUser /> },
  ];

  // 👇 Agar user login hai, to list mein "Settings" add kar do
  if (user) {
    navItems.push({ name: "Settings", path: "/edit-profile", icon: <AiOutlineSetting /> });
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-[#0F0F0F] border-r border-gray-800 h-screen fixed left-0 top-0 pt-16 z-40">
      
      <div className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {!user && (
        <div className="mt-auto p-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-400 mb-3">Sign in to like videos, comment, and subscribe.</p>
          <Link to="/login" className="border border-gray-600 text-blue-400 px-6 py-1.5 rounded-full text-sm font-bold hover:bg-gray-800">
              Sign in
          </Link>
        </div>
      )}
      
      <div className="p-4 text-xs text-gray-500 mt-auto">
         &copy; 2025 ChaiTube Clone
      </div>
    </div>
  );
}