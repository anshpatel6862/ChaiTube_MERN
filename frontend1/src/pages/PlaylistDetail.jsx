import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const { user } = useAuth();
  
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal States for Adding Video
  const [showModal, setShowModal] = useState(false);
  const [myVideos, setMyVideos] = useState([]);

  // 1. Playlist Detail Fetch karo
  const fetchPlaylist = async () => {
    try {
      const res = await api.get(`/playlist/${playlistId}`);
      setPlaylist(res.data.data);
    } catch (error) {
      console.log("Error fetching playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  // 2. User ke Uploaded Videos lao (Modal ke liye)
  const fetchMyVideos = async () => {
    if (!user) return;
    try {
      // Hum wahi API use kar rahe hain jo Video upload hone par banti hai
      // Filter: Sirf meri videos chahiye
      const res = await api.get(`/videos?userId=${user._id}`);
      setMyVideos(res.data.data.videos); // Backend response structure ke hisab se .videos
    } catch (error) {
      console.log("Error fetching my videos:", error);
    }
  };

  // 3. Video ko Playlist me Add karo
  const addVideoToPlaylist = async (videoId) => {
    try {
      // Backend Route: /playlist/add/:videoId/:playlistId
      await api.patch(`/playlist/add/${videoId}/${playlistId}`);
      alert("Video added to playlist! ✅");
      fetchPlaylist(); // List refresh karo
    } catch (error) {
      console.log("Error adding video:", error);
      alert("Could not add video. Check console.");
    }
  };

  // 4. Video Remove karo
  const removeVideoFromPlaylist = async (videoId) => {
    if(!window.confirm("Remove this video from playlist?")) return;
    try {
        await api.patch(`/playlist/remove/${videoId}/${playlistId}`);
        fetchPlaylist();
    } catch (error) {
        console.log("Error removing video", error);
    }
  }

  if (loading) return <div className="text-center mt-20 text-white">Loading...</div>;
  if (!playlist) return <div className="text-center mt-20 text-white">Playlist not found</div>;

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white p-4 lg:p-8 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-[#1E1E1E] p-6 rounded-xl border border-gray-800">
        <div>
            <h1 className="text-3xl font-bold text-purple-500 mb-2">{playlist.name}</h1>
            <p className="text-gray-400">{playlist.description}</p>
            <p className="text-gray-600 text-sm mt-2">
                Total Videos: {playlist.videos?.length || 0}
            </p>
        </div>
        
        <button 
            onClick={() => {
                setShowModal(true);
                fetchMyVideos();
            }}
            className="mt-4 md:mt-0 bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition flex items-center gap-2"
        >
            <FaPlus /> Add Videos
        </button>
      </div>

      {/* --- VIDEOS LIST INSIDE PLAYLIST --- */}
      <div className="grid grid-cols-1 gap-4">
        {playlist.videos && playlist.videos.length > 0 ? (
            playlist.videos.map((video) => (
                <div key={video._id} className="flex flex-col sm:flex-row bg-[#1E1E1E] p-3 rounded-lg border border-gray-800 hover:bg-[#252525] transition items-center">
                     {/* Thumbnail */}
                     <Link to={`/video/${video._id}`} className="w-full sm:w-40 h-24 flex-shrink-0 rounded overflow-hidden relative">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                     </Link>

                     {/* Details */}
                     <div className="flex-1 ml-0 sm:ml-4 mt-2 sm:mt-0 w-full">
                        <h3 className="font-bold text-lg line-clamp-1">{video.title}</h3>
                        <p className="text-gray-400 text-sm">{video.owner?.username}</p>
                     </div>

                     {/* Remove Button */}
                     <button 
                        onClick={() => removeVideoFromPlaylist(video._id)}
                        className="text-red-500 p-2 hover:bg-red-500/10 rounded-full ml-auto"
                        title="Remove from playlist"
                     >
                        <FaTrash />
                     </button>
                </div>
            ))
        ) : (
            <p className="text-center text-gray-500 mt-10">No videos in this playlist yet.</p>
        )}
      </div>

      {/* --- MODAL: SELECT MY VIDEOS --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E1E1E] p-6 rounded-lg w-full max-w-2xl border border-gray-700 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Select Video to Add</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">Close</button>
                </div>

                <div className="overflow-y-auto flex-1 space-y-3 pr-2">
                    {myVideos.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10">No uploaded videos found.</p>
                    ) : (
                        myVideos.map((vid) => (
                            <div key={vid._id} className="flex items-center justify-between bg-black p-3 rounded border border-gray-800">
                                <div className="flex items-center gap-3">
                                    <img src={vid.thumbnail} className="w-16 h-10 object-cover rounded" />
                                    <div>
                                        <p className="font-semibold text-sm line-clamp-1">{vid.title}</p>
                                        <p className="text-xs text-gray-500">{Number(vid.duration).toFixed(2)} mins</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => addVideoToPlaylist(vid._id)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded transition"
                                >
                                    Add +
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
}