import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Copy, Loader2, ScanLine, Image as ImageIcon } from 'lucide-react';

export default function ReversePrompt() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setGeneratedPrompt('');
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setGeneratedPrompt('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);

      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];

        // Ab seedha Gemini ko call nahi kar rahe -- apne proxy server ko
        // call kar rahe hain, jo asli key server-side rakhta hai.
        const response = await fetch('https://promptvessel.vercel.app/api/reverse-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Image,
            mimeType: selectedFile.type
          })
        });

        const result = await response.json();
        console.log("Gemini API Response:", result);

        if (result && result.candidates && result.candidates[0] && result.candidates[0].content) {
          setGeneratedPrompt(result.candidates[0].content.parts[0].text);
        } else if (result.error) {
          setGeneratedPrompt(`API Error: ${result.error.message}`);
        } else {
          setGeneratedPrompt("Unexpected response format. Check console.");
        }
        setIsProcessing(false);
      };
    } catch (error) {
      console.error("Fetch Error:", error);
      setGeneratedPrompt("Failed to generate. Please check your API Key and Console.");
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    const textArea = document.createElement("textarea");
    textArea.value = generatedPrompt;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#F2F3F5] py-20 px-6 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap');

        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono-rp { font-family: 'IBM Plex Mono', monospace; }
        .font-body-rp { font-family: 'Inter', sans-serif; }

        @keyframes scanSweep {
          0% { top: -4%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 102%; opacity: 0; }
        }
        .scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FF6B35 20%, #5EEAD4 80%, transparent);
          box-shadow: 0 0 12px 2px rgba(255,107,53,0.6);
          animation: scanSweep 1.8s linear infinite;
        }
        @keyframes blinkCursor {
          0%, 45% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .cursor-blink {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: #5EEAD4;
          margin-left: 2px;
          animation: blinkCursor 1s step-start infinite;
          vertical-align: middle;
        }
        .grid-fade {
          background-image: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 44px 44px;
          -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 20%, #000 40%, transparent 90%);
                  mask-image: radial-gradient(ellipse 60% 50% at 50% 20%, #000 40%, transparent 90%);
        }
      `}</style>

      {/* Ambient background grid */}
      <div className="absolute inset-0 grid-fade pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF6B35]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#23262F] bg-[#12141B] font-mono-rp text-xs text-[#5EEAD4] tracking-widest mb-5">
            <ScanLine size={12} />
            IMAGE → PROMPT
          </div>
          <h1 className="font-display text-black md:text-6xl font-bold tracking-tight mb-4">
            Reverse Prompt <span className="text-[#FF6B35]">Engine</span>
          </h1>
          <p className="font-body-rp text-[#8B90A0] max-w-lg mx-auto text-[15px]">
            Drop in an image. We decode its visual DNA into a ready-to-use Midjourney-style prompt.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* SOURCE PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#F8FAFC] border border-[#23262F] p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono-rp text-xs text-[#8B90A0] tracking-widest">01 · SOURCE IMAGE</span>
              {selectedFile && <span className="font-mono-rp text-xs text-[#5EEAD4] truncate max-w-[140px]">{selectedFile.name}</span>}
            </div>

            <div className="relative border-2 border-dashed border-[#2A2D38] hover:border-[#FF6B35]/50 rounded-xl h-64 flex flex-col items-center justify-center transition-colors overflow-hidden group">
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  {isProcessing && <div className="scan-line" />}
                  {isProcessing && <div className="absolute inset-0 bg-black/30" />}
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-[#565A68] group-hover:text-[#8B90A0] transition-colors">
                  <div className="p-3 rounded-full border border-[#2A2D38]">
                    <ImageIcon size={22} />
                  </div>
                  <span className="font-body-rp text-sm">Click or drop an image here</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedFile || isProcessing}
              className="w-full mt-5 bg-[#FF6B35] hover:bg-[#FF7F4D] disabled:bg-[#23262F] disabled:text-[#565A68] text-[#090A0F] py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {isProcessing ? "Decoding image..." : "Generate Prompt"}
            </button>
          </motion.div>

          {/* OUTPUT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#F8FAFC] border border-[#23262F] rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#23262F]">
              <span className="font-mono-rp text-xs text-[#8B90A0] tracking-widest">02 · DECODED PROMPT</span>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A2D38]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A2D38]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#5EEAD4]/40" />
              </div>
            </div>

            <div className="p-6 flex-1">
              <div className="bg-[#F1F5F9] p-5 rounded-xl border border-[#23262F] font-mono-rp text-[13px] leading-relaxed min-h-[176px] text-[#020618]">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[#8B90A0]"
                    >
                      analyzing pixels<span className="cursor-blink" />
                    </motion.span>
                  ) : generatedPrompt ? (
                    <motion.span
                      key="result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {generatedPrompt}
                      <span className="cursor-blink" />
                    </motion.span>
                  ) : (
                    <span className="text-[#020618]">// prompt output will appear here</span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={handleCopy}
                disabled={!generatedPrompt}
                className="border text-[#020618] border-[#23262F] hover:border-[#5EEAD4]/50 disabled:opacity-40 disabled:hover:border-[#23262F] py-3 rounded-xl w-full font-body-rp text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Copy size={14} />
                {copied ? "Copied to clipboard" : "Copy Prompt"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}