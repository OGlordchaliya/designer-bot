'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Palette,
  Plus,
  Trash2,
  Sparkles,
  Mail,
  Globe,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { BrandKit } from '@/lib/ddom/types';
import { AutonomousDesignEngine } from '@/lib/ai/autonomousEngine';

export default function BrandKitsPage() {
  const router = useRouter();
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [industry, setIndustry] = useState('Technology & Software');
  const [primaryColor, setPrimaryColor] = useState('#6366F1');
  const [secondaryColor, setSecondaryColor] = useState('#3B82F6');
  const [accentColor, setAccentColor] = useState('#10B981');
  const [headingFont, setHeadingFont] = useState('Plus Jakarta Sans');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [regNo, setRegNo] = useState('');

  useEffect(() => {
    setBrandKits(storage.listBrandKits());
  }, []);

  const handleCreateBrandKit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newKit: BrandKit = {
      id: `brand-kit-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || 'Excellence in Autonomous Innovation',
      industry,
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
        neutralDark: '#0B0F19',
        neutralLight: '#F8FAFC',
        background: '#0B0F19',
      },
      typography: {
        headingFont,
        bodyFont,
      },
      contactInfo: {
        email: email || `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: phone || '+1 (800) 555-0199',
        website: website || `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        address: address || '100 Innovation Boulevard, Tech Park, Suite 400, San Francisco, CA 94107',
        registrationNumber: regNo || 'US-DEL-2024-884920',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: brandKits.length === 0,
    };

    storage.saveBrandKit(newKit);
    setBrandKits(storage.listBrandKits());
    setIsModalOpen(false);

    setName('');
    setTagline('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this Brand Kit?')) {
      storage.deleteBrandKit(id);
      setBrandKits(storage.listBrandKits());
    }
  };

  const handleGenerateBoard = (kit: BrandKit) => {
    const doc = AutonomousDesignEngine.generate({
      prompt: `Brand identity guideline board for ${kit.name}`,
      category: 'brand',
      brandKit: kit,
    });
    storage.saveProject(doc);
    router.push(`/editor/${doc.id}`);
  };

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
            Brand Asset Repository
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Brand Kit Manager</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Maintain consistent chromatic palettes, typography tokens, and contact coordinates across all studios.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold hover:from-indigo-600 hover:to-purple-700 shadow-glow transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Brand Kit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {brandKits.map((kit) => (
          <div
            key={kit.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl relative overflow-hidden"
          >
            {kit.isDefault && (
              <span className="absolute top-6 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active Default
              </span>
            )}

            <div className="space-y-1 pr-20">
              <h3 className="text-lg font-black text-white">{kit.name}</h3>
              <p className="text-xs font-medium text-indigo-400">{kit.tagline}</p>
              <span className="inline-block text-[10px] text-slate-400 font-mono mt-1">
                Industry: {kit.industry || 'Enterprise Technology'}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Color Palette Tokens
              </span>
              <div className="flex gap-2">
                {Object.entries(kit.colors).map(([key, hex]) => (
                  <div key={key} className="flex-1 space-y-1">
                    <div
                      className="h-10 rounded-xl border border-white/20 shadow-sm"
                      style={{ backgroundColor: hex }}
                      title={`${key}: ${hex}`}
                    />
                    <span className="block text-[9px] font-mono text-slate-400 truncate uppercase">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Heading Font</span>
                <span className="font-bold text-white">{kit.typography.headingFont}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Body Font</span>
                <span className="font-bold text-white">{kit.typography.bodyFont}</span>
              </div>
            </div>

            {kit.contactInfo && (
              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{kit.contactInfo.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{kit.contactInfo.website}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => handleGenerateBoard(kit)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Style Guide Board</span>
              </button>

              <button
                onClick={() => handleDelete(kit.id)}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                title="Delete Brand Kit"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">Create New Brand Kit</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateBrandKit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nexus Dynamics"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Tagline</label>
                  <input
                    type="text"
                    placeholder="Architecting Sovereign Intelligence"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-2">Palette Colors</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Primary Core</span>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Secondary Accent</span>
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Vibrant Accent</span>
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Heading Font</label>
                  <select
                    value={headingFont}
                    onChange={(e) => setHeadingFont(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-xl border border-slate-700"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                    <option value="Playfair Display">Playfair Display (Luxury Serif)</option>
                    <option value="Space Grotesk">Space Grotesk (Tech Modern)</option>
                    <option value="Inter">Inter (Clean Slate)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Body Font</label>
                  <select
                    value={bodyFont}
                    onChange={(e) => setBodyFont(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-xl border border-slate-700"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Lora">Lora</option>
                    <option value="DM Sans">DM Sans</option>
                    <option value="Roboto">Roboto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="contact@enterprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (800) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-glow"
                >
                  Save Brand Kit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
