import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="bg-[#0F0F0F] min-h-screen">
      {/* 1. Navbar hamesha upar rahega */}
      <Navbar />
      
      <div className="flex">
        {/* 2. Sidebar left mein rahega */}
        <Sidebar />
        
        {/* 3. Main Content Area */}
        {/* md:ml-64 = Sidebar ki jagah chhodo */}
        {/* pt-16 = Navbar ki jagah chhodo (padding-top) */}
        <main className="flex-1 md:ml-64 pt-16 w-full min-h-screen text-white">
             <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;