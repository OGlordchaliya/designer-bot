'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Key,
  Database,
  Check,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { storage } from '@/lib/storage';

export default function SettingsPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const prof = storage.getProfile();
    setFullName(prof.fullName);
    setEmail(prof.email);
    setAvatarUrl(prof.avatarUrl || '');

    if (typeof window !== 'undefined') {
      setOpenaiKey(localStorage.getItem('aics_custom_openai_key') || '');
      setGeminiKey(localStorage.getItem('aics_custom_gemini_key') || '');
      setSupabaseUrl(localStorage.getItem('aics_custom_supabase_url') || '');
      setSupabaseKey(localStorage.getItem('aics_custom_supabase_key') || '');
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateProfile({
      fullName,
      email,
      avatarUrl,
    });

    if (typeof window !== 'undefined') {
      if (openaiKey) localStorage.setItem('aics_custom_openai_key', openaiKey);
      else localStorage.removeItem('aics_custom_openai_key');

      if (geminiKey) localStorage.setItem('aics_custom_gemini_key', geminiKey);
      else localStorage.removeItem('aics_custom_gemini_key');

      if (supabaseUrl) localStorage.setItem('aics_custom_supabase_url', supabaseUrl);
      if (supabaseKey) localStorage.setItem('aics_custom_supabase_key', supabaseKey);
    }

    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-8 select-none">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
          Configuration &amp; Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Account &amp; API Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your personal workspace, cloud storage credentials, and custom AI provider API keys.
        </p>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>Settings and API credentials updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">User Profile Details</h2>
              <p className="text-xs text-slate-400">Workspace identity &amp; account owner information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">External AI Provider API Keys (Optional)</h2>
                <p className="text-xs text-slate-400">
                  By default, the autonomous vector intelligence engine runs built-in. You may connect your own keys.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowKeys(!showKeys)}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
            >
              {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showKeys ? 'Mask Keys' : 'Reveal Keys'}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">OpenAI API Key (sk-...)</label>
              <input
                type={showKeys ? 'text' : 'password'}
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Used for GPT-4o reasoning, structured specs, and DALL-E asset generation.
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Google Gemini API Key (AIzaSy...)</label>
              <input
                type={showKeys ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Alternative multimodal design reasoning provider.
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Database &amp; File Storage Infrastructure</h2>
              <p className="text-xs text-slate-400">PostgreSQL and S3 private asset storage integration</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Storage Status:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                ACTIVE &amp; ISOLATED
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Client projects, brand standards, and export histories are safely stored with strict user-level Row Level
              Security (RLS). Users never have access to another user&apos;s proprietary projects.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold hover:from-indigo-600 hover:to-purple-700 shadow-glow flex items-center space-x-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings &amp; Credentials</span>
          </button>
        </div>
      </form>
    </div>
  );
}
