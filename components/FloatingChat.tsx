// components/FloatingChat.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'হ্যালো! স্মার্ট ফ্যামিলি আইটি সলিউশন্স ওয়ার্ল্ডে আপনাকে স্বাগতম। আজ আপনাকে কীভাবে সাহায্য করতে পারি?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [isHandover, setIsHandover] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const whatsappNumber = '8801934111005';
  const messengerUsername = 'h.m.alim.2025';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || isHandover) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (data.handover) {
        setIsHandover(true);
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: data.reply || 'দুঃখিত, কোনো সমস্যা হয়েছে।' },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'সার্ভারে সংযোগ স্থাপন করা যাচ্ছে না। দয়া করে একটু পর চেষ্টা করুন।' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window Popup */}
      {isOpen && (
        <div className="w-[360px] h-[500px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Smart Family AI Support</h3>
                <p className="text-[10px] text-slate-200">Powered by Gemini AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white text-lg font-bold px-2 py-1 rounded-lg hover:bg-white/10 transition"
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl shadow-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-100 border border-slate-700/50 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (typingIndicator())}
            <div ref={messagesEndRef} />
          </div>

          {/* Handover Action Buttons (if triggered) */}
          {isHandover ? (
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 justify-center">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello,%20I%20need%20human%20support%20from%20chat.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-center py-2 px-3 rounded-xl text-xs font-semibold shadow transition"
              >
                WhatsApp-এ কথা বলুন
              </a>
              <a
                href={`https://m.me/${messengerUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-center py-2 px-3 rounded-xl text-xs font-semibold shadow transition"
              >
                Messenger-এ যান
              </a>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="আপনার মেসেজ এখানে লিখুন..."
                className="flex-1 bg-slate-950 border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition disabled:opacity-50"
              >
                পাঠান
              </button>
            </form>
          )}
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 text-white shadow-[0_8px_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(59,130,246,0.8)] active:scale-95 focus:outline-none border border-blue-400/30 backdrop-blur-md group/btn"
      >
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/30 opacity-0 transition-opacity group-hover/btn:opacity-100" />
        
        {/* Tooltip */}
        <span className="absolute right-16 px-3 py-1 text-xs font-semibold tracking-wide text-white bg-gray-900/90 rounded-lg opacity-0 translate-x-2 transition-all duration-300 pointer-events-none group-hover/btn:opacity-100 group-hover/btn:translate-x-0 shadow-lg whitespace-nowrap border border-white/10">
          {isOpen ? 'Close Chat' : 'AI Live Chat'}
        </span>

        {isOpen ? (
          <span className="text-2xl font-bold z-10">✕</span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current drop-shadow-md z-10" aria-hidden="true">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0-2-.9-2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
      </button>
    </div>
  );
}

// Helper typing indicator component
function typingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-800 text-slate-400 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs flex items-center gap-1.5 border border-slate-700/50">
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
    </div>
  );
}