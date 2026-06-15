import React from 'react';
import { Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto px-8 py-10 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        {/* Left Row Brand Identity */}
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Terminal size={14} className="text-slate-950" />
          <span>© 2026 Prompt Vessel Node. All architectural systems reserved.</span>
        </div>

        {/* Right Row Static Anchors */}
        <div className="flex flex-wrap gap-6 font-semibold text-slate-400">
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Security Schema</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">API Endpoint Docs</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Licensing Nodes</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Contact Stack</span>
        </div>
      </div>
    </footer>
  );
}