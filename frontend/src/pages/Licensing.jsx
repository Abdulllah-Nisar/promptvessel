import React from 'react';
import { Sparkles } from 'lucide-react';

export function Licensing() {
  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6">

        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-slate-900 text-white px-3 py-1 rounded-full shadow-sm mb-6">
          <Sparkles size={12} className="text-yellow-400" /> Licensing Nodes
        </span>

        <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight mb-8 leading-tight">
          Licensing Nodes
        </h1>

        <div className="space-y-6 text-slate-500 leading-relaxed text-lg">
          <p>
            We believe in the open-source movement. All blueprints submitted to the registry are governed by the MIT License unless stated otherwise.
          </p>
          <h3 className="text-slate-950 font-bold text-xl">What this means:</h3>
          <p>
            You are free to use, modify, and distribute these prompts in your commercial projects, provided you maintain the attribution to the original creator.
          </p>
        </div>

      </div>
    </div>
  );
}