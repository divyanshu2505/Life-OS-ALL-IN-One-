"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, Video, BookOpen, Compass, Layout, Check, Sparkles, Server, Database, Cpu } from 'lucide-react';

import Link from 'next/link';

export function Features() {
  const features = [
    { icon: MessageSquare, title: "AI Chat Assistant", desc: "Your personal genius, available 24/7.", href: "/chat", color: "from-blue-500 to-cyan-400" },
    { icon: TrendingUp, title: "AI Revenue Generator", desc: "Automate income streams smartly.", href: "/revenue", color: "from-purple-500 to-pink-500" },
    { icon: Video, title: "Video Summarizer", desc: "Get the gist of any video in seconds.", href: "/summarizer", color: "from-green-400 to-emerald-600" },
    { icon: BookOpen, title: "Book Generator", desc: "Create complete books from simple prompts.", href: "/book-generator", color: "from-yellow-400 to-orange-500" },
    { icon: Compass, title: "Smart Navigation", desc: "Find anything across your digital life.", href: "/navigation", color: "from-red-500 to-rose-400" },
    { icon: Layout, title: "Flight Tracking", desc: "Real-time global flight radar and alerts.", href: "/flight-tracking", color: "from-cyan-500 to-blue-600" }
  ];

  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-20 relative">
        <h2 className="text-5xl md:text-6xl font-display font-extrabold mb-6 tracking-tight">
          Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Life</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Access a suite of next-generation AI tools designed to multiply your productivity and automate the boring stuff.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-[1000px]">
        {features.map((feat, i) => (
          <Link href={feat.href} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, translateY: -10 }}
              className="relative group p-[1px] rounded-3xl overflow-hidden h-full block"
            >
              {/* Animated Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-30 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Card Content */}
              <div className="relative h-full bg-[#0a0a0f]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/5 flex flex-col items-start z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">{feat.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">{feat.desc}</p>
                
                {/* Hover Arrow */}
                <div className="mt-auto pt-6 flex items-center text-sm font-bold text-gray-500 group-hover:text-white transition-colors">
                  Explore Module <span className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">→</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function UserFlow() {
  const steps = ["Signup", "Onboarding", "Dashboard", "Daily Usage"];
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <h2 className="text-4xl font-display font-bold text-center mb-16">Seamless Experience</h2>
      <div className="flex flex-col md:flex-row items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block z-0"></div>
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="relative z-10 flex flex-col items-center gap-4 mb-8 md:mb-0"
          >
            <div className="w-16 h-16 rounded-full glass-panel border border-primary/50 flex items-center justify-center text-primary font-bold text-xl shadow-neon">
              {i + 1}
            </div>
            <span className="font-semibold text-lg">{step}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function TechStack() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto text-center">
      <h2 className="text-4xl font-display font-bold mb-16">Powered by Next-Gen Tech</h2>
      <div className="flex flex-wrap justify-center gap-8 items-center">
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center gap-2"><Layout className="w-8 h-8 text-blue-400"/><span>Frontend</span></div>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-green-400 animate-pulse-slow hidden md:block"></div>
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center gap-2"><Server className="w-8 h-8 text-green-400"/><span>Backend</span></div>
        <div className="h-1 w-16 bg-gradient-to-r from-green-400 to-purple-400 animate-pulse-slow hidden md:block"></div>
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center gap-2 shadow-neon"><Cpu className="w-8 h-8 text-primary"/><span>Ollama AI</span></div>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-yellow-400 animate-pulse-slow hidden md:block"></div>
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center gap-2"><Database className="w-8 h-8 text-yellow-400"/><span>Database</span></div>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-display font-bold mb-4">Simple Pricing</h2>
        <p className="text-xl text-gray-400">Start for free, upgrade when you need more power.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <motion.div whileHover={{ y: -10 }} className="glass-panel p-8 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-bold mb-2">Basic</h3>
          <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-400"/> Basic AI Chat</li>
            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-400"/> 5 Summaries/mo</li>
            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-400"/> Dashboard Access</li>
          </ul>
          <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors font-semibold">Get Started Free</button>
        </motion.div>
        
        <motion.div whileHover={{ y: -10 }} className="glass-panel p-8 rounded-2xl border border-primary relative glow-border overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
          <h3 className="text-2xl font-bold mb-2 text-primary">Premium</h3>
          <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-gray-400 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/> Unlimited AI Chat</li>
            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/> Unlimited Summaries</li>
            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/> Revenue Generator</li>
            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/> Book Generator</li>
          </ul>
          <button className="w-full py-3 rounded-xl bg-primary text-white hover:bg-primary/80 transition-colors font-semibold shadow-neon">Upgrade to Premium</button>
        </motion.div>
      </div>
    </section>
  );
}

export function FutureVision() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-neon-blue/5 blur-[100px] rounded-full pointer-events-none"></div>
      <h2 className="text-4xl md:text-5xl font-display font-bold mb-12">The Future is Here</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {["Voice Assistant", "AI Automation", "Marketplace", "Holographic UI"].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-3"
          >
            <Sparkles className="w-8 h-8 text-neon-blue" />
            <span className="font-semibold">{item}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="py-32 px-6 text-center relative z-10">
      <div className="max-w-4xl mx-auto glass-panel p-12 md:p-20 rounded-3xl glow-border">
        <h2 className="text-5xl md:text-7xl font-display font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-neon-pink">
          Start Your AI Life Today
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join thousands of users who have already unified their workflow and accelerated their growth.
        </p>
        <button className="px-10 py-5 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.5)]">
          Join Now
        </button>
      </div>
    </section>
  );
}
