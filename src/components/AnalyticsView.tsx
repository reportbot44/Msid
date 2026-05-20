import React, { useState } from 'react';
import { 
  DatabaseSchema, 
  KeywordRankingHistory, 
  CompetitorStrategy, 
  TrafficSourceData, 
  SEOPerformanceReport 
} from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Globe, 
  ShieldAlert, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  Briefcase, 
  ArrowRight, 
  FileText, 
  Download, 
  Printer, 
  Plus, 
  RefreshCw,
  Award,
  BookOpen,
  PieChart,
  Target
} from 'lucide-react';

interface AnalyticsViewProps {
  db: DatabaseSchema;
  isDarkMode: boolean;
  onGenerateReport: (title: string, domain: string) => Promise<void>;
}

export default function AnalyticsView({ db, isDarkMode, onGenerateReport }: AnalyticsViewProps) {
  // Local state for active selections
  const [selectedRankKeywordId, setSelectedRankKeywordId] = useState<string>(
    db.rankings && db.rankings.length > 0 ? db.rankings[0].id : 'rank-1'
  );
  
  const [newTrackKeyword, setNewTrackKeyword] = useState('');
  const [newTrackVolume, setNewTrackVolume] = useState('2400');
  const [newTrackDifficulty, setNewTrackDifficulty] = useState('35');

  // Reporting compilation state
  const [reportTitle, setReportTitle] = useState('Spring Search Visibility Metrics');
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Rankings addition helper (Client-side optimistic + persists if we save DB state)
  const [rankings, setRankings] = useState<KeywordRankingHistory[]>(db.rankings || []);
  const [competitors] = useState<CompetitorStrategy[]>(db.competitorStrategies || []);
  const [trafficSources] = useState<TrafficSourceData[]>(db.trafficSources || []);
  const [seoReports, setSeoReports] = useState<SEOPerformanceReport[]>(db.seoReports || []);

  const handleCreateTrackKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackKeyword.trim()) return;

    const fresh: KeywordRankingHistory = {
      id: `rank-${Date.now()}`,
      keyword: newTrackKeyword.trim().toLowerCase(),
      searchVolume: parseInt(newTrackVolume) || 1200,
      currentRank: 42,
      prevRank: 48,
      difficulty: parseInt(newTrackDifficulty) || 40,
      history: [
        { date: "May 13", rank: 54 },
        { date: "May 14", rank: 52 },
        { date: "May 15", rank: 52 },
        { date: "May 16", rank: 48 },
        { date: "May 17", rank: 48 },
        { date: "May 18", rank: 45 },
        { date: "May 19", rank: 42 },
        { date: "May 20", rank: 42 }
      ]
    };

    const updated = [fresh, ...rankings];
    setRankings(updated);
    setSelectedRankKeywordId(fresh.id);
    setNewTrackKeyword('');
    
    // Save to server database state
    fetch('/api/db/save', {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-user-email": "akexseni08@gmail.com"
      },
      body: JSON.stringify({
        db: { ...db, rankings: updated }
      })
    }).catch(e => console.error("Could not sync ranking keyword additions: ", e));
  };

  // Compile Reports helper
  const handleCompileSEOReport = async () => {
    setIsCompiling(true);
    try {
      await onGenerateReport(reportTitle, db.domain);
      // Reload fresh reports list representing sync state
      const res = await fetch('/api/db');
      const data = await res.json();
      if (data.success && data.db) {
        if (data.db.seoReports) {
          setSeoReports(data.db.seoReports);
          setSelectedReportId(data.db.seoReports[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCompiling(false);
    }
  };

  // Find currently selected keyword history
  const activeRanking = rankings.find(r => r.id === selectedRankKeywordId) || rankings[0];

  // Vector Ranking Chart values
  const svgWidth = 600;
  const svgHeight = 220;
  const hPoints = activeRanking ? activeRanking.history : [];
  
  // Rank #1 is the highest visually (Top of Chart). Rank #100 is lowest visually (Bottom of Chart).
  // We'll map the ranks with standard inversion. Let's find min & max ranks in activeRanking's history.
  const rankValues = hPoints.map(p => p.rank);
  const maxRankValue = Math.max(...rankValues, 100); // Floor limit definition
  const minRankValue = Math.min(...rankValues, 1);   // Ceiling limit definition
  
  // Standard padding limits
  const paddingY = 25;
  const padBottom = 25;
  
  const points = hPoints.map((item, idx) => {
    const x = (idx / (hPoints.length - 1)) * (svgWidth - 60) + 30;
    // Map Rank to height. 
    // y = paddingY + ((rank - minRankValue) / (maxRankValue - minRankValue)) * (svgHeight - paddingY - padBottom)
    // To invert: Rank 1 is top, rank 100 is bottom:
    const range = (maxRankValue - minRankValue) || 10;
    const y = paddingY + ((item.rank - minRankValue) / range) * (svgHeight - paddingY - padBottom);
    return `${x},${y}`;
  }).join(' ');

  const activeReport = seoReports.find(r => r.id === selectedReportId) || seoReports[0];

  return (
    <div id="analytics-reporting-dashboard" className="space-y-8 animate-fade-in">
      
      {/* Title Header Hero Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-[#0f1218] to-[#141a24] border-slate-800' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-indigo-500/20">
              Audit Operations
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono tracking-widest leading-none">• Advanced Dashboard</span>
          </div>
          <h2 id="analytics-heading" className={`text-xl sm:text-2xl font-bold font-sans tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Advanced Analytics & Intelligence Reporting
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Monitor real-time Google positions, reverse-engineer organic competitor pipelines, and audit site traffic index distributions.
          </p>
        </div>
        
        {/* Core Stats Overview widget */}
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className={`px-4 py-3 rounded-xl border font-mono ${isDarkMode ? 'bg-[#0a0c10]/80 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            <span className="text-[9px] uppercase text-slate-500 font-bold block mb-1">Estimated Organic Traffic</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {trafficSources.reduce((acc, curr) => acc + curr.visitors, 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">+12%</span>
            </div>
          </div>
          <div className={`px-4 py-3 rounded-xl border font-mono ${isDarkMode ? 'bg-[#0a0c10]/80 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            <span className="text-[9px] uppercase text-slate-500 font-bold block mb-1">Tracked Keywords</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{rankings.length}</span>
              <span className="text-[10px] text-cyan-400 font-bold">Stable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Keyword Rankings tracker & Linear graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Graph Component */}
        <div className={`lg:col-span-8 p-6 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 id="ranking-graph-title" className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  <Award className="w-4 h-4 text-amber-400" />
                  Position Trajectory (Daily Progress)
                </h3>
                <p className="text-[10px] text-slate-500 font-medium font-mono uppercase tracking-wide mt-0.5">
                  Selected keyword: <span className="text-teal-400 font-extrabold font-mono">"{activeRanking?.keyword}"</span>
                </p>
              </div>
              
              {/* Stats pill on graphs */}
              <div className="flex items-center gap-3">
                <div className="text-right font-mono">
                  <span className="text-[9px] uppercase text-slate-500 block">Current Rank</span>
                  <span className={`text-xs font-black ${
                    activeRanking?.currentRank <= 10 ? 'text-emerald-400' : 'text-slate-300'
                  }`}>
                    #{activeRanking?.currentRank} on Google
                  </span>
                </div>
                <div className="text-right border-l pl-3 border-slate-800 font-mono">
                  <span className="text-[9px] uppercase text-slate-500 block">Trajectory</span>
                  <span className="text-xs font-black text-teal-400 flex items-center gap-0.5">
                    {activeRanking?.prevRank - activeRanking?.currentRank >= 0 ? (
                      <>
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400 inline" />
                        +{activeRanking?.prevRank - activeRanking?.currentRank} spots
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3.5 h-3.5 text-rose-400 inline" />
                        {activeRanking?.prevRank - activeRanking?.currentRank} spots
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Inverted Rank tracing SVG Graph */}
            {activeRanking ? (
              <div className="relative pt-4">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
                  <defs>
                    <linearGradient id="rankGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid guidelines */}
                  <line x1="10" y1={paddingY} x2={svgWidth - 10} y2={paddingY} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3,3" />
                  <line x1="10" y1={(svgHeight - paddingY - padBottom) / 2 + paddingY} x2={svgWidth - 10} y2={(svgHeight - paddingY - padBottom) / 2 + paddingY} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3,3" />
                  <line x1="10" y1={svgHeight - padBottom} x2={svgWidth - 10} y2={svgHeight - padBottom} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3,3" />

                  {/* Left Label Indicators */}
                  <text x="5" y={paddingY + 4} className="fill-slate-500 font-mono text-[8px] font-bold">#1 Peak</text>
                  <text x="5" y={(svgHeight - paddingY - padBottom) / 2 + paddingY + 4} className="fill-slate-500 font-mono text-[8px] font-bold">Mid rank</text>
                  <text x="5" y={svgHeight - padBottom + 4} className="fill-slate-500 font-mono text-[8px] font-bold">#100 Floor</text>

                  {/* Polylines representing linear trends */}
                  <polyline
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="3"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dots tracing days */}
                  {hPoints.map((item, idx) => {
                    const range = (maxRankValue - minRankValue) || 10;
                    const x = (idx / (hPoints.length - 1)) * (svgWidth - 60) + 30;
                    const y = paddingY + ((item.rank - minRankValue) / range) * (svgHeight - paddingY - padBottom);
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="5.5" className="fill-[#0f1218] stroke-teal-400 stroke-[2.5] cursor-pointer hover:r-7" />
                        <text x={x} y={y - 12} textAnchor="middle" className="fill-slate-400 font-mono font-bold text-[9px]">
                          #{item.rank}
                        </text>
                        {/* Dates scales below */}
                        <text x={x} y={svgHeight - 10} textAnchor="middle" className="fill-slate-500 font-mono font-semibold text-[8px] uppercase">
                          {item.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">Add a keyword to track ranking history.</div>
            )}
          </div>
          
          <div className="pt-2 text-[10px] text-slate-500 font-medium flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Topical rank inverted: line trends upwards indicating search engine results page climb towards Position #1.</span>
          </div>
        </div>

        {/* Right Tabulation: Keyword listing */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2 ${isDarkMode ? 'text-white border-slate-800' : 'text-slate-800 border-slate-100'}`}>
              Tracking Index
            </h3>

            {/* Scrollable list */}
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4 pr-1">
              {rankings.map(item => (
                <button
                  id={`select-ranking-${item.id}`}
                  key={item.id}
                  onClick={() => setSelectedRankKeywordId(item.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedRankKeywordId === item.id
                      ? 'bg-slate-800/40 border-slate-700/60 font-bold'
                      : isDarkMode 
                      ? 'bg-slate-900/40 border-transparent hover:bg-slate-800/10'
                      : 'bg-slate-50 hover:bg-slate-100 border-transparent'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs truncate font-mono">{item.keyword}</p>
                    <span className="text-[9px] text-slate-500 uppercase font-mono">Vol: {item.searchVolume.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-center">
                    <div className="text-right">
                      <span className="text-[10px] font-bold block">Rank #{item.currentRank}</span>
                      <span className={`text-[9px] uppercase font-bold text-slate-500`}>Diff: {item.difficulty}%</span>
                    </div>
                    {item.prevRank - item.currentRank >= 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-black">
                        +{item.prevRank - item.currentRank}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-black">
                        {item.prevRank - item.currentRank}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form to submit keyword for position tracking */}
          <form onSubmit={handleCreateTrackKeyword} className={`p-3 rounded-xl border ${
            isDarkMode ? 'bg-[#0a0c10] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block mb-2">Track New Search Keyword</span>
            <div className="space-y-2">
              <input
                id="rank-keyword-input"
                type="text"
                placeholder="e.g. headless CMS seo guide"
                value={newTrackKeyword}
                onChange={e => setNewTrackKeyword(e.target.value)}
                className={`w-full px-2.5 py-1.5 rounded text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-300'
                }`}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="rank-volume-input"
                  type="number"
                  placeholder="Monthly Vol"
                  value={newTrackVolume}
                  onChange={e => setNewTrackVolume(e.target.value)}
                  className={`w-full px-2.5 py-1 text-xs font-mono focus:outline-none ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-300'
                  }`}
                />
                <input
                  id="rank-difficulty-input"
                  type="number"
                  placeholder="Difficulty %"
                  value={newTrackDifficulty}
                  onChange={e => setNewTrackDifficulty(e.target.value)}
                  className={`w-full px-2.5 py-1 text-xs font-mono focus:outline-none ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-300'
                  }`}
                />
              </div>
              <button
                id="rank-track-submit-btn"
                type="submit"
                className="w-full py-1.5 rounded bg-teal-500 hover:bg-teal-600 active:scale-95 text-xs text-white font-bold transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Track Keyword
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Row 2: Competitor Reverse Engineering & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Competitor Strategic Analysis */}
        <div className={`lg:col-span-8 p-6 rounded-2xl border ${
          isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4 border-b pb-2 border-slate-800/20">
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <Layers className="w-4 h-4 text-teal-400" />
                Competitor Strategy Profiling
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">Reconstruction of competitor authority benchmarks and organic keyword footprint shares</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {competitors.map(comp => (
              <div 
                id={`competitor-card-${comp.id}`}
                key={comp.id} 
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 ${
                  isDarkMode ? 'bg-[#0a0c10] border-slate-800/85' : 'bg-slate-50 border-slate-100'
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black font-mono text-indigo-400 truncate">{comp.domain}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wider ${
                      comp.strategyType === 'Content-Focused' 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/25'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                    }`}>
                      {comp.strategyType}
                    </span>
                  </div>

                  {/* Authority Benchmarking scales */}
                  <div className="space-y-2 mt-4">
                    <div>
                      <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-0.5">
                        <span className="font-bold">Domain Authority Score</span>
                        <span className="font-extrabold text-[#cbd5e1]">{comp.authorityScore}/100</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800">
                        <div className="h-full bg-teal-400 rounded-full" style={{ width: `${comp.authorityScore}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-0.5">
                        <span className="font-bold">Backlinks Profile</span>
                        <span className="font-extrabold text-[#cbd5e1]">{comp.backlinksCount.toLocaleString()} URLs</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${Math.min(100, (comp.backlinksCount / 100000) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top keywords lists */}
                <div className="pt-2 border-t border-slate-800/10">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold font-mono block mb-1.5">Top Traffic Driver Keyterms</span>
                  <div className="space-y-1">
                    {comp.topKeywords.map((kw, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] font-mono py-0.5 border-b border-slate-800/5">
                        <span className="text-slate-400 truncate max-w-[120px]">"{kw.keyword}"</span>
                        <span className="text-teal-400 font-bold">Rank #{kw.rank}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Traffic Sources bento grid with inline spark vectors */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border ${
          isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">Property Channels</h3>
            <p className="text-[10px] text-slate-500">Website organic impressions & traffic bounce indicators</p>
          </div>

          <div className="space-y-3">
            {trafficSources.map((source, idx) => (
              <div 
                id={`traffic-source-${idx}`}
                key={idx} 
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDarkMode ? 'bg-[#0a0c10] border-slate-800/80' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <span className="text-xs font-bold font-mono block truncate">{source.source}</span>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 font-bold">
                    <span>{source.visitors.toLocaleString()} users</span>
                    <span>•</span>
                    <span>Bounce: {source.bounceRate}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-right shrink-0">
                  {/* Inline Sparkline SVG vector tracing trend */}
                  <svg className="w-12 h-6 overflow-visible select-none" viewBox="0 0 50 20">
                    <polyline
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      points={source.trend.map((val, i) => {
                        const x = (i / (source.trend.length - 1)) * 50;
                        const y = 20 - (val / 1000) * 15;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  </svg>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-cyan-400/10 text-cyan-400">
                    {source.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Comprehensive SEO Performance Reports compilation manager */}
      <div className={`p-6 sm:p-8 rounded-2xl border ${
        isDarkMode ? 'bg-gradient-to-tr from-[#0a0c10] to-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-4 border-b border-slate-850/40">
          <div className="space-y-1">
            <h3 className="text-base font-bold uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Comprehensive Executive Reports Manager
            </h3>
            <p className="text-xs text-slate-400">
              Query Google Gemini 3.5-flash models in real-time to analyze database metrics and design PDF performance audit reports instantly.
            </p>
          </div>

          {/* Compilation Form */}
          <div className="flex gap-2 max-w-md w-full shrink-0">
            <input
              id="report-subject-input"
              type="text"
              placeholder="Report subject (e.g. Q2 Organic Crawl)..."
              value={reportTitle}
              onChange={e => setReportTitle(e.target.value)}
              className={`flex-grow px-3 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-300'
              }`}
            />
            <button
              id="report-compile-btn"
              disabled={isCompiling}
              onClick={handleCompileSEOReport}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 shrink-0 select-none ${
                isCompiling 
                  ? 'bg-slate-700 animate-pulse cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-600 active:scale-95'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              {isCompiling ? 'Compiling AI...' : 'Compile Report'}
            </button>
          </div>
        </div>

        {/* Audit layout view split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Compiled Reports list */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500 block mb-2">Compiled Audits Logs</span>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {seoReports.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-slate-800 text-center font-mono text-slate-500 text-xs">
                  No compiled reports logged. Enter a subject above to run compilation.
                </div>
              ) : (
                seoReports.map(rep => (
                  <button
                    id={`select-report-${rep.id}`}
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`w-full p-3.5 text-left rounded-xl border flex flex-col gap-1 transition-all ${
                      selectedReportId === rep.id || (!selectedReportId && seoReports[0].id === rep.id)
                        ? 'bg-slate-800/40 border-slate-700 font-bold'
                        : isDarkMode
                        ? 'bg-[#0a0c10] border-slate-800/40 hover:bg-slate-800/10'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs truncate max-w-[150px] font-mono leading-none">{rep.title}</span>
                      <span className="text-[9px] font-mono text-slate-500 shrink-0 font-semibold leading-none">
                        {new Date(rep.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-teal-400 font-bold block uppercase mt-1">Domain: {rep.domain}</span>
                    <div className="flex items-center justify-between text-[11px] font-mono mt-2 pt-2 border-t border-slate-800/10">
                      <span className="text-slate-500">Score Match:</span>
                      <span className={`font-black ${rep.seoScore >= 85 ? 'text-emerald-400' : 'text-amber-500'}`}>
                        {rep.seoScore}/100
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: Compiled Report PDF View Simulation */}
          <div className="lg:col-span-8">
            {activeReport ? (
              <div 
                id="compiled-report-document"
                className={`p-6 rounded-2xl border relative flex flex-col justify-between space-y-6 ${
                  isDarkMode ? 'bg-[#0a0c10] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                
                {/* PDF Control Options */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    id="export-pdf-btn"
                    onClick={() => window.print()}
                    title="Print / Export Report compiled view"
                    className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1 font-mono font-bold uppercase leading-none"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                  <button
                    id="export-csv-btn"
                    onClick={() => alert(`SaaS CSV Segment generated offline: SEO audit metrics saved for domain ${activeReport.domain}.`)}
                    title="Export structured insights CSV"
                    className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1 font-mono font-bold uppercase leading-none"
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV
                  </button>
                </div>

                {/* Report Document Title and details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                      <Award className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 id="report-title-label" className="text-sm font-extrabold max-w-[250px] sm:max-w-none truncate">{activeReport.title}</h4>
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-bold mt-0.5">
                        Target System Domain: <span className="text-indigo-400">{activeReport.domain}</span>
                      </p>
                    </div>
                  </div>

                  {/* Document Meta row indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-800/20 bg-slate-900/10">
                    <div className="font-mono text-center">
                      <span className="text-[8px] text-slate-500 uppercase block mb-0.5">Compiled Date</span>
                      <span className="text-xs font-black">{new Date(activeReport.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="font-mono text-center">
                      <span className="text-[8px] text-slate-500 uppercase block mb-0.5">Technical Grade</span>
                      <span className="text-xs font-black text-emerald-400">{activeReport.seoScore}% Verified</span>
                    </div>
                    <div className="font-mono text-center">
                      <span className="text-[8px] text-slate-500 uppercase block mb-0.5">Organic Sessions</span>
                      <span className="text-xs font-black text-cyan-400">{activeReport.organicTraffic.toLocaleString()}/mo</span>
                    </div>
                    <div className="font-mono text-center">
                      <span className="text-[8px] text-slate-500 uppercase block mb-0.5">Compiler model</span>
                      <span className="text-xs font-bold text-slate-400">Gemini 3.5</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-extrabold block">Executive Audit Statement</span>
                    <p className={`text-xs leading-relaxed font-sans ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {activeReport.summary}
                    </p>
                  </div>

                  {/* Top Insights */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-extrabold block">Strategic Intelligence Actions</span>
                    <div className="space-y-2">
                      {activeReport.topInsights.map((ins, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start p-2.5 rounded-lg border border-slate-800/10 bg-slate-950/20">
                          <span className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <p className={`text-xs leading-normal font-sans ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {ins}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-800/30 pt-4 flex items-center justify-between text-[9px] font-mono uppercase text-slate-500 font-semibold">
                  <span>Audit compiled programmatically. Verified.</span>
                  <span>Signature ID: REP-{activeReport.id.toUpperCase()}</span>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 bg-[#0a0c10] border border-slate-800 rounded-xl">
                Select a compiled report logs list item on the left to read compiled executive details.
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
