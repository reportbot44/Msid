import React, { useState } from 'react';
import { DatabaseSchema, AnalyticsData, SEOAuditIssue } from '../types';
import { 
  TrendingUp, 
  MousePointer, 
  Map, 
  Percent, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  FileText,
  Search,
  ExternalLink
} from 'lucide-react';
import { analyticsMock } from '../data';

interface DashboardViewProps {
  db: DatabaseSchema;
  isDarkMode: boolean;
  onFixIssue: (issueId: string) => void;
  setTab: (tab: string) => void;
}

export default function DashboardView({ db, isDarkMode, onFixIssue, setTab }: DashboardViewProps) {
  const [selectedMetric, setSelectedMetric] = useState<'impressions' | 'clicks'>('clicks');

  const pendingIssues = db.issues.filter(i => i.status === 'pending');
  const fixedIssues = db.issues.filter(i => i.status === 'fixed');
  
  // Custom interactive SVG chart math variables
  const dataPoints = selectedMetric === 'impressions' ? analyticsMock.impressionsTrend : analyticsMock.clicksTrend;
  const maxVal = Math.max(...dataPoints) * 1.05;
  const minVal = Math.min(...dataPoints) * 0.95;
  const delta = maxVal - minVal;

  const svgWidth = 600;
  const svgHeight = 180;
  
  const points = dataPoints.map((val, idx) => {
    const x = (idx / (dataPoints.length - 1)) * svgWidth;
    const y = svgHeight - ((val - minVal) / delta) * svgHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${points} ${svgWidth},${svgHeight} 0,${svgHeight}`;

  return (
    <div id="dashboard-view" className="space-y-6">
      
      {/* Upper Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-sans font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            SEO Console Hub
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Real-time indexing status and technical performance overview for <span className="font-semibold text-teal-400 font-mono">{db.domain}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
            Sitemap Crawl Active: {db.posts.length} Indexed Pages
          </span>
        </div>
      </div>

      {/* Advanced Organic SEO & Client Expansion Banner */}
      <div className={`p-4 rounded-xl border relative overflow-hidden transition-all hover:shadow-lg ${
        isDarkMode 
          ? 'bg-gradient-to-r from-indigo-950/20 via-slate-900/40 to-emerald-950/10 border-indigo-500/35' 
          : 'bg-gradient-to-r from-indigo-50/40 to-emerald-50/20 border-indigo-152'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-tight">EXECUTIVE CONSOLE ACTIVE</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-tight">AUTO-MARKUP ACTIVE</span>
            </div>
            <h3 className={`text-xs uppercase font-mono tracking-wider font-extrabold ${isDarkMode ? 'text-slate-205' : 'text-slate-805'}`}>
              Bespoke Interior & Home Decor Search Acceleration
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal max-w-3xl">
              Equip your corporate home styling partners with high-integrity Google Rich Snippets structured scripts, and compile bespoke organic growth blueprints presenting exact ROI forecasts relative to expensive PPC bidding pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              onClick={() => setTab('schema-suite')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-md cursor-pointer"
            >
              Rich Snippets Master
            </button>

            <button
              onClick={() => setTab('monetization')}
              className={`px-3 py-1.5 border text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-300 hover:text-white' : 'bg-white border-slate-205 text-slate-705 hover:bg-slate-50'
              }`}
            >
              Client ROI Blueprint
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 4 Key Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Impressions Card */}
        <button
          onClick={() => setSelectedMetric('impressions')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedMetric === 'impressions'
              ? 'ring-2 ring-indigo-500/50 border-indigo-500 bg-indigo-500/5'
              : isDarkMode 
                ? 'bg-[#0f1218] border-slate-800 hover:border-slate-700' 
                : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Google Impressions</span>
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {analyticsMock.impressions.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400">+14.2%</span>
          </div>
        </button>

        {/* Clicks Card */}
        <button
          onClick={() => setSelectedMetric('clicks')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedMetric === 'clicks'
              ? 'ring-2 ring-indigo-500/50 border-indigo-500 bg-indigo-500/5'
              : isDarkMode 
                ? 'bg-[#0f1218] border-slate-800 hover:border-slate-700' 
                : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Organic Clicks</span>
            <MousePointer className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {analyticsMock.clicks.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400">+8.7%</span>
          </div>
        </button>

        {/* Average Position */}
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Avg position</span>
            <Map className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {analyticsMock.avgPosition}
            </span>
            <span className="text-xs text-teal-400">-1.3</span>
          </div>
        </div>

        {/* Click Through Rate */}
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Average CTR</span>
            <Percent className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {analyticsMock.avgCTR}%
            </span>
            <span className="text-xs text-emerald-300">+0.44%</span>
          </div>
        </div>
      </div>

      {/* Main Graph & Audit Hub Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: SVG Chart Dashboard */}
        <div className={`lg:col-span-8 p-6 rounded-xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 id="chart-title" className={`text-sm font-bold capitalize ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {selectedMetric} Trend (Last 8 Days)
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">Daily impressions & clicks recorded inside Google Search Console</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-teal-500 inline-block" />
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">{selectedMetric} Line</span>
            </div>
          </div>

          {/* Render Vector Chart */}
          <div className="relative pt-2">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1={svgHeight * 0.25} x2={svgWidth} y2={svgHeight * 0.25} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3,3" />
              <line x1="0" y1={svgHeight * 0.5} x2={svgWidth} y2={svgHeight * 0.5} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3,3" />
              <line x1="0" y1={svgHeight * 0.75} x2={svgWidth} y2={svgHeight * 0.75} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3,3" />

              {/* Shadow gradient area under curve */}
              <polygon points={areaPoints} fill="url(#chartGradient)" />

              {/* Actual curve lines */}
              <polyline
                fill="none"
                stroke="#14b8a6"
                strokeWidth="2.5"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Individual dots */}
              {dataPoints.map((val, idx) => {
                const x = (idx / (dataPoints.length - 1)) * svgWidth;
                const y = svgHeight - ((val - minVal) / delta) * svgHeight;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5" className="fill-slate-900 stroke-teal-400 stroke-[2] cursor-pointer hover:r-6" />
                    <text x={x} y={y - 10} textAnchor="middle" className="fill-slate-400 font-mono text-[9px] font-bold">
                      {val.toLocaleString()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Dates Scale */}
          <div className="flex items-center justify-between border-t border-slate-800/20 pt-3 mt-4 text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">
            {analyticsMock.dates.map((date, idx) => (
              <span key={idx} className="w-12 text-center">{date}</span>
            ))}
          </div>

        </div>

        {/* Right Side: Technical SEO audit crawler issues list */}
        <div className={`lg:col-span-4 p-6 rounded-xl border ${
          isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Crawler Audits</h3>
              <p className="text-[10px] text-slate-500 font-medium">Auto-detected performance bottlenecks and optimizations</p>
            </div>
            <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono font-bold leading-none">
              {pendingIssues.length} Unresolved
            </span>
          </div>

          <div id="audit-list" className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {pendingIssues.length === 0 ? (
              <div className="p-4 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                <ShieldCheck className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                <p className="text-xs font-bold text-white">All Crawler Checks Green!</p>
                <p className="text-[10px] text-slate-500">Your structural schema indices are clear of index blocks.</p>
              </div>
            ) : (
              pendingIssues.map((issue) => (
                <div key={issue.id} className={`p-3 rounded-lg border text-left flex flex-col space-y-2 ${
                  isDarkMode ? 'bg-[#0a0c10] border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${
                        issue.category === 'critical' ? 'text-rose-400' : 'text-amber-400'
                      }`} />
                      <p className={`text-xs font-bold leading-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {issue.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{issue.description}</p>
                  <button
                    id={`fix-issue-btn-${issue.id}`}
                    onClick={() => onFixIssue(issue.id)}
                    className="w-full py-1 text-center bg-teal-500/10 hover:bg-teal-500/15 border border-teal-500/20 text-teal-400 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-all cursor-pointer"
                  >
                    Resolve & Re-index Issues
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Fixed checks: {fixedIssues.length}</span>
            </div>
            <button
              onClick={() => setTab('settings')}
              className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Domain Settings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Bottom Area: Active SEO Workspace Content Queue (Sitemaps list) */}
      <div className={`p-6 rounded-xl border ${
        isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Active XML Sitemap & Published Hub</h3>
            <p className="text-[10px] text-slate-500 font-medium">The content nodes published programmatically by manual editors or autonomous agents</p>
          </div>
          <button
            id="write-post-nav-btn"
            onClick={() => setTab('content-generator')}
            className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold rounded-lg transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Write SEO Post Now</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Page / Title Schema</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider">SEO Score</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Length</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Indexed Keywords</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Publisher Type</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider">XML Sitemaps Connection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10">
              {db.posts.map((post) => (
                <tr key={post.id} className={`group ${isDarkMode ? 'hover:bg-slate-950/20' : 'hover:bg-slate-50'}`}>
                  <td className="py-3.5 pr-3">
                    <div className="flex flex-col">
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{post.title}</span>
                      <span className="text-[10px] font-mono text-slate-500 truncate max-w-sm">/sitemap/{post.slug}</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-10 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end">
                        <div 
                          className={`w-full rounded-full ${
                            post.seoScore >= 90 ? 'bg-emerald-400' : post.seoScore >= 80 ? 'bg-amber-400' : 'bg-red-400'
                          }`}
                          style={{ height: `${post.seoScore}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-teal-400">{post.seoScore}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono text-slate-400 text-[11px]">{post.wordCount} words</td>
                  <td className="py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {post.keywordsUsed.map((kw, i) => (
                        <span key={i} className={`px-1.5 py-0.5 rounded text-[9px] font-semibold font-mono ${
                          isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-tight border ${
                      post.authorType === 'AI Agent'
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {post.authorType}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">XML Live Index</span>
                    </div>
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
