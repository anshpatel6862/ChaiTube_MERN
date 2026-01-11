import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Tweets() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");

  // Tweets fetch karne ke liye
  // Note: Backend mein 'getUserTweets' hai, hum abhi current user ke tweets fetch kar rahe hain demo ke liye
  const fetchTweets = async () => {
    try {
      if(user?._id) {
          const res = await api.get(`/tweets/user/${user._id}`);
          setTweets(res.data.data || []);
      }
    } catch (error) {
      console.log("Error fetching tweets", error);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [user]);

  const handleCreateTweet = async (e) => {
    e.preventDefault();
    if (!content) return;
    try {
      await api.post("/tweets", { content });
      setContent("");
      fetchTweets(); // Refresh list
    } catch (error) {
      console.log("Tweet failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-4">Community Tweets</h1>

        {/* Create Tweet Box */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg mb-6 border border-gray-700">
            <div className="flex gap-4">
                <img src={user?.avatar} className="w-12 h-12 rounded-full object-cover" alt="avatar" />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's happening?"
                    className="flex-1 bg-transparent outline-none text-lg resize-none h-24 placeholder-gray-500"
                ></textarea>
            </div>
            <div className="flex justify-end mt-2 border-t border-gray-700 pt-2">
                <button 
                    onClick={handleCreateTweet}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold transition"
                >
                    Tweet
                </button>
            </div>
        </div>

        {/* Tweets List */}
        <div className="space-y-4">
            {tweets.map((tweet) => (
                <div key={tweet._id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:bg-gray-750 transition">
                    <div className="flex gap-3">
                        <img src={user?.avatar} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                        <div>
                            <h3 className="font-bold">{user?.username}</h3>
                            <p className="text-gray-400 text-xs">{new Date(tweet.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <p className="mt-3 text-lg leading-relaxed">
                        {tweet.content}
                    </p>
                    <div className="flex gap-6 mt-4 text-gray-400 text-sm">
                        <button className="hover:text-purple-500 transition">❤️ Like</button>
                        <button className="hover:text-blue-500 transition">💬 Comment</button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}