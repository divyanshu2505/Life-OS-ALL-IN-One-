"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LayoutDashboard, Smartphone, Monitor, Database, Youtube, Wallet, Map, Bot } from 'lucide-react';

export default function ProblemSolution() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const chaosOpacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 0]);
  const chaosScale = useTransform(scrollYProgress, [0.1, 0.3], [1, 0.8]);
  const solutionOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const solutionScale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1]);

  const chaosIcons = [
    { Icon: Youtube, color: "text-red-500", x: "-30%", y: "-40%" },
    { Icon: Wallet, color: "text-green-500", x: "30%", y: "-20%" },
    { Icon: Map, color: "text-yellow-500", x: "-20%", y: "40%" },
    { Icon: Bot, color: "text-blue-500", x: "40%", y: "30%" },
  ];

  return (
    <section ref={containerRef} className="py-32 relative min-h-[150vh]">
      <div className="sticky top-1/2 -translate-y-1/2 max-w-7xl mx-auto px-6 h-[80vh] flex flex-col items-center justify-center">
        
        {/* Chaos Phase */}
        <motion.div 
          style={{ opacity: chaosOpacity, scale: chaosScale }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-10"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">The Chaos of Multiple Apps</h2>
          <p className="text-xl text-gray-400 max-w-2xl mb-12">Too many tabs. Constant context switching. Time wasted jumping between disconnected tools.</p>
          
          <div className="relative w-full max-w-2xl h-64 mx-auto">
            {chaosIcons.map((item, i) => (
              <motion.div
                key={i}
                animate={{ 
                  x: ["-5%", "5%", "-5%"], 
                  y: ["-5%", "5%", "-5%"],
                  rotate: [-10, 10, -10]
                }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
                className={`absolute left-1/2 top-1/2 glass-panel p-6 rounded-2xl ${item.color}`}
                style={{ marginLeft: item.x, mt: item.y }}
              >
                <item.Icon className="w-12 h-12" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solution Phase */}
        <motion.div 
          style={{ opacity: solutionOpacity, scale: solutionScale }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none"
        >
          <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-neon-blue">
            The One System You Need
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mb-12">LifeOS AI unifies your workflow into one seamless, intelligent dashboard.</p>
          
          <div className="relative w-full max-w-4xl perspective-[1200px]">
            <motion.div 
              initial={{ rotateX: 45, rotateZ: -10, y: 50 }}
              whileInView={{ rotateX: 10, rotateZ: 0, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="glass-panel border border-white/10 rounded-2xl p-4 shadow-neon overflow-hidden"
            >
              <div className="w-full h-[400px] rounded-xl bg-[#e3e6e6] border border-white/5 flex flex-col overflow-hidden relative">
                {/* Amazon-like Top Nav */}
                <div className="bg-[#131921] px-4 py-2 flex items-center gap-4 text-white text-sm">
                  <div className="font-bold text-lg tracking-tight">amazon<span className="text-[#ff9900]">.in</span></div>
                  <div className="hidden md:flex flex-col text-xs leading-tight">
                    <span className="text-gray-300">Delivering to</span>
                    <span className="font-bold">New Delhi 110001</span>
                  </div>
                  <div className="flex-1 flex rounded overflow-hidden h-8">
                    <select className="bg-[#f3f3f3] text-black text-xs px-2 border-none outline-none hidden md:block w-16"><option>All</option></select>
                    <input type="text" className="flex-1 px-2 text-black outline-none" placeholder="Search Amazon.in" />
                    <button className="bg-[#febd69] px-3 flex items-center justify-center text-black">🔍</button>
                  </div>
                  <div className="font-bold">Cart <span className="text-[#ff9900]">0</span></div>
                </div>
                {/* Secondary Nav */}
                <div className="bg-[#232f3e] px-4 py-1 flex items-center gap-4 text-white text-xs font-semibold">
                  <span>☰ All</span>
                  <span>Fresh</span>
                  <span>Amazon miniTV</span>
                  <span>Sell</span>
                  <span>Best Sellers</span>
                  <span>Mobiles</span>
                  <span>Customer Service</span>
                </div>
                {/* Main Content Area */}
                <div className="flex-1 p-4 relative overflow-hidden flex flex-col gap-4">
                  {/* Fake Banner */}
                  <div className="w-full h-24 bg-gradient-to-r from-blue-900 to-cyan-500 rounded flex items-center justify-center text-white text-xl font-bold italic shadow-inner">
                    Great Indian Festival - Live Now!
                  </div>
                  {/* Grid of Product Cards */}
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4 flex-1">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-white p-2 rounded shadow-sm flex flex-col">
                        <div className="font-bold text-black text-xs mb-1">Up to 70% off</div>
                        <div className="flex-1 bg-gray-200 rounded animate-pulse"></div>
                        <div className="text-blue-600 text-[10px] mt-1 hover:underline cursor-pointer">Shop now</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
