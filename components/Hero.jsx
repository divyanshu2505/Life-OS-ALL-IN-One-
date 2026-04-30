"use client";
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

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
          {/* Portfolio Access Button replacing the SVG image */}
          <Link href="/portfolio" className="relative group block">
            <div className="absolute inset-0 bg-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative glass-panel px-12 py-8 rounded-3xl border border-cyan-500/30 flex flex-col items-center gap-4 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-neon animate-pulse-slow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-white">Access Life-OS</h3>
                <p className="text-cyan-400 text-sm tracking-widest uppercase mt-1">View Full Portfolio →</p>
              </div>
            </div>
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
            View Portfolio <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-lg flex items-center gap-2 hover:bg-white/10 transition-colors rounded-xl uppercase tracking-wider">
            Login
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
