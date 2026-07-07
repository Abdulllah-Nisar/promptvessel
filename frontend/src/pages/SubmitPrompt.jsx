import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Upload, Cpu } from 'lucide-react';

// Ab keys frontend mein nahi -- proxy server inhe apne .env se inject karta hai
const BASE_URL = 'https://promptvessel.vercel.app';

// Title se URL-friendly slug banata hai (SEO ke liye)
function generateSlug(title) {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // accents hatayein
    .replace(/[^a-z0-9\s-]/g, '')   // special characters hatayein
    .replace(/\s+/g, '-')            // spaces ko - se replace karein
    .replace(/-+/g, '-')             // multiple -- ko single - banayein
    .replace(/^-|-$/g, '');          // start/end ke - hatayein
}

export default function Submit() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [model, setModel] = useState('Midjourney');
  const [promptText, setPromptText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setStatusMessage(`📁 Image selected: ${e.target.files[0].name}`);
    }
  };

  const triggerMatrixDeployment = async (e) => {
    e.preventDefault();

    if (!title.trim() || !promptText.trim()) {
      setStatusMessage('❌ Blueprint Title aur Prompt Text zaroori hain.');
      return;
    }

    setIsSubmitting(true);

    try {
      // ── Step 1: Image upload ──
      let featured_image = null;

      if (selectedFile) {
        setStatusMessage('📸 Image upload ho rahi hai...');

        const formData = new FormData();
        formData.append('file', selectedFile);

        const mediaRes = await fetch(`${BASE_URL}/_emdash/api/media`, {
          method: 'POST',
          body: formData,
        });

        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          console.log('Media upload response:', mediaData);

          const item = mediaData?.data?.item
            || mediaData?.data?.items?.[0]
            || mediaData?.data
            || mediaData;
          const storageKey = item?.storageKey || item?.filename || item?.id;

          if (storageKey) {
            featured_image = {
              id: item?.id || storageKey,
              filename: storageKey,
              meta: { storageKey: storageKey }
            };
            setStatusMessage('✅ Image upload ho gayi!');
          }
        } else {
          console.warn('Image upload failed');
          setStatusMessage('⚠️ Image upload nahi hui, prompt bina image ke save hoga...');
        }
      }

      // ── Step 2: Slug generate karein title se ──
      const baseSlug = generateSlug(title);

      // ── Step 3: Post create ──
      setStatusMessage('📡 Prompt database mein save ho raha hai...');

      const payload = {
        title: title,
        slug: baseSlug, // ✅ EmDash ko custom slug bhej rahe hain (title-based, SEO friendly)
        status: 'draft',
        data: {
          title: title,
          model: model,
          content: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: promptText }]
            }
          ],
        }
      };

      if (featured_image) {
        payload.data.featured_image = featured_image;
      }

      const response = await fetch(`${BASE_URL}/_emdash/api/content/posts`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => ({}));
      console.log('Post create response:', responseData);

      if (!response.ok) {
        throw new Error(
          typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        );
      }

      // ── Step 4: Server ne jo actual slug assign kiya wo check karein ──
      const createdItem = responseData?.data?.item || responseData?.data || responseData;
      const finalSlug = createdItem?.slug || baseSlug;
      console.log('Final slug used by EmDash:', finalSlug);

      setStatusMessage('✅ Prompt successfully deploy ho gaya! Redirect ho raha hai...');
      setTitle('');
      setPromptText('');
      setSelectedFile(null);

      setTimeout(() => navigate(`/prompts/${finalSlug}`), 1200);

    } catch (err) {
      console.error('Error:', err);
      setStatusMessage(`❌ Deployment Failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">

        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl font-black text-slate-950 flex items-center justify-center gap-2 tracking-tight">
            <Cpu size={28} /> Deploy Generative Prompt Blueprint
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-2xl mx-auto">
            Contribute your advanced text token matrices to the open-source registry. Every configuration undergoes automated metadata verification.
          </p>
        </div>

        {statusMessage && (
          <div className="mb-6 p-4 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono tracking-wide shadow-inner text-center border border-slate-800 break-words">
            {statusMessage}
          </div>
        )}

        <form onSubmit={triggerMatrixDeployment} className="bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-sm space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black tracking-widest uppercase text-slate-400">Blueprint Title / Concept Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Cyberpunk Cityscape"
                className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-950 transition-all"
              />
              {/* Live URL preview — SEO transparency ke liye */}
              {title.trim() && (
                <p className="text-[10px] font-mono text-slate-400 truncate">
                  URL: yourdomain.com/prompts/{generateSlug(title) || '...'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black tracking-widest uppercase text-slate-400">Target Model Engine Configuration</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-xs font-bold focus:outline-none focus:border-slate-950 transition-all"
              >
                <option value="Midjourney">Midjourney v6.0 [RAW Optimization]</option>
                <option value="DALL-E 3">DALL-E 3 [OpenAI Matrix]</option>
                <option value="Sora / Runway">Sora / Runway [Video Synthesis Engine]</option>
                <option value="Chat Gpt">Chat GPT Prompt [Large Language Token]</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black tracking-widest uppercase text-slate-400">Exact Prompt Weights & Token Text Structure</label>
            <textarea
              rows={5}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Paste complete raw parameter values including aspect ratios, lighting weights, styles, camera matrices, and version parameters..."
              className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 p-4 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-950 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black tracking-widest uppercase text-slate-400">Verified Generative Output Execution (High Definition Render)</label>
            <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-8 text-center transition-colors relative bg-[#f8fafc]">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-2 text-slate-500 pointer-events-none">
                <Upload className="mx-auto text-slate-400" size={24} />
                <p className="text-xs font-bold text-slate-700">
                  {selectedFile ? `✅ Selected: ${selectedFile.name}` : 'Upload execution asset pipeline'}
                </p>
                <p className="text-[10px] tracking-wide">Supports PNG, JPEG, WEBP or RAW up to 10MB file dimensions</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-950 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-md hover:bg-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-400"
            >
              <Sparkles size={14} className="text-yellow-400" />
              {isSubmitting ? 'Deploying to Cluster...' : 'Deploy Blueprint Matrix'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}