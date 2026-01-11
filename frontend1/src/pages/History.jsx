import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { FaTrash } from "react-icons/fa"; // Icon for better UI

export default function History() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const res = await api.get("/users/history");
        setVideos(res.data.data);
      } catch (error) {
        console.log("Error fetching history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  // ✅ CLEAR HISTORY FUNCTION
  const handleClearHistory = async () => {
    // 1. Confirmation Alert
    if (!window.confirm("Are you sure you want to clear your entire watch history?")) return;
    
    try {
        // 2. API Call
        await api.patch("/users/history/clear");
        
        // 3. UI Update (List khali kar do)
        setVideos([]); 
        alert("History Cleared Successfully! 🗑️");
    } catch (error) {
        console.log("Error clearing history", error);
        alert("Failed to clear history.");
    }
  };

  if (loading) return <div className="text-center mt-20 text-white animate-pulse">Loading History...</div>;

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white p-4 lg:p-8">
      
      {/* HEADER WITH CLEAR BUTTON */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold">Watch History</h1>
        
        {/* Sirf tab dikhao jab history mein videos hon */}
        {videos.length > 0 && (
            <button 
                onClick={handleClearHistory}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2"
            >
                <FaTrash /> Clear History
            </button>
        )}
      </div>

      {videos.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">You haven't watched any videos yet.</p>
          <Link to="/" className="text-purple-500 hover:text-purple-400 font-semibold mt-2 inline-block">
            Explore Videos
          </Link>
        </div>
      ) : (
        /* --- HISTORY LIST --- */
        <div className="flex flex-col gap-4">
          {videos.map((video) => {
            if (!video) return null;

            return (
              <Link key={video._id} to={`/video/${video._id}`} className="block group">
                <div className="bg-[#1E1E1E] rounded-xl overflow-hidden hover:bg-[#2a2a2a] transition flex flex-col sm:flex-row h-auto sm:h-44 border border-gray-800 relative">
                    
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-72 h-48 sm:h-full flex-shrink-0">
                        <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                            {Number(video.duration).toFixed(2)}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col justify-center w-full">
                        <h3 className="font-bold text-xl mb-2 group-hover:text-purple-400 line-clamp-2">
                            {video.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                             <p className="hover:text-white transition">{video.owner?.username || "Unknown Channel"}</p>
                             <span>•</span>
                             <p>{video.views} views</p>
                        </div>
                        <p className="text-gray-500 text-xs line-clamp-2 sm:line-clamp-3">
                             {video.description}
                        </p>
                    </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}