import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export function Security() {
  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6">

        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-slate-900 text-white px-3 py-1 rounded-full shadow-sm mb-6">
          <Sparkles size={12} className="text-yellow-400" /> Security & Privacy
        </span>

        <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight mb-8 leading-tight">
          Security & Privacy
        </h1>

        <div className="space-y-6 text-slate-500 leading-relaxed text-lg">
          <p>
            At Prompt Vessel, we treat your prompt architecture as top-secret data. Our platform ensures end-to-end encryption for all stored blueprints.
          </p>

          <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm">
            <div className="bg-slate-100 p-2.5 rounded-xl inline-block text-slate-900 mb-4">
              <Shield size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-950 mb-3">Our Measures</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-500 text-base">
              <li>End-to-end data encryption.</li>
              <li>Regular security audits of our API layers.</li>
              <li>Zero-tolerance policy for unauthorized access.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}