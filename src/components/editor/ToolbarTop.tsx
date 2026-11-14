'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Download,
  Save,
  Sparkles,
  Layers,
} from 'lucide-react';
import { DesignDocument } from '@/lib/ddom/types';

interface ToolbarTopProps {
  document: DesignDocument;
  onUpdateTitle: (newTitle: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  onSave: () => void;
  isSaving: boolean;
  onOpenExport: () => void;
  showAICopilot: boolean;
  onToggleAICopilot: () => void;
  showLayers: boolean;
  onToggleLayers: () => void;
}

export const ToolbarTop: React.FC<ToolbarTopProps> = ({
  document: doc,
  onUpdateTitle,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomChange,
  showGrid,
  onToggleGrid,
  onSave,
  isSaving,
  onOpenExport,
  showAICopilot,
  onToggleAICopilot,
  showLayers,
  onToggleLayers,
}) => {
  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 select-none">
      <div className="flex items-center space-x-3">
        <Link
          href="/dashboard"
          className="flex items-center space-x-1 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">Dashboard</span>
        </Link>

        <div className="h-4 w-px bg-slate-800" />

        <input
          type="text"
          value={doc.title}
          onChange={(e) => onUpdateTitle(e.target.value)}
          className="bg-transparent hover:bg-slate-800/60 focus:bg-slate-850 focus:ring-1 focus:ring-indigo-500 text-sm font-semibold text-white px-2.5 py-1 rounded transition max-w-[200px] md:max-w-[320px] truncate"
          title="Click to rename"
        />

        <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {doc.category}
        </span>
      </div>

      <div className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={() => onZoomChange(Math.max(25, zoom - 15))}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono font-medium text-slate-300 px-1.5 min-w-[45px] text-center">
          {zoom}%
        </span>

        <button
          onClick={() => onZoomChange(Math.min(300, zoom + 15))}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => onZoomChange(100)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Reset Zoom (100%)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={onToggleGrid}
          className={`p-1.5 rounded-lg transition ${
            showGrid ? 'bg-indigo-600/30 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle Grid (G)"
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleLayers}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
            showLayers ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Layers</span>
        </button>

        <button
          onClick={onToggleAICopilot}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            showAICopilot
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow'
              : 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          <span>AI Copilot</span>
        </button>

        <button
          onClick={onSave}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
        >
          {isSaving ? (
            <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-glow-green transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
