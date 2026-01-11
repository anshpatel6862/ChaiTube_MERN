import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Subscribers() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      if (!user) return; 

      try {
        // Backend API call
        const res = await api.get(`/subscriptions/u/${user._id}`);
        setChannels(res.data.data);
      } catch (error) {
        console.log("Error fetching subscribers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribedChannels();
  }, [user]);

  if (loading) return <div className="text-center mt-20 text-white animate-pulse">Loading Subscriptions...</div>;

  if (!user) {
     return <div className="text-center mt-20 text-white">Please login to see your subscriptions.</div>
  }

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white p-4 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Subscribed Channels</h1>

      {channels.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p>You haven't subscribed to any channels yet.</p>
          <Link to="/" className="text-purple-400 hover:underline mt-2 inline-block">
            Explore Videos
          </Link>
        </div>
      ) : (
        /* --- GRID LAYOUT --- */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {channels.map((item) => {
            // Backend se 'channel' object aata hai
            const channel = item.channel; 
            
            if (!channel) return null;

            return (
              <div 
                key={item._id} 
                className="bg-[#1E1E1E] p-6 rounded-xl flex flex-col items-center text-center hover:bg-[#2a2a2a] transition border border-gray-800"
              >
                {/* Avatar */}
                <Link to={`/c/${channel.username}`}>
                    <img 
                    src={channel.avatar} 
                    alt={channel.username} 
                    className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-purple-500"
                    />
                </Link>

                {/* Name */}
                <h3 className="text-lg font-bold text-white">{channel.username}</h3>
                <p className="text-sm text-gray-400 mb-4">{channel.fullName}</p>
                
                {/* View Button */}
                <Link 
                    to={`/c/${channel.username}`} 
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition w-full"
                >
                    View Channel
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}