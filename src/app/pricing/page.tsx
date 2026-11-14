'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { storage, UserProfile } from '@/lib/storage';

export default function PricingPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  useEffect(() => {
    setProfile(storage.getProfile());
  }, []);

  const handleSelectPlan = (tier: 'free' | 'creator' | 'business' | 'professional', credits: number) => {
    const updated = storage.updateProfile({
      subscriptionTier: tier,
      creditsBalance: (profile?.creditsBalance || 0) + credits,
    });
    setProfile(updated);
    setSelectedNotification(`Successfully upgraded to the ${tier.toUpperCase()} plan! Added ${credits} AI credits.`);
    setTimeout(() => setSelectedNotification(null), 3000);
  };

  const handleBuyCredits = (amount: number) => {
    const newBal = storage.addCredits(amount);
    setProfile(storage.getProfile());
    setSelectedNotification(`Added +${amount} AI Generation Credits! New balance: ${newBal}`);
    setTimeout(() => setSelectedNotification(null), 3000);
  };

  const tiers = [
    {
      id: 'free',
      name: 'Free Starter',
      priceMonthly: 0,
      priceYearly: 0,
      desc: 'Ideal for trying out vector generation and basic tools.',
      credits: 15,
      features: [
        '15 AI design credits / month',
        'Logo & basic social post generation',
        'Standard SVG and PNG exports',
        'Basic layer editing workspace',
        'Personal workspace storage',
      ],
      cta: 'Current Plan',
    },
    {
      id: 'creator',
      name: 'Creator',
      priceMonthly: 24,
      priceYearly: 19,
      popular: true,
      desc: 'For freelancers, independent designers, and content creators.',
      credits: 100,
      features: [
        '100 AI design credits / month',
        'Full Logo, Letterhead & Social Studios',
        'Print-ready ISO A4 300 DPI PDF export',
        '1 Brand Kit with custom colors & fonts',
        'In-Editor Conversational AI Copilot',
        'Unlimited project saves',
      ],
      cta: 'Upgrade to Creator',
    },
    {
      id: 'business',
      name: 'Business',
      priceMonthly: 59,
      priceYearly: 49,
      desc: 'For growing businesses and design agencies needing commercial stationery.',
      credits: 350,
      features: [
        '350 AI design credits / month',
        'All 6 Creative Studios (Cards, Invoices, Web)',
        'Unlimited Brand Kits & token boards',
        'Clean HTML/CSS and React TSX code export',
        'Multi-concept synthesis (3 variations)',
        'Priority vector rendering pipeline',
      ],
      cta: 'Upgrade to Business',
    },
    {
      id: 'professional',
      name: 'Professional Enterprise',
      priceMonthly: 129,
      priceYearly: 99,
      desc: 'For high-volume studios and enterprise design teams.',
      credits: 1000,
      features: [
        '1,000 AI design credits / month',
        'Dedicated API access & custom LLM keys',
        'White-label vector exports',
        'Team collaboration workspaces',
        'Custom corporate templates',
        '24/7 Priority SLA engineering support',
      ],
      cta: 'Select Professional',
    },
  ];

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-12 select-none">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
          Transparent Scalable Pricing
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Flexible Plans for Every Creative Stage
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Freemium model with credit-based usage tracking. Upgrade anytime to unlock higher resolution exports,
          multi-concept variations, and business stationery studios.
        </p>

        <div className="inline-flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold mt-4">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-xl transition ${
              billingPeriod === 'monthly' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
              billingPeriod === 'yearly' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] uppercase">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {selectedNotification && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{selectedNotification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => {
          const isCurrent = profile?.subscriptionTier === tier.id;
          const price = billingPeriod === 'yearly' ? tier.priceYearly : tier.priceMonthly;

          return (
            <div
              key={tier.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 transition relative border ${
                tier.popular
                  ? 'bg-slate-900 border-indigo-500 shadow-glow ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-white">{tier.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{tier.desc}</p>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">${price}</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center space-x-2 text-xs text-amber-400 font-semibold">
                  <Coins className="w-4 h-4" />
                  <span>Includes {tier.credits} AI credits/mo</span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    What&apos;s Included
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleSelectPlan(tier.id as any, tier.credits)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700'
                      : tier.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow hover:opacity-95'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {isCurrent ? 'Current Active Plan' : tier.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Need Additional AI Credits?</h2>
            <p className="text-xs text-slate-400">
              Credits never expire. Top up your balance to generate more vector variations and high-res exports.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { credits: 50, price: '$9', label: 'Starter Pack' },
            { credits: 200, price: '$29', label: 'Pro Pack' },
            { credits: 500, price: '$59', label: 'Enterprise Pack' },
          ].map((pack) => (
            <div
              key={pack.credits}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <span className="text-base font-extrabold text-white block">+{pack.credits} Credits</span>
                <span className="text-xs text-indigo-400 font-semibold">{pack.price} one-time</span>
              </div>
              <button
                onClick={() => handleBuyCredits(pack.credits)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white text-xs font-bold transition"
              >
                Add Credits
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
