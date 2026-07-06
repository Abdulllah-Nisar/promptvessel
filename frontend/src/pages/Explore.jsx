import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

export function Explore() {
  const categories = [
    { name: 'Cinematic', desc: 'Photorealistic, film grain, wide-angle.' },
    { name: 'Architectural', desc: 'Brutalist, sleek, 8k interiors.' },
    { name: 'Abstract', desc: 'Fluidity, neon, surreal geometry.' },
    { name: 'Character', desc: 'High-fidelity portraits, lighting.' }
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">

        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-slate-900 text-white px-3 py-1 rounded-full shadow-sm mb-6">
          <Sparkles size={12} className="text-yellow-400" /> Browse by Category
        </span>

        <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight mb-4 leading-tight">
          The Blueprint Library
        </h1>
        <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl mb-12">
          Filter your search by category and discover the next generation of prompts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-950/20 transition-all cursor-pointer"
            >
              <div className="bg-slate-100 p-2.5 rounded-xl inline-block text-slate-900 mb-4">
                <Compass size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-2">{cat.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}