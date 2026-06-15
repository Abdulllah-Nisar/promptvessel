import React, { useState } from 'react';
import { Copy, Check, Heart } from 'lucide-react';

// Accepting onLikeToggle callback safely alongside the prompt model object data references
export default function PromptCard({ prompt, onLikeToggle }) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative group">
      {/* Image Area */}
      <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
        <img 
          src={prompt.image} 
          alt={prompt.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
        />
        
        {/* Top Badges Row Connected and Click-Listener Embedded safely */}
        <div className="absolute top-3 inset-x-3 flex justify-between items-center z-10">
          {/* Badge Label Tag */}
          <span className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg backdrop-blur-md text-white pointer-events-none ${prompt.badge === 'Premium' ? 'bg-purple-600/80' : 'bg-black/60'}`}>
            {prompt.badge}
          </span>
          
          {/* INTERACTIVE LIKE TRIGGER ACTION BUTTON */}
          <button
            type="button"
            onClick={onLikeToggle} // Triggers the dynamic state modifier loop up inside Home.jsx
            className={`bg-white/90 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1 shadow-sm border border-slate-100 cursor-pointer hover:bg-white active:scale-95 transition-all outline-none focus:outline-none ${
              prompt.hasLiked ? 'text-rose-600' : 'text-slate-800'
            }`}
          >
            {/* Dynamic Fill Color condition dependent upon local state user tracking logs */}
            <Heart 
              size={11} 
              className={`transition-colors ${prompt.hasLiked ? 'text-rose-600 fill-rose-600' : 'text-slate-400'}`} 
            /> 
            <span>{prompt.likes}</span>
          </button>
        </div>

        {/* Hover overlay text reveal effect */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 pt-16 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white pointer-events-auto">
          <p className="text-[11px] font-medium tracking-wide line-clamp-4 text-slate-200 mb-3 font-mono bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
            {prompt.text}
          </p>
          <button 
            onClick={copyPrompt}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-white text-slate-950 py-2.5 px-4 rounded-xl shadow-md hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
            {copied ? 'Copied Blueprint' : 'Copy Prompt'}
          </button>
        </div>
      </div>
      
      {/* Bottom info section */}
      <div className="p-4 bg-white flex justify-between items-center border-t border-slate-100 mt-auto">
        <span className="font-bold text-slate-950 text-xs md:text-sm truncate max-w-[65%]">{prompt.title}</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">by {prompt.author}</span>
      </div>
    </div>
  );
}