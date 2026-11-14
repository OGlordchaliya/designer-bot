'use client';

import React, { useState } from 'react';
import {
  Type,
  Square,
  Sparkles,
  Palette,
  Search,
  Shield,
  Zap,
  Star,
  Hexagon,
  Globe,
  Briefcase,
  Award,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Cpu,
  Rocket,
  Lock,
  QrCode,
} from 'lucide-react';
import { DesignDocument, DesignLayer, ShapeType, BrandKit } from '@/lib/ddom/types';

interface SidebarLeftProps {
  document: DesignDocument;
  onAddLayer: (layer: DesignLayer) => void;
  brandKit?: BrandKit | null;
  onApplyBrandKit?: (brandKit: BrandKit) => void;
}

const AVAILABLE_ICONS = [
  { name: 'Shield', label: 'Shield', icon: Shield },
  { name: 'Zap', label: 'Lightning', icon: Zap },
  { name: 'Star', label: 'Star', icon: Star },
  { name: 'Hexagon', label: 'Hexagon', icon: Hexagon },
  { name: 'Globe', label: 'Global', icon: Globe },
  { name: 'Briefcase', label: 'Enterprise', icon: Briefcase },
  { name: 'Award', label: 'Excellence', icon: Award },
  { name: 'TrendingUp', label: 'Growth', icon: TrendingUp },
  { name: 'Mail', label: 'Email', icon: Mail },
  { name: 'Phone', label: 'Telephone', icon: Phone },
  { name: 'MapPin', label: 'Location', icon: MapPin },
  { name: 'Cpu', label: 'AI Processor', icon: Cpu },
  { name: 'Rocket', label: 'Launch', icon: Rocket },
  { name: 'Lock', label: 'Security', icon: Lock },
  { name: 'QrCode', label: 'QR Matrix', icon: QrCode },
  { name: 'Sparkles', label: 'Intelligence', icon: Sparkles },
];

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  document: doc,
  onAddLayer,
  brandKit,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'shapes' | 'icons' | 'brand'>('text');
  const [iconSearch, setIconSearch] = useState('');

  const nextZ = Math.max(...doc.layers.map((l) => l.zIndex || 1), 0) + 1;
  const cx = doc.artboard.width / 2;
  const cy = doc.artboard.height / 2;

  const handleAddText = (variant: 'heading' | 'subheading' | 'body') => {
    const id = `layer-txt-${Date.now()}`;
    let newLayer: DesignLayer;

    if (variant === 'heading') {
      newLayer = {
        id,
        name: 'New Heading',
        type: 'text',
        text: 'Transform Your Vision',
        x: Math.max(20, cx - 250),
        y: Math.max(20, cy - 35),
        width: 500,
        height: 70,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: nextZ,
        fontSize: 36,
        fontFamily: brandKit?.typography.headingFont || 'Plus Jakarta Sans',
        fontWeight: 800,
        textAlign: 'center',
        color: brandKit?.colors.primary || '#6366F1',
      };
    } else if (variant === 'subheading') {
      newLayer = {
        id,
        name: 'New Subheading',
        type: 'text',
        text: 'Next-Generation Design Intelligence',
        x: Math.max(20, cx - 200),
        y: Math.max(20, cy - 20),
        width: 400,
        height: 40,
        rotation: 0,
        opacity: 0.9,
        visible: true,
        zIndex: nextZ,
        fontSize: 18,
        fontFamily: brandKit?.typography.bodyFont || 'Inter',
        fontWeight: 600,
        textAlign: 'center',
        color: '#94A3B8',
      };
    } else {
      newLayer = {
        id,
        name: 'New Paragraph',
        type: 'text',
        text: 'Describe your imagination and refine your creative assets with precision.',
        x: Math.max(20, cx - 180),
        y: Math.max(20, cy - 30),
        width: 360,
        height: 60,
        rotation: 0,
        opacity: 0.85,
        visible: true,
        zIndex: nextZ,
        fontSize: 13,
        fontFamily: brandKit?.typography.bodyFont || 'Inter',
        fontWeight: 400,
        textAlign: 'center',
        color: '#CBD5E1',
      };
    }

    onAddLayer(newLayer);
  };

  const handleAddShape = (shapeType: ShapeType) => {
    const id = `layer-shp-${Date.now()}`;
    const fill = brandKit?.colors.primary || '#6366F1';

    let width = 120;
    let height = 120;
    let borderRadius = 0;

    if (shapeType === 'pill') {
      width = 180;
      height = 44;
      borderRadius = 22;
    } else if (shapeType === 'divider') {
      width = 400;
      height = 2;
    } else if (shapeType === 'rectangle') {
      width = 160;
      height = 100;
      borderRadius = 12;
    }

    const newLayer: DesignLayer = {
      id,
      name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} Shape`,
      type: 'shape',
      shapeType,
      x: Math.max(20, cx - width / 2),
      y: Math.max(20, cy - height / 2),
      width,
      height,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: nextZ,
      fill,
      borderRadius,
    };

    onAddLayer(newLayer);
  };

  const handleAddIcon = (iconName: string) => {
    const id = `layer-ico-${Date.now()}`;
    const newLayer: DesignLayer = {
      id,
      name: `${iconName} Icon`,
      type: 'icon',
      iconName,
      x: Math.max(20, cx - 32),
      y: Math.max(20, cy - 32),
      width: 64,
      height: 64,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: nextZ,
      color: brandKit?.colors.accent || '#38BDF8',
      strokeWidth: 2,
    };

    onAddLayer(newLayer);
  };

  const filteredIcons = AVAILABLE_ICONS.filter((item) =>
    item.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
    item.name.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-20 select-none">
      <div className="flex border-b border-slate-800 p-1.5 gap-1 bg-slate-950/40">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg text-[11px] font-semibold transition ${
            activeTab === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Type className="w-4 h-4 mb-1" />
          <span>Text</span>
        </button>

        <button
          onClick={() => setActiveTab('shapes')}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg text-[11px] font-semibold transition ${
            activeTab === 'shapes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Square className="w-4 h-4 mb-1" />
          <span>Shapes</span>
        </button>

        <button
          onClick={() => setActiveTab('icons')}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg text-[11px] font-semibold transition ${
            activeTab === 'icons' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-1" />
          <span>Icons</span>
        </button>

        <button
          onClick={() => setActiveTab('brand')}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg text-[11px] font-semibold transition ${
            activeTab === 'brand' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4 mb-1" />
          <span>Brand</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'text' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Typography Elements</h4>
            
            <button
              onClick={() => handleAddText('heading')}
              className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500 transition group"
            >
              <span className="block text-lg font-extrabold text-white group-hover:text-indigo-400">Add a Heading</span>
              <span className="text-[11px] text-slate-400">Primary headline with high prominence</span>
            </button>

            <button
              onClick={() => handleAddText('subheading')}
              className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500 transition group"
            >
              <span className="block text-sm font-semibold text-slate-200 group-hover:text-indigo-400">Add a Subheading</span>
              <span className="text-[11px] text-slate-400">Secondary supporting statement</span>
            </button>

            <button
              onClick={() => handleAddText('body')}
              className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500 transition group"
            >
              <span className="block text-xs font-normal text-slate-300 group-hover:text-indigo-400">Add Body Paragraph</span>
              <span className="text-[11px] text-slate-400">Regular multi-line descriptive text</span>
            </button>
          </div>
        )}

        {activeTab === 'shapes' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Geometric Vector Shapes</h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleAddShape('rectangle')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500 flex flex-col items-center justify-center space-y-2 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500" />
                <span className="text-xs font-medium text-slate-300">Rectangle</span>
              </button>

              <button
                onClick={() => handleAddShape('circle')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500 flex flex-col items-center justify-center space-y-2 transition"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500" />
                <span className="text-xs font-medium text-slate-300">Circle</span>
              </button>

              <button
                onClick={() => handleAddShape('pill')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500 flex flex-col items-center justify-center space-y-2 transition"
              >
                <div className="w-12 h-5 rounded-full bg-indigo-500" />
                <span className="text-xs font-medium text-slate-300">Pill / Badge</span>
              </button>

              <button
                onClick={() => handleAddShape('divider')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500 flex flex-col items-center justify-center space-y-2 transition"
              >
                <div className="w-10 h-0.5 bg-indigo-500 my-3.5" />
                <span className="text-xs font-medium text-slate-300">Divider Rule</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search vector icons..."
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                className="w-full bg-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {filteredIcons.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleAddIcon(item.name)}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500 flex flex-col items-center justify-center space-y-1.5 transition group"
                    title={`Add ${item.label}`}
                  >
                    <Icon className="w-6 h-6 text-slate-300 group-hover:text-indigo-400" />
                    <span className="text-[10px] text-slate-400 truncate max-w-full">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'brand' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Brand Standards</h4>
            {brandKit ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs font-bold text-white">{brandKit.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{brandKit.tagline}</div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400">Palette Tokens</span>
                  <div className="flex gap-2">
                    {Object.entries(brandKit.colors).map(([key, color]) => (
                      <div
                        key={key}
                        className="w-7 h-7 rounded-lg border border-white/20 shadow-sm cursor-pointer hover:scale-110 transition"
                        style={{ backgroundColor: color }}
                        title={`${key}: ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 text-[11px]">Heading Font: </span>
                    <span className="font-semibold">{brandKit.typography.headingFont}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Body Font: </span>
                    <span className="font-semibold">{brandKit.typography.bodyFont}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center text-xs text-slate-400">
                No custom brand kit assigned. Default design tokens active.
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
