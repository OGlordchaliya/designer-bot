'use client';

import React from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Type,
  Square,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { DesignDocument, DesignLayer } from '@/lib/ddom/types';

interface LayersPanelProps {
  document: DesignDocument;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string | null) => void;
  onUpdateLayer: (updatedLayer: DesignLayer) => void;
  onDeleteLayer: (layerId: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  document: doc,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
}) => {
  const sortedLayers = [...doc.layers].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-3.5 h-3.5 text-indigo-400" />;
      case 'shape':
        return <Square className="w-3.5 h-3.5 text-emerald-400" />;
      case 'icon':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <ImageIcon className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="w-64 bg-slate-900 border-l border-slate-800 flex flex-col z-20 select-none">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Layers Stack</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
          {doc.layers.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedLayers.map((layer) => {
          const isSelected = layer.id === selectedLayerId;
          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition ${
                isSelected
                  ? 'bg-indigo-600/30 text-white border border-indigo-500/50'
                  : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2 min-w-0 pr-1">
                {getLayerIcon(layer.type)}
                <span className="truncate text-xs font-medium">{layer.name}</span>
              </div>

              <div className="flex items-center space-x-1 opacity-70 hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer({ ...layer, visible: !layer.visible });
                  }}
                  className="p-1 hover:text-white"
                  title={layer.visible ? 'Hide' : 'Show'}
                >
                  {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-rose-400" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer({ ...layer, locked: !layer.locked });
                  }}
                  className="p-1 hover:text-white"
                  title={layer.locked ? 'Unlock' : 'Lock'}
                >
                  {layer.locked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                  className="p-1 hover:text-rose-400"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
