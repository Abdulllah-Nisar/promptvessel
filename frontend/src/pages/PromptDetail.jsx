import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Copy, Check, Heart, ArrowLeft, Cpu, Sparkles, Zap, Share2 } from 'lucide-react';

const API_TOKEN = 'Bearer ec_pat_nJHtFN0nshpwtnmxTLDlOaLrfalEvqiI7ehBMSui-8Q';
const BASE_URL = 'http://localhost:4321';

export default function PromptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [error, setError] = useState('');
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}/_emdash/api/content/posts/${id}`, {
      headers: { 'Accept': 'application/json', 'Authorization': API_TOKEN }
    })
      .then(res => res.json())
.then(data => {
  // ✅ Exact structure: data.data.item
  const item = data?.data?.item || data?.data || data;
  const emdashData = item?.data || {};

  setPrompt({ data: emdashData, id: item?.id });

  const savedLikes = parseInt(emdashData?.likes) || 0;
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  setLikes(savedLikes > 0 ? savedLikes : 500 + (seed % 499));
  setIsLoading(false);
})
      .catch(() => { setError('Post load nahi ho saka.'); setIsLoading(false); });
  }, [id]);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLike = () => {
    setHasLiked(prev => !prev);
    setLikes(prev => hasLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Loading Blueprint...</p>
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-500 font-medium">{error || 'Prompt nahi mila.'}</p>
          <button onClick={() => navigate('/')} className="bg-slate-950 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest">
            Home par wapis jao
          </button>
        </div>
      </div>
    );
  }

  const emdashData = prompt?.data || {};
  const cardTitle = emdashData.title || prompt.title || 'Untitled';
  const author = emdashData.author || 'User';
  const model = emdashData.model || 'Midjourney';
  const badge = emdashData.badge || 'Live Node';

  let promptText = '';
  if (Array.isArray(emdashData.content)) {
    promptText = emdashData.content.map(b => b.children?.map(c => c.text || '').join('') || '').join('\n');
  } else {
    promptText = String(emdashData.content || '');
  }

  let cardImage = '';
if (emdashData.featured_image?.meta?.storageKey) {
  cardImage = `${BASE_URL}/_emdash/api/media/file/${emdashData.featured_image.meta.storageKey}`;
} else if (emdashData.featured_image?.id) {
  // ✅ ID se file fetch karo
  cardImage = `${BASE_URL}/_emdash/api/media/file/${emdashData.featured_image.id}`;
} else if (emdashData.featured_image?.url) {
  cardImage = emdashData.featured_image.url;
}

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* Top Gradient Banner */}
      <div className="w-full h-1.5 bg-gradient-to-r from-violet-600 via-orange-400 to-emerald-500"></div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-950 uppercase tracking-widest mb-10 transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* LEFT: Image Column */}
          <div className="lg:col-span-2 space-y-4">

            {/* Image Card */}
            <div className="relative rounded-[28px] overflow-hidden bg-slate-200 shadow-2xl group">
              {cardImage ? (
                <img
                  src={cardImage}
                  alt={cardTitle}
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full aspect-[4/5] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <Cpu size={64} className="text-slate-300" />
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <p className="text-white text-xs font-mono line-clamp-3 opacity-90">{promptText}</p>
              </div>

              {/* Top badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <span className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-1.5 rounded-lg backdrop-blur-md text-white ${badge === 'Premium' ? 'bg-purple-600/80' : 'bg-black/60'}`}>
                  {badge}
                </span>
                <div className="flex items-center gap-2">
                  {/* Share */}
                  <button
                    onClick={handleShare}
                    className="bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-xs font-bold shadow border border-slate-100 flex items-center gap-1 hover:bg-white transition-all active:scale-95"
                  >
                    {shared ? <Check size={11} className="text-green-600" /> : <Share2 size={11} className="text-slate-500" />}
                  </button>
                  {/* Like */}
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-xs font-bold shadow border border-slate-100 transition-all active:scale-95 ${hasLiked ? 'text-rose-600' : 'text-slate-700'}`}
                  >
                    <Heart size={11} className={hasLiked ? 'fill-rose-600 text-rose-600' : 'text-slate-400'} />
                    {likes}
                  </button>
                </div>
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-orange-400 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Submitted by</p>
                <p className="text-sm font-black text-slate-950">{author}</p>
              </div>
            </div>

          </div>

          {/* RIGHT: Details Column */}
          <div className="lg:col-span-3 space-y-6">

            {/* Model Tag + Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-950 text-white px-3 py-1.5 rounded-full">
                  <Zap size={10} className="text-yellow-400" /> {model}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                  {emdashData.type || 'Image'}
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-tight">{cardTitle}</h1>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-transparent"></div>

            {/* Prompt Box */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Cpu size={11} /> Prompt Blueprint Matrix
              </label>
              <div className="relative bg-slate-950 rounded-2xl p-6 shadow-inner border border-slate-800">
                {/* Decorative dots */}
                <div className="flex gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
                </div>
                <p className="text-emerald-400 text-sm font-mono leading-relaxed whitespace-pre-wrap">
                  {promptText || 'No prompt text available.'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Copy */}
              <button
                onClick={copyPrompt}
                disabled={!promptText}
                className="flex items-center justify-center gap-2 bg-slate-950 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition-all active:scale-95 disabled:bg-slate-300 col-span-2"
              >
                {copied
                  ? <><Check size={14} className="text-green-400" /> Blueprint Copied to Clipboard!</>
                  : <><Copy size={14} /> Copy Full Prompt Blueprint</>
                }
              </button>

              {/* Deploy Own */}
              <Link
                to="/submit"
                className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-950 font-black text-xs uppercase tracking-widest py-3.5 rounded-2xl hover:border-slate-950 transition-all active:scale-95"
              >
                <Sparkles size={13} className="text-yellow-400" /> Deploy Yours
              </Link>

              {/* Like Big */}
              <button
                onClick={toggleLike}
                className={`flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest py-3.5 rounded-2xl border-2 transition-all active:scale-95 ${
                  hasLiked
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-500'
                }`}
              >
                <Heart size={13} className={hasLiked ? 'fill-rose-600' : ''} />
                {hasLiked ? 'Liked!' : 'Like'} · {likes}
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Model', value: model },
                { label: 'Type', value: emdashData.type || 'Image' },
                { label: 'Status', value: 'Live' },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                  <p className="text-xs font-black text-slate-950 truncate">{item.value}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
