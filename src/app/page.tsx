'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  CreditCard,
  Layout,
  Instagram,
  Palette,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { DesignCategory } from '@/lib/ddom/types';
import { AutonomousDesignEngine } from '@/lib/ai/autonomousEngine';
import { storage } from '@/lib/storage';

export default function LandingPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DesignCategory>('logo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'logo' | 'letterhead' | 'stationery' | 'website'>('logo');

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() && !samplePrompts[selectedCategory]) return;

    setIsGenerating(true);
    const finalPrompt = prompt.trim() || samplePrompts[selectedCategory];

    setTimeout(() => {
      const doc = AutonomousDesignEngine.generate({
        prompt: finalPrompt,
        category: selectedCategory,
      });
      storage.saveProject(doc);
      storage.useCredits(1);
      router.push(`/editor/${doc.id}`);
    }, 600);
  };

  const samplePrompts: Record<DesignCategory, string> = {
    logo: 'Minimalist geometric logo for a cybersecurity startup called Aegis Shield',
    letterhead: 'Corporate executive letterhead for Vanguard Global Logistics with A4 standard layout',
    stationery: 'Dark luxury executive business card for Alexander Sterling, CEO of Nexus Dynamics',
    website: 'Modern responsive SaaS landing page for an autonomous creative AI cloud platform',
    social: 'High-contrast Instagram square post announcing Next-Gen Creative AI 2.0 release',
    brand: 'Comprehensive brand identity guideline board with obsidian slate and electric emerald',
  };

  const categories: Array<{ id: DesignCategory; label: string; icon: any }> = [
    { id: 'logo', label: 'Logo Design', icon: Sparkles },
    { id: 'letterhead', label: 'Letterhead', icon: FileText },
    { id: 'stationery', label: 'Stationery', icon: CreditCard },
    { id: 'website', label: 'Website', icon: Layout },
    { id: 'social', label: 'Social Media', icon: Instagram },
    { id: 'brand', label: 'Brand Kit', icon: Palette },
  ];

  return (
    <div className="flex-1 flex flex-col bg-mesh select-none">
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 shadow-glow">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Vector Design Intelligence</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
          <span className="text-emerald-400 font-bold">100% Editable Output</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          Describe your imagination.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            Let AI design it.
          </span>{' '}
          Edit it. Own it.
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Never settle for flat, uneditable raster images with scrambled text. AI Creative Intelligence Studio
          synthesizes multi-layered vector artwork, corporate stationery, responsive web layouts, and brand identities
          ready for live editing and print-quality PDF export.
        </p>

        <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-3 border-b border-slate-800/80 mb-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setPrompt(samplePrompts[cat.id]);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-glow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder={samplePrompts[selectedCategory]}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 text-white text-xs font-bold hover:opacity-95 shadow-glow flex items-center justify-center space-x-2 shrink-0 transition"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Design'}</span>
            </button>
          </form>

          <div className="pt-2.5 px-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 text-left">
            <span className="font-semibold text-slate-300">Try Prompt:</span>
            <button
              onClick={() => {
                setSelectedCategory('logo');
                setPrompt('Minimalist geometric logo for a cybersecurity startup called Aegis Shield');
              }}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              Aegis Shield Logo
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setSelectedCategory('letterhead');
                setPrompt('Corporate executive letterhead for Vanguard Global Logistics with A4 standard layout');
              }}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              Vanguard A4 Letterhead
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setSelectedCategory('stationery');
                setPrompt('Dark luxury executive business card for Alexander Sterling, CEO of Nexus Dynamics');
              }}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              Executive Business Card
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Live Design Engines</span>
          <h2 className="text-3xl font-extrabold text-white">What You Can Create &amp; Edit In Seconds</h2>
        </div>

        <div className="flex justify-center mb-8 gap-2">
          {[
            { id: 'logo', label: 'Logo Studio' },
            { id: 'letterhead', label: 'A4 Letterhead' },
            { id: 'stationery', label: 'Business Card' },
            { id: 'website', label: 'Website Layout' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveShowcaseTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeShowcaseTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full flex items-center justify-center bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 min-h-[340px]">
            {activeShowcaseTab === 'logo' && (
              <div className="w-64 h-64 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-6 shadow-glow relative overflow-hidden group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 rotate-45 flex items-center justify-center shadow-lg mb-6">
                  <Shield className="w-10 h-10 text-white -rotate-45" />
                </div>
                <span className="text-lg font-black tracking-widest text-white uppercase">AEGIS SHIELD</span>
                <span className="text-[10px] font-semibold text-indigo-400 tracking-widest uppercase mt-1">SOVEREIGN DEFENSE</span>
              </div>
            )}

            {activeShowcaseTab === 'letterhead' && (
              <div className="w-60 h-80 bg-white rounded-lg p-5 shadow-2xl flex flex-col justify-between text-slate-900 text-[8px]">
                <div>
                  <div className="h-1.5 w-full bg-indigo-600 rounded mb-2" />
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-extrabold text-[10px] tracking-wider text-slate-900">VANGUARD LOGISTICS</span>
                    <span className="text-slate-400 font-mono">contact@vanguard.io</span>
                  </div>
                  <div className="h-0.5 w-full bg-slate-200 mb-3" />
                  <p className="font-semibold text-indigo-600 mb-1">STRATEGIC MEMORANDUM</p>
                  <p className="text-slate-600 leading-relaxed">
                    Dear Partners, please review the institutional framework and operational directives for the upcoming cycle...
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-center text-[7px] text-slate-400">
                  Vanguard Logistics Inc. • 100 Innovation Blvd, SF • Confidential A4 Document
                </div>
              </div>
            )}

            {activeShowcaseTab === 'stationery' && (
              <div className="w-72 h-44 rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600" />
                <div className="flex justify-between items-start pl-2">
                  <div>
                    <span className="text-xs font-black tracking-wider text-white">NEXUS DYNAMICS</span>
                    <span className="block text-[8px] text-indigo-400 tracking-wider">ENTERPRISE CLOUD</span>
                  </div>
                  <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="pl-2">
                  <span className="text-sm font-bold text-white block">ALEXANDER STERLING</span>
                  <span className="text-[9px] text-slate-400 font-medium">Chief Executive Officer</span>
                </div>
                <div className="pl-2 text-[8px] text-slate-400 font-mono flex justify-between items-end">
                  <span>M: +1 (555) 839-2041<br/>E: alex@nexus.io</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-bold">CR80 SPEC</span>
                </div>
              </div>
            )}

            {activeShowcaseTab === 'website' && (
              <div className="w-72 h-48 bg-slate-950 rounded-xl border border-slate-800 p-3 shadow-2xl flex flex-col justify-between text-[8px]">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="font-bold text-white">NEXUS.IO</span>
                  <span className="text-slate-400">Platform • Solutions • Pricing</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">Start</span>
                </div>
                <div className="text-center py-3">
                  <span className="font-black text-xs text-white block">Next-Gen Autonomous AI</span>
                  <span className="text-slate-400 text-[8px] mt-1 block">Deploy intelligent agents with enterprise precision</span>
                </div>
                <div className="flex justify-center gap-2">
                  <div className="px-2 py-1 rounded bg-indigo-600 text-white font-bold">Free Trial</div>
                  <div className="px-2 py-1 rounded bg-slate-800 text-slate-300">Live Demo</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              Autonomous DDOM Vector Engine
            </div>
            <h3 className="text-2xl font-bold text-white">
              {activeShowcaseTab === 'logo' && 'Logos with Mathematical Vector Balance'}
              {activeShowcaseTab === 'letterhead' && 'Print-Ready ISO 216 A4 Letterheads'}
              {activeShowcaseTab === 'stationery' && 'Executive Business Cards & Stationery'}
              {activeShowcaseTab === 'website' && 'Responsive Clean HTML/Tailwind Layouts'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every design generated by AI Creative Studio is built from isolated, layered vectors. You can drag and
              resize shapes, retype company names, adjust letter spacing, or instruct the in-editor AI Copilot to
              modify the entire theme.
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero raster blurring • Infinite scalability</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Export to SVG, A4 300 DPI PDF, Transparent PNG, and HTML</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Synchronized with your custom Brand Kits</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/generate"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-glow transition"
              >
                <span>Try In AI Generation Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">The Architectural Difference</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ordinary AI Image Gen vs. AI Creative Studio</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-rose-500/20 space-y-4">
            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
              Ordinary AI Image Generators
            </span>
            <h3 className="text-xl font-bold text-white">Flat Uneditable Pixels</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Produces flattened raster images (JPEG/PNG) with scrambled, unreadable text.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Impossible to change the company name, phone number, or font without Photoshop.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Pixelates and loses quality when printed on commercial letterheads or signage.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-4 shadow-glow-green">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              AI Creative Intelligence Studio
            </span>
            <h3 className="text-xl font-bold text-white">Multi-Layered Vector DDOM</h3>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Generates structured design specifications with independent text, vector shapes &amp; icons.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Full interactive drag-and-drop editor with Google Fonts, color pickers &amp; AI Copilot.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Print-ready ISO A4 PDFs, standalone clean SVGs, and responsive HTML code.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-glow space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to design with true intelligence?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Experience the complete ecosystem. Create professional business logos, letterheads, business stationery,
            and brand guidelines today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/generate"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs hover:from-indigo-600 hover:to-purple-700 shadow-glow transition"
            >
              Start Generating Free &rarr;
            </Link>
            <Link
              href="/studios"
              className="px-6 py-3.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition"
            >
              Explore Creative Studios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
