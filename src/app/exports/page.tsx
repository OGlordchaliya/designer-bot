'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  FileCode,
  Sparkles,
  Printer,
  Filter,
} from 'lucide-react';
import { storage, ExportRecord } from '@/lib/storage';
import { SVGExportEngine } from '@/lib/export/svgExport';
import { PDFExportEngine } from '@/lib/export/pdfGenerator';

export default function ExportCenterPage() {
  const [records, setRecords] = useState<ExportRecord[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    let list = storage.listExports();
    if (list.length === 0) {
      storage.logExport({
        projectId: 'proj-demo-1',
        projectTitle: 'Aegis Shield - Minimalist Logo',
        category: 'logo',
        format: 'svg',
        scale: 1,
        fileSize: '42 KB',
      });
      storage.logExport({
        projectId: 'proj-demo-2',
        projectTitle: 'Vanguard Global Logistics - Corporate Letterhead',
        category: 'letterhead',
        format: 'pdf',
        scale: 1,
        fileSize: '1.4 MB',
      });
      storage.logExport({
        projectId: 'proj-demo-3',
        projectTitle: 'Nexus Dynamics - Executive Card',
        category: 'stationery',
        format: 'png',
        scale: 2,
        fileSize: '680 KB',
      });
      list = storage.listExports();
    }
    setRecords(list);
  }, []);

  const handleReDownload = async (record: ExportRecord) => {
    const doc = storage.getProject(record.projectId);
    if (!doc) {
      alert('Original project template is being re-synthesized for export.');
      return;
    }

    if (record.format === 'svg') {
      SVGExportEngine.downloadSVG(doc);
    } else if (record.format === 'pdf') {
      await PDFExportEngine.downloadPDF(doc);
    } else {
      SVGExportEngine.downloadSVG(doc);
    }
  };

  const filtered = filter === 'all' ? records : records.filter((r) => r.format === filter);

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
            Distribution &amp; Artifact Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Download &amp; Export Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Centralized archive of high-resolution print PDFs, vector SVGs, and web components.
          </p>
        </div>

        <Link
          href="/editor"
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition self-start sm:self-auto"
        >
          Open Editor
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Scalable SVG</span>
          </div>
          <p className="text-xs text-slate-300">100% vector mathematics. Never loses sharpness at any scale.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Printer className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Print-Ready PDF</span>
          </div>
          <p className="text-xs text-slate-300">ISO 216 A4 dimensions with exact margins calibrated for physical printers.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center space-x-2 text-amber-400">
            <FileCode className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">HTML &amp; React TSX</span>
          </div>
          <p className="text-xs text-slate-300">Directly embeddable code with clean Tailwind and SVG markup.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {['all', 'svg', 'pdf', 'png', 'html'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Project Title</th>
                <th className="py-3.5 px-4">Discipline</th>
                <th className="py-3.5 px-4">Output Format</th>
                <th className="py-3.5 px-4">Resolution / Scale</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-4 px-6 font-bold text-white max-w-[240px] truncate">
                    {item.projectTitle}
                  </td>
                  <td className="py-4 px-4 uppercase text-[10px] font-mono tracking-wider text-slate-400">
                    {item.category}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-md font-mono font-bold text-[10px] uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      .{item.format}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400 font-mono">
                    {item.scale ? `${item.scale}x High-Res` : 'Vector Native'}
                  </td>
                  <td className="py-4 px-4 text-slate-400 text-[11px]">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleReDownload(item)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Re-Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
