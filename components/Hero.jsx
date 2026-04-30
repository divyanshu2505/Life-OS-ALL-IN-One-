"use client";
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden perspective-[1000px]">
      
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-4 w-full"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 relative w-full flex justify-center"
        >
          {/* Red Landing Page Image in Blue Theme */}
          <Link href="/portfolio" className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,150,255,0.3)] group cursor-pointer border border-cyan-500/20 hover:border-cyan-500/50 transition-colors block">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
            
            <img 
              src="/lifeos-red.png" 
              alt="Life-OS Red Theme Preview" 
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800";
              }}
            />
          </Link>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 leading-tight uppercase"
        >
          LifeOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-500">System</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-gray-400 mb-10 max-w-2xl font-mono uppercase tracking-widest text-sm"
        >
          [ INITIALIZING CORE... ] UNIFIED WORKSPACE DEPLOYED.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/portfolio" className="glow-border px-8 py-4 bg-white text-black font-bold text-lg flex items-center gap-2 hover:bg-gray-200 transition-colors rounded-xl uppercase tracking-wider">
            View Projects <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-lg flex items-center gap-2 hover:bg-white/10 transition-colors rounded-xl uppercase tracking-wider">
            Login
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
