import React, { useState } from 'react';
import { DatabaseSchema, ContentGapItem } from '../types';
import { 
  Layers, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  Trash, 
  Plus, 
  Volume, 
  Compass,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface ContentGapViewProps {
  db: DatabaseSchema;
  isDarkMode: boolean;
  onRunGapAnalysis: (competitorUrl: string, targetUrl: string) => Promise<void>;
}

export default function ContentGapView({ db, isDarkMode, onRunGapAnalysis }: ContentGapViewProps) {
  const [competitorInput, setCompetitorInput] = useState('');
  const [targetInput, setTargetInput] = useState(db.domain || 'my-saas-platform.com');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorInput.trim() || !targetInput.trim()) return;
    setIsLoading(true);
    try {
      await onRunGapAnalysis(competitorInput, targetInput);
      setCompetitorInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="gap-view" className="space-y-6 font-sans">
      
      {/* View Header */}
      <div>
        <h2 className={`text-2xl font-sans font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Competitor Content Gap Analyzer
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Compare crawled search positions against top corporate competition. Identify search queries where competitors are ranked highly but your property remains unindexed.
        </p>
      </div>

      {/* Input Comparison Seeder Form */}
      <div className={`p-6 rounded-xl border relative overflow-hidden ${
        isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label htmlFor="comp-url-gap" className="text-xs font-semibold text-slate-400">Competitor Domain URL</label>
              <input
                id="comp-url-gap"
                type="text"
                required
                placeholder="e.g. competitor-giant.io"
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                className="w-full px-4 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="target-url-gap" className="text-xs font-semibold text-slate-400">Your Property Context</label>
              <input
                id="target-url-gap"
                type="text"
                required
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="w-full px-4 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>

          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <AlertCircle className="w-4 h-4 text-teal-500" />
              <span>Grabs sitemap elements on matching nodes to extract target index discrepancies instantly.</span>
            </div>

            <button
              id="analyze-gaps-btn"
              type="submit"
              disabled={isLoading || !competitorInput.trim()}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Harvest Traffic Gaps</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Discovered gaps data listings */}
      <div className={`p-6 rounded-xl border ${
        isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
          <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-850'}`}>High Opportunity Keyword Discrepancies</h3>
          <span className="text-xs text-slate-500 font-mono font-bold uppercase">{db.gaps.length} gaps discovered</span>
        </div>

        {db.gaps.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-xl flex flex-col justify-center items-center space-y-2 bg-slate-905 min-h-[260px]">
            <Compass className="w-10 h-10 text-slate-600 animate-spin" />
            <p className="text-xs font-bold text-white">No content gap matrices compiled</p>
            <p className="text-[10px] text-slate-500 max-w-xs">Seed competitor URLs above to index competitor keyword profiles manually.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {db.gaps.map((item) => (
              <div key={item.id} className={`p-4 rounded-xl border grid md:grid-cols-12 gap-4 items-center ${
                isDarkMode ? 'bg-[#0a0c10] border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
              }`}>
                
                {/* Meta details key columns (md:col-span-4) */}
                <div className="md:col-span-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.keyword}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="truncate">Opponent: {item.competitorUrl}</span>
                  </div>
                </div>

                {/* Score stats columns (md:col-span-4) */}
                <div className="md:col-span-4 grid grid-cols-3 gap-2 text-center border-l border-r border-slate-850/60 font-mono px-3">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">THEIR RANK</span>
                    <p className="text-xs font-bold text-rose-400 mt-0.5">#{item.competitorRank}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">YOUR RANK</span>
                    <p className={`text-xs font-bold mt-0.5 ${
                      item.yourRank === 'unindexed' ? 'text-slate-500 uppercase tracking-widest text-[9px]' : 'text-teal-400'
                    }`}>{item.yourRank === 'unindexed' ? 'unindexed' : `#${item.yourRank}`}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">GAP VOLUME</span>
                    <p className="text-xs font-bold text-teal-400 mt-0.5">{item.gapVolume.toLocaleString()}</p>
                  </div>
                </div>

                {/* Specific SEO recommendation & setup steps (md:col-span-4) */}
                <div className="md:col-span-4 space-y-1.5 pl-2">
                  <span className="text-[9px] uppercase font-bold text-teal-400 font-mono tracking-wide">AI Recommendation:</span>
                  <p className="text-[10px] text-slate-400 leading-normal">{item.recommendation}</p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
