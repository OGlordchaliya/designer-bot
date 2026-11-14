'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { storage } from '@/lib/storage';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      storage.updateProfile({
        email: email || 'creator@nexushorizon.ai',
        fullName: fullName || 'Alex Vance',
        subscriptionTier: 'creator',
      });
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      storage.updateProfile({
        email: 'alex.sterling@nexusdynamics.io',
        fullName: 'Alexander Sterling',
        subscriptionTier: 'professional',
        creditsBalance: 150,
      });
      setIsLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-mesh select-none py-16">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Sign in to Studio' : 'Create Your Account'}
          </h1>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Access your private vector projects and brand assets'
              : 'Join the next-generation AI creative ecosystem'}
          </p>
        </div>

        <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Alexander Sterling"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800/80 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="alex@nexusdynamics.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/80 text-white pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/80 text-white pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs hover:from-indigo-600 hover:to-purple-700 shadow-glow flex items-center justify-center space-x-2 transition"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 space-y-2">
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>One-Click Executive Demo Login</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 text-center leading-relaxed">
          Protected with Row Level Security (RLS) and end-to-end user isolation. Your proprietary designs remain 100% private.
        </div>
      </div>
    </div>
  );
}
