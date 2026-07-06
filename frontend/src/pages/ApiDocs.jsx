import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

export function ApiDocs() {
  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6">

        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-slate-900 text-white px-3 py-1 rounded-full shadow-sm mb-6">
          <Sparkles size={12} className="text-yellow-400" /> API Endpoint Docs
        </span>

        <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight mb-6 leading-tight">
          API Documentation
        </h1>

        <p className="text-slate-500 text-lg leading-relaxed mb-8">
          Integrate Prompt Vessel into your own workflows. Use our registry to fetch optimized prompts dynamically.
        </p>

        <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm">
          <div className="bg-slate-100 p-2.5 rounded-xl inline-block text-slate-900 mb-4">
            <Cpu size={20} />
          </div>
          <div className="bg-slate-950 rounded-2xl p-6 shadow-inner border border-slate-800 font-mono text-xs text-emerald-400 space-y-2">
            <p>Endpoint: https://api.promptvessel.node/v1/registry</p>
            <p>Auth: Bearer {`{YOUR_API_TOKEN}`}</p>
          </div>
        </div>

      </div>
    </div>
  );
}