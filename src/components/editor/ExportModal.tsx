'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  FileCode,
  FileText,
  Image as ImageIcon,
  Check,
  Sparkles,
  Printer,
  Copy,
} from 'lucide-react';
import { DesignDocument } from '@/lib/ddom/types';
import { SVGExportEngine } from '@/lib/export/svgExport';
import { PDFExportEngine } from '@/lib/export/pdfGenerator';
import { HTMLExportEngine } from '@/lib/export/htmlExport';
import { storage } from '@/lib/storage';

interface ExportModalProps {
  document: DesignDocument;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ document: doc, isOpen, onClose }) => {
  const [activeFormat, setActiveFormat] = useState<'png' | 'svg' | 'pdf' | 'html' | 'react'>('png');
  const [transparentBg, setTransparentBg] = useState(false);
  const [resolutionScale, setResolutionScale] = useState<number>(2);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      const svgString = SVGExportEngine.generateSVG(doc, { transparentBg });
      const canvas = window.document.createElement('canvas');
      canvas.width = doc.artboard.width * resolutionScale;
      canvas.height = doc.artboard.height * resolutionScale;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });

      const pngData = canvas.toDataURL('image/png');
      const a = window.document.createElement('a');
      a.href = pngData;
      a.download = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${resolutionScale}x.png`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);

      storage.logExport({
        projectId: doc.id,
        projectTitle: doc.title,
        category: doc.category,
        format: 'png',
        scale: resolutionScale,
        fileSize: `${Math.round((canvas.width * canvas.height * 4) / 1024)} KB`,
      });
      onClose();
    } catch (e) {
      console.error('PNG export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSVG = () => {
    SVGExportEngine.downloadSVG(doc);
    storage.logExport({
      projectId: doc.id,
      projectTitle: doc.title,
      category: doc.category,
      format: 'svg',
      scale: 1,
      fileSize: '48 KB',
    });
    onClose();
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await PDFExportEngine.downloadPDF(doc);
      storage.logExport({
        projectId: doc.id,
        projectTitle: doc.title,
        category: doc.category,
        format: 'pdf',
        scale: 1,
        fileSize: '1.2 MB',
      });
      onClose();
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const htmlCode = HTMLExportEngine.generateHTML(doc);
  const reactCode = HTMLExportEngine.generateReactComponent(doc);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export & Download Asset</h2>
              <p className="text-xs text-slate-400">Professional multi-format output compiler</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-5 p-3 gap-2 bg-slate-950/60 border-b border-slate-800 text-xs">
          {[
            { id: 'png', label: 'PNG Image', icon: ImageIcon },
            { id: 'svg', label: 'Vector SVG', icon: Sparkles },
            { id: 'pdf', label: 'Print PDF', icon: Printer },
            { id: 'html', label: 'HTML/CSS', icon: FileCode },
            { id: 'react', label: 'React Code', icon: FileText },
          ].map((fmt) => {
            const Icon = fmt.icon;
            const isSel = activeFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                onClick={() => setActiveFormat(fmt.id as any)}
                className={`py-2 px-3 rounded-xl flex flex-col items-center justify-center space-y-1 font-semibold transition ${
                  isSel
                    ? 'bg-indigo-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{fmt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6 space-y-5">
          {activeFormat === 'png' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">PNG Output Settings</span>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Transparent Background</span>
                  <input
                    type="checkbox"
                    checked={transparentBg}
                    onChange={(e) => setTransparentBg(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Resolution Scale</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((s) => (
                      <button
                        key={s}
                        onClick={() => setResolutionScale(s)}
                        className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg border transition ${
                          resolutionScale === s
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {s}x ({doc.artboard.width * s} × {doc.artboard.height * s} px)
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:from-emerald-600 hover:to-teal-700 shadow-glow-green flex items-center justify-center space-x-2 transition"
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isExporting ? 'Generating High-Res PNG...' : 'Download PNG File'}</span>
              </button>
            </div>
          )}

          {activeFormat === 'svg' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2 text-xs text-slate-300">
                <span className="font-bold text-white block">Scalable Vector Graphics (SVG)</span>
                <p>
                  Exports clean, standard, mathematically precise vector XML with embedded web typography links. Perfect for logos, illustrations, web development, and professional print shops.
                </p>
                <div className="pt-2 font-mono text-[11px] text-indigo-400">
                  Target Dimensions: {doc.artboard.width} × {doc.artboard.height} px
                </div>
              </div>

              <button
                onClick={handleExportSVG}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm hover:from-indigo-600 hover:to-purple-700 shadow-glow flex items-center justify-center space-x-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Standalone SVG</span>
              </button>
            </div>
          )}

          {activeFormat === 'pdf' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2 text-xs text-slate-300">
                <span className="font-bold text-white block">Print-Ready PDF (A4 / 300 DPI)</span>
                <p>
                  Compiles a high-resolution PDF document calibrated for physical printing and corporate distribution, preserving exact margins and vector alignment.
                </p>
                <div className="pt-2 font-mono text-[11px] text-emerald-400">
                  Format: {doc.category === 'letterhead' || doc.subcategory === 'invoice_standard' ? 'ISO 216 A4 (210 × 297 mm)' : 'Custom Form Factor 300 DPI'}
                </div>
              </div>

              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:from-emerald-600 hover:to-teal-700 shadow-glow-green flex items-center justify-center space-x-2 transition"
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Printer className="w-4 h-4" />
                )}
                <span>{isExporting ? 'Compiling PDF Document...' : 'Download Print PDF'}</span>
              </button>
            </div>
          )}

          {activeFormat === 'html' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Standalone HTML & CSS Document</span>
                <button
                  onClick={() => handleCopyCode(htmlCode)}
                  className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy HTML'}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto max-h-56">
                {htmlCode}
              </pre>
            </div>
          )}

          {activeFormat === 'react' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">React Component Code (.tsx)</span>
                <button
                  onClick={() => handleCopyCode(reactCode)}
                  className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy TSX'}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto max-h-56">
                {reactCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
