"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Plane, Search, Globe, MapPin, Activity, Clock, Navigation } from 'lucide-react';

export default function FlightTracking() {
  const [selectedFlight, setSelectedFlight] = useState('AI101');
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const flights = {
    'AI101': { id: 'AI101', airline: 'Air India', type: 'Boeing 777-300ER', from: 'DEL', to: 'JFK', alt: '35,000 ft', speed: '540 mph', lat: 28.5, lng: 77.1, heading: 45, color: 'text-yellow-400' },
    'EK500': { id: 'EK500', airline: 'Emirates', type: 'Airbus A380', from: 'DXB', to: 'BOM', alt: '39,000 ft', speed: '510 mph', lat: 28.1, lng: 77.4, heading: 120, color: 'text-orange-400' },
    'BA25': { id: 'BA25', airline: 'British Airways', type: 'Boeing 787-9', from: 'LHR', to: 'HKG', alt: '41,000 ft', speed: '560 mph', lat: 28.8, lng: 77.2, heading: 90, color: 'text-white' },
  };

  const active = flights[selectedFlight];

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1014] text-white overflow-hidden font-sans">
      <Navbar />
      <div className="flex-1 mt-16 relative flex">
        {/* Full Screen Map */}
        <div className="absolute inset-0 z-0 opacity-90 pointer-events-none">
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=76.8,28.1,77.8,28.8&amp;layer=mapnik" 
            style={{ filter: "invert(100%) hue-rotate(180deg) brightness(60%) contrast(150%) grayscale(50%)" }}
          ></iframe>
        </div>

        {/* Floating Planes (CSS Animated to look live) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {Object.values(flights).map(f => (
            <div 
              key={f.id}
              className={`absolute cursor-pointer pointer-events-auto transition-transform duration-500 ease-linear ${f.color} ${selectedFlight === f.id ? 'scale-150 z-50 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'hover:scale-125'}`}
              style={{ 
                top: `${(28.8 - f.lat) / 0.7 * 100}%`, 
                left: `${(f.lng - 76.8) / 1.0 * 100}%`,
                transform: `rotate(${f.heading}deg)`
              }}
              onClick={() => setSelectedFlight(f.id)}
            >
              <Plane size={selectedFlight === f.id ? 32 : 24} fill="currentColor" />
            </div>
          ))}
          <div className="absolute top-[50%] left-[50%] flex flex-col items-center">
            <MapPin className="text-red-500 w-6 h-6 -mt-6 drop-shadow-lg" fill="currentColor" />
            <span className="bg-[#1a1b26]/90 px-2 py-1 text-[10px] rounded mt-1 font-bold border border-white/10 uppercase tracking-wider text-gray-300">Jewar Int.</span>
          </div>
        </div>

        {/* Top Search Bar */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <div className="bg-[#1a1b26]/90 backdrop-blur-md border border-white/10 p-1 rounded-xl flex items-center gap-2 shadow-2xl w-80">
            <Search className="w-5 h-5 text-gray-400 ml-3" />
            <input 
              type="text" 
              placeholder="Search flight, airport, registration..." 
              className="flex-1 bg-transparent border-none outline-none text-white py-2.5 text-sm"
            />
          </div>
        </div>
        
        {/* Left Flight Info Panel (FlightRadar Style) */}
        <div className="absolute top-20 left-4 bottom-4 w-80 bg-[#1a1b26]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col z-20 shadow-2xl overflow-hidden transform transition-all duration-300">
          
          {/* Header Image */}
          <div className="relative h-48 w-full bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1b26] z-10"></div>
            {/* Fake 3D plane image for aesthetics */}
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60" alt="Aircraft" />
            
            <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-20 flex items-center gap-1">
               <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> LIVE
            </div>
            
            <div className="absolute bottom-4 left-4 z-20 w-full pr-8">
               <h2 className="text-3xl font-display font-bold text-white tracking-tight drop-shadow-md">{active.id}</h2>
               <p className="text-sm font-medium text-blue-300 drop-shadow-md">{active.airline}</p>
            </div>
          </div>

          <div className="p-5 flex-1 overflow-y-auto hide-scrollbar space-y-6">
            
            {/* Route */}
            <div className="flex items-center justify-between px-2">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{active.from}</div>
                <div className="text-[10px] text-gray-400 font-medium tracking-widest mt-1">DEPARTURE</div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
                 <div className="w-full h-[2px] bg-gray-700 absolute top-1/2 -translate-y-1/2"></div>
                 <div className="w-1/2 h-[2px] bg-cyan-400 absolute top-1/2 -translate-y-1/2 left-0 shadow-[0_0_8px_#22d3ee]"></div>
                 <Plane className="text-cyan-400 z-10 bg-[#1a1b26] p-1 w-8 h-8 rotate-90" />
                 <span className="text-[10px] text-cyan-400 font-bold mt-2">IN AIR</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{active.to}</div>
                <div className="text-[10px] text-gray-400 font-medium tracking-widest mt-1">ARRIVAL</div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f1014] p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1"><Navigation size={12}/> Altitude</div>
                <div className="text-lg font-bold text-cyan-400">{active.alt}</div>
              </div>
              <div className="bg-[#0f1014] p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1"><Activity size={12}/> Ground Speed</div>
                <div className="text-lg font-bold text-yellow-400">{active.speed}</div>
              </div>
              <div className="bg-[#0f1014] p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1"><Clock size={12}/> Tracked Since</div>
                <div className="text-lg font-bold text-white">03:45 AM</div>
              </div>
              <div className="bg-[#0f1014] p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1"><Plane size={12}/> Aircraft Type</div>
                <div className="text-sm font-bold text-white truncate" title={active.type}>{active.type}</div>
              </div>
            </div>

            {/* Select Other Flights */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Nearby Traffic</h3>
              <div className="space-y-2">
                {Object.values(flights).filter(f => f.id !== selectedFlight).map(f => (
                   <div key={f.id} onClick={() => setSelectedFlight(f.id)} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                     <div className="flex items-center gap-3">
                       <Plane size={16} className={f.color} />
                       <div>
                         <div className="text-sm font-bold">{f.id}</div>
                         <div className="text-[10px] text-gray-400">{f.from} ➔ {f.to}</div>
                       </div>
                     </div>
                     <div className="text-xs font-mono text-gray-300">{f.alt}</div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
