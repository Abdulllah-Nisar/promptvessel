import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Compass, Zap, HelpCircle, Globe, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [currentLang, setCurrentLang] = useState({ code: 'EN', name: 'English' });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español (Spanish)' },
    { code: 'FR', name: 'Français (French)' },
    { code: 'AR', name: 'العربية (Arabic)' },
    { code: 'ZH', name: '中文 (Chinese)' }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fixed core function layer to handle click explicitly
  const handleLanguageSelect = (e, lang) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentLang(lang);
    setIsOpen(false);

    // CRITICAL FIX: Emit a global window custom event with language info payload
    const event = new CustomEvent('languageChanged', { detail: lang });
    window.dispatchEvent(event);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-[100] px-8 py-3.5 flex justify-between items-center max-w-full">
      
      {/* Brand Logo Identity */}
      <Link to="/" className="flex items-center gap-2 text-slate-950 font-black tracking-tight text-lg">
        <div className="bg-slate-950 text-white p-1.5 rounded-lg"><Terminal size={16} /></div>
        <span>PROMPT<span className="text-slate-400 font-medium">VESSEL</span></span>
      </Link>

      {/* Center Nav Anchors */}
      <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
        <Link to="/" className="text-slate-950 flex items-center gap-1"><Compass size={16} /> Hub</Link>
        <Link to="/studio" className="hover:text-slate-950 cursor-pointer transition-colors flex items-center gap-1">
            <Zap size={16} /> Studio Matrix
        </Link>
        <span className="hover:text-slate-950 cursor-pointer transition-colors flex items-center gap-1"><HelpCircle size={16} /> Docs</span>
      </div>

      {/* Call To Action & Dropdown Segment */}
      <div className="flex items-center gap-4">
        <Link to="/submit" className="text-xs bg-slate-950 hover:bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all uppercase tracking-wider">
          Deploy Blueprint
        </Link>

        {/* Language Switcher Container */}
        <div className="relative z-[150]" ref={dropdownRef}>
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-950 text-white flex items-center justify-center font-black text-[10px] tracking-wide">
              {currentLang.code}
            </div>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">{currentLang.name}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Floating List Box (Added explicit z-index layers & mouse events routing) */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-[200] pointer-events-auto">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 border-b border-slate-100 mb-1 select-none">
                <Globe size={12} /> Target Translations
              </div>
              
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={(e) => handleLanguageSelect(e, lang)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer block relative z-[210] ${
                    currentLang.code === lang.code 
                      ? 'bg-slate-950 text-white' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="pointer-events-none">{lang.name}</span>
                  <span className={`text-[9px] font-black font-mono px-1.5 py-0.5 rounded pointer-events-none ${
                    currentLang.code === lang.code ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {lang.code}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}