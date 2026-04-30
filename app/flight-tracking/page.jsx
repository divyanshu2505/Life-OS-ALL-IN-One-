"use client";
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Plane, Search, Globe, MapPin, Info } from 'lucide-react';

export default function FlightTracking() {
  const [selectedFlight, setSelectedFlight] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1c] text-white overflow-hidden">
      <Navbar />
      <div className="flex-1 mt-16 relative flex">
        {/* Full Screen Map (OpenStreetMap iframe for authentic look) */}
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
          {/* We use OpenStreetMap centered near Jewar/Delhi */}
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=76.8,28.1,77.8,28.8&amp;layer=mapnik&amp;marker=28.2435,77.5623" 
            style={{ filter: "invert(100%) hue-rotate(180deg) brightness(80%) contrast(120%)" }}
          ></iframe>
        </div>

        {/* Mock Planes overlay over the map */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-[40%] left-[45%] text-yellow-400 rotate-45 cursor-pointer pointer-events-auto hover:scale-125 transition-transform" onClick={() => setSelectedFlight('AI101')}><Plane size={28} fill="currentColor" /></div>
          <div className="absolute top-[60%] left-[65%] text-yellow-400 -rotate-12 cursor-pointer pointer-events-auto hover:scale-125 transition-transform" onClick={() => setSelectedFlight('EK500')}><Plane size={24} fill="currentColor" /></div>
          <div className="absolute top-[35%] left-[55%] text-yellow-400 rotate-90 cursor-pointer pointer-events-auto hover:scale-125 transition-transform" onClick={() => setSelectedFlight('BA25')}><Plane size={32} fill="currentColor" /></div>
          <div className="absolute top-[50%] left-[50%] flex flex-col items-center">
            <MapPin className="text-red-500 w-8 h-8 -mt-8" fill="currentColor" />
            <span className="bg-black/80 px-2 py-1 text-xs rounded mt-1 font-bold border border-white/10">Jewar Int. Airport</span>
          </div>
        </div>

        {/* Floating Top Search Bar */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <div className="bg-[#242424] border border-white/10 p-1 rounded-md flex items-center gap-2 shadow-xl w-80">
            <Search className="w-5 h-5 text-gray-400 ml-2" />
            <input 
              type="text" 
              placeholder="Search flight, airport..." 
              className="flex-1 bg-transparent border-none outline-none text-white py-2 text-sm"
            />
          </div>
        </div>
        
        {/* Sidebar Status (Jewar Airport & Flights) */}
        <div className="absolute top-4 right-4 bottom-4 w-80 bg-[#242424]/95 backdrop-blur-md border border-white/10 rounded-xl flex flex-col z-20 shadow-2xl overflow-hidden">
          {/* Jewar Airport Spotlight */}
          <div className="relative h-40 w-full bg-black">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Noida_International_Airport_model.jpg/640px-Noida_International_Airport_model.jpg" 
              alt="Jewar Airport" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent">
              <h2 className="text-lg font-bold">Noida Int. Airport (Jewar)</h2>
              <p className="text-xs text-gray-300">DXN • Under Construction</p>
            </div>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><Globe size={16}/> Live Traffic</h3>
            
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedFlight === 'AI101' ? 'bg-blue-900/50 border-blue-500' : 'bg-black/40 border-white/5 hover:border-white/20'}`} onClick={() => setSelectedFlight('AI101')}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-yellow-400">Air India AI101</span>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded">B777</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>DEL</span> <span>✈</span> <span>JFK</span>
                </div>
                <div className="text-xs text-gray-400 mt-1 flex justify-between">
                  <span>35,000 ft</span>
                  <span>540 mph</span>
                </div>
              </div>

              <div className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedFlight === 'EK500' ? 'bg-blue-900/50 border-blue-500' : 'bg-black/40 border-white/5 hover:border-white/20'}`} onClick={() => setSelectedFlight('EK500')}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-yellow-400">Emirates EK500</span>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded">A380</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>DXB</span> <span>✈</span> <span>BOM</span>
                </div>
                <div className="text-xs text-gray-400 mt-1 flex justify-between">
                  <span>39,000 ft</span>
                  <span>510 mph</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
