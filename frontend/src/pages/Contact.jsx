import React from 'react';
import { Mail, Clock, MessageSquare, Handshake, Layers3, ArrowUpRight, Sparkles } from 'lucide-react';

export function Contact() {
  const channels = [
    {
      icon: MessageSquare,
      title: 'Technical Support',
      desc: 'Issues with blueprint execution, API access, or node syncing.',
      email: 'support@promptvessel.node',
    },
    {
      icon: Handshake,
      title: 'Partnerships',
      desc: 'Integrations, creator collabs, and ecosystem proposals.',
      email: 'partners@promptvessel.node',
    },
    {
      icon: Layers3,
      title: 'Blueprint Indexing',
      desc: 'Submit or verify a prompt blueprint for the public registry.',
      email: 'index@promptvessel.node',
    },
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-slate-900 text-white px-3 py-1 rounded-full shadow-sm mb-6">
          <Sparkles size={12} className="text-yellow-400" /> Contact Stack
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight mb-4 leading-[1.1]">
          Let's talk shop.
        </h1>
        <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-xl mb-14">
          Need help? Reach out to our engineering team for technical support, partnership inquiries, or blueprint indexing.
        </p>

        {/* Channel cards */}
        <div className="space-y-4 mb-16">
          {channels.map((c, idx) => (
            <div
              key={idx}
              className="group p-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-950/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-slate-100 text-slate-900 shrink-0">
                    <c.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 mb-1">{c.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-3 max-w-md">{c.desc}</p>
                    <a
                      href={`mailto:${c.email}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:text-slate-700 transition-colors"
                    >
                      {c.email}
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Response time footer note */}
        <div className="flex items-center gap-3 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">Response time</p>
            <p className="text-sm text-slate-500">Usually within 24 hours, Monday to Friday.</p>
          </div>
        </div>
      </div>
    </div>
  );
}