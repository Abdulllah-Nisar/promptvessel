import React, { useState, useEffect } from 'react';
import { Sparkles, Upload, Maximize2, Image as ImageIcon, Sliders, Play, Loader2, ThumbsUp, MessageSquare, Eye, Share2, Download } from 'lucide-react';

export default function Studio() {
  const [prompt, setPrompt] = useState('');
  const [activeModel, setActiveModel] = useState('Pro (Flux.1)');
  const [aspectRatio, setAspectRatio] = useState('Landscape');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Yeh aapki image save karega
  const [generatedImage, setGeneratedImage] = useState(null);
  const [activePromptDisplay, setActivePromptDisplay] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isEngineReady, setIsEngineReady] = useState(false);

  const models = [
    { name: 'Standard', id: 'gpt-image-2' },
    { name: 'Pro (Flux.1)', id: 'black-forest-labs/flux-schnell' },
    { name: 'SD3 (Stable)', id: 'stabilityai/stable-diffusion-3-medium' }
  ];
  
  const aspectRatios = [
    { name: 'Square', label: 'Square 1:1', ratio: '1:1', style: 'w-6 h-6' },
    { name: 'Landscape', label: 'Landscape 16:9', ratio: '16:9', style: 'w-9 h-5' },
    { name: 'Portrait', label: 'Portrait 9:16', ratio: '9:16', style: 'w-5 h-9' },
    { name: 'Classic', label: 'Classic 4:3', ratio: '4:3', style: 'w-8 h-6' }
  ];

  // Puter.js AI Engine Setup
  useEffect(() => {
    if (window.puter) {
      setIsEngineReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    script.onload = () => {
      console.log("AI Engine Loaded Successfully");
      setIsEngineReady(true);
    };
    script.onerror = () => {
      console.error("Failed to load AI Engine");
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGenerateAssetMatrix = async (e) => {
    e.preventDefault(); 
    if (!prompt.trim() || !isEngineReady) return;
    
    setIsGenerating(true);
    setHasError(false);
    setGeneratedImage(null);
    setActivePromptDisplay(prompt.trim());

    const selectedEngine = models.find(m => m.name === activeModel)?.id || 'black-forest-labs/flux-schnell';

    try {
      const imgElement = await window.puter.ai.txt2img(prompt.trim(), { model: selectedEngine });
      
      if (imgElement && imgElement.src) {
        setGeneratedImage(imgElement.src);
      } else {
        throw new Error("No image data received");
      }

      setPrompt(''); 

    } catch (error) {
      console.error("Generation Pipeline Failed:", error);
      setHasError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  
  // 🧠 THE ROBUST BLOB-DOWNLOAD LOGIC
  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      // 1. Image ko Fetch karke Blob (Binary Data) mein convert karein
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      
      // 2. Browser ki memory mein is image ka local URL banayein
      const url = window.URL.createObjectURL(blob);
      
      // 3. Ek chota sa temporary hidden link banayein aur usay click trigger karein
      const link = document.createElement('a');
      link.href = url;
      link.download = `PromptVessel-${Date.now()}.png`; // File ka naam
      document.body.appendChild(link);
      link.click();
      
      // 4. Download hone ke baad memory saaf karein
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed, falling back to new tab:", err);
      // Fallback: Agar kisi security error ki wajah se fetch na ho, tab hi nayi tab khulegi
      window.open(generatedImage, '_blank');
    }
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target.result);
    reader.readAsDataURL(file);
  }
};

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen py-12 px-6 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-amber-500 font-bold text-sm uppercase tracking-wider">
            <Sparkles size={16} className="fill-amber-500" /> Image Studio Node
          </div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tight">Generate polished visuals in seconds.</h1>
          <p className="text-slate-500 text-sm font-medium">Serverless Enterprise Cloud Engine Active.</p>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT PANEL */}
          <form 
            onSubmit={handleGenerateAssetMatrix} 
            className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-[24px] p-6 shadow-2xl flex flex-col justify-between text-slate-200"
          >
            <div className="space-y-6">
              <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase flex items-center justify-between">
                <span>src/pages/Studio.jsx</span>
                <span className={`px-2 py-1 rounded-full text-[9px] font-bold ${isEngineReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {isEngineReady ? 'ENGINE ONLINE' : 'CONNECTING...'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 space-y-2">
                  <label className="block text-xs font-bold tracking-wide text-slate-400">Prompt text weights</label>
                  <textarea 
                    rows={6}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image (e.g. A futuristic cyberpunk city at night with neon lights)..."
                    className="w-full h-[140px] bg-[#1f2937] border border-slate-700 text-white p-4 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-500 transition-all shadow-inner resize-none leading-relaxed"
                  />
                </div>

                <div className="md:col-span-5 space-y-2">
                  <label className="block text-xs font-bold tracking-wide text-slate-400">Reference Assets Node</label>
                  <div className="border border-dashed border-slate-700 hover:border-slate-500 rounded-xl h-[140px] flex flex-col items-center justify-center text-center bg-[#1f2937]/50 cursor-pointer transition-colors p-4 group relative">
                    <input 
  type="file" 
  onChange={handleImageUpload} 
  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
/>
                    <Upload className="text-slate-500 mb-2 group-hover:text-slate-300 transition-colors" size={22} />
                    <p className="text-[11px] font-bold text-slate-400">Drag & drop asset pipeline</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wide text-slate-400">Select AI Engine</label>
                <div className="grid grid-cols-3 bg-[#1f2937] p-1 rounded-xl border border-slate-700 shadow-inner">
                  {models.map(m => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setActiveModel(m.name)}
                      className={`py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all text-center ${
                        activeModel === m.name ? 'bg-[#374151] border border-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wide text-slate-400">Active aspect ratio</label>
                <div className="grid grid-cols-4 gap-3">
                  {aspectRatios.map(ratio => (
                    <button
                      key={ratio.name}
                      type="button"
                      onClick={() => setAspectRatio(ratio.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2 bg-[#1f2937]/40 ${
                        aspectRatio === ratio.name
                          ? 'border-slate-400 bg-[#1f2937] text-white shadow-lg scale-[1.02]'
                          : 'border-slate-800 text-slate-400 hover:bg-[#1f2937]/80 hover:text-slate-200'
                      }`}
                    >
                      <div className={`border rounded ${ratio.style} ${aspectRatio === ratio.name ? 'border-white/80' : 'border-slate-600'}`} />
                      <span className="text-[11px] font-bold tracking-tight">{ratio.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit" 
                disabled={isGenerating || !prompt.trim() || !isEngineReady}
                className={`w-full font-bold py-4 rounded-xl shadow-lg text-xs uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 border ${
                  !prompt.trim() || !isEngineReady
                    ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isGenerating ? <Loader2 size={14} className="animate-spin text-white" /> : <Play size={12} fill="currentColor" />}
                  <span>{isGenerating ? 'AI ENGINE PROCESSING...' : isEngineReady ? 'Generate AI Image' : 'Connecting Engine...'}</span>
                </div>
                <span className="text-[9px] lowercase font-normal opacity-70">
                  {isGenerating ? 'Connecting to cloud cluster...' : 'powered by flux & stable diffusion'}
                </span>
              </button>
            </div>
          </form>

          {/* RIGHT PANEL: CANVAS */}
          <div className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-[24px] p-4 shadow-2xl flex flex-col text-white min-h-[550px]">
            
            <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase pb-2 border-b border-slate-800 mb-4 px-1">
              Execution Render Canvas dashboard
            </div>

            {/* MAIN IMAGE CONTAINER (Now completely fills the space) */}
            <div className="flex-1 w-full relative overflow-hidden bg-[#0c1017]/80 rounded-xl border border-slate-800/50 group flex items-center justify-center">
              
              {/* Spinner */}
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111827]/90 backdrop-blur-sm z-20 text-center space-y-3">
                  <Loader2 size={32} className="mx-auto text-emerald-500 animate-spin" />
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest animate-pulse">Running Cloud Inference...</p>
                  <p className="text-[10px] text-slate-500 font-mono tracking-wide px-4">
                    Generating high-fidelity visual. Please wait...
                  </p>
                </div>
              )}

              {/* Error Block */}
              {hasError && !isGenerating && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-2 z-10 p-6 bg-[#111827]">
                   <p className="text-sm font-bold uppercase tracking-wider text-rose-400">⚠️ API Interruption</p>
                   <p className="text-[11px] max-w-xs leading-relaxed text-slate-400">Cloud engine encountered an issue. Please try again.</p>
                 </div>
              )}

              {/* SUCCESS IMAGE FULL FILL */}
              {generatedImage && !isGenerating && !hasError && (
                <>
                  <img 
                    src={generatedImage} 
                    alt="AI Render Output" 
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-100 z-0"
                  />
                  
                  {/* OVERLAY DOWNLOAD BUTTON (Appears on Hover) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                  
                  <button 
                    onClick={handleDownload}
                    className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-emerald-600/90 text-white px-5 py-3 rounded-xl backdrop-blur shadow-2xl border border-emerald-500/50 hover:bg-emerald-500 transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 cursor-pointer pointer-events-auto"
                  >
                    <Download size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Download Asset</span>
                  </button>
                </>
              )}

              {/* Default Empty State */}
              {!generatedImage && !isGenerating && !hasError && (
                  <div className="text-center text-slate-500 space-y-2 pointer-events-none z-10">
                    <div className="p-4 bg-[#1f2937]/50 rounded-2xl inline-block border border-slate-800 mb-2">
                      <ImageIcon size={24} className="text-slate-600" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ready when you are.</h4>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">Type a prompt and click generate.</p>
                  </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 px-2">
              <div className="text-sm font-bold text-slate-200 tracking-tight truncate">
                {activePromptDisplay || "Your prompt will appear here"}
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-[11px] font-medium text-slate-500">
                <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer"><ThumbsUp size={13} /> Likes (224k)</span>
                <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer"><MessageSquare size={13} /> Comments (350k)</span>
                <span className="flex items-center gap-1.5"><Eye size={13} /> Views (77k)</span>
                <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer"><Share2 size={13} /> Other (290k)</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}