import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { FaPlayCircle, FaPlus } from "react-icons/fa"; 

export default function MyPlaylists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 👇 Create Playlist ke liye States
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchPlaylists();
  }, [user]);

  const fetchPlaylists = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/playlist/user/${user._id}`);
      setPlaylists(res.data.data);
    } catch (error) {
      console.log("Error fetching playlists", error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Playlist Create karne wala function
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Playlist name is required");

    try {
      // Backend API call
      await api.post("/playlist", { name, description });
      
      // Success: Modal band karo, form clear karo, aur list refresh karo
      setShowModal(false);
      setName("");
      setDescription("");
      fetchPlaylists(); // List update
      alert("Playlist created successfully! 🎉");
    } catch (error) {
      console.log("Error creating playlist", error);
      alert("Failed to create playlist");
    }
  };

  if (loading) return <div className="text-center mt-20 text-white animate-pulse">Loading Playlists...</div>;

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white p-4 lg:p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Playlists</h1>
        
        {/* 👇 CREATE BUTTON */}
        <button 
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
            <FaPlus /> Create Playlist
        </button>
      </div>

      {/* --- PLAYLIST LIST --- */}
      {playlists.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p>You haven't created any playlists yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <Link 
              key={playlist._id} 
              to={`/playlist/${playlist._id}`} 
              className="block group"
            >
              <div className="bg-[#1E1E1E] rounded-xl overflow-hidden hover:bg-[#2a2a2a] transition border border-gray-800 relative">
                <div className="h-40 bg-gray-700 flex items-center justify-center relative">
                    <FaPlayCircle className="text-4xl text-gray-400 group-hover:text-purple-500 transition"/>
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition" />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs">
                        Playlist
                    </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-purple-400 line-clamp-1">
                    {playlist.name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {playlist.description || "No description"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 👇 CREATE PLAYLIST POPUP (MODAL) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E1E1E] p-6 rounded-lg w-full max-w-md border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Create New Playlist</h2>
                <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
                    
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-purple-500 outline-none"
                            placeholder="Enter playlist name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea 
                            className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-purple-500 outline-none"
                            placeholder="Enter description (optional)"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-2">
                        <button 
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}