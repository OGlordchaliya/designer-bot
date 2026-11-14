'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { DesignDocument, DesignLayer, BrandKit } from '@/lib/ddom/types';
import { storage } from '@/lib/storage';
import { AutonomousDesignEngine } from '@/lib/ai/autonomousEngine';
import { ToolbarTop } from '@/components/editor/ToolbarTop';
import { SidebarLeft } from '@/components/editor/SidebarLeft';
import { CanvasArtboard } from '@/components/editor/CanvasArtboard';
import { PropertiesRight } from '@/components/editor/PropertiesRight';
import { LayersPanel } from '@/components/editor/LayersPanel';
import { AICopilotPanel } from '@/components/editor/AICopilotPanel';
import { ExportModal } from '@/components/editor/ExportModal';

export default function EditorCanvasPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [doc, setDoc] = useState<DesignDocument | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [showAICopilot, setShowAICopilot] = useState<boolean>(false);
  const [showLayers, setShowLayers] = useState<boolean>(false);
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);

  const [history, setHistory] = useState<DesignDocument[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  useEffect(() => {
    if (!projectId) return;
    let project = storage.getProject(projectId);
    if (!project) {
      project = AutonomousDesignEngine.generate({
        prompt: 'Minimalist modern logo for a cybersecurity startup called Aegis Shield',
        category: 'logo',
      });
      project.id = projectId;
      storage.saveProject(project);
    }
    setDoc(project);
    setHistory([project]);
    setHistoryIndex(0);

    const kits = storage.listBrandKits();
    if (kits.length > 0) setBrandKit(kits[0]);

    if (project.artboard.height > 1000) {
      setZoom(60);
    } else if (project.artboard.width > 1200) {
      setZoom(55);
    } else {
      setZoom(85);
    }
  }, [projectId]);

  const pushState = useCallback((newDoc: DesignDocument) => {
    setDoc(newDoc);
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, newDoc].slice(-30);
    });
    setHistoryIndex((prev) => prev + 1);
    storage.saveProject(newDoc);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      const targetDoc = history[prevIndex];
      setDoc(targetDoc);
      storage.saveProject(targetDoc);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      const targetDoc = history[nextIndex];
      setDoc(targetDoc);
      storage.saveProject(targetDoc);
    }
  }, [historyIndex, history]);

  const handleSave = () => {
    if (!doc) return;
    setIsSaving(true);
    storage.saveProject(doc);
    setTimeout(() => setIsSaving(false), 300);
  };

  const handleUpdateLayer = (updatedLayer: DesignLayer) => {
    if (!doc) return;
    const newLayers = doc.layers.map((l) => (l.id === updatedLayer.id ? updatedLayer : l));
    const newDoc: DesignDocument = {
      ...doc,
      layers: newLayers,
    };
    pushState(newDoc);
  };

  const handleAddLayer = (newLayer: DesignLayer) => {
    if (!doc) return;
    const newDoc: DesignDocument = {
      ...doc,
      layers: [...doc.layers, newLayer],
    };
    pushState(newDoc);
    setSelectedLayerId(newLayer.id);
  };

  const handleDeleteLayer = (layerId: string) => {
    if (!doc) return;
    const newLayers = doc.layers.filter((l) => l.id !== layerId);
    const newDoc: DesignDocument = {
      ...doc,
      layers: newLayers,
    };
    pushState(newDoc);
    if (selectedLayerId === layerId) setSelectedLayerId(null);
  };

  const handleDuplicateLayer = (layer: DesignLayer) => {
    if (!doc) return;
    const newId = `layer-dup-${Date.now()}`;
    const duplicated: DesignLayer = {
      ...layer,
      id: newId,
      name: `${layer.name} (Copy)`,
      x: layer.x + 20,
      y: layer.y + 20,
      zIndex: (layer.zIndex || 1) + 1,
    };
    handleAddLayer(duplicated);
  };

  const handleReorderLayer = (layerId: string, direction: 'front' | 'back' | 'up' | 'down') => {
    if (!doc) return;
    const layers = [...doc.layers];
    const targetIdx = layers.findIndex((l) => l.id === layerId);
    if (targetIdx === -1) return;

    const layer = layers[targetIdx];
    const currentZ = layer.zIndex || 1;

    if (direction === 'front') {
      const maxZ = Math.max(...layers.map((l) => l.zIndex || 1), 0);
      layer.zIndex = maxZ + 1;
    } else if (direction === 'back') {
      const minZ = Math.min(...layers.map((l) => l.zIndex || 1), 1);
      layer.zIndex = Math.max(0, minZ - 1);
    } else if (direction === 'up') {
      layer.zIndex = currentZ + 1;
    } else if (direction === 'down') {
      layer.zIndex = Math.max(0, currentZ - 1);
    }

    pushState({ ...doc, layers });
  };

  const handleUpdateArtboardBg = (newColor: string) => {
    if (!doc) return;
    pushState({
      ...doc,
      artboard: {
        ...doc.artboard,
        backgroundColor: newColor,
      },
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedLayerId) {
          e.preventDefault();
          handleDeleteLayer(selectedLayerId);
        }
      } else if (e.key.toLowerCase() === 'g') {
        setShowGrid((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerId, handleUndo, handleRedo]);

  if (!doc) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Vector Artboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      <ToolbarTop
        document={doc}
        onUpdateTitle={(title) => pushState({ ...doc, title })}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoom={zoom}
        onZoomChange={setZoom}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onSave={handleSave}
        isSaving={isSaving}
        onOpenExport={() => setIsExportOpen(true)}
        showAICopilot={showAICopilot}
        onToggleAICopilot={() => setShowAICopilot(!showAICopilot)}
        showLayers={showLayers}
        onToggleLayers={() => setShowLayers(!showLayers)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <SidebarLeft
          document={doc}
          onAddLayer={handleAddLayer}
          brandKit={brandKit}
        />

        <main className="flex-1 overflow-auto bg-slate-950 relative flex items-center justify-center">
          <CanvasArtboard
            document={doc}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onUpdateLayer={handleUpdateLayer}
            zoom={zoom}
            showGrid={showGrid}
          />
        </main>

        {showLayers && (
          <LayersPanel
            document={doc}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onUpdateLayer={handleUpdateLayer}
            onDeleteLayer={handleDeleteLayer}
          />
        )}

        {showAICopilot && (
          <AICopilotPanel
            document={doc}
            onApplyDocumentUpdate={pushState}
            onClose={() => setShowAICopilot(false)}
          />
        )}

        <PropertiesRight
          document={doc}
          selectedLayerId={selectedLayerId}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          onDuplicateLayer={handleDuplicateLayer}
          onReorderLayer={handleReorderLayer}
          onUpdateArtboardBg={handleUpdateArtboardBg}
        />
      </div>

      <ExportModal
        document={doc}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
