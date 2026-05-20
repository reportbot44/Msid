import React, { useState } from 'react';
import { DatabaseSchema, KeywordItem, KeywordIntent } from '../types';
import { 
  Search, 
  HelpCircle, 
  Filter, 
  Sparkles, 
  Check, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  ChevronDown,
  Download,
  AlertCircle
} from 'lucide-react';

interface KeywordResearchViewProps {
  db: DatabaseSchema;
  isDarkMode: boolean;
  onRunKeywords: (seed: string) => Promise<void>;
  onAddTargetKeyword: (kw: string) => void;
  setTab: (tab: string) => void;
}

export default function KeywordResearchView({ 
  db, 
  isDarkMode, 
  onRunKeywords, 
  onAddTargetKeyword, 
  setTab 
}: KeywordResearchViewProps) {
  const [seedInput, setSeedInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterIntent, setFilterIntent] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedInput.trim()) return;
    setIsLoading(true);
    try {
      await onRunKeywords(seedInput);
      setSeedInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const intentColorMap: Record<KeywordIntent, { bg: string; text: string }> = {
    informational: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    commercial: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    transactional: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    navigational: { bg: 'bg-amber-500/10', text: 'text-amber-400' }
  };

  // Filter list
  const filteredKeywords = db.keywords.filter(item => {
    // 1. Text search
    if (searchQuery && !item.keyword.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // 2. Intent
    if (filterIntent !== 'all' && item.intent !== filterIntent) {
      return false;
    }
    // 3. Difficulty
    if (filterDifficulty === 'low' && item.difficulty > 30) return false;
    if (filterDifficulty === 'medium' && (item.difficulty <= 30 || item.difficulty > 60)) return false;
    if (filterDifficulty === 'high' && item.difficulty <= 60) return false;

    return true;
  });

  const getDifficultyColor = (score: number) => {
    if (score < 30) return 'text-emerald-400';
    if (score <= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const handleExportCSV = () => {
    const headers = 'keyword,volume,difficulty,intent,cpc,competition,cluster\n';
    const rows = filteredKeywords.map(k => `"${k.keyword}",${k.volume},${k.difficulty},"${k.intent}",${k.cpc},"${k.competition}","${k.cluster}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SEO_Keywords_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div id="keywords-view" className="space-y-6">
      
      {/* View Header */}
      <div>
        <h2 className={`text-2xl font-sans font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Keyword Research Engine
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Generate accurate monthly search volume, keyword difficulty scores, programmatic user intents, and semantic clusters.
        </p>
      </div>

      {/* Input Form Box with Gemini Power Indicator */}
      <div className={`p-6 rounded-xl border relative overflow-hidden ${
        isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <form onSubmit={handleSearch} className="space-y-4 relative z-10">
          <div className="flex flex-col space-y-2">
            <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Target Seed Phrase or Competitor Concept
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <input
                  id="seed-phrase-input"
                  type="text"
                  required
                  placeholder="e.g., automated semantic seo mapping, dynamic landing pages"
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-800' : 'bg-slate-50 border-slate-350 text-slate-900'
                  }`}
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
              <button
                id="search-keywords-btn"
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Research Engine</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 leading-none">
            <AlertCircle className="w-3.5 h-3.5 text-teal-500/70" />
            <span>Connected to real-time search index parameters (Google Keyword Planner simulation & Semantic Grounding support on active keys)</span>
          </div>
        </form>
      </div>

      {/* Grid of filtering actions & Table list */}
      <div className={`p-6 rounded-xl border ${
        isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-850/60 pb-4">
          
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-1.5 h-1.5" />
              <span>Filters:</span>
            </div>

            {/* Intent Filter */}
            <select
              id="filter-intent-select"
              value={filterIntent}
              onChange={(e) => setFilterIntent(e.target.value)}
              className="bg-[#0a0c10] border border-slate-800 text-xs px-2.5 py-1.5 rounded-lg text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Intent Types</option>
              <option value="informational">Informational</option>
              <option value="commercial">Commercial</option>
              <option value="transactional">Transactional</option>
              <option value="navigational">Navigational</option>
            </select>

            {/* Difficulty Filter */}
            <select
              id="filter-difficulty-select"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="bg-[#0a0c10] border border-slate-800 text-xs px-2.5 py-1.5 rounded-lg text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Difficulties</option>
              <option value="low">Easy (KD &lt; 30)</option>
              <option value="medium">Medium (KD 30 - 60)</option>
              <option value="high">Hard (KD &gt; 60)</option>
            </select>

            {/* Keyword Search mini input */}
            <input
              id="search-keyword-filter"
              type="text"
              placeholder="Filter keyword text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0a0c10] border border-slate-800 text-xs px-2.5 py-1.5 rounded-lg text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 max-w-[140px]"
            />
          </div>

          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-[#0a0c10] hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer self-start"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Keyword Lists Tables */}
        <div className="overflow-x-auto">
          {filteredKeywords.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-xs font-bold text-white mb-1">No keywords items found matching filters</p>
              <p className="text-[10px] text-slate-500">Perform a new search analysis above to seed active keyword datasets.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-sans">
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider w-[240px]">SEO Keyword Target</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Search Volume</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Difficulty KD</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Intent Rating</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider">CPC (avg)</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Trend Graph</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Semantic Cluster</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-right">Integrations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {filteredKeywords.map((item) => {
                  const intentColor = intentColorMap[item.intent] || { bg: 'bg-slate-850', text: 'text-slate-400' };
                  
                  // Simple dynamic mini sparkline points inside cells!
                  const trendPoints = item.trend && item.trend.length >= 8 
                    ? item.trend.slice(-8).map((val, idx) => `${(idx / 7) * 45},${25 - (val / 100) * 20}`).join(' ') 
                    : "0,15 10,10 20,20 30,12 40,15 45,5";

                  return (
                    <tr key={item.id} className="hover:bg-slate-950/20 group">
                      <td className="py-3.5 pr-2">
                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.keyword}</span>
                      </td>
                      <td className="py-3.5 font-mono text-[11px] text-slate-400">
                        {item.volume.toLocaleString()}/mo
                      </td>
                      <td className="py-3.5 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${getDifficultyColor(item.difficulty)}`}>{item.difficulty}</span>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">KD</span>
                        </div>
                      </td>
                      <td className="py-3.5 font-semibold">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${intentColor.bg} ${intentColor.text}`}>
                          {item.intent}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-[11px] text-slate-400">
                        ${item.cpc.toFixed(2)}
                      </td>
                      <td className="py-3.5">
                        <div className="w-12 h-6 flex items-center">
                          <svg className="w-full h-full overflow-visible">
                            <polyline
                              fill="none"
                              stroke="#14b8a6"
                              strokeWidth="1.5"
                              points={trendPoints}
                            />
                            {/* trend end dot */}
                            {item.trend && <circle cx="45" cy={25 - (item.trend[item.trend.length - 1] / 100) * 20} r="2" fill="#14b8a6" />}
                          </svg>
                        </div>
                      </td>
                      <td className="py-3.5 font-medium truncate max-w-[120px] text-slate-400">
                        {item.cluster}
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`add-target-kw-btn-${item.id}`}
                            onClick={() => {
                              onAddTargetKeyword(item.keyword);
                              setTab('content-generator');
                            }}
                            title="Insert into AI Article Generator"
                            className="p-1 px-2.5 bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-slate-950 border border-teal-500/20 rounded text-[10px] font-sans font-semibold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Run AI Writer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

    </div>
  );
}
