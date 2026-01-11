import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { 
    FaVideo, 
    FaEye, 
    FaUsers, 
    FaHeart, 
    FaEdit, 
    FaTrash, 
    FaPlus, 
    FaCloudUploadAlt, 
    FaTimes,
    FaCog // Settings icon (Optional)
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- MODAL STATES ---
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null); // For Edit
  const [uploading, setUploading] = useState(false);

  // --- FORM STATES ---
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      const statsRes = await api.get("/dashboard/stats");
      setStats(statsRes.data.data);

      const videosRes = await api.get("/dashboard/videos");
      setVideos(videosRes.data.data);
    } catch (error) {
      console.log("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 1. UPLOAD VIDEO FUNCTION ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnail || !title || !description) {
        return alert("All fields are required!");
    }

    const formData = new FormData();
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);

    try {
        setUploading(true);
        await api.post("/videos", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Video Uploaded Successfully! 🎉");
        setShowUploadModal(false);
        resetForm();
        fetchDashboardData(); // Refresh list
    } catch (error) {
        console.log("Upload failed", error);
        alert("Upload failed. Try again.");
    } finally {
        setUploading(false);
    }
  };

  // --- 2. DELETE VIDEO FUNCTION ---
  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
        await api.delete(`/videos/${videoId}`);
        setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (error) {
        console.log("Error deleting video", error);
    }
  };

  // --- 3. TOGGLE PUBLISH ---
  const togglePublish = async (videoId) => {
    try {
        await api.patch(`/videos/toggle/publish/${videoId}`);
        setVideos((prev) => prev.map((v) => 
            v._id === videoId ? { ...v, isPublished: !v.isPublished } : v
        ));
    } catch (error) {
        console.log("Error toggling publish", error);
    }
  };

  // --- 4. EDIT VIDEO FUNCTION ---
  const openEditModal = (video) => {
    setSelectedVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        setUploading(true);
        // Sirf title/desc update kar rahe hain abhi ke liye
        await api.patch(`/videos/${selectedVideo._id}`, { title, description });
        alert("Video Updated! ✅");
        setShowEditModal(false);
        fetchDashboardData();
    } catch (error) {
        console.log("Update failed", error);
    } finally {
        setUploading(false);
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setThumbnail(null);
    setTitle("");
    setDescription("");
  };

  if (loading) return <div className="text-center mt-20 text-white animate-pulse">Loading Dashboard...</div>;

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white p-4 lg:p-8 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold">Channel Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.fullName}!</p>
        </div>
        
        <div className="flex gap-3">
            {/* 👇 EDIT PROFILE BUTTON ADDED HERE */}
            <Link 
                to="/edit-profile" 
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition border border-gray-700"
            >
                <FaEdit /> Edit Profile
            </Link>

            <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition"
            >
                <FaPlus /> Upload Video
            </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FaEye />} label="Total Views" value={stats.totalViews || 0} color="bg-blue-500" />
        <StatCard icon={<FaUsers />} label="Subscribers" value={stats.totalSubscribers || 0} color="bg-purple-500" />
        <StatCard icon={<FaHeart />} label="Total Likes" value={stats.totalLikes || 0} color="bg-red-500" />
        <StatCard icon={<FaVideo />} label="Total Videos" value={stats.totalVideos || 0} color="bg-green-500" />
      </div>

      {/* VIDEOS TABLE */}
      <div className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-gray-800">
        <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Uploaded Videos</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-black text-gray-400 text-sm uppercase">
                        <th className="p-4">Video</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {videos.map((video) => (
                        <tr key={video._id} className="hover:bg-[#252525] transition">
                            <td className="p-4 flex gap-3 items-center min-w-[250px]">
                                <img src={video.thumbnail} className="w-16 h-10 object-cover rounded" alt="thumb" />
                                <div>
                                    <Link to={`/video/${video._id}`} className="font-semibold hover:text-purple-400 line-clamp-1">{video.title}</Link>
                                    <span className="text-xs text-gray-500">{video.views} views</span>
                                </div>
                            </td>
                            <td className="p-4">
                                <button onClick={() => togglePublish(video._id)} className={`px-3 py-1 rounded-full text-xs font-bold border ${video.isPublished ? "border-green-500 text-green-500 bg-green-500/10" : "border-orange-500 text-orange-500 bg-orange-500/10"}`}>
                                    {video.isPublished ? "Public" : "Private"}
                                </button>
                            </td>
                            <td className="p-4 text-sm text-gray-400">{new Date(video.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => openEditModal(video)} className="text-blue-400 hover:text-blue-300"><FaEdit /></button>
                                    <button onClick={() => handleDelete(video._id)} className="text-red-500 hover:text-red-400"><FaTrash /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {videos.length === 0 && <div className="p-8 text-center text-gray-500">No videos uploaded yet.</div>}
        </div>
      </div>

      {/* --- UPLOAD VIDEO MODAL --- */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E1E1E] p-6 rounded-xl w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Upload New Video</h2>
                    <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
                </div>
                
                <form onSubmit={handleUpload} className="flex flex-col gap-4">
                    {/* Video File */}
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition cursor-pointer relative">
                        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">{videoFile ? videoFile.name : "Click to select Video File"}</p>
                    </div>

                    {/* Thumbnail File */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Thumbnail</label>
                        <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-gray-300" />
                    </div>

                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none" required />
                    
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none" required />

                    <button type="submit" disabled={uploading} className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded font-bold disabled:opacity-50">
                        {uploading ? "Uploading..." : "Upload Video"}
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* --- EDIT VIDEO MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E1E1E] p-6 rounded-xl w-full max-w-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Edit Video</h2>
                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none" required />
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none" required />
                    
                    <div className="flex justify-end gap-3 mt-2">
                        <button type="button" onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white px-4">Cancel</button>
                        <button type="submit" disabled={uploading} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold">
                            {uploading ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div className="bg-[#1E1E1E] p-4 rounded-xl border border-gray-800 flex items-center gap-4">
            <div className={`p-3 rounded-full text-white ${color}`}>{icon}</div>
            <div>
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-gray-400 text-sm">{label}</p>
            </div>
        </div>
    );
}