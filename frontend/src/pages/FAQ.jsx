import React from 'react';
import { Sparkles } from 'lucide-react';

export function FAQ() {
  const faqs = [
    { q: 'How do I clone a prompt?', a: 'Simply click "Copy" on any blueprint and paste it into your engine.' },
    { q: 'Can I contribute?', a: 'Yes! Join our registry, submit your blueprint, and get indexed in our search engine.' },
    { q: 'Why is my image failing?', a: 'Check if the AI Engine (Puter.ai) is currently handling high traffic.' }
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">

        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-slate-900 text-white px-3 py-1 rounded-full shadow-sm mb-6">
          <Sparkles size={12} className="text-yellow-400" /> Help & FAQ
        </span>

        <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight mb-12 leading-tight">
          Help & FAQ
        </h1>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 className="font-bold text-slate-950 mb-2">{f.q}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}