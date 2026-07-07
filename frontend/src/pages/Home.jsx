import React, { useState, useEffect } from 'react';
import { Search, Flame, Rocket, ScanLine, Sparkles, Layers, Cpu, ArrowRight } from 'lucide-react';
import PromptCard from '../components/PromptCard';
import { Link } from 'react-router-dom';

// Ab keys frontend mein nahi -- proxy server inhe apne .env se inject karta hai
const BASE_URL = 'https://promptvessel.vercel.app';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isExpanded, setIsExpanded] = useState(false);
  const [upgradedPrompts, setUpgradedPrompts] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interactiveLikes, setInteractiveLikes] = useState({});

  useEffect(() => {
    const fetchPosts = fetch(`${BASE_URL}/_emdash/api/content/posts`, {
      headers: { 'Accept': 'application/json' }
    }).then(res => res.json());

    const fetchPageSettings = fetch(`${BASE_URL}/_emdash/api/content/pages`, {
      headers: { 'Accept': 'application/json' }
    }).then(res => res.json()).catch(() => null);

    Promise.all([fetchPosts, fetchPageSettings])
      .then(([postsRes, pagesRes]) => {
        let itemsArray = [];
        if (postsRes?.data?.items) itemsArray = postsRes.data.items;
        else if (postsRes?.items) itemsArray = postsRes.items;
        else if (Array.isArray(postsRes)) itemsArray = postsRes;

        setUpgradedPrompts(itemsArray);

        const initialLikesMap = {};
        itemsArray.forEach(prompt => {
          if (!prompt) return;
          const emdashData = prompt.data || {};
          const targetId = prompt.slug || prompt.id; // slug ko priority: SEO-friendly URL
          const seed = targetId ? targetId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : Math.random();
          const savedNum = parseInt(emdashData.likes) || (500 + (seed % 499));
          initialLikesMap[targetId] = { count: savedNum, hasLiked: false };
        });
        setInteractiveLikes(initialLikesMap);

        const homePage = pagesRes?.data?.items?.find(p => p.slug === 'home') || pagesRes?.items?.find(p => p.slug === 'home');
        if (homePage?.data) setPageData(homePage.data);

        setIsLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });
  }, []);

  const handleCardLikeTrigger = (id) => {
    setInteractiveLikes(prev => {
      const currentData = prev[id] || { count: 520, hasLiked: false };
      return {
        ...prev,
        [id]: {
          count: currentData.hasLiked ? currentData.count - 1 : currentData.count + 1,
          hasLiked: !currentData.hasLiked
        }
      };
    });
  };

  const ui = {
    tagline: pageData?.tagline || "Decentralized Prompt Engineering Hub",
    heading: pageData?.heading || "Decode the matrix behind generative art. Explore, clone, and build next-gen prompts.",
    subheading: pageData?.subheading || "Prompt Vessel is an open-source registry where elite prompt engineers share production-ready recipes.",
    heroImage: pageData?.hero_image?.meta?.storageKey
      ? `${BASE_URL}/_emdash/api/media/file/${pageData.hero_image.meta.storageKey}`
      : (pageData?.hero_image?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"),
    stat1_label: pageData?.stat1_label || "Active Prompt Blueprints",
    stat1_val: pageData?.stat1_value || "140K+",
    stat2_label: pageData?.stat2_label || "Generative Creators Joined",
    stat2_val: pageData?.stat2_value || "12.5K+",
    stat3_label: pageData?.stat3_label || "Successful Copies Today",
    stat3_val: pageData?.stat3_value || "480K+",
    engineTitle: pageData?.engine_title || "Trending Prompts Engine",
    searchPlaceholder: pageData?.search_placeholder || "Filter by tags, keyword, aspect ratios...",
    btnExplore: pageData?.btn_explore || "Explore Trending Prompts",
    infoTitle1: pageData?.info_title1 || "Immutable Open Source Framework",
    infoDesc1: pageData?.info_desc1 || "We believe prompt intelligence shouldn't be locked behind silos.",
    infoTitle2: pageData?.info_title2 || "Automated Execution Testing",
    infoDesc2: pageData?.info_desc2 || "Every blueprint shared is natively analyzed across varying aspect configurations.",
  };

  const filteredData = Array.isArray(upgradedPrompts) ? upgradedPrompts.filter(p => {
    if (!p) return false;
    const emdashData = p.data || {};
    const titleText = String(emdashData.title || p.title || '').toLowerCase();
    let mainPromptText = '';
    if (Array.isArray(emdashData.content)) {
      mainPromptText = emdashData.content.map(b => b.children?.map(c => c.text || '').join('') || '').join(' ');
    }
    const query = searchTerm.toLowerCase();
    const matchesSearch = titleText.includes(query) || mainPromptText.toLowerCase().includes(query);
    const promptModel = emdashData.model || 'Midjourney';
    const promptType = emdashData.type || 'Image';
    const matchesModel = selectedModel === 'All' || promptModel === selectedModel;
    const matchesType = selectedType === 'All' || promptType === selectedType;
    return matchesSearch && matchesModel && matchesType;
  }) : [];

  const displayedData = filteredData.slice(0, isExpanded ? undefined : 8);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest animate-pulse">Establishing Control Panel Sync...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-[#FAFAF8] text-[#14161A] min-h-screen relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap');
        .hf-display { font-family: 'Space Grotesk', sans-serif; }
        .hf-mono { font-family: 'IBM Plex Mono', monospace; }
        .hf-body { font-family: 'Inter', sans-serif; }
        .hf-grid {
          background-image: linear-gradient(rgba(20,22,26,0.035) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(20,22,26,0.035) 1px, transparent 1px);
          background-size: 40px 40px;
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 55%);
                  mask-image: linear-gradient(to bottom, #000 0%, transparent 55%);
        }
        .hf-corner {
          position: absolute;
          width: 22px; height: 22px;
          border-color: #FF6B35;
        }
      `}</style>

      <div className="absolute inset-0 hf-grid pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-14 relative">

        {/* HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <span className="hf-mono inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-[#0F8B8D] border border-[#0F8B8D]/30 bg-[#0F8B8D]/5 px-3 py-1.5 rounded-md">
              <Sparkles size={12} /> {ui.tagline}
            </span>
            <h1 className="hf-display text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-[#14161A] tracking-tight leading-[1.05]">
              {ui.heading.split('generative art').length > 1 ? (
                <>
                  {ui.heading.split('generative art')[0]}
                  <span className="text-[#FF6B35]">generative art</span>
                  {ui.heading.split('generative art')[1]}
                </>
              ) : ui.heading}
            </h1>
            <p className="hf-body text-[#5B5F6B] text-base md:text-lg leading-relaxed max-w-xl">{ui.subheading}</p>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/submit"
                className="group hf-mono inline-flex items-center gap-2 bg-[#14161A] hover:bg-[#FF6B35] text-white text-[11px] font-medium uppercase tracking-widest px-6 py-3.5 rounded-md transition-colors duration-300"
              >
                <Rocket size={14} />
                Deploy Blueprint
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/reverse-prompt"
                className="group hf-mono inline-flex items-center gap-2 bg-white hover:bg-[#0F8B8D]/5 border border-[#E4E4E0] hover:border-[#0F8B8D]/40 text-[#14161A] text-[11px] font-medium uppercase tracking-widest px-6 py-3.5 rounded-md transition-colors duration-300"
              >
                <ScanLine size={14} className="text-[#0F8B8D]" />
                Reverse Prompt
              </Link>
            </div>
          </div>
          

          <div className="lg:col-span-5 w-full relative">
            <div className="relative w-full h-full min-h-[340px] lg:min-h-[400px] rounded-md overflow-hidden border border-[#E4E4E0] bg-[#14161A]">
              <img src={ui.heroImage} alt="Hero" className="w-full h-full object-cover object-center opacity-95" />
            </div>
            {/* corner brackets */}
            <div className="hf-corner -top-2 -left-2 border-t-2 border-l-2" />
            <div className="hf-corner -top-2 -right-2 border-t-2 border-r-2" />
            <div className="hf-corner -bottom-2 -left-2 border-b-2 border-l-2" />
            <div className="hf-corner -bottom-2 -right-2 border-b-2 border-r-2" />
            <div className="hf-mono absolute -bottom-7 left-0 text-[11px] text-[#8B90A0] tracking-wider">
              FIG.01 — DECODE SUBJECT
            </div>
          </div>
        </div>

        {/* STATS SPEC STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-t-[3px] border-[#FF6B35] rounded-md overflow-hidden bg-white mb-10">
          {[
            { label: ui.stat1_label, value: ui.stat1_val },
            { label: ui.stat2_label, value: ui.stat2_val },
            { label: ui.stat3_label, value: ui.stat3_val }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`p-6 ${idx !== 2 ? 'sm:border-r border-[#E4E4E0]' : ''} ${idx !== 0 ? 'border-t sm:border-t-0 border-[#E4E4E0]' : ''}`}
            >
              <div className="hf-display text-3xl font-bold text-[#14161A]">{stat.value}</div>
              <div className="hf-mono text-[11px] uppercase tracking-widest text-[#8B90A0] mt-1.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* SECTION MARKER */}
        <div className="flex items-center gap-3 mb-8">
          <span className="hf-mono text-[11px] tracking-widest text-[#8B90A0] uppercase whitespace-nowrap">Section 02</span>
          <div className="h-px flex-1 bg-[#E4E4E0]" />
          <span className="hf-mono text-sm font-medium text-[#14161A] flex items-center gap-2 whitespace-nowrap">
            <Flame size={14} className="text-[#FF6B35]" /> {ui.engineTitle}
          </span>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B90A0]" size={16} />
            <input
              type="text"
              placeholder={ui.searchPlaceholder}
              className="hf-body w-full bg-white border border-[#E4E4E0] text-[#14161A] pl-10 pr-4 py-3 rounded-md text-sm focus:outline-none focus:border-[#FF6B35]/50 transition-colors"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex bg-white p-1 rounded-md border border-[#E4E4E0]">
              {['All', 'Image', 'Video'].map(v => (
                <button
                  key={v} type="button" onClick={() => setSelectedType(v)}
                  className={`hf-mono px-3 py-1.5 rounded text-[11px] font-medium uppercase tracking-wide transition-all ${selectedType === v ? 'bg-[#14161A] text-white' : 'text-[#5B5F6B] hover:text-[#14161A]'}`}
                >{v}</button>
              ))}
            </div>
            <div className="flex bg-white p-1 rounded-md border border-[#E4E4E0]">
              {['All', 'Midjourney', 'DALL-E 3', 'Sora / Runway'].map(m => (
                <button
                  key={m} type="button" onClick={() => setSelectedModel(m)}
                  className={`hf-mono px-3 py-1.5 rounded text-[11px] font-medium uppercase tracking-wide transition-all ${selectedModel === m ? 'bg-[#14161A] text-white' : 'text-[#5B5F6B] hover:text-[#14161A]'}`}
                >{m}</button>
              ))}
            </div>
          </div>
        </div>

        {/* PROMPT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6">
          {displayedData.map(prompt => {
            if (!prompt) return null;
            const emdashData = prompt.data || {};
            const targetId = prompt.slug || prompt.id; // slug ko priority: SEO-friendly URL
            const cardTitle = emdashData.title || prompt.title || 'Untitled';

            let rawText = '';
            if (Array.isArray(emdashData.content)) {
              rawText = emdashData.content.map(b => b.children?.map(c => c.text || '').join('') || '').join(' ');
            }
            rawText = rawText.replace(/<\/?[^>]+(>|$)/g, "").trim();

            let cardImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600';
            const featImg = emdashData.featured_image;
            if (featImg?.meta?.storageKey) {
              cardImage = `${BASE_URL}/_emdash/api/media/file/${featImg.meta.storageKey}`;
            } else if (featImg?.url) {
              cardImage = featImg.url;
            } else if (featImg?.src) {
              cardImage = featImg.src;
            }

            const currentLikeNode = interactiveLikes[targetId] || { count: 520, hasLiked: false };

            return (
              <Link to={`/prompts/${targetId}`} key={targetId} className="block">
                <PromptCard
                  prompt={{
                    id: targetId,
                    title: cardTitle,
                    text: rawText,
                    model: emdashData.model || 'Midjourney',
                    type: emdashData.type || 'Image',
                    likes: String(currentLikeNode.count),
                    image: cardImage,
                    author: emdashData.author || 'Prompt Vessel',
                    badge: emdashData.badge || 'Live Node',
                    hasLiked: currentLikeNode.hasLiked
                  }}
                  onLikeToggle={(ev) => {
                    ev.preventDefault();
                    handleCardLikeTrigger(targetId);
                  }}
                />
              </Link>
            );
          })}
        </div>

        {!isExpanded && filteredData.length > 8 && (
          <div className="flex justify-center items-center mt-4 mb-14">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="hf-mono group inline-flex items-center gap-2 bg-[#14161A] hover:bg-[#FF6B35] text-white text-[11px] font-medium uppercase tracking-widest px-8 py-4 rounded-md transition-colors duration-300"
            >
              {ui.btnExplore} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* INFO BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E4E4E0] border border-[#E4E4E0] rounded-md overflow-hidden mb-16">
          <div className="bg-white p-8 border-l-2 border-[#FF6B35]">
            <div className="text-[#14161A] mb-4"><Layers size={20} /></div>
            <h3 className="hf-display text-lg font-semibold text-[#14161A] mb-2">{ui.infoTitle1}</h3>
            <p className="hf-body text-[#5B5F6B] text-sm leading-relaxed">{ui.infoDesc1}</p>
          </div>
          <div className="bg-white p-8 border-l-2 border-[#0F8B8D]">
            <div className="text-[#14161A] mb-4"><Cpu size={20} /></div>
            <h3 className="hf-display text-lg font-semibold text-[#14161A] mb-2">{ui.infoTitle2}</h3>
            <p className="hf-body text-[#5B5F6B] text-sm leading-relaxed">{ui.infoDesc2}</p>
          </div>
        </div>
      </div>
    </div>
  );
}