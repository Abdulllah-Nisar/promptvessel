import React from 'react';
import { Sparkles, Layers, Cpu } from 'lucide-react';

export function About() {
  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">

        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-slate-900 text-white px-3 py-1 rounded-full shadow-sm mb-6">
          <Sparkles size={12} className="text-yellow-400" /> About Prompt Vessel
        </span>

        <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight mb-8 leading-tight">
          Who We Are
        </h1>

        <div className="space-y-6 text-slate-500 leading-relaxed text-lg">
          <p>
            We are a team of prompt engineers tired of closed-source AI tools. We built Prompt Vessel to make the "art of the prompt" as transparent as the code it generates.
          </p>

          <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm">
            <div className="bg-slate-100 p-2.5 rounded-xl inline-block text-slate-900 mb-4">
              <Layers size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-950 mb-2">Our Vision</h3>
            <p className="text-slate-500 text-base leading-relaxed">
              A future where every AI creator can stand on the shoulders of giants. Open access, precise testing, and collaborative evolution.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}