import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import VideoDetail from "../pages/VideoDetail";
import Tweets from "../pages/Tweets";
import NotFound from "../pages/NotFound";
import LikedVideos from "../pages/LikedVideos";
import SearchVideos from "../pages/SearchVideos";
import History from "../pages/History";
import Subscribers from "../pages/Subscribers";
import MyPlaylists from "../pages/MyPlaylists";
import PlaylistDetail from "../pages/PlaylistDetail";
import EditProfile from "../pages/EditProfile";
import AuthLayout from "../components/AuthLayout"; 

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          
          {/* --- PUBLIC ROUTES (Sabke liye khule hain) --- */}
          <Route index element={<Home />} />
          <Route path="video/:videoId" element={<VideoDetail />} />
          <Route path="tweets" element={<Tweets />} />
          <Route path="search" element={<SearchVideos />} />

          {/* --- PROTECTED ROUTES (Bina Login ke nahi khulenge) --- */}
          <Route element={<AuthLayout />}>
             <Route path="dashboard" element={<Dashboard />} />
             <Route path="liked-videos" element={<LikedVideos />} />
             <Route path="history" element={<History />} />
             <Route path="subscribers" element={<Subscribers />} />
             {/* 👇 Ye naya route add kiya hai */}
             <Route path="collections" element={<MyPlaylists />} />
             <Route path="playlist/:playlistId" element={<PlaylistDetail />} />
             <Route path="/edit-profile" element={<EditProfile />} />
          </Route>

        </Route>

        {/* --- AUTH PAGE ROUTES --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- 404 PAGE --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}