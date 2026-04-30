"use client";
import React from 'react';
import Navbar from '../../components/Navbar';
import { Compass, Search, MapPin } from 'lucide-react';

export default function Navigation() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-white">
      <Navbar />
      <div className="flex-1 mt-20 relative">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-[#0a0a0f] overflow-hidden">
          {/* Grid lines to simulate map feel */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
          {/* Fake route line */}
          <div className="absolute top-1/2 left-1/4 w-1/2 h-1 bg-neon-blue rotate-12 blur-[1px]"></div>
          {/* Fake map markers */}
          <div className="absolute top-[40%] left-[25%] p-2 bg-primary rounded-full shadow-neon animate-pulse"><MapPin size={24} /></div>
          <div className="absolute top-[60%] left-[75%] p-2 bg-primary rounded-full shadow-neon"><MapPin size={24} /></div>
        </div>

        {/* Floating Search Bar */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-10">
          <div className="glass-panel p-2 rounded-2xl flex items-center gap-4 shadow-glass">
            <Search className="w-6 h-6 text-gray-400 ml-4" />
            <input 
              type="text" 
              placeholder="Search destination..." 
              className="flex-1 bg-transparent border-none outline-none text-white py-3"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold">Navigate</button>
          </div>
        </div>
        
        {/* Sidebar overlay */}
        <div className="absolute top-28 left-8 w-80 glass-panel border border-white/5 rounded-2xl p-6 hidden md:block">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Compass className="text-primary" /> Smart Nav</h2>
          <div className="space-y-4">
            <div className="p-4 bg-surface rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-primary">
              <div className="font-semibold">Current Location</div>
              <div className="text-sm text-gray-400">Determining...</div>
            </div>
            <div className="p-4 bg-surface rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
              <div className="font-semibold">Home</div>
              <div className="text-sm text-gray-400">12 mins away</div>
            </div>
            <div className="p-4 bg-surface rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
              <div className="font-semibold">Work</div>
              <div className="text-sm text-gray-400">45 mins away (Heavy traffic)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
