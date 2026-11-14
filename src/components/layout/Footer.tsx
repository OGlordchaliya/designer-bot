'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname.startsWith('/editor')) {
    return null;
  }

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-extrabold text-white">AI Creative Studio</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              &quot;Describe your imagination. Let AI design it. Edit it. Own it.&quot;
            </p>
            <p className="text-[11px] text-slate-400">
              Transforming natural language instructions into multi-layered, editable and print-ready creative assets.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block mb-2">Creative Studios</span>
            <Link href="/studios" className="block hover:text-white transition">Logo Design Studio</Link>
            <Link href="/studios" className="block hover:text-white transition">Company Letterhead Studio</Link>
            <Link href="/studios" className="block hover:text-white transition">Business Stationery Studio</Link>
            <Link href="/studios" className="block hover:text-white transition">Website Design Studio</Link>
            <Link href="/studios" className="block hover:text-white transition">Social Media Studio</Link>
            <Link href="/brand-kits" className="block hover:text-white transition">Brand Identity Studio</Link>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block mb-2">Platform</span>
            <Link href="/generate" className="block hover:text-white transition">AI Wizard</Link>
            <Link href="/editor" className="block hover:text-white transition">Vector Canvas Editor</Link>
            <Link href="/projects" className="block hover:text-white transition">My Projects</Link>
            <Link href="/exports" className="block hover:text-white transition">Download &amp; Export Center</Link>
            <Link href="/pricing" className="block hover:text-white transition">Subscription Plans</Link>
            <Link href="/help" className="block hover:text-white transition">Help &amp; Documentation</Link>
          </div>

          <div className="space-y-3 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block mb-2">Engineering &amp; Security</span>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-[11px]">
                <Shield className="w-3.5 h-3.5" />
                <span>Zero Data Leaks • Isolated Storage</span>
              </div>
              <p className="text-[11px] text-slate-400">
                End-to-end user isolation, private vectors, and clean high-resolution exports.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} AI Creative Intelligence Studio. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/help" className="hover:text-white">Privacy Policy</Link>
            <Link href="/help" className="hover:text-white">Terms of Service</Link>
            <Link href="/help" className="hover:text-white">API Docs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
