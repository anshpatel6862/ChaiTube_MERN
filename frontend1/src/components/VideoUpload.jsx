import React, { useState } from "react";
import api from "../api/axiosInstance";

const VideoUpload = ({ setOpenUpload, onUploadSuccess }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnail) {
        alert("Video and Thumbnail are required");
        return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("videoFile", videoFile);
    data.append("thumbnail", thumbnail);
    data.append("title", title);
    data.append("description", description);

    try {
      await api.post("/videos", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video Uploaded Successfully!");
      setOpenUpload(false);
      onUploadSuccess(); 
    } catch (error) {
      console.log(error);
      alert("Error uploading video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg border border-gray-700 relative">
        <button 
          onClick={() => setOpenUpload(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="w-full bg-gray-900 p-2 rounded border border-gray-600" required />
          <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="w-full bg-gray-900 p-2 rounded border border-gray-600" required />
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-900 p-3 rounded border border-gray-600" required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full bg-gray-900 p-3 rounded border border-gray-600" required></textarea>
          <button type="submit" disabled={uploading} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded font-bold">{uploading ? "Uploading..." : "Publish Video"}</button>
        </form>
      </div>
    </div>
  );
};

export default VideoUpload;