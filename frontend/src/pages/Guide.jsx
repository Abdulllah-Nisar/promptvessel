import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Wand2, Rocket, ScanLine, ArrowRight, Sparkles } from 'lucide-react';

export default function Guide() {
  const steps = [
    {
      number: '01',
      icon: Compass,
      title: 'Browse and Copy Prompts',
      description: 'Head to the Home page or Explore section to view every prompt published by the community. Find one you like and copy the full prompt text in a single click to use with your own AI tool.',
      cta: 'Explore Prompts',
      link: '/',
    },
    {
      number: '02',
      icon: Wand2,
      title: 'Generate Images in Studio',
      description: 'Want to create your own AI artwork? Head to the Studio page, write your own prompt or customize an existing one, and generate an image directly from the site.',
      cta: 'Open Studio',
      link: '/studio',
    },
    {
      number: '03',
      icon: Rocket,
      title: 'Publish Your Own Prompt',
      description: 'Have a great prompt others could use? Click "Deploy Blueprint," add a title, select a model, paste your prompt text, and add it to the community registry.',
      cta: 'Deploy Blueprint',
      link: '/submit',
    },
    {
      number: '04',
      icon: ScanLine,
      title: 'Reverse-Engineer a Prompt from an Image',
      description: 'Curious what prompt produced a particular image? Upload it on the Reverse Prompt page and our engine will decode it into a ready-to-use, Midjourney-style prompt.',
      cta: 'Try Reverse Prompt',
      link: '/reverse-prompt',
    },
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-slate-900 text-white px-3 py-1 rounded-full shadow-sm">
            <Sparkles size={12} className="text-yellow-400" /> Getting Started
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            How PromptVessel Works
          </h1>
          <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Four simple capabilities, all in one place explore prompts, generate images, publish your own work, and reverse-engineer prompts from any image.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="bg-slate-950 text-white p-3 rounded-2xl">
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-black tracking-widest text-slate-300">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-950 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow mb-6">
                  {step.description}
                </p>

                <Link
                  to={step.link}
                  className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-950 hover:gap-3 transition-all"
                >
                  {step.cta}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-slate-500 text-sm mb-4">Ready to get started?</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-950 to-slate-800 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg border border-slate-800 hover:opacity-90 transition-all"
          >
            Explore Trending Prompts <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}