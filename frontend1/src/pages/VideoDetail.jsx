import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa"; // Icons import kiye

export default function VideoDetail() {
  const { videoId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        // 1. Fetch Video Details
        const videoRes = await api.get(`/videos/${videoId}`);
        const videoData = videoRes.data.data;
        setVideo(videoData);
        
        // 👇 MAIN FIX: Ab Views aur Likes alag-alag hain
        // Backend se 'likesCount' aur 'isLiked' aa raha hai (Video Controller update karne ke baad)
        setLikeCount(videoData.likesCount || 0); 
        setIsLiked(videoData.isLiked || false);
        
        // Subscribe status
        setIsSubscribed(videoData.owner?.isSubscribed || false);

        // 2. Fetch Comments
        const commentsRes = await api.get(`/comments/${videoId}`);
        setComments(commentsRes.data.data.docs || []);
        
      } catch (err) {
        console.log("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, [videoId, user]);

  // ✅ LIKE FUNCTION
  const handleLike = async () => {
    if (!user) {
        alert("Please login to like the video!");
        navigate("/login");
        return;
    }

    // Optimistic UI update
    const previousLiked = isLiked;
    const previousCount = likeCount;

    setIsLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);
    
    try {
      await api.post(`/likes/toggle/v/${videoId}`);
    } catch (error) {
      console.log("Like error", error);
      // Revert if error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
    }
  };

  // ✅ SUBSCRIBE FUNCTION
  const handleSubscribe = async () => {
    if (!user) {
        alert("Please login to subscribe!");
        navigate("/login");
        return;
    }

    if (!video?.owner?._id) return;
    
    // Optimistic Update
    setIsSubscribed((prev) => !prev);
    
    try {
      await api.post(`/subscriptions/c/${video.owner._id}`);
    } catch (error) {
      console.log("Subscribe error", error);
      setIsSubscribed((prev) => !prev); // Revert
    }
  };

  // ✅ COMMENT FUNCTION
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
        alert("Please login to comment!");
        navigate("/login");
        return;
    }

    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/comments/${videoId}`, { content: newComment });
      setComments((prev) => [res.data.data, ...prev]); 
      setNewComment("");
    } catch (error) {
      console.log("Comment error", error);
    }
  };

  if (loading) return <div className="text-center mt-20 text-white animate-pulse">Loading Video...</div>;
  if (!video) return <div className="text-center mt-20 text-white">Video not found.</div>;

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white p-4 lg:p-8 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT SECTION: Video Player & Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-black">
            <video
              src={video.videoFile}
              poster={video.thumbnail}
              controls
              autoPlay
              className="w-full h-full object-contain"
            ></video>
          </div>

          {/* Title & Actions */}
          <div>
            <h1 className="text-2xl font-bold line-clamp-2">{video.title}</h1>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-4">
                <p className="text-gray-400 text-sm">
                    {/* 👇 Views yahan alag hain */}
                    {video.views} Views • {new Date(video.createdAt).toLocaleDateString()}
                </p>
                
                {/* Like Button */}
                <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition ${
                        isLiked ? "bg-white text-black" : "bg-[#222] hover:bg-[#333] text-white"
                    }`}
                >
                    {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />} 
                    
                    {/* 👇 Likes count yahan alag hai */}
                    <span>{likeCount}</span>
                </button>
            </div>
          </div>

          {/* Channel Info & Description */}
          <div className="bg-[#1E1E1E] p-4 rounded-xl flex items-start gap-4 shadow-lg border border-gray-800">
             <img 
                src={video.owner?.avatar || "https://via.placeholder.com/50"} 
                alt="channel"
                className="w-12 h-12 rounded-full object-cover"
             />
             <div className="flex-1">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h3 className="font-bold text-lg">{video.owner?.fullName}</h3>
                        <p className="text-xs text-gray-400">@{video.owner?.username}</p>
                    </div>
                    <button 
                        onClick={handleSubscribe}
                        className={`px-5 py-2 rounded-full font-bold transition ${
                            isSubscribed ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                    >
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                </div>
                <p className="mt-3 text-sm text-gray-300 whitespace-pre-wrap">
                    {video.description}
                </p>
             </div>
          </div>
        </div>

        {/* RIGHT SECTION: Comments */}
        <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
            
            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
                <img 
                    src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                    className="w-10 h-10 rounded-full object-cover" 
                    alt="me" 
                />
                <div className="flex-1">
                    <input 
                        type="text" 
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-transparent border-b border-gray-600 focus:border-purple-500 outline-none p-2 text-sm transition text-white"
                    />
                    <div className="flex justify-end mt-2">
                        <button className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-purple-700">
                            Comment
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3 items-start">
                        <img 
                            src={comment.owner?.avatar || "https://via.placeholder.com/40"} 
                            alt="user" 
                            className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-xs font-bold text-gray-300">
                                @{comment.owner?.username} <span className="text-gray-500 font-normal">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                            </p>
                            <p className="text-sm mt-1 text-white">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}