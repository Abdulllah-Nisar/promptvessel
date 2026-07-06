import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context
import { LanguageProvider } from './context/LanguageContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import SubmitPrompt from './pages/SubmitPrompt';
import Studio from './pages/Studio';
import PromptDetail from './pages/PromptDetail';
import { Explore } from './pages/Explore';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Security } from './pages/Security';
import { ApiDocs } from './pages/ApiDocs';
import { Licensing } from './pages/Licensing';
import { Contact } from './pages/Contact';
import ReversePrompt from './pages/ReversePrompt';
import Guide from './pages/Guide';


export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-slate-900 selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={<SubmitPrompt />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/prompts/:slug" element={<PromptDetail />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/security" element={<Security />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/licensing" element={<Licensing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reverse-prompt" element={<ReversePrompt />} />
              <Route path="/guide" element={<Guide />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}


