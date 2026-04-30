"use client";
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Compass, Search, MapPin, Navigation as NavIcon } from 'lucide-react';

export default function Navigation() {
  const [query, setQuery] = useState('');
  const [mapUrl, setMapUrl] = useState('https://www.openstreetmap.org/export/embed.html?bbox=-122.51,37.70,-122.36,37.81&layer=mapnik');

  const handleSearch = () => {
    if (!query) return;
    // Real search logic for OpenStreetMap iframe
    const encodedQuery = encodeURIComponent(query);
    setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik&marker=&q=${encodedQuery}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-white">
      <Navbar />
      <div className="flex-1 mt-20 relative">
        {/* Real Interactive Map */}
        <div className="absolute inset-0 bg-[#0a0a0f]">
           <iframe 
             width="100%" 
             height="100%" 
             frameBorder="0" 
             scrolling="no" 
             marginHeight="0" 
             marginWidth="0" 
             src={mapUrl} 
             style={{ filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }} // Dark mode map hack
             className="w-full h-full border-none pointer-events-auto"
           ></iframe>
        </div>

        {/* Floating Search Bar */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-10">
          <div className="glass-panel p-2 rounded-2xl flex items-center gap-4 shadow-2xl border border-white/20 bg-black/60 backdrop-blur-xl">
            <Search className="w-6 h-6 text-gray-400 ml-4" />
            <input 
              type="text" 
              placeholder="Search destination (e.g. Jharkhand, London, Tokyo)..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent border-none outline-none text-white py-3 placeholder:text-gray-500"
            />
            <button onClick={handleSearch} className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-colors">
              Navigate
            </button>
          </div>
        </div>
        
        {/* Sidebar overlay */}
        <div className="absolute top-28 left-8 w-80 glass-panel border border-white/10 rounded-2xl p-6 hidden md:block bg-black/70 backdrop-blur-xl shadow-2xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Compass className="text-primary" /> Smart Nav</h2>
          <div className="space-y-4">
            <div 
              onClick={() => { setQuery('Ranchi, Jharkhand'); setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=85.2,23.3,85.4,23.4&layer=mapnik`); }}
              className="p-4 bg-surface/50 rounded-xl hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-primary/50"
            >
              <div className="font-semibold flex items-center gap-2"><NavIcon size={16} className="text-blue-400"/> Current Location</div>
              <div className="text-sm text-gray-400 mt-1">Ranchi, Jharkhand</div>
            </div>
            <div 
              onClick={() => { setQuery('New Delhi'); setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=77.1,28.5,77.3,28.7&layer=mapnik`); }}
              className="p-4 bg-surface/50 rounded-xl hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-primary/50"
            >
              <div className="font-semibold flex items-center gap-2"><MapPin size={16} className="text-green-400"/> Home</div>
              <div className="text-sm text-gray-400 mt-1">1,200 km away</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
