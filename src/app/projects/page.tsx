'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Search,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Clock,
  Layers,
  ExternalLink,
  Download,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { UserProjectSummary } from '@/lib/ddom/types';
import { SVGExportEngine } from '@/lib/export/svgExport';

export default function MyProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<UserProjectSummary[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    setProjects(storage.listProjects());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      storage.deleteProject(id);
      setProjects(storage.listProjects());
    }
  };

  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const original = storage.getProject(id);
    if (!original) return;
    const dup = {
      ...original,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${original.title} (Copy)`,
      metadata: {
        ...original.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    storage.saveProject(dup);
    setProjects(storage.listProjects());
  };

  const handleQuickDownload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const doc = storage.getProject(id);
    if (!doc) return;
    SVGExportEngine.downloadSVG(doc);
    storage.logExport({
      projectId: doc.id,
      projectTitle: doc.title,
      category: doc.category,
      format: 'svg',
      scale: 1,
      fileSize: '48 KB',
    });
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
            Workspace Projects
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Creative Projects</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage, duplicate, edit, and export your personal vector designs.
          </p>
        </div>

        <Link
          href="/generate"
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold hover:from-indigo-600 hover:to-purple-700 shadow-glow transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Design</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'logo', label: 'Logos' },
            { id: 'letterhead', label: 'Letterheads' },
            { id: 'stationery', label: 'Stationery' },
            { id: 'website', label: 'Websites' },
            { id: 'social', label: 'Social' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterCategory === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="py-20 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
          <FolderKanban className="w-12 h-12 text-slate-500 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white">No projects found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {search ? 'Try clearing your search query.' : 'Create your first project using the AI wizard.'}
            </p>
          </div>
          <Link
            href="/generate"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Design</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => router.push(`/editor/${proj.id}`)}
              className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 cursor-pointer transition shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {proj.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleQuickDownload(e, proj.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition"
                      title="Quick Download SVG"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDuplicate(e, proj.id)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                      title="Duplicate Project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, proj.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-indigo-400 flex items-center gap-1 group-hover:underline">
                  <Edit3 className="w-3.5 h-3.5" /> Open in Editor
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
