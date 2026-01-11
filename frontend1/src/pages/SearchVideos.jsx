import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axiosInstance";

export default function SearchVideos() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query"); // URL se ?query=... nikalo
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        // Backend API call: /videos?query=someText
        const res = await api.get(`/videos?query=${query}`);
        setVideos(res.data.data.videos); // Backend pagination format (videos array)
      } catch (error) {
        console.log("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]); // Jab bhi query badlegi, dobara search hoga

  if (loading) return <div className="text-center mt-20 text-white animate-pulse">Searching for "{query}"...</div>;

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white p-4 lg:p-8">
      <h1 className="text-xl font-bold mb-6">
        Search Results for: <span className="text-purple-500">"{query}"</span>
      </h1>

      {videos.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p>No videos found matching your search.</p>
        </div>
      ) : (
        /* --- LIST LAYOUT (Horizontal Cards) --- */
        <div className="flex flex-col gap-4 max-w-5xl">
          {videos.map((video) => (
            <Link 
              to={`/video/${video._id}`} 
              key={video._id} 
              className="flex flex-col sm:flex-row gap-4 cursor-pointer hover:bg-[#1E1E1E] p-2 rounded-xl transition group"
            >
              
              {/* Thumbnail */}
              <div className="relative w-full sm:w-[360px] aspect-video shrink-0 rounded-xl overflow-hidden bg-gray-800">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-1.5 py-0.5 rounded text-white">
                  {formatDuration(video.duration)}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2 py-1 flex-1">
                <h3 className="text-lg md:text-xl font-semibold line-clamp-2 group-hover:text-purple-400">
                  {video.title}
                </h3>
                
                <p className="text-xs text-gray-400">
                   {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-2 my-1">
                   <img src={video.owner?.avatar} className="w-6 h-6 rounded-full" alt="" />
                   <p className="text-sm text-gray-400 hover:text-white transition">
                      {video.owner?.username}
                   </p>
                </div>

                <p className="text-sm text-gray-500 line-clamp-1 md:line-clamp-2">
                  {video.description}
                </p>
              </div>

            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function
const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};