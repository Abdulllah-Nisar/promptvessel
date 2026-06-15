import React, { useState, useEffect } from 'react';
import { Search, Flame, Sparkles, Layers, Cpu, ArrowRight } from 'lucide-react';
import PromptCard from '../components/PromptCard';
import { Link } from 'react-router-dom';

const API_TOKEN = 'Bearer ec_pat_nJHtFN0nshpwtnmxTLDlOaLrfalEvqiI7ehBMSui-8Q';
const BASE_URL = 'http://localhost:4321';

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
      headers: { 'Accept': 'application/json', 'Authorization': API_TOKEN }
    }).then(res => res.json());

    const fetchPageSettings = fetch(`${BASE_URL}/_emdash/api/content/pages`, {
      headers: { 'Accept': 'application/json', 'Authorization': API_TOKEN }
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
          const targetId = prompt.id || prompt.slug;
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

  // ✅ Bug fix: 'e' parameter hata diya — yeh function sirf id leta hai
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
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Establishing Control Panel Sync...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-12">

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-slate-900 text-white px-3 py-1 rounded-full shadow-sm">
              <Sparkles size={12} className="text-yellow-400" /> {ui.tagline}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-none">{ui.heading}</h1>
            <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-xl">{ui.subheading}</p>
          </div>
          <div className="lg:col-span-5 w-full h-full min-h-[350px] lg:min-h-[420px] relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-[32px] blur-xl opacity-20 group-hover:opacity-35 transition duration-500"></div>
            <div className="relative w-full h-full min-h-[350px] lg:min-h-[420px] bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200/60 shadow-lg">
              <img src={ui.heroImage} alt="Hero" className="w-full h-full object-cover object-center" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
          {[
            { label: ui.stat1_label, value: ui.stat1_val },
            { label: ui.stat2_label, value: ui.stat2_val },
            { label: ui.stat3_label, value: ui.stat3_val }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-black text-slate-950">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <hr className="border-slate-200 my-8" />

        {/* Filters */}
        <div className="space-y-4 mb-10">
          <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Flame size={16} className="text-orange-500" /> {ui.engineTitle}
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder={ui.searchPlaceholder} className="w-full bg-white border border-slate-200 text-slate-900 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all shadow-sm" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-200">
                {['All', 'Image', 'Video'].map(v => (
                  <button key={v} type="button" onClick={() => setSelectedType(v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedType === v ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{v}</button>
                ))}
              </div>
              <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-200">
                {['All', 'Midjourney', 'DALL-E 3', 'Sora / Runway'].map(m => (
                  <button key={m} type="button" onClick={() => setSelectedModel(m)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedModel === m ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{m}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Cards — click karo toh PromptDetail par jao */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6">
          {displayedData.map(prompt => {
            if (!prompt) return null;
            const emdashData = prompt.data || {};
            const targetId = prompt.id || prompt.slug;
            const cardTitle = emdashData.title || prompt.title || 'Untitled';

            let rawText = '';
            if (Array.isArray(emdashData.content)) {
              rawText = emdashData.content.map(b => b.children?.map(c => c.text || '').join('') || '').join(' ');
            }
            rawText = rawText.replace(/<\/?[^>]+(>|$)/g, "").trim();

            // ✅ Image sahi tarike se extract ho rahi hai
            let cardImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600';
            if (emdashData.featured_image?.meta?.storageKey) {
              cardImage = `${BASE_URL}/_emdash/api/media/file/${emdashData.featured_image.meta.storageKey}`;
            } else if (emdashData.featured_image?.url) {
              cardImage = emdashData.featured_image.url;
            } else if (emdashData.featured_image?.src) {
              cardImage = emdashData.featured_image.src;
            }

            const currentLikeNode = interactiveLikes[targetId] || { count: 520, hasLiked: false };

            return (
              // ✅ Link ab /prompts/:id par jata hai — submit page par nahi
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
                    author: emdashData.author || 'Abdul Hanan',
                    badge: emdashData.badge || 'Live Node',
                    hasLiked: currentLikeNode.hasLiked
                  }}
                  onLikeToggle={(ev) => {
                    ev.preventDefault(); // Link navigate hone se rokta hai
                    handleCardLikeTrigger(targetId);
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* Explore Button */}
        {!isExpanded && filteredData.length > 8 && (
          <div className="flex justify-center items-center mt-8 mb-12">
            <button type="button" onClick={() => setIsExpanded(true)} className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-slate-950 to-slate-800 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg border border-slate-800 cursor-pointer transition-all duration-300">
              {ui.btnExplore} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Info Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <div>
            <div className="bg-slate-100 p-2.5 rounded-xl inline-block text-slate-900 mb-4"><Layers size={20} /></div>
            <h3 className="text-xl font-bold text-slate-950 mb-2">{ui.infoTitle1}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{ui.infoDesc1}</p>
          </div>
          <div>
            <div className="bg-slate-100 p-2.5 rounded-xl inline-block text-slate-900 mb-4"><Cpu size={20} /></div>
            <h3 className="text-xl font-bold text-slate-950 mb-2">{ui.infoTitle2}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{ui.infoDesc2}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
