'use client';

import React, { useRef, useState, useEffect } from 'react';
import { DesignDocument, DesignLayer, TextLayer, ShapeLayer, IconLayer } from '@/lib/ddom/types';
import * as LucideIcons from 'lucide-react';

interface CanvasArtboardProps {
  document: DesignDocument;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string | null) => void;
  onUpdateLayer: (updatedLayer: DesignLayer) => void;
  zoom: number;
  showGrid: boolean;
}

export const CanvasArtboard: React.FC<CanvasArtboardProps> = ({
  document: doc,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  zoom,
  showGrid,
}) => {
  const artboardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialLayerState, setInitialLayerState] = useState<DesignLayer | null>(null);

  const selectedLayer = doc.layers.find((l) => l.id === selectedLayerId) || null;

  const handleMouseDown = (e: React.MouseEvent, layer: DesignLayer) => {
    e.stopPropagation();
    if (layer.locked) return;
    onSelectLayer(layer.id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialLayerState({ ...layer });
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (!selectedLayer || selectedLayer.locked) return;
    setIsResizing(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialLayerState({ ...selectedLayer });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!initialLayerState) return;

      const deltaX = (e.clientX - dragStart.x) / (zoom / 100);
      const deltaY = (e.clientY - dragStart.y) / (zoom / 100);

      if (isDragging) {
        onUpdateLayer({
          ...initialLayerState,
          x: Math.round(initialLayerState.x + deltaX),
          y: Math.round(initialLayerState.y + deltaY),
        });
      } else if (isResizing) {
        let newW = initialLayerState.width;
        let newH = initialLayerState.height;
        let newX = initialLayerState.x;
        let newY = initialLayerState.y;

        if (isResizing.includes('e')) newW = Math.max(20, Math.round(initialLayerState.width + deltaX));
        if (isResizing.includes('s')) newH = Math.max(20, Math.round(initialLayerState.height + deltaY));
        if (isResizing.includes('w')) {
          const proposedW = Math.max(20, Math.round(initialLayerState.width - deltaX));
          newX = Math.round(initialLayerState.x + (initialLayerState.width - proposedW));
          newW = proposedW;
        }
        if (isResizing.includes('n')) {
          const proposedH = Math.max(20, Math.round(initialLayerState.height - deltaY));
          newY = Math.round(initialLayerState.y + (initialLayerState.height - proposedH));
          newH = proposedH;
        }

        onUpdateLayer({
          ...initialLayerState,
          x: newX,
          y: newY,
          width: newW,
          height: newH,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
      setInitialLayerState(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, initialLayerState, dragStart, zoom, onUpdateLayer]);

  const renderLayer = (layer: DesignLayer) => {
    if (!layer.visible) return null;
    const isSelected = layer.id === selectedLayerId;

    let content: React.ReactNode = null;

    if (layer.type === 'shape') {
      const shape = layer as ShapeLayer;
      const rx = shape.shapeType === 'pill' ? shape.height / 2 : shape.borderRadius || 0;
      content = (
        <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
          {shape.shapeType === 'circle' ? (
            <circle
              cx={shape.width / 2}
              cy={shape.height / 2}
              r={Math.min(shape.width, shape.height) / 2}
              fill={shape.fill}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth || 0}
            />
          ) : (
            <rect
              width="100%"
              height="100%"
              rx={rx}
              fill={shape.fill}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth || 0}
            />
          )}
        </svg>
      );
    } else if (layer.type === 'text') {
      const txt = layer as TextLayer;
      content = (
        <div
          style={{
            width: '100%',
            height: '100%',
            color: txt.color,
            fontSize: `${txt.fontSize}px`,
            fontFamily: txt.fontFamily || 'Inter',
            fontWeight: txt.fontWeight || 600,
            textAlign: txt.textAlign || 'left',
            letterSpacing: txt.letterSpacing ? `${txt.letterSpacing}px` : undefined,
            lineHeight: txt.lineHeight || 1.3,
            whiteSpace: 'pre-wrap',
            userSelect: 'none',
          }}
        >
          {txt.text}
        </div>
      );
    } else if (layer.type === 'icon') {
      const icon = layer as IconLayer;
      const IconComponent = (LucideIcons as any)[icon.iconName] || LucideIcons.Zap;
      content = (
        <div className="w-full h-full flex items-center justify-center">
          <IconComponent
            style={{
              width: '100%',
              height: '100%',
              color: icon.color,
              strokeWidth: icon.strokeWidth || 2,
            }}
          />
        </div>
      );
    }

    return (
      <div
        key={layer.id}
        onMouseDown={(e) => handleMouseDown(e, layer)}
        style={{
          position: 'absolute',
          left: `${layer.x}px`,
          top: `${layer.y}px`,
          width: `${layer.width}px`,
          height: `${layer.height}px`,
          transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
          opacity: layer.opacity !== undefined ? layer.opacity : 1,
          zIndex: layer.zIndex || 1,
          cursor: layer.locked ? 'default' : 'move',
        }}
        className={`group transition-shadow ${
          isSelected ? 'ring-2 ring-indigo-500 ring-offset-1' : 'hover:ring-1 hover:ring-indigo-300/60'
        }`}
      >
        {content}

        {isSelected && !layer.locked && (
          <div className="absolute inset-0 pointer-events-none border border-indigo-500">
            {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map((handle) => {
              const posStyles: Record<string, string> = {
                nw: '-top-1.5 -left-1.5 cursor-nwse-resize',
                ne: '-top-1.5 -right-1.5 cursor-nesw-resize',
                sw: '-bottom-1.5 -left-1.5 cursor-nesw-resize',
                se: '-bottom-1.5 -right-1.5 cursor-nwse-resize',
                n: '-top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize',
                s: '-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize',
                w: 'top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize',
                e: 'top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize',
              };
              return (
                <div
                  key={handle}
                  onMouseDown={(e) => handleResizeStart(e, handle)}
                  className={`pointer-events-auto absolute w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm shadow-sm ${posStyles[handle]}`}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const W = doc.artboard.width;
  const H = doc.artboard.height;

  return (
    <div
      className="relative flex items-center justify-center min-w-full min-h-full p-16 select-none"
      onClick={() => onSelectLayer(null)}
    >
      <div
        ref={artboardRef}
        style={{
          width: `${W}px`,
          height: `${H}px`,
          backgroundColor: doc.artboard.backgroundColor || '#FFFFFF',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center center',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        }}
        className="relative overflow-hidden transition-transform duration-75"
        onClick={(e) => e.stopPropagation()}
      >
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        )}

        {doc.layers
          .slice()
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
          .map(renderLayer)}
      </div>
    </div>
  );
};
