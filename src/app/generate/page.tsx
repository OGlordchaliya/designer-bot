'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
  FileText,
  CreditCard,
  Layout,
  Instagram,
  Palette,
  Edit3,
} from 'lucide-react';
import { DesignCategory, DesignSubcategory, DesignDocument, BrandKit } from '@/lib/ddom/types';
import { COLOR_PALETTES, TYPOGRAPHY_PAIRS } from '@/lib/ddom/defaults';
import { AutonomousDesignEngine } from '@/lib/ai/autonomousEngine';
import { storage } from '@/lib/storage';

function GenerateWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<DesignCategory>('logo');
  const [subcategory, setSubcategory] = useState<DesignSubcategory>('logo_modern');
  const [prompt, setPrompt] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [industry, setIndustry] = useState<string>('Technology & Software');
  const [stylePreference, setStylePreference] = useState<string>('Modern Minimalist');
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number>(0);
  const [selectedTypoIndex, setSelectedTypoIndex] = useState<number>(0);
  const [activeBrandKit, setActiveBrandKit] = useState<BrandKit | null>(null);

  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [generatedConcepts, setGeneratedConcepts] = useState<DesignDocument[]>([]);
  const [selectedConceptIndex, setSelectedConceptIndex] = useState<number>(0);

  useEffect(() => {
    const qCat = searchParams.get('category') as DesignCategory;
    const qPrompt = searchParams.get('prompt');
    if (qCat && ['logo', 'letterhead', 'stationery', 'website', 'social', 'brand'].includes(qCat)) {
      setCategory(qCat);
      if (qCat === 'letterhead') setSubcategory('letterhead_a4');
      else if (qCat === 'stationery') setSubcategory('business_card_front');
      else if (qCat === 'website') setSubcategory('website_landing');
      else if (qCat === 'social') setSubcategory('social_instagram_square');
    }
    if (qPrompt) {
      setPrompt(decodeURIComponent(qPrompt));
    }
    const brandKits = storage.listBrandKits();
    if (brandKits.length > 0) setActiveBrandKit(brandKits[0]);
  }, [searchParams]);

  const handleAnalyzePrompt = () => {
    if (!prompt.trim()) return;
    const entities = AutonomousDesignEngine.extractEntities(prompt);
    if (!companyName) setCompanyName(entities.companyName);
    if (!tagline) setTagline(entities.tagline);
    if (entities.industry) setIndustry(entities.industry);
    if (entities.style) setStylePreference(entities.style);
    setStep(2);
  };

  const handleGenerateConcepts = () => {
    setIsSynthesizing(true);
    setStep(3);

    setTimeout(() => {
      const c1 = AutonomousDesignEngine.generate({
        prompt,
        category,
        subcategory,
        companyName,
        tagline,
        industry,
        stylePreference,
        brandKit: activeBrandKit,
        conceptIndex: 0,
      });

      const c2 = AutonomousDesignEngine.generate({
        prompt,
        category,
        subcategory,
        companyName,
        tagline,
        industry,
        stylePreference,
        brandKit: activeBrandKit,
        conceptIndex: 1,
      });

      const c3 = AutonomousDesignEngine.generate({
        prompt,
        category,
        subcategory,
        companyName,
        tagline,
        industry,
        stylePreference,
        brandKit: activeBrandKit,
        conceptIndex: 2,
      });

      setGeneratedConcepts([c1, c2, c3]);
      setIsSynthesizing(false);
    }, 800);
  };

  const handleOpenInEditor = () => {
    const chosen = generatedConcepts[selectedConceptIndex];
    if (!chosen) return;
    storage.saveProject(chosen);
    storage.useCredits(1);
    router.push(`/editor/${chosen.id}`);
  };

  const categories = [
    { id: 'logo', label: 'Logo Design', icon: Sparkles },
    { id: 'letterhead', label: 'Company Letterhead', icon: FileText },
    { id: 'stationery', label: 'Business Stationery', icon: CreditCard },
    { id: 'website', label: 'Website Layout', icon: Layout },
    { id: 'social', label: 'Social Media', icon: Instagram },
    { id: 'brand', label: 'Brand Guidelines', icon: Palette },
  ];

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-8 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
            AI Creative Orchestration
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white">AI Design Generation Workspace</h1>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          {[
            { num: 1, label: 'Prompt & Category' },
            { num: 2, label: 'Design Tokens' },
            { num: 3, label: 'Multi-Concepts' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition ${
                step === s.num
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : step > s.num
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              <span>{s.num}.</span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Select Creative Discipline &amp; Describe Your Vision</h2>
            <p className="text-xs text-slate-400">
              Our semantic AI parser extracts your company identity, tone, industry, and geometric parameters.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSel = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id as any);
                    if (cat.id === 'letterhead') setSubcategory('letterhead_a4');
                    else if (cat.id === 'stationery') setSubcategory('business_card_front');
                    else if (cat.id === 'website') setSubcategory('website_landing');
                    else if (cat.id === 'social') setSubcategory('social_instagram_square');
                    else if (cat.id === 'brand') setSubcategory('brand_guidelines');
                    else setSubcategory('logo_modern');
                  }}
                  className={`p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 font-bold text-xs transition border ${
                    isSel
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-glow'
                      : 'bg-slate-850 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Natural Language Prompt</label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g. Minimalist geometric logo for a cybersecurity startup called Aegis Shield with obsidian slate and electric emerald accents..."
              className="w-full bg-slate-800/80 text-white text-xs p-4 rounded-2xl border border-slate-700 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleAnalyzePrompt}
              disabled={!prompt.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold hover:from-indigo-600 hover:to-purple-700 shadow-glow disabled:opacity-40 transition flex items-center space-x-2"
            >
              <span>Analyze &amp; Configure Tokens</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">2. Refine Brand Parameters &amp; Aesthetics</h2>
              <p className="text-xs text-slate-400">Review AI extracted details and select your desired color harmony.</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Company / Brand Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Tagline / Motto</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Industry Context</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Aesthetic Style</label>
              <input
                type="text"
                value={stylePreference}
                onChange={(e) => setStylePreference(e.target.value)}
                className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
              Recommended Color Harmonies
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COLOR_PALETTES.map((pal, idx) => (
                <div
                  key={pal.name}
                  onClick={() => setSelectedPaletteIndex(idx)}
                  className={`p-3 rounded-2xl border cursor-pointer transition ${
                    selectedPaletteIndex === idx
                      ? 'bg-slate-800 border-indigo-500 shadow-glow ring-1 ring-indigo-500'
                      : 'bg-slate-850/60 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex gap-1.5 mb-2">
                    {[pal.primary, pal.secondary, pal.accent, pal.neutralDark].map((c, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-md border border-white/20"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white block truncate">{pal.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
              Recommended Typography Pairings
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TYPOGRAPHY_PAIRS.slice(0, 4).map((tp, idx) => (
                <div
                  key={tp.name}
                  onClick={() => setSelectedTypoIndex(idx)}
                  className={`p-3 rounded-2xl border cursor-pointer transition ${
                    selectedTypoIndex === idx
                      ? 'bg-slate-800 border-indigo-500 shadow-glow ring-1 ring-indigo-500'
                      : 'bg-slate-850/60 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{tp.name}</span>
                    {selectedTypoIndex === idx && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {tp.heading} + {tp.body}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Back
            </button>
            <button
              onClick={handleGenerateConcepts}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold hover:from-emerald-600 hover:to-teal-700 shadow-glow-green flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize Vector Concepts</span>
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">3. Multi-Concept Vector Synthesis</h2>
              <p className="text-xs text-slate-400">
                Select your preferred concept to open in the interactive canvas editor.
              </p>
            </div>
            <button
              onClick={handleGenerateConcepts}
              disabled={isSynthesizing}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>Regenerate Concepts</span>
            </button>
          </div>

          {isSynthesizing ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-white">Synthesizing Layered Vector Geometry...</h3>
              <p className="text-xs text-slate-400">Calculating proportions, typography hierarchies &amp; colors</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {generatedConcepts.map((concept, idx) => (
                  <div
                    key={concept.id}
                    onClick={() => setSelectedConceptIndex(idx)}
                    className={`rounded-2xl border p-5 cursor-pointer transition flex flex-col justify-between space-y-4 ${
                      selectedConceptIndex === idx
                        ? 'bg-slate-850 border-indigo-500 shadow-glow ring-2 ring-indigo-500/50'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Concept 0{idx + 1}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {concept.layers.length} Vector Layers
                      </span>
                    </div>

                    <div
                      style={{ backgroundColor: concept.artboard.backgroundColor }}
                      className="w-full h-44 rounded-xl flex items-center justify-center border border-white/10 p-4 shadow-inner relative overflow-hidden"
                    >
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 mx-auto flex items-center justify-center text-indigo-400 mb-2">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="block text-xs font-black tracking-wider text-white">
                          {companyName || 'BRAND'}
                        </span>
                        <span className="block text-[8px] text-slate-400 tracking-widest uppercase">
                          {tagline || 'INNOVATION'}
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <span
                        className={`inline-block px-3 py-1 text-[11px] font-bold rounded-lg ${
                          selectedConceptIndex === idx
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {selectedConceptIndex === idx ? 'Selected Concept' : 'Choose Concept'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-800 gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Adjust Tokens
                </button>

                <button
                  onClick={handleOpenInEditor}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 text-white text-xs font-black hover:opacity-95 shadow-glow flex items-center justify-center space-x-2 transition"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Open Selected Concept in Canvas Editor &rarr;</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GenerateWorkspacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs text-slate-400">
        Loading AI Generator...
      </div>
    }>
      <GenerateWorkspaceContent />
    </Suspense>
  );
}

