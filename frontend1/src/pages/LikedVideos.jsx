import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";

export default function LikedVideos() {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const res = await api.get("/likes/videos"); // Backend endpoint
        // Backend se data { _id: likeId, video: { ...videoDetails } } format mein aata hai
        setLikedVideos(res.data.data);
      } catch (error) {
        console.log("Error fetching liked videos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  if (loading) return <div className="text-center mt-20 text-white animate-pulse">Loading Liked Videos...</div>;

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white p-4 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>

      {likedVideos.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p>No liked videos yet.</p>
        </div>
      ) : (
        /* --- LIST LAYOUT (DevUI style: Left Image, Right Text) --- */
        <div className="flex flex-col gap-4 max-w-4xl">
          {likedVideos.map((item) => {
            // Kabhi kabhi video delete ho jati hai par like reh jata hai, isliye check zaroori hai
            const video = item.video; 
            if (!video) return null;

            return (
              <Link 
                to={`/video/${video._id}`} 
                key={item._id} 
                className="flex flex-col sm:flex-row gap-4 bg-[#0F0F0F] hover:bg-[#1E1E1E] p-2 rounded-xl transition cursor-pointer group"
              >
                
                {/* Thumbnail */}
                <div className="relative w-full sm:w-48 h-28 shrink-0 rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded">
                    {formatDuration(video.duration)}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 py-1">
                  <h3 className="text-lg font-semibold line-clamp-2 leading-tight group-hover:text-purple-400">
                    {video.title}
                  </h3>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                     <span>{video.owner?.username || "Unknown"}</span>
                     <span>•</span>
                     <span>{video.views} views</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {video.description}
                  </p>
                </div>

              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper for duration
const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};