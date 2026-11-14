'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Keyboard,
  Sparkles,
  ChevronDown,
  Search,
} from 'lucide-react';

export default function HelpCenterPage() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does AI Creative Intelligence Studio differ from Midjourney or DALL-E?',
      a: 'Ordinary AI image generators produce flat raster pixel images (JPEG/PNG) where text is distorted, garbled, or uneditable. AI Creative Intelligence Studio operates on a structured Design Document Object Model (DDOM). Every output is composed of discrete, mathematically editable vector layers, Google Fonts, vector shapes, and Lucide icons that you can drag, resize, restyle, and download as clean SVGs or print-ready PDFs.',
    },
    {
      q: 'Can I print generated corporate letterheads and invoices?',
      a: 'Yes. Our Letterhead and Business Stationery studios output to standard ISO 216 A4 (210 x 297 mm) and US Letter formats with exact margins, high resolution (300 DPI equivalent), and embedded fonts, calibrated for professional corporate printing.',
    },
    {
      q: 'How do Brand Kits work across studios?',
      a: 'When you create a Brand Kit in the Brand Kit Manager, its primary/secondary colors, typography pairings, and official company coordinates are automatically synchronized across all studios. Generating a logo or letterhead will dynamically adopt your brand rules.',
    },
    {
      q: 'Can I export clean HTML or React component code for website layouts?',
      a: 'Yes. The Website Design Studio and Export Modal allow you to copy or download clean standalone HTML/CSS code or reusable React (.tsx) components with embedded SVG vectors ready for your web application.',
    },
    {
      q: 'Are my proprietary designs and uploaded assets private?',
      a: 'Yes. All projects and brand assets are isolated under strict Row Level Security (RLS) policies. No user or third party can access another user’s workspace or private vectors.',
    },
  ];

  const shortcuts = [
    { key: 'Ctrl + Z', desc: 'Undo last canvas action' },
    { key: 'Ctrl + Y / Ctrl+Shift+Z', desc: 'Redo previously undone action' },
    { key: 'Delete / Backspace', desc: 'Delete the currently selected element' },
    { key: 'G', desc: 'Toggle background alignment grid' },
    { key: 'Drag Handles', desc: 'Resize width and height from 8 perimeter points' },
    { key: 'Click & Drag', desc: 'Move element across the artboard' },
  ];

  const promptExamples = [
    {
      category: 'Logo Design',
      prompt: 'Minimalist geometric logo for a cybersecurity startup called Aegis Shield with obsidian slate and electric emerald accents',
    },
    {
      category: 'Company Letterhead',
      prompt: 'Corporate executive letterhead for Vanguard Global Logistics with A4 standard layout and navy header rule',
    },
    {
      category: 'Business Card',
      prompt: 'Dark luxury executive business card for Alexander Sterling, CEO of Nexus Dynamics with QR code',
    },
    {
      category: 'Website Layout',
      prompt: 'Modern responsive SaaS landing page for an autonomous creative AI cloud platform with dark mode glow',
    },
    {
      category: 'Social Media',
      prompt: 'High-contrast Instagram square post announcing Next-Gen Creative AI 2.0 release with bold headline',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-12 select-none">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
          Knowledge Base &amp; Guides
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Help &amp; Documentation Center</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Master the prompt architecture, vector editor shortcuts, and professional export workflows.
        </p>

        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 absolute left-3 top-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documentation, shortcuts, or FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Prompt Engineering Guide for AI Design</h2>
            <p className="text-xs text-slate-400">
              How to craft high-precision prompts for the autonomous vector engine
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {promptExamples.map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                {item.category}
              </span>
              <p className="text-slate-300 font-mono text-[11px] leading-relaxed">&ldquo;{item.prompt}&rdquo;</p>
              <Link
                href={`/generate?prompt=${encodeURIComponent(item.prompt)}`}
                className="inline-block text-[10px] font-bold text-emerald-400 hover:underline pt-1"
              >
                Use this prompt in wizard &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Editor Keyboard Shortcuts</h2>
            <p className="text-xs text-slate-400">Boost your design speed with desktop shortcuts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
            >
              <span className="text-slate-300">{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 font-mono font-bold text-indigo-400 text-[10px]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Detailed answers regarding architecture, vectors, and prints</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40 transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-indigo-400 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
