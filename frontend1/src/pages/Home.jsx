import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Helpers ---
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return date.toLocaleDateString(); 
  };

  const formatViews = (views) => {
    if (!views) return "0 views";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await api.get("/videos");
        let videoList = [];
        if (res.data?.data?.videos && Array.isArray(res.data.data.videos)) {
            videoList = res.data.data.videos;
        } else if (Array.isArray(res.data?.data)) {
            videoList = res.data.data;
        } else if (res.data?.data?.docs && Array.isArray(res.data.data.docs)) {
            videoList = res.data.data.docs;
        }
        setVideos(videoList);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load videos.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div className="text-center mt-20 text-white animate-pulse">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-20">Failed to load videos</div>;

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white p-6">
      
      {!Array.isArray(videos) || videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
             <h2 className="text-2xl font-bold">No videos found</h2>
             <Link to="/dashboard" className="text-purple-400 mt-2 hover:underline">Upload Video</Link>
        </div>
      ) : (
        /* --- FLEX CONTAINER --- */
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {videos.map((video) => (
            
            <Link 
                to={`/video/${video._id}`} 
                key={video._id} 
                /* 👇 ZABARDASTI SIZE FIX (Force Style) */
                style={{ width: "320px", minWidth: "300px", maxWidth: "320px", textDecoration: "none" }}
                className="group cursor-pointer flex flex-col gap-2"
            >
              
              {/* Thumbnail - Height Fixed */}
              <div style={{ width: "100%", height: "180px" }} className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700">
                  <img
                    src={video.thumbnail} 
                    alt={video.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                      {formatDuration(video.duration)}
                  </div>
              </div>

              {/* Info Section */}
              <div className="flex gap-3 items-start mt-1">
                {/* Avatar */}
                <div className="shrink-0">
                   <img 
                      src={video.owner?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                      alt="avatar"
                      style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                   />
                </div>
                
                {/* Details */}
                <div className="flex flex-col">
                  <h3 className="text-[16px] font-bold text-white leading-tight line-clamp-2" title={video.title}>
                      {video.title}
                  </h3>
                  
                  <div className="text-sm text-gray-400 mt-1">
                    <p className="hover:text-white transition-colors">
                        {video.owner?.username || "Unknown"}
                    </p>
                    <div className="flex items-center gap-1">
                        <span>{formatViews(video.views || 0)}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(video.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </Link>

          ))}
        </div>
      )}
    </div>
  );
}