import React, { useState } from 'react';
import { UserSession } from '../types';
import { KeyRound, ShieldAlert, Cpu, Sparkles, LogIn, Chrome } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tier, setTier] = useState<'Pro' | 'Enterprise'>('Pro');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid business email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate authentic SaaS security tokens
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        isLoggedIn: true,
        email: email,
        tier: tier,
        domain: 'my-saas-platform.com'
      });
    }, 1200);
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      isLoggedIn: true,
      email: 'growth-officer@seo-agency.io',
      tier: 'Enterprise',
      domain: 'my-saas-platform.com'
    });
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background grid and flares */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e293b,transparent_60%)] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="w-full max-w-5xl grid md:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left column: Marketing Pitch & Interactive Features */}
        <div id="login-marketing" className="md:col-span-7 flex flex-col justify-center space-y-6 md:pr-4">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 text-teal-400 px-3 py-1.5 rounded-full text-xs font-mono font-medium tracking-tight">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Autonomous SEO Copilot v3.2</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-sans font-medium tracking-tight text-white leading-tight">
            Supercharge Search Traffic with <span className="text-gradient bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">Autonomous AI Content Loop</span>
          </h1>

          <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
            Uncover high-volume semantic topic clusters, analyze competitor rank gaps, and let AI agents continuously research, optimize, and schedule blog content directly into your CMS.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-xl flex flex-col space-y-1">
              <span className="text-2xl font-bold text-teal-400 font-mono">10x</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Indexing Velocity</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-xl flex flex-col space-y-1">
              <span className="text-2xl font-bold text-indigo-400 font-mono">92%</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">SEO Audit Score</span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Form */}
        <div id="login-form-box" className="md:col-span-5 bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col space-y-6 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-500" />
          
          <div className="flex flex-col space-y-1">
            <h2 className="text-2xl font-sans font-medium text-white">Enter SEO Console</h2>
            <p className="text-xs text-slate-400">Configure your autonomous ranking agent parameters below</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-900/50 text-rose-300 rounded-lg text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-slate-300">Corporate Email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-slate-300">Master Secret Key (Password)</label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="tier" className="text-xs font-medium text-slate-300">Subscription Tier</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="tier-pro"
                  type="button"
                  onClick={() => setTier('Pro')}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                    tier === 'Pro'
                      ? 'bg-teal-500/10 border-teal-500 text-teal-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Pro (SaaS Limit)
                </button>
                <button
                  id="tier-enterprise"
                  type="button"
                  onClick={() => setTier('Enterprise')}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                    tier === 'Enterprise'
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Enterprise (Unlimited)
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-sans font-semibold rounded-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase font-bold tracking-wider">Playground Demo Sandbox</span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          <button
            id="demo-access-btn"
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-200 font-sans font-medium rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Instant Demo Access (Skip Setup)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
