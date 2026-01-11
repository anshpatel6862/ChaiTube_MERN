import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineVideoCamera, AiOutlineMenu } from "react-icons/ai"; // Icons import
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Search Handle Function
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`); // Search page par le jayega
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-[#0F0F0F] border-b border-gray-800 z-50 flex items-center justify-between px-4 lg:px-6">
      
      {/* --- LEFT: Logo --- */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Icon (Sirf mobile pe dikhega) */}
        <button className="md:hidden text-white text-2xl">
            <AiOutlineMenu />
        </button>
        
        <Link to="/" className="flex items-center gap-1">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            ▶
          </div>
          <span className="text-white text-xl font-bold tracking-tight">ChaiTube</span>
        </Link>
      </div>

      {/* --- CENTER: Search Bar --- */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[600px] mx-4">
        <div className="flex w-full">
            <input 
                type="text" 
                placeholder="Search" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#121212] border border-gray-700 rounded-l-full px-4 py-2 text-white outline-none focus:border-blue-500 placeholder-gray-500"
            />
            <button type="submit" className="bg-[#222] border border-l-0 border-gray-700 px-5 rounded-r-full text-white hover:bg-gray-700 transition">
                <AiOutlineSearch className="text-xl" />
            </button>
        </div>
      </form>

      {/* --- RIGHT: User / Login --- */}
      <div className="flex items-center gap-4">
        
        {/* Search Icon for Mobile (Sirf mobile pe dikhega) */}
        <button className="md:hidden text-white text-xl">
             <AiOutlineSearch />
        </button>

        {user ? (
          // AGAR LOGIN HAI
          <>
            <Link to="/dashboard" className="text-white text-2xl hover:text-purple-400" title="Upload Video">
                <AiOutlineVideoCamera />
            </Link>
            
            <div className="flex items-center gap-3 cursor-pointer group relative">
                <img 
                    src={user?.avatar} 
                    alt="avatar" 
                    className="w-8 h-8 rounded-full object-cover border border-gray-700"
                />
                {/* Simple Dropdown for Logout */}
                <div className="absolute right-0 top-10 bg-[#222] border border-gray-700 rounded-lg shadow-lg p-2 w-32 hidden group-hover:block">
                    <button 
                        onClick={logout} 
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
          </>
        ) : (
          // AGAR LOGIN NAHI HAI
          <div className="flex gap-2">
             <Link to="/login" className="text-blue-400 font-semibold px-4 py-1.5 border border-gray-700 rounded-full hover:bg-blue-400/10 text-sm">
                Log in
             </Link>
             <Link to="/register" className="bg-purple-600 text-white font-semibold px-4 py-1.5 rounded-full hover:bg-purple-700 text-sm">
                Sign up
             </Link>
          </div>
        )}
      </div>

    </nav>
  );
}