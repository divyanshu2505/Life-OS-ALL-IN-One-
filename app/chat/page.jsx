"use client";
import React, { useState, useCallback, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import Navbar from '../../components/Navbar';

// 🔥 QUICK SPEED BOOST: Prevent unnecessary re-renders using React.memo
const MessageList = React.memo(({ messages }) => (
  <div className="flex-1 overflow-y-auto space-y-4 p-4 glass-panel rounded-2xl mb-4 border border-white/5">
    {messages.map((msg, i) => (
      <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><Bot size={16}/></div>}
        <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-primary/20 text-white' : 'bg-surface border border-white/5'}`}>
          {msg.content}
        </div>
        {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0"><User size={16}/></div>}
      </div>
    ))}
  </div>
));

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your LifeOS AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const debounceRef = useRef(null);

  // 🔥 QUICK SPEED BOOST: Debounce input/API call
  const handleSend = useCallback(() => {
    if (!input.trim() || isTyping) return;
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    debounceRef.current = setTimeout(() => {
      let aiResponse = "I'm a local AI assistant. I can help you code, plan your day, or summarize content. What exactly would you like to explore?";
      const lower = userMessage.toLowerCase();
      
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        aiResponse = "Hello there! How can I assist you with your projects today?";
      } else if (lower.includes("code") || lower.includes("react") || lower.includes("nextjs") || lower.includes("bug")) {
        aiResponse = "I'd love to help with your code! Please share the snippet or describe the bug you're encountering, and we can debug it together.";
      } else if (lower.includes("who are you") || lower.includes("what are you")) {
        aiResponse = "I am LifeOS AI, an intelligent assistant created to boost your productivity. I can write code, analyze data, and optimize your workflows.";
      } else if (lower.includes("weather") || lower.includes("time")) {
        aiResponse = "I don't have access to real-time external APIs in this demo mode, but normally I would fetch the live data for you right here!";
      } else if (lower.includes("joke") || lower.includes("funny")) {
        aiResponse = "Why do programmers prefer dark mode? Because light attracts bugs! 🐛";
      } else if (lower.length < 10) {
        aiResponse = "Could you tell me a little more about that?";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1200); // Simulated AI thinking time
  }, [input, isTyping]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-white">
      <Navbar />
      <div className="flex-1 max-w-4xl w-full mx-auto mt-24 p-4 flex flex-col h-[calc(100vh-8rem)]">
        <MessageList messages={messages} />
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..." 
            className="w-full bg-surface border border-white/10 rounded-full py-4 pl-6 pr-16 text-white outline-none focus:border-primary transition-colors disabled:opacity-50"
            disabled={isTyping}
          />
          <button onClick={handleSend} disabled={isTyping} className="absolute right-2 p-3 bg-primary rounded-full hover:bg-primary/80 transition-colors disabled:opacity-50">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
