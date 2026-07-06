import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Compass, RotateCcw, Zap, Sparkles, HelpCircle, Globe, ChevronDown, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [currentLang, setCurrentLang] = useState({ code: 'EN', name: 'English' });
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state
  const dropdownRef = useRef(null);
  const { t } = useLanguage();

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

  const handleLanguageSelect = (e, lang) => {
    e.preventDefault();
    setLang(lang.code);
    e.stopPropagation();
    setCurrentLang(lang);
    setIsOpen(false);
    const event = new CustomEvent('languageChanged', { detail: lang });
    window.dispatchEvent(event);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-[100] px-6 md:px-8 py-3.5 flex justify-between items-center max-w-full">
      
      {/* Brand Logo Identity */}
      <Link to="/" className="flex items-center gap-2 text-slate-950 font-black tracking-tight text-lg group">
        <div className="bg-slate-950 group-hover:bg-[#FF6B35] text-white p-1.5 rounded-lg transition-all duration-300 group-hover:rotate-[8deg] group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-orange-500/20">
          <Terminal size={16} className="transition-transform duration-300" />
        </div>
        <span className="relative">
            PROMPT
            <span className="text-slate-400 font-medium group-hover:text-slate-500 transition-colors duration-300">VESSEL</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#FF6B35] group-hover:w-full transition-all duration-300 ease-out" />
        </span>
      </Link>

      {/* Center Nav Anchors (Desktop) */}
      <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
        <Link to="/explore" className="hover:text-slate-950 transition-colors flex items-center gap-1"><Compass size={16} /> Explore</Link>
        <Link to="/about" className="hover:text-slate-950 transition-colors flex items-center gap-1"><Globe size={16} /> About</Link>
        <Link to="/studio" className="hover:text-slate-950 transition-colors flex items-center gap-1"><Zap size={16} /> Studio</Link>
        <Link to="/reverse-prompt" className="hover:text-slate-950 transition-colors flex items-center gap-1"><RotateCcw size={16} /> Reverse Prompt</Link>
        <Link to="/faq" className="hover:text-slate-950 transition-colors flex items-center gap-1"><HelpCircle size={16} /> FAQ</Link>
        <Link to="/guide" className="hover:text-slate-950 transition-colors flex items-center gap-1"><Sparkles size={16} /> Guide</Link>
        
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <Link to="/submit" className="hidden sm:flex text-xs bg-slate-950 hover:bg-[#FF6B35] text-white hover:text-black transition-all duration-200 ease-in-out hover:scale-105 uppercase tracking-wider font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all uppercase tracking-wider">
          Deploy Blueprint
        </Link>
        
        {/* Language Switcher */}
        <div className="relative z-[150]" ref={dropdownRef}>
          <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 hover:bg-slate-100 transition-colors shadow-sm">
            <div className="w-6 h-6 rounded-lg bg-slate-950 text-white flex items-center justify-center font-black text-[10px]">{currentLang.code}</div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-[200]">
              {languages.map((lang) => (
  <button
    key={lang.code}
    type="button"
    onClick={(e) => handleLanguageSelect(e, lang)}
    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
  >
    {lang.name}
  </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button className="md:hidden p-2 text-slate-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer (Updated Section) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 p-6 flex flex-col gap-6 shadow-2xl z-[90]">
          <Link to="/explore" className="text-lg font-bold text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Explore</Link>
          <Link to="/about" className="text-lg font-bold text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/faq" className="text-lg font-bold text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
          <Link to="/studio" className="text-lg font-bold text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Studio Matrix</Link>
          <Link to="/submit" className="w-full text-center bg-slate-950 text-white font-bold py-3 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Deploy Blueprint</Link>
        </div>
      )}
    </nav>
  );
}