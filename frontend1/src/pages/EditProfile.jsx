import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { FaCamera, FaSave, FaSpinner, FaLock } from "react-icons/fa";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Profile States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // Password States (New)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (user) {
        setFullName(user.fullName);
        setEmail(user.email);
    }
  }, [user]);

  // --- 1. UPDATE PROFILE INFO ---
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await api.patch("/users/update-account", { fullName, email });
        alert("Profile Details Updated! ✅");
        setUser(prev => ({ ...prev, fullName, email }));
    } catch (error) {
        console.log("Update failed", error);
        alert("Failed to update details.");
    } finally {
        setLoading(false);
    }
  };

  // --- 2. UPDATE AVATAR ---
  const handleUpdateAvatar = async () => {
    if (!avatar) return alert("Please select an image first");
    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
        const res = await api.patch("/users/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Avatar Updated! 📸");
        setUser(prev => ({ ...prev, avatar: res.data.data.avatar }));
        setAvatar(null);
    } catch (error) {
        console.log("Avatar upload failed", error);
    } finally {
        setLoading(false);
    }
  };

  // --- 3. UPDATE COVER ---
  const handleUpdateCover = async () => {
    if (!coverImage) return alert("Please select an image first");
    setLoading(true);
    const formData = new FormData();
    formData.append("coverImage", coverImage);

    try {
        const res = await api.patch("/users/cover-image", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Cover Image Updated! 🖼️");
        setUser(prev => ({ ...prev, coverImage: res.data.data.coverImage }));
        setCoverImage(null);
    } catch (error) {
        console.log("Cover upload failed", error);
    } finally {
        setLoading(false);
    }
  };

  // --- 4. CHANGE PASSWORD FUNCTION (NEW) ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
        return alert("Both password fields are required");
    }
    
    setPassLoading(true);
    try {
        await api.post("/users/change-password", { oldPassword, newPassword });
        alert("Password Changed Successfully! 🔐");
        setOldPassword("");
        setNewPassword("");
    } catch (error) {
        console.log("Password change failed", error);
        // Error message backend se dikhayein agar available ho
        alert(error.response?.data?.message || "Incorrect Old Password or Error");
    } finally {
        setPassLoading(false);
    }
  };

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white p-4 lg:p-8 flex justify-center pb-20">
        <div className="w-full max-w-2xl bg-[#1E1E1E] rounded-xl border border-gray-800 p-6 shadow-2xl">
            <h1 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Edit Profile</h1>

            {/* --- SECTION 1: IMAGES --- */}
            <div className="mb-8">
                {/* Cover Image */}
                <div className="relative w-full h-40 bg-gray-700 rounded-lg overflow-hidden group">
                    <img 
                        src={coverImage ? URL.createObjectURL(coverImage) : (user?.coverImage || "https://via.placeholder.com/800x300")} 
                        className="w-full h-full object-cover" 
                        alt="cover"
                    />
                    <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        <FaCamera className="text-3xl" />
                        <input type="file" className="hidden" onChange={(e) => setCoverImage(e.target.files[0])} />
                    </label>
                </div>
                {coverImage && <button onClick={handleUpdateCover} className="mt-2 text-xs bg-purple-600 px-3 py-1 rounded">Save Cover</button>}

                {/* Avatar */}
                <div className="relative -mt-12 ml-6 w-24 h-24 rounded-full border-4 border-[#1E1E1E] overflow-hidden group">
                    <img 
                        src={avatar ? URL.createObjectURL(avatar) : (user?.avatar || "https://via.placeholder.com/150")} 
                        className="w-full h-full object-cover"
                        alt="avatar"
                    />
                    <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        <FaCamera className="text-xl" />
                        <input type="file" className="hidden" onChange={(e) => setAvatar(e.target.files[0])} />
                    </label>
                </div>
                {avatar && <button onClick={handleUpdateAvatar} className="ml-6 mt-2 text-xs bg-purple-600 px-3 py-1 rounded">Save Avatar</button>}
            </div>

            {/* --- SECTION 2: PERSONAL DETAILS --- */}
            <form onSubmit={handleUpdateInfo} className="space-y-4 mb-10">
                <h2 className="text-lg font-bold text-gray-300">Personal Information</h2>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                    <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none" 
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition flex justify-center items-center gap-2"
                >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Profile
                </button>
            </form>

            {/* --- SECTION 3: CHANGE PASSWORD (NEW) --- */}
            <form onSubmit={handleChangePassword} className="space-y-4 border-t border-gray-700 pt-6">
                <h2 className="text-lg font-bold text-gray-300 flex items-center gap-2">
                    <FaLock className="text-purple-500"/> Change Password
                </h2>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Old Password</label>
                    <input 
                        type="password" 
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none" 
                        placeholder="Enter current password"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">New Password</label>
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none" 
                        placeholder="Enter new password"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={passLoading}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition flex justify-center items-center gap-2"
                >
                    {passLoading ? <FaSpinner className="animate-spin" /> : "Update Password"}
                </button>
            </form>

        </div>
    </div>
  );
}