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
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    debounceRef.current = setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: "This is a simulated AI response. Optimized with Debounce and Memoization!" }]);
      setIsTyping(false);
    }, 800); // Debounced mock API call
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
