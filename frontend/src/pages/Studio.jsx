// import React, { useState, useEffect } from 'react';
// import { Sparkles, Upload, Maximize2, Image as ImageIcon, Sliders, Play, Loader2, ThumbsUp, MessageSquare, Eye, Share2, Download } from 'lucide-react';

// export default function Studio() {
//   const [prompt, setPrompt] = useState('');
//   const [activeModel, setActiveModel] = useState('Pro (Flux.1)');
//   const [aspectRatio, setAspectRatio] = useState('Landscape');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null); // Yeh aapki image save karega
//   const [generatedImage, setGeneratedImage] = useState(null);
//   const [activePromptDisplay, setActivePromptDisplay] = useState('');
//   const [hasError, setHasError] = useState(false);
//   const [isEngineReady, setIsEngineReady] = useState(false);

//   const models = [
//     { name: 'Standard', id: 'gpt-image-2' },
//     { name: 'Pro (Flux.1)', id: 'black-forest-labs/flux-schnell' },
//     { name: 'SD3 (Stable)', id: 'stabilityai/stable-diffusion-3-medium' }
//   ];
  
//   const aspectRatios = [
//     { name: 'Square', label: 'Square 1:1', ratio: '1:1', style: 'w-6 h-6' },
//     { name: 'Landscape', label: 'Landscape 16:9', ratio: '16:9', style: 'w-9 h-5' },
//     { name: 'Portrait', label: 'Portrait 9:16', ratio: '9:16', style: 'w-5 h-9' },
//     { name: 'Classic', label: 'Classic 4:3', ratio: '4:3', style: 'w-8 h-6' }
//   ];

//   // Puter.js AI Engine Setup
//   useEffect(() => {
//     if (window.puter) {
//       setIsEngineReady(true);
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = "https://js.puter.com/v2/";
//     script.async = true;
//     script.onload = () => {
//       console.log("AI Engine Loaded Successfully");
//       setIsEngineReady(true);
//     };
//     script.onerror = () => {
//       console.error("Failed to load AI Engine");
//     };
//     document.head.appendChild(script);

//     return () => {
//       document.head.removeChild(script);
//     };
//   }, []);

//   const handleGenerateAssetMatrix = async (e) => {
//     e.preventDefault(); 
//     if (!prompt.trim() || !isEngineReady) return;
    
//     setIsGenerating(true);
//     setHasError(false);
//     setGeneratedImage(null);
//     setActivePromptDisplay(prompt.trim());

//     const selectedEngine = models.find(m => m.name === activeModel)?.id || 'black-forest-labs/flux-schnell';

//     try {
//       const imgElement = await window.puter.ai.txt2img(prompt.trim(), { model: selectedEngine });
      
//       if (imgElement && imgElement.src) {
//         setGeneratedImage(imgElement.src);
//       } else {
//         throw new Error("No image data received");
//       }

//       setPrompt(''); 

//     } catch (error) {
//       console.error("Generation Pipeline Failed:", error);
//       setHasError(true);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

  
//   // 🧠 THE ROBUST BLOB-DOWNLOAD LOGIC
//   const handleDownload = async () => {
//     if (!generatedImage) return;

//     try {
//       // 1. Image ko Fetch karke Blob (Binary Data) mein convert karein
//       const response = await fetch(generatedImage);
//       const blob = await response.blob();
      
//       // 2. Browser ki memory mein is image ka local URL banayein
//       const url = window.URL.createObjectURL(blob);
      
//       // 3. Ek chota sa temporary hidden link banayein aur usay click trigger karein
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `PromptVessel-${Date.now()}.png`; // File ka naam
//       document.body.appendChild(link);
//       link.click();
      
//       // 4. Download hone ke baad memory saaf karein
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Download failed, falling back to new tab:", err);
//       // Fallback: Agar kisi security error ki wajah se fetch na ho, tab hi nayi tab khulegi
//       window.open(generatedImage, '_blank');
//     }
//   };

//   const handleImageUpload = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => setSelectedImage(e.target.result);
//     reader.readAsDataURL(file);
//   }
// };

//   return (
//     <div className="bg-[#f8fafc] text-slate-900 min-h-screen py-12 px-6 font-sans">
//       <div className="max-w-[1400px] mx-auto space-y-10">
        
//         {/* Top Header */}
//         <div className="text-center space-y-2">
//           <div className="flex items-center justify-center gap-2 text-amber-500 font-bold text-sm uppercase tracking-wider">
//             <Sparkles size={16} className="fill-amber-500" /> Image Studio Node
//           </div>
//           <h1 className="text-4xl font-black text-slate-950 tracking-tight">Generate polished visuals in seconds.</h1>
//           <p className="text-slate-500 text-sm font-medium">Serverless Enterprise Cloud Engine Active.</p>
//         </div>

//         {/* Workspace Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
//           {/* LEFT PANEL */}
//           <form 
//             onSubmit={handleGenerateAssetMatrix} 
//             className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-[24px] p-6 shadow-2xl flex flex-col justify-between text-slate-200"
//           >
//             <div className="space-y-6">
//               <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase flex items-center justify-between">
//                 <span>src/pages/Studio.jsx</span>
//                 <span className={`px-2 py-1 rounded-full text-[9px] font-bold ${isEngineReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
//                   {isEngineReady ? 'ENGINE ONLINE' : 'CONNECTING...'}
//                 </span>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//                 {/* col-span-12 karne se ye poori width le lega */}
//                 <div className="md:col-span-12 space-y-2">
//                   <label className="block text-xs font-bold tracking-wide text-slate-400">Prompt text weights</label>
//                   <textarea 
//                     rows={8}
//                     value={prompt}
//                     onChange={(e) => setPrompt(e.target.value)}
//                     placeholder="Describe the image (e.g. A futuristic cyberpunk city at night with neon lights)..."
//                     className="w-full h-[180px] bg-[#1f2937] border border-slate-700 text-white p-4 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-500 transition-all shadow-inner resize-none leading-relaxed"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-xs font-bold tracking-wide text-slate-400">Select AI Engine</label>
//                 <div className="grid grid-cols-3 bg-[#1f2937] p-1 rounded-xl border border-slate-700 shadow-inner">
//                   {models.map(m => (
//                     <button
//                       key={m.name}
//                       type="button"
//                       onClick={() => setActiveModel(m.name)}
//                       className={`py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all text-center ${
//                         activeModel === m.name ? 'bg-[#374151] border border-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
//                       }`}
//                     >
//                       {m.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-xs font-bold tracking-wide text-slate-400">Active aspect ratio</label>
//                 <div className="grid grid-cols-4 gap-3">
//                   {aspectRatios.map(ratio => (
//                     <button
//                       key={ratio.name}
//                       type="button"
//                       onClick={() => setAspectRatio(ratio.name)}
//                       className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2 bg-[#1f2937]/40 ${
//                         aspectRatio === ratio.name
//                           ? 'border-slate-400 bg-[#1f2937] text-white shadow-lg scale-[1.02]'
//                           : 'border-slate-800 text-slate-400 hover:bg-[#1f2937]/80 hover:text-slate-200'
//                       }`}
//                     >
//                       <div className={`border rounded ${ratio.style} ${aspectRatio === ratio.name ? 'border-white/80' : 'border-slate-600'}`} />
//                       <span className="text-[11px] font-bold tracking-tight">{ratio.label}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="pt-6">
//               <button
//                 type="submit" 
//                 disabled={isGenerating || !prompt.trim() || !isEngineReady}
//                 className={`w-full font-bold py-4 rounded-xl shadow-lg text-xs uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 border ${
//                   !prompt.trim() || !isEngineReady
//                     ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed shadow-none'
//                     : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white cursor-pointer'
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   {isGenerating ? <Loader2 size={14} className="animate-spin text-white" /> : <Play size={12} fill="currentColor" />}
//                   <span>{isGenerating ? 'AI ENGINE PROCESSING...' : isEngineReady ? 'Generate AI Image' : 'Connecting Engine...'}</span>
//                 </div>
//                 <span className="text-[9px] lowercase font-normal opacity-70">
//                   {isGenerating ? 'Connecting to cloud cluster...' : 'powered by flux & stable diffusion'}
//                 </span>
//               </button>
//             </div>
//           </form>

//           {/* RIGHT PANEL: CANVAS */}
//           <div className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-[24px] p-4 shadow-2xl flex flex-col text-white min-h-[550px]">
            
//             <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase pb-2 border-b border-slate-800 mb-4 px-1">
//               Execution Render Canvas dashboard
//             </div>

//             {/* MAIN IMAGE CONTAINER (Now completely fills the space) */}
//             <div className="flex-1 w-full relative overflow-hidden bg-[#0c1017]/80 rounded-xl border border-slate-800/50 group flex items-center justify-center">
              
//               {/* Spinner */}
//               {isGenerating && (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111827]/90 backdrop-blur-sm z-20 text-center space-y-3">
//                   <Loader2 size={32} className="mx-auto text-emerald-500 animate-spin" />
//                   <p className="text-xs font-bold text-slate-300 uppercase tracking-widest animate-pulse">Running Cloud Inference...</p>
//                   <p className="text-[10px] text-slate-500 font-mono tracking-wide px-4">
//                     Generating high-fidelity visual. Please wait...
//                   </p>
//                 </div>
//               )}

//               {/* Error Block */}
//               {hasError && !isGenerating && (
//                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-2 z-10 p-6 bg-[#111827]">
//                    <p className="text-sm font-bold uppercase tracking-wider text-rose-400">⚠️ API Interruption</p>
//                    <p className="text-[11px] max-w-xs leading-relaxed text-slate-400">Cloud engine encountered an issue. Please try again.</p>
//                  </div>
//               )}

//               {/* SUCCESS IMAGE FULL FILL */}
//               {generatedImage && !isGenerating && !hasError && (
//                 <>
//                   <img 
//                     src={generatedImage} 
//                     alt="AI Render Output" 
//                     className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-100 z-0"
//                   />
                  
//                   {/* OVERLAY DOWNLOAD BUTTON (Appears on Hover) */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                  
//                   <button 
//                     onClick={handleDownload}
//                     className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-emerald-600/90 text-white px-5 py-3 rounded-xl backdrop-blur shadow-2xl border border-emerald-500/50 hover:bg-emerald-500 transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 cursor-pointer pointer-events-auto"
//                   >
//                     <Download size={18} />
//                     <span className="text-xs font-bold uppercase tracking-widest">Download Asset</span>
//                   </button>
//                 </>
//               )}

//               {/* Default Empty State */}
//               {!generatedImage && !isGenerating && !hasError && (
//                   <div className="text-center text-slate-500 space-y-2 pointer-events-none z-10">
//                     <div className="p-4 bg-[#1f2937]/50 rounded-2xl inline-block border border-slate-800 mb-2">
//                       <ImageIcon size={24} className="text-slate-600" />
//                     </div>
//                     <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ready when you are.</h4>
//                     <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">Type a prompt and click generate.</p>
//                   </div>
//               )}
//             </div>

//             {/* Bottom Actions */}
//             <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 px-2">
//               <div className="text-sm font-bold text-slate-200 tracking-tight truncate">
//                 {activePromptDisplay || "Your prompt will appear here"}
//               </div>
              
//               <div className="flex flex-wrap items-center gap-6 text-[11px] font-medium text-slate-500">
//                 <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer"><ThumbsUp size={13} /> Likes (224k)</span>
//                 <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer"><MessageSquare size={13} /> Comments (350k)</span>
//                 <span className="flex items-center gap-1.5"><Eye size={13} /> Views (77k)</span>
//                 <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer"><Share2 size={13} /> Other (290k)</span>
//               </div>
//             </div>

//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }
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
    { name: 'Square', label: 'Square 1:1', ratio: '1:1', style: 'w-6 h-6', width: 1024, height: 1024, openaiSize: '1024x1024' },
    { name: 'Landscape', label: 'Landscape 16:9', ratio: '16:9', style: 'w-9 h-5', width: 1024, height: 576, openaiSize: '1792x1024' },
    { name: 'Portrait', label: 'Portrait 9:16', ratio: '9:16', style: 'w-5 h-9', width: 576, height: 1024, openaiSize: '1024x1792' },
    { name: 'Classic', label: 'Classic 4:3', ratio: '4:3', style: 'w-8 h-6', width: 1024, height: 768, openaiSize: '1024x1024' }
  ];

  // Puter.js Engine Check
  // Note: Puter.js script ab index.html mein <script src="https://js.puter.com/v2/"></script>
  // ke through load hoti hai — sirf ek dafa, poore page lifetime mein. Yahan hum
  // sirf poll karte hain ke wo ready ho gayi ya nahi, koi script inject nahi karte
  // (isse React StrictMode/dev double-effect ki wajah se duplicate registration
  // error, "puter-dialog" already defined, nahi aata).
  useEffect(() => {
    if (window.puter) {
      setIsEngineReady(true);
      return;
    }

    const intervalId = setInterval(() => {
      if (window.puter) {
        setIsEngineReady(true);
        clearInterval(intervalId);
      }
    }, 150);

    return () => clearInterval(intervalId);
  }, []);

  const handleGenerateAssetMatrix = async (e) => {
    e.preventDefault(); 
    if (!prompt.trim() || !isEngineReady) return;
    
    setIsGenerating(true);
    setHasError(false);
    setGeneratedImage(null);
    setActivePromptDisplay(prompt.trim());

    const selectedEngine = models.find(m => m.name === activeModel)?.id || 'black-forest-labs/flux-schnell';
    const selectedRatio = aspectRatios.find(r => r.name === aspectRatio) || aspectRatios[1];

    // OpenAI (gpt-image / dall-e) models use a "size" string; everything else
    // (Flux, Stable Diffusion, Together AI models) uses separate width/height.
    const isOpenAIModel = selectedEngine.startsWith('gpt-image') || selectedEngine.includes('dall-e');

    const generationOptions = isOpenAIModel
      ? { model: selectedEngine, size: selectedRatio.openaiSize }
      : { model: selectedEngine, width: selectedRatio.width, height: selectedRatio.height };

    try {
      let imgElement;
      try {
        // Pehle selected aspect ratio ke sath try karein
        imgElement = await window.puter.ai.txt2img(prompt.trim(), generationOptions);
      } catch (sizeError) {
        // Agar model custom width/height/size reject kare (400 error), to
        // bina size ke dobara try karein taake generation fail na ho —
        // sirf ratio apply nahi hogi, image phir bhi ban jayegi.
        console.warn("Custom size rejected by model, retrying without it:", sizeError);
        imgElement = await window.puter.ai.txt2img(prompt.trim(), { model: selectedEngine });
      }

      if (imgElement && imgElement.src) {
        setGeneratedImage(imgElement.src);
      } else {
        throw new Error("No image data received");
      }

      setPrompt(''); 

    } catch (error) {
      console.error("Generation Pipeline Failed:", error?.message || error);
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
            className="lg:col-span-6 bg-white border border-slate-200/80 rounded-[24px] p-6 shadow-sm flex flex-col justify-between text-slate-900"
          >
            <div className="space-y-6">
              <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase flex items-center justify-between">
                <span>src/pages/Studio.jsx</span>
                <span className={`px-2 py-1 rounded-full text-[9px] font-bold ${isEngineReady ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                  {isEngineReady ? 'ENGINE ONLINE' : 'CONNECTING...'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* col-span-12 karne se ye poori width le lega */}
                <div className="md:col-span-12 space-y-2">
                  <label className="block text-xs font-bold tracking-wide text-slate-500">Prompt text weights</label>
                  <textarea 
                    rows={8}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image (e.g. A futuristic cyberpunk city at night with neon lights)..."
                    className="w-full h-[180px] bg-[#f8fafc] border border-slate-200 text-slate-900 p-4 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-400 transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wide text-slate-500">Select AI Engine</label>
                <div className="grid grid-cols-3 bg-[#f8fafc] p-1 rounded-xl border border-slate-200">
                  {models.map(m => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setActiveModel(m.name)}
                      className={`py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all text-center ${
                        activeModel === m.name ? 'bg-white border border-slate-200 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wide text-slate-500">Active aspect ratio</label>
                <div className="grid grid-cols-4 gap-3">
                  {aspectRatios.map(ratio => (
                    <button
                      key={ratio.name}
                      type="button"
                      onClick={() => setAspectRatio(ratio.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2 bg-[#f8fafc] ${
                        aspectRatio === ratio.name
                          ? 'border-slate-950 bg-white text-slate-950 shadow-sm scale-[1.02]'
                          : 'border-slate-200 text-slate-500 hover:bg-white hover:text-slate-800'
                      }`}
                    >
                      <div className={`border rounded ${ratio.style} ${aspectRatio === ratio.name ? 'border-slate-950' : 'border-slate-400'}`} />
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
                className={`w-full font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 border ${
                  !prompt.trim() || !isEngineReady
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-950 text-white cursor-pointer shadow-md'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                  <span>{isGenerating ? 'AI ENGINE PROCESSING...' : isEngineReady ? 'Generate AI Image' : 'Connecting Engine...'}</span>
                </div>
                <span className="text-[9px] lowercase font-normal opacity-70">
                  {isGenerating ? 'Connecting to cloud cluster...' : 'powered by flux & stable diffusion'}
                </span>
              </button>
            </div>
          </form>

          {/* RIGHT PANEL: CANVAS */}
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-[24px] p-4 shadow-sm flex flex-col text-slate-900 min-h-[550px]">
            
            <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase pb-2 border-b border-slate-200 mb-4 px-1">
              Execution Render Canvas dashboard
            </div>

            {/* MAIN IMAGE CONTAINER (Now completely fills the space) */}
            <div className="flex-1 w-full relative overflow-hidden bg-[#f8fafc] rounded-xl border border-slate-200 group flex items-center justify-center">
              
              {/* Spinner */}
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-20 text-center space-y-3">
                  <Loader2 size={32} className="mx-auto text-slate-950 animate-spin" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-widest animate-pulse">Running Cloud Inference...</p>
                  <p className="text-[10px] text-slate-500 font-mono tracking-wide px-4">
                    Generating high-fidelity visual. Please wait...
                  </p>
                </div>
              )}

              {/* Error Block */}
              {hasError && !isGenerating && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-2 z-10 p-6 bg-white">
                   <p className="text-sm font-bold uppercase tracking-wider text-rose-600">⚠️ API Interruption</p>
                   <p className="text-[11px] max-w-xs leading-relaxed text-slate-500">Cloud engine encountered an issue. Please try again.</p>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                  
                  <button 
                    onClick={handleDownload}
                    className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-slate-950/90 text-white px-5 py-3 rounded-xl backdrop-blur shadow-lg border border-slate-800 hover:bg-slate-900 transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 cursor-pointer pointer-events-auto"
                  >
                    <Download size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Download Asset</span>
                  </button>
                </>
              )}

              {/* Default Empty State */}
              {!generatedImage && !isGenerating && !hasError && (
                  <div className="text-center text-slate-500 space-y-2 pointer-events-none z-10">
                    <div className="p-4 bg-white rounded-2xl inline-block border border-slate-200 mb-2 shadow-sm">
                      <ImageIcon size={24} className="text-slate-400" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ready when you are.</h4>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">Type a prompt and click generate.</p>
                  </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 px-2">
              <div className="text-sm font-bold text-slate-800 tracking-tight truncate">
                {activePromptDisplay || "Your prompt will appear here"}
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-[11px] font-medium text-slate-500">
                <span className="flex items-center gap-1.5 hover:text-slate-800 cursor-pointer"><ThumbsUp size={13} /> Likes (224k)</span>
                <span className="flex items-center gap-1.5 hover:text-slate-800 cursor-pointer"><MessageSquare size={13} /> Comments (350k)</span>
                <span className="flex items-center gap-1.5"><Eye size={13} /> Views (77k)</span>
                <span className="flex items-center gap-1.5 hover:text-slate-800 cursor-pointer"><Share2 size={13} /> Other (290k)</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}