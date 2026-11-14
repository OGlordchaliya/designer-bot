'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  FileText,
  CreditCard,
  Layout,
  Instagram,
  Palette,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function StudiosDirectoryPage() {
  const [filter, setFilter] = useState<string>('all');

  const studios = [
    {
      id: 'logo',
      category: 'logo',
      title: 'Logo Design Studio',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-600',
      tagline: 'Precision Vector Marks & Business Wordmarks',
      description:
        'Generate distinctive corporate emblems, minimalist monogram crests, and modern tech symbols with transparent PNG and scalable SVG exports.',
      capabilities: [
        'Minimalist, corporate, luxury, modern & creative styles',
        'Multiple concept synthesis with icon variations',
        'Transparent background and SVG vector output',
        'Editable typography and letter spacing',
      ],
      defaultPrompt: 'Minimalist modern logo for a cybersecurity startup called Aegis Shield',
    },
    {
      id: 'letterhead',
      category: 'letterhead',
      title: 'Company Letterhead Studio',
      icon: FileText,
      color: 'from-blue-500 to-cyan-600',
      tagline: 'ISO 216 A4 & US Letter Corporate Documents',
      description:
        'Architect print-ready corporate letterheads containing executive headers, address blocks, contact coordinates, registration badges, and watermarks.',
      capabilities: [
        'Standard ISO 216 A4 (210 x 297 mm) format',
        'Executive headers, margins, and bottom accent rules',
        'Print-ready high-DPI PDF compilation',
        'Accurate editable company and recipient text',
      ],
      defaultPrompt: 'Corporate executive letterhead for Vanguard Global Logistics with A4 standard layout',
    },
    {
      id: 'stationery',
      category: 'stationery',
      title: 'Business Stationery Studio',
      icon: CreditCard,
      color: 'from-emerald-500 to-teal-600',
      tagline: 'Business Cards, Invoices, Envelopes & ID Badges',
      description:
        'Complete suite of physical corporate collateral designed according to standard dimensions with digital QR codes and itemized tables.',
      capabilities: [
        'Standard 3.5x2.0 inch business cards (front and back)',
        'Tabular tax invoice templates with item calculations',
        'Corporate staff ID badges with QR code slots',
        'DL format business envelopes and email signatures',
      ],
      defaultPrompt: 'Dark luxury executive business card for Alexander Sterling, CEO of Nexus Dynamics',
    },
    {
      id: 'website',
      category: 'website',
      title: 'Website Design Studio',
      icon: Layout,
      color: 'from-amber-500 to-orange-600',
      tagline: 'Responsive Landing Pages & Enterprise Layouts',
      description:
        'Transform high-level product narratives into structured, modern responsive web layouts with hero sections, feature grids, and clean HTML/React code.',
      capabilities: [
        'Responsive layouts for desktop, tablet, and mobile views',
        'Modern navigation, hero announcements, and CTA stacks',
        'Export clean standalone HTML/CSS code',
        'Export modular React (.tsx) component code',
      ],
      defaultPrompt: 'Modern responsive SaaS landing page for an autonomous creative AI cloud platform',
    },
    {
      id: 'social',
      category: 'social',
      title: 'Social Media Design Studio',
      icon: Instagram,
      color: 'from-rose-500 to-pink-600',
      tagline: 'High-CTR Instagram, LinkedIn & YouTube Creatives',
      description:
        'Design high-engagement graphics tailored for standard social dimensions, including square Instagram posts, vertical stories, and feed banners.',
      capabilities: [
        'Instagram Square (1080x1080) & Vertical Story (1080x1920)',
        'LinkedIn thought leadership feed banners (1200x627)',
        'High click-through YouTube thumbnails (1280x720)',
        'Bold typography overlays and high-contrast ambient glows',
      ],
      defaultPrompt: 'High-contrast Instagram square post announcing Next-Gen Creative AI 2.0 release',
    },
    {
      id: 'brand',
      category: 'brand',
      title: 'Brand Identity Studio',
      icon: Palette,
      color: 'from-violet-500 to-indigo-600',
      tagline: 'Unified Brand Kits & Style Guideline Boards',
      description:
        'Establish coherent visual identities with synchronized color palettes (HEX/RGB), typography hierarchies, and reusable tokens.',
      capabilities: [
        'Complete color tokens (primary, secondary, accents, neutrals)',
        'Google Fonts typography pairing rules',
        'Cross-studio brand application across all projects',
        'Downloadable brand style specification boards',
      ],
      defaultPrompt: 'Comprehensive brand identity guideline board with obsidian slate and electric emerald',
    },
  ];

  const filtered = filter === 'all' ? studios : studios.filter((s) => s.category === filter);

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-10 select-none">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
          Creative Capabilities Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Six Specialized AI Creative Studios
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Each studio features purpose-built design intelligence, layout rules, and standard dimension presets
          engineered for professional output.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[
          { id: 'all', label: 'All Studios' },
          { id: 'logo', label: 'Logo' },
          { id: 'letterhead', label: 'Letterhead' },
          { id: 'stationery', label: 'Stationery' },
          { id: 'website', label: 'Website' },
          { id: 'social', label: 'Social Media' },
          { id: 'brand', label: 'Brand Kit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === tab.id
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-lg transition group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${st.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {st.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
                    {st.title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-400 mt-0.5">{st.tagline}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{st.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Core Capabilities
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {st.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link
                  href={`/generate?category=${st.category}&prompt=${encodeURIComponent(st.defaultPrompt)}`}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center space-x-2 transition group/btn"
                >
                  <span>Launch {st.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
