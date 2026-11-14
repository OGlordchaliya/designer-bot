'use client';

import React from 'react';
import {
  Trash2,
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
} from 'lucide-react';
import { DesignDocument, DesignLayer, TextLayer, ShapeLayer, IconLayer } from '@/lib/ddom/types';

interface PropertiesRightProps {
  document: DesignDocument;
  selectedLayerId: string | null;
  onUpdateLayer: (updatedLayer: DesignLayer) => void;
  onDeleteLayer: (layerId: string) => void;
  onDuplicateLayer: (layer: DesignLayer) => void;
  onReorderLayer: (layerId: string, direction: 'front' | 'back' | 'up' | 'down') => void;
  onUpdateArtboardBg: (newColor: string) => void;
}

const FONT_OPTIONS = [
  'Inter',
  'Plus Jakarta Sans',
  'Playfair Display',
  'Space Grotesk',
  'Montserrat',
  'Cinzel',
  'Roboto',
];

export const PropertiesRight: React.FC<PropertiesRightProps> = ({
  document: doc,
  selectedLayerId,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onReorderLayer,
  onUpdateArtboardBg,
}) => {
  const layer = doc.layers.find((l) => l.id === selectedLayerId);

  if (!layer) {
    return (
      <aside className="w-80 bg-slate-900 border-l border-slate-800 p-4 space-y-5 overflow-y-auto z-20 select-none">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Canvas Artboard</h3>
          <p className="text-xs text-slate-300 font-semibold">{doc.title}</p>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-800">
          <label className="text-xs font-medium text-slate-400 block">Dimensions</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Width</span>
              <span className="font-mono font-semibold text-white">{doc.artboard.width} px</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Height</span>
              <span className="font-mono font-semibold text-white">{doc.artboard.height} px</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-800">
          <label className="text-xs font-medium text-slate-400 block">Background Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={doc.artboard.backgroundColor || '#0B0F19'}
              onChange={(e) => onUpdateArtboardBg(e.target.value)}
              className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={doc.artboard.backgroundColor || '#0B0F19'}
              onChange={(e) => onUpdateArtboardBg(e.target.value)}
              className="flex-1 bg-slate-800 text-xs text-white px-3 py-2 rounded-lg border border-slate-700 font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {['#0B0F19', '#0F172A', '#1E293B', '#FFFFFF', '#FAF5FF', '#F0FDFA'].map((c) => (
              <button
                key={c}
                onClick={() => onUpdateArtboardBg(c)}
                style={{ backgroundColor: c }}
                className="w-6 h-6 rounded-md border border-white/20 hover:scale-110 transition shadow-sm"
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
          Select any element on the canvas to inspect its geometry, typography, colors, and layer properties.
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 p-4 space-y-5 overflow-y-auto z-20 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">{layer.type}</span>
          <h3 className="text-xs font-bold text-white truncate">{layer.name}</h3>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onUpdateLayer({ ...layer, visible: !layer.visible })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={layer.visible ? 'Hide Layer' : 'Show Layer'}
          >
            {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
          </button>

          <button
            onClick={() => onUpdateLayer({ ...layer, locked: !layer.locked })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
          >
            {layer.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onDuplicateLayer(layer)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Duplicate Layer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDeleteLayer(layer.id)}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
            title="Delete Layer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Transform</span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-slate-400">X Position</span>
            <input
              type="number"
              value={layer.x}
              onChange={(e) => onUpdateLayer({ ...layer, x: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-800 text-white px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono mt-0.5"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400">Y Position</span>
            <input
              type="number"
              value={layer.y}
              onChange={(e) => onUpdateLayer({ ...layer, y: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-800 text-white px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono mt-0.5"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400">Width</span>
            <input
              type="number"
              value={layer.width}
              onChange={(e) => onUpdateLayer({ ...layer, width: Math.max(10, parseInt(e.target.value) || 10) })}
              className="w-full bg-slate-800 text-white px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono mt-0.5"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400">Height</span>
            <input
              type="number"
              value={layer.height}
              onChange={(e) => onUpdateLayer({ ...layer, height: Math.max(10, parseInt(e.target.value) || 10) })}
              className="w-full bg-slate-800 text-white px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono mt-0.5"
            />
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Opacity</span>
            <span className="font-mono">{Math.round((layer.opacity !== undefined ? layer.opacity : 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={layer.opacity !== undefined ? layer.opacity : 1}
            onChange={(e) => onUpdateLayer({ ...layer, opacity: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {layer.type === 'text' && (
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Typography</span>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Text Content</label>
            <textarea
              rows={3}
              value={(layer as TextLayer).text}
              onChange={(e) => onUpdateLayer({ ...layer, text: e.target.value } as TextLayer)}
              className="w-full bg-slate-800 text-xs text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Font Family</label>
              <select
                value={(layer as TextLayer).fontFamily || 'Inter'}
                onChange={(e) => onUpdateLayer({ ...layer, fontFamily: e.target.value } as TextLayer)}
                className="w-full bg-slate-800 text-xs text-white px-2 py-1.5 rounded-lg border border-slate-700"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Font Size</label>
              <input
                type="number"
                value={(layer as TextLayer).fontSize}
                onChange={(e) => onUpdateLayer({ ...layer, fontSize: parseInt(e.target.value) || 12 } as TextLayer)}
                className="w-full bg-slate-800 text-xs text-white px-2 py-1.5 rounded-lg border border-slate-700 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Alignment</label>
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 gap-1">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => onUpdateLayer({ ...layer, textAlign: align } as TextLayer)}
                  className={`flex-1 py-1 flex items-center justify-center rounded transition ${
                    (layer as TextLayer).textAlign === align ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                  {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                  {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={(layer as TextLayer).color || '#FFFFFF'}
                onChange={(e) => onUpdateLayer({ ...layer, color: e.target.value } as TextLayer)}
                className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={(layer as TextLayer).color || '#FFFFFF'}
                onChange={(e) => onUpdateLayer({ ...layer, color: e.target.value } as TextLayer)}
                className="flex-1 bg-slate-800 text-xs text-white px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {layer.type === 'shape' && (
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Shape Appearance</span>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Fill Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={(layer as ShapeLayer).fill || '#6366F1'}
                onChange={(e) => onUpdateLayer({ ...layer, fill: e.target.value } as ShapeLayer)}
                className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={(layer as ShapeLayer).fill || '#6366F1'}
                onChange={(e) => onUpdateLayer({ ...layer, fill: e.target.value } as ShapeLayer)}
                className="flex-1 bg-slate-800 text-xs text-white px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Corner Radius</span>
              <span className="font-mono">{(layer as ShapeLayer).borderRadius || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={(layer as ShapeLayer).borderRadius || 0}
              onChange={(e) => onUpdateLayer({ ...layer, borderRadius: parseInt(e.target.value) } as ShapeLayer)}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {layer.type === 'icon' && (
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Icon Settings</span>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Icon Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={(layer as IconLayer).color || '#38BDF8'}
                onChange={(e) => onUpdateLayer({ ...layer, color: e.target.value } as IconLayer)}
                className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={(layer as IconLayer).color || '#38BDF8'}
                onChange={(e) => onUpdateLayer({ ...layer, color: e.target.value } as IconLayer)}
                className="flex-1 bg-slate-800 text-xs text-white px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 pt-3 border-t border-slate-800">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Layer Order</span>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => onReorderLayer(layer.id, 'front')}
            className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg flex flex-col items-center justify-center transition"
            title="Bring to Front"
          >
            <ChevronsUp className="w-4 h-4" />
            <span className="text-[9px] mt-1">To Top</span>
          </button>

          <button
            onClick={() => onReorderLayer(layer.id, 'up')}
            className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg flex flex-col items-center justify-center transition"
            title="Move Up"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-[9px] mt-1">Up</span>
          </button>

          <button
            onClick={() => onReorderLayer(layer.id, 'down')}
            className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg flex flex-col items-center justify-center transition"
            title="Move Down"
          >
            <ArrowDown className="w-4 h-4" />
            <span className="text-[9px] mt-1">Down</span>
          </button>

          <button
            onClick={() => onReorderLayer(layer.id, 'back')}
            className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg flex flex-col items-center justify-center transition"
            title="Send to Back"
          >
            <ChevronsDown className="w-4 h-4" />
            <span className="text-[9px] mt-1">To Bottom</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
