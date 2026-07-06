import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="px-8 py-6 border-t border-slate-100 flex justify-between items-center bg-white">
      <div className="text-[11px] font-bold text-slate-500">
        &copy; 2026 Prompt Vessel Node. All architectural systems reserved.
      </div>
      <div className="flex gap-6 text-[11px] font-bold text-slate-400">
        <Link to="/security" className="hover:text-slate-950 transition">Security Schema</Link>
        <Link to="/api-docs" className="hover:text-slate-950 transition">API Endpoint Docs</Link>
        <Link to="/licensing" className="hover:text-slate-950 transition">Licensing Nodes</Link>
        <Link to="/contact" className="hover:text-slate-950 transition">Contact Stack</Link>
      </div>
    </footer>
  );
}