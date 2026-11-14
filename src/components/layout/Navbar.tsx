'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Menu,
  X,
  Plus,
  Coins,
  User,
} from 'lucide-react';
import { storage, UserProfile } from '@/lib/storage';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setProfile(storage.getProfile());
  }, []);

  const navLinks = [
    { href: '/studios', label: 'Studios' },
    { href: '/generate', label: 'AI Wizard' },
    { href: '/editor', label: 'Editor' },
    { href: '/projects', label: 'Projects' },
    { href: '/brand-kits', label: 'Brand Kits' },
    { href: '/exports', label: 'Exports' },
    { href: '/pricing', label: 'Pricing' },
  ];

  if (pathname.startsWith('/editor/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 p-0.5 shadow-glow group-hover:scale-105 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400 group-hover:text-emerald-400 transition" />
            </div>
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>AI CREATIVE</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">STUDIO</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Design Intelligence Engine</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center space-x-3">
          {profile && (
            <Link
              href="/pricing"
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-slate-300 transition"
              title="Available AI Generation Credits"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{profile.creditsBalance} credits</span>
            </Link>
          )}

          <Link
            href="/generate"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold hover:from-indigo-600 hover:to-purple-700 shadow-glow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Design</span>
          </Link>

          <Link
            href="/settings"
            className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-indigo-500 transition overflow-hidden"
            title="User Account Settings"
          >
            {profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </Link>
        </div>

        <div className="lg:hidden flex items-center space-x-2">
          <Link
            href="/generate"
            className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold"
          >
            + Create
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center px-3">
            <span className="text-xs text-slate-400">Credits: {profile?.creditsBalance || 0}</span>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-indigo-400 hover:underline"
            >
              Settings &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
