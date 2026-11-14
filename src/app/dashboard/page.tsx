'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Plus,
  FolderKanban,
  Palette,
  Download,
  Coins,
  FileText,
  CreditCard,
  Layout,
  Instagram,
  ArrowRight,
  ExternalLink,
  Trash2,
  Edit3,
  Clock,
  Layers,
} from 'lucide-react';
import { storage, UserProfile } from '@/lib/storage';
import { UserProjectSummary, BrandKit } from '@/lib/ddom/types';
import { AutonomousDesignEngine } from '@/lib/ai/autonomousEngine';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<UserProjectSummary[]>([]);
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);

  useEffect(() => {
    const prof = storage.getProfile();
    setProfile(prof);

    let projs = storage.listProjects();
    if (projs.length === 0) {
      const seed1 = AutonomousDesignEngine.generate({
        prompt: 'Minimalist geometric logo for a cybersecurity startup called Aegis Shield',
        category: 'logo',
      });
      const seed2 = AutonomousDesignEngine.generate({
        prompt: 'Executive corporate letterhead for Vanguard Global Logistics with A4 standard layout',
        category: 'letterhead',
      });
      const seed3 = AutonomousDesignEngine.generate({
        prompt: 'Luxury executive business card for Alexander Sterling, CEO of Nexus Dynamics',
        category: 'stationery',
      });
      storage.saveProject(seed1);
      storage.saveProject(seed2);
      storage.saveProject(seed3);
      projs = storage.listProjects();
    }
    setProjects(projs);
    setBrandKits(storage.listBrandKits());
  }, []);

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      storage.deleteProject(id);
      setProjects(storage.listProjects());
    }
  };

  const studios = [
    {
      id: 'logo',
      title: 'Logo Studio',
      desc: 'Minimalist, luxury & corporate vector logos',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-600',
      category: 'logo',
    },
    {
      id: 'letterhead',
      title: 'Letterhead Studio',
      desc: 'ISO 216 A4 print-ready corporate documents',
      icon: FileText,
      color: 'from-blue-500 to-cyan-600',
      category: 'letterhead',
    },
    {
      id: 'stationery',
      title: 'Business Stationery',
      desc: 'Business cards, invoices, ID badges & envelopes',
      icon: CreditCard,
      color: 'from-emerald-500 to-teal-600',
      category: 'stationery',
    },
    {
      id: 'website',
      title: 'Website Studio',
      desc: 'Responsive web layouts with HTML/React export',
      icon: Layout,
      color: 'from-amber-500 to-orange-600',
      category: 'website',
    },
    {
      id: 'social',
      title: 'Social Media Studio',
      desc: 'High-CTR Instagram, LinkedIn & YouTube banners',
      icon: Instagram,
      color: 'from-rose-500 to-pink-600',
      category: 'social',
    },
    {
      id: 'brand',
      title: 'Brand Identity Studio',
      desc: 'Unified color palettes, typography & guidelines',
      icon: Palette,
      color: 'from-violet-500 to-indigo-600',
      category: 'brand',
    },
  ];

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-10 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {profile?.fullName || 'Creator'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {profile?.subscriptionTier || 'Creator'} Plan
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Personal Creative Intelligence Workspace • All assets saved and editable
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{profile?.creditsBalance || 0} Credits</span>
          </div>

          <Link
            href="/generate"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold hover:from-indigo-600 hover:to-purple-700 shadow-glow transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Design</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Saved Projects</span>
            <FolderKanban className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{projects.length}</div>
          <span className="text-[10px] text-slate-400">Fully editable vector assets</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Brand Kits</span>
            <Palette className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{brandKits.length}</div>
          <span className="text-[10px] text-slate-400">Standardized design tokens</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Export Formats</span>
            <Download className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">5 Formats</div>
          <span className="text-[10px] text-slate-400">PNG, SVG, PDF, HTML, React</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">AI Credits</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{profile?.creditsBalance || 0}</div>
          <span className="text-[10px] text-emerald-400">Auto-renews monthly</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Creative Design Studios</h2>
          <Link href="/studios" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <span>View All Studios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studios.map((st) => {
            const Icon = st.icon;
            return (
              <Link
                key={st.id}
                href={`/generate?category=${st.category}`}
                className="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition flex items-start space-x-4 shadow-sm"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${st.color} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
                      {st.title}
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{st.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Projects</h2>
          <Link href="/projects" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            View All ({projects.length}) &rarr;
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
            <FolderKanban className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">No projects created yet</h3>
            <p className="text-xs text-slate-400">Launch a studio or use the prompt wizard to start designing.</p>
            <Link
              href="/generate"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Design</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {projects.slice(0, 6).map((proj) => (
              <div
                key={proj.id}
                onClick={() => router.push(`/editor/${proj.id}`)}
                className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {proj.category}
                    </span>
                    <button
                      onClick={(e) => handleDeleteProject(e, proj.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition truncate">
                    {proj.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                    <span className="flex items-center space-x-1">
                      <Layers className="w-3 h-3" />
                      <span>{proj.layerCount} layers</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-indigo-400 font-semibold group-hover:underline flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" /> Open in Canvas
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
