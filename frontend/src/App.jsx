import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SubmitPrompt from './pages/SubmitPrompt';
import Studio from './pages/Studio';
import PromptDetail from './pages/PromptDetail'; // Naya page import kiya

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-slate-900 selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<SubmitPrompt />} />
          <Route path="/studio" element={<Studio />} />
          {/* Dynamic route: jab user kisi card par click karega */}
          <Route path="/prompts/:id" element={<PromptDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}