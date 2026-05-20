import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Bot, 
  Zap, 
  History, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock, 
  Share2, 
  Database, 
  Compass, 
  Plus, 
  RefreshCw, 
  TrendingUp, 
  Layers, 
  Terminal,
  FileCheck,
  ShieldCheck,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';
import { DatabaseSchema, ScrapeResult, CrawlJob, CompetitorSEOReport, SEOAuditReport } from '../types';

interface ScrapingAuditViewProps {
  db: DatabaseSchema;
  isDarkMode: boolean;
  onRefresh: () => void;
}

export default function ScrapingAuditView({ db, isDarkMode, onRefresh }: ScrapingAuditViewProps) {
  // Navigation tabs inside ScrapingAudit
  const [activeSubTab, setActiveSubTab] = useState<'single' | 'crawler' | 'competitor'>('single');

  // Single SEO Audit State
  const [singleUrl, setSingleUrl] = useState('');
  const [isSingleLoading, setIsSingleLoading] = useState(false);
  const [singleResult, setSingleResult] = useState<ScrapeResult | null>(null);
  const [singleAudit, setSingleAudit] = useState<SEOAuditReport | null>(null);
  const [singleError, setSingleError] = useState('');

  // Crawler State
  const [crawlUrl, setCrawlUrl] = useState('');
  const [maxPages, setMaxPages] = useState(5);
  const [isCrawlerLoading, setIsCrawlerLoading] = useState(false);
  const [crawlerMessage, setCrawlerMessage] = useState('');
  const [crawlerError, setCrawlerError] = useState('');

  // Competitor State
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [isCompetitorLoading, setIsCompetitorLoading] = useState(false);
  const [competitorReport, setCompetitorReport] = useState<CompetitorSEOReport | null>(null);
  const [competitorError, setCompetitorError] = useState('');

  // General Notification Alert Overlay
  const [toastMessage, setToastMessage] = useState('');

  const displayToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // 1. One-off Audit Handler
  const handlePerformAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleUrl) return;
    setIsSingleLoading(true);
    setSingleError('');
    setSingleResult(null);
    setSingleAudit(null);

    // Ensure polite schema format
    let target = singleUrl.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = 'https://' + target;
    }

    try {
      const response = await fetch('/api/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target })
      });
      const data = await response.json();

      if (data.success) {
        setSingleAudit(data.report);
        // Also simulate or perform scrape details fetch
        const scrapeRes = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: target })
        });
        const scrapeData = await scrapeRes.json();
        if (scrapeData.success) {
          setSingleResult(scrapeData.result);
        }
        displayToast('AI SEO Audit Agent successfully finalized audit.');
        onRefresh();
      } else {
        setSingleError(data.error || 'Failed to analyze url. Check logs.');
      }
    } catch (err: any) {
      setSingleError(err.message || 'Network issue communicating with the SEO Audit Agent.');
    } finally {
      setIsSingleLoading(false);
    }
  };

  // 2. Crawler Handler
  const handleTriggerCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crawlUrl) return;
    setIsCrawlerLoading(true);
    setCrawlerError('');
    setCrawlerMessage('');

    let target = crawlUrl.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = 'https://' + target;
    }

    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target, maxPages })
      });
      const data = await response.json();
      if (data.success) {
        setCrawlerMessage(data.message);
        displayToast('Recursive Crawl enqueued. Mapped keywords will appear in main DB!');
        setCrawlUrl('');
        onRefresh();
      } else {
        setCrawlerError(data.error || 'Failed launching autonomous crawler.');
      }
    } catch (err: any) {
      setCrawlerError(err.message || 'Crawler queue network problem.');
    } finally {
      setIsCrawlerLoading(false);
    }
  };

  // 3. Competitor Analysis Handler
  const handleCompetitorAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorUrl) return;
    setIsCompetitorLoading(true);
    setCompetitorError('');
    setCompetitorReport(null);

    let target = competitorUrl.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = 'https://' + target;
    }

    try {
      const response = await fetch('/api/competitor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target })
      });
      const data = await response.json();
      if (data.success) {
        setCompetitorReport(data.report);
        displayToast('Sector Competitor analysis successfully calculated!');
        onRefresh();
      } else {
        setCompetitorError(data.error || 'Failed competitor analysis computation.');
      }
    } catch (err: any) {
      setCompetitorError(err.message || 'Competitor engine is offline.');
    } finally {
      setIsCompetitorLoading(false);
    }
  };

  // Select severity pill color
  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-[#6366f1]/10 text-indigo-400 border border-indigo-500/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-650 text-white px-4 py-3 rounded-xl border border-indigo-505/20 shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-semibold backdrop-blur font-sans">
          <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Intro visual banner */}
      <div className={`p-6 rounded-2xl border transition-all duration-200 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-indigo-950/40 via-[#0f1218] to-emerald-950/20 border-slate-800' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-mono leading-none bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 uppercase font-bold">Autonomous Engine</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono leading-none bg-indigo-500/10 text-indigo-400 border border-indigo-200/10 uppercase font-bold">v2.5 Hot reload</span>
            </div>
            <h2 className={`text-xl font-bold font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Master AI SEO Scraping & Crawler Console
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Orchestrate autonomous Puppeteer-simulated spider scripts to crawl public websites, extract structured titles, latent keywords, and FAQs. Feed discoveries directly back into the primary content schema.
            </p>
          </div>
          
          <button 
            onClick={onRefresh}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all border ${
              isDarkMode 
                ? 'bg-[#0a0c10] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync DB Cache</span>
          </button>
        </div>

        {/* Console Hub Inner Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-dashed border-slate-800/10">
          <button 
            onClick={() => setActiveSubTab('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'single'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                : (isDarkMode ? 'bg-[#0a0c10] text-slate-400 hover:text-slate-200 border border-slate-850' : 'bg-slate-100 text-slate-600 hover:text-slate-800')
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>AI Page Auditor</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('crawler')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'crawler'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                : (isDarkMode ? 'bg-[#0a0c10] text-slate-400 hover:text-slate-200 border border-slate-850' : 'bg-slate-100 text-slate-600 hover:text-slate-800')
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Autonomous Web Crawler</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('competitor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'competitor'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                : (isDarkMode ? 'bg-[#0a0c10] text-slate-400 hover:text-slate-200 border border-slate-850' : 'bg-slate-100 text-slate-600 hover:text-slate-800')
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Competitor Analysis Agent</span>
          </button>
        </div>
      </div>

      {/* Subtab 1: Single URL Audit */}
      {activeSubTab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls form card */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'} space-y-4 h-fit`}>
            <div className="flex items-center gap-2 text-indigo-400">
              <Compass className="w-4 h-4" />
              <h3 className="text-xs uppercase font-mono tracking-wider font-extrabold">Instant Page Assessment</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Insert any public page URL below. The Scraper Agent retrieves the DOM node, analyzes headings ratio, metadata, and invokes the Audit Agent for real-time improvements.
            </p>

            <form onSubmit={handlePerformAudit} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-semibold text-slate-500 block">HTTP Target Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. products.mysite.com/features"
                    value={singleUrl}
                    onChange={(e) => setSingleUrl(e.target.value)}
                    className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              {singleError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-[10px] rounded-lg text-rose-400 leading-relaxed font-mono">
                  <strong>Audit Error:</strong> {singleError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSingleLoading}
                className="w-full bg-indigo-500 hover:bg-indigo-650 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSingleLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing DOM...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Perform AI Audit</span>
                  </>
                )}
              </button>
            </form>

            {/* Audit courtesy standards guidelines */}
            <div className={`p-3 rounded-lg text-[10px] font-mono leading-relaxed space-y-1 ${isDarkMode ? 'bg-[#0a0c10] text-slate-500' : 'bg-slate-50 text-slate-500'}`}>
              <span className="font-bold text-slate-400 uppercase">Courtesy limits:</span>
              <p>• Scraper respects robots.txt permissions by default.</p>
              <p>• Polite pauses applied (500ms between crawls).</p>
            </div>
          </div>

          {/* Results dashboard viewport */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* If no result evaluated */}
            {!singleAudit && !isSingleLoading && (
              <div className={`p-12 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center ${
                isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <Terminal className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
                <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-850'}`}>No Data Queried Yet</h4>
                <p className="text-xs text-slate-550 max-w-sm">
                  Run a live URL through the generator on the left frame to spawn crawler workers and extract micro-data insights.
                </p>
              </div>
            )}

            {/* If loading view */}
            {isSingleLoading && (
              <div className={`p-16 rounded-2xl border flex flex-col items-center justify-center text-center ${
                isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="w-12 h-12 bg-indigo-500/15 rounded-full flex items-center justify-center border border-indigo-500/40 relative mb-4">
                  <Bot className="w-6 h-6 text-indigo-400 animate-bounce" />
                  <span className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></span>
                </div>
                <h4 className={`text-sm font-bold truncate mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Spawning Scraper Agents</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Connecting to live remote index. Harvesting XML markup, headings ratio, links cluster and FAQs schema logs...
                </p>
              </div>
            )}

            {/* Main result panels */}
            {singleAudit && (
              <div className="space-y-6">
                
                {/* Score panel */}
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Crawl Target Assessed</span>
                      <h4 className={`text-sm font-bold truncate max-w-md ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{singleAudit.targetUrl}</h4>
                      <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(singleAudit.createdAt).toLocaleTimeString()}</span>
                        <span>• Size: {singleAudit.pageSizeKb} KB</span>
                        <span>• Latency: {singleAudit.loadTimeMs}ms</span>
                        <span>• SSL: {singleAudit.sslEnabled ? 'Secure' : 'Unencrypted'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Calculated Score</p>
                        <p className={`text-2xl font-black ${
                          singleAudit.seoScore > 85 ? 'text-emerald-400' : singleAudit.seoScore > 65 ? 'text-amber-400' : 'text-rose-400'
                        }`}>{singleAudit.seoScore}/100</p>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-dashed border-indigo-500/40 flex items-center justify-center bg-indigo-500/10">
                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issues List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Detected SEO Audits Recommendations ({singleAudit.totalIssuesCount})
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {singleAudit.issues.map((issue, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                          isDarkMode ? 'bg-[#0f1218] border-slate-850' : 'bg-white border-slate-100'
                        }`}
                      >
                        {issue.severity === 'critical' ? (
                          <AlertOctagon className="w-5 h-5 text-rose-450 mt-0.5 flex-shrink-0" />
                        ) : issue.severity === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-450 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                        )}

                        <div className="space-y-1 flex-grow">
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{issue.title}</h5>
                            <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${getSeverityStyle(issue.severity)}`}>
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal">{issue.description}</p>
                          <div className={`mt-2 p-2 rounded text-[10px] font-mono ${
                            isDarkMode ? 'bg-[#0a0c10] text-[#cbd5e1]' : 'bg-slate-50 text-slate-700'
                          }`}>
                            <span className="font-bold text-indigo-400">Action:</span> {issue.recommendation}
                          </div>
                          {issue.detectedValue && (
                            <p className="text-[9px] font-mono text-slate-550 leading-none">Detected: "{issue.detectedValue}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scraped Raw HTML Insights */}
                {singleResult && (
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                    <div className="flex items-center gap-2 text-emerald-400 pb-2 border-b border-slate-800/10">
                      <Terminal className="w-4 h-4" />
                      <h4 className="text-xs uppercase font-mono tracking-wider font-extrabold text-slate-350">Scraped Node Meta details</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Document Title Mapping</p>
                        <p className={`font-mono font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-705'}`}>{singleResult.title}</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Content Keywords Weight</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {singleResult.keywords.map((w, i) => (
                            <span key={i} className={`px-1.5 py-0.5 rounded font-mono text-[9px] ${
                              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                            }`}>{w}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Extracted FAQs from Scraper Agent */}
                    {singleResult.faqs && singleResult.faqs.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-800/10">
                        <p className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-indigo-400" />
                          <span>AI Scraper Agent: Extracted FAQs</span>
                        </p>

                        <div className="space-y-1.5">
                          {singleResult.faqs.map((faq, i) => (
                            <div key={i} className={`p-2 rounded border text-[11px] ${
                              isDarkMode ? 'bg-[#0a0c10] border-slate-850' : 'bg-slate-50 border-slate-150'
                            }`}>
                              <p className="font-bold text-indigo-400 flex items-center gap-1">Q: {faq.question}</p>
                              <p className="text-slate-500 mt-1 pl-2">A: {faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Link Map statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs pt-2">
                      <div className={`p-2 rounded ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-slate-50'}`}>
                        <p className="text-[10px] font-mono text-slate-500">Headings (H1-H3)</p>
                        <p className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{singleResult.headings.length}</p>
                      </div>
                      <div className={`p-2 rounded ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-slate-50'}`}>
                        <p className="text-[10px] font-mono text-slate-500">Images Mapped</p>
                        <p className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{singleResult.imageUrls.length}</p>
                      </div>
                      <div className={`p-2 rounded ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-slate-50'}`}>
                        <p className="text-[10px] font-mono text-slate-500">Internal Links</p>
                        <p className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{singleResult.internalLinks.length}</p>
                      </div>
                      <div className={`p-2 rounded ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-slate-50'}`}>
                        <p className="text-[10px] font-mono text-slate-500">Schemas</p>
                        <p className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{singleResult.schemaMarkup.length}</p>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

      {/* Subtab 2: Autonomous Multi-Page Crawler */}
      {activeSubTab === 'crawler' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form crawler controls */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'} space-y-4 h-fit`}>
            <div className="flex items-center gap-2 text-indigo-400">
              <Bot className="w-4 h-4" />
              <h3 className="text-xs uppercase font-mono tracking-wider font-extrabold">Autonomous Page Spider</h3>
            </div>
            <p className="text-[11px] text-slate-550 leading-normal">
              Launches an autonomous scraping engine. It automatically identifies internal hyperlinks, sequences parallel pages, maps sitemap structures, extracts latent semantic vocabulary and seeds your primary keyword catalog databases!
            </p>

            <form onSubmit={handleTriggerCrawl} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-semibold text-slate-500 block">Root Domain Seed</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. docs.domain.com"
                    value={crawlUrl}
                    onChange={(e) => setCrawlUrl(e.target.value)}
                    className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-semibold text-slate-500 block">Crawled Page Limit</label>
                <select 
                  value={maxPages}
                  onChange={(e) => setMaxPages(parseInt(e.target.value))}
                  className={`w-full text-xs px-3 py-2 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-55 border-slate-200'
                  }`}
                >
                  <option value={3}>3 URL Leaves (Ultra-Fast)</option>
                  <option value={5}>5 URL Leaves (Standard)</option>
                  <option value={10}>10 URL Leaves (Comprehensive)</option>
                  <option value={20}>20 URL Leaves (Enterprise Bulk)</option>
                </select>
              </div>

              {crawlerError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-[10px] rounded-lg text-rose-400 leading-relaxed font-mono">
                  {crawlerError}
                </div>
              )}

              {crawlerMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[10px] rounded-lg text-emerald-400 leading-relaxed font-mono">
                  {crawlerMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isCrawlerLoading}
                className="w-full bg-indigo-500 hover:bg-indigo-650 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isCrawlerLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Launching spider...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Spawn New Crawl</span>
                  </>
                )}
              </button>
            </form>

            {/* Scheduled Crawl Setup */}
            <div className={`p-3.5 rounded-xl border border-dashed space-y-2 text-xs ${
              isDarkMode ? 'bg-[#0a0c10]/40 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono font-bold uppercase text-[9px]">Autopilot Automation Schedule</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Hourly automated cron workers parse local XML site hierarchies. Freshly crawled entities are fed to Scraper Agents at midnight daily.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono leading-none font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Cron Active</span>
                <span className="text-[9px] font-mono text-slate-530">Next run: Fri 00:00 UTC</span>
              </div>
            </div>
          </div>

          {/* Crawler logs directory viewport */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
              <div className="flex items-center justify-between border-b border-slate-800/10 pb-3">
                <div className="flex items-center gap-2 text-indigo-400">
                  <History className="w-4 h-4" />
                  <h4 className="text-xs uppercase font-mono tracking-wider font-extrabold">Autonomous Spider Crawl Run History</h4>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded font-bold">
                  {db.crawls?.length || 0} Runs
                </span>
              </div>

              {(!db.crawls || db.crawls.length === 0) ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No automated crawling runs cached in state. Use the Root Domain form on the left menu block to bootstrap index parsing.
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-slate-800/10">
                  {db.crawls.map((job) => (
                    <div key={job.id} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="space-y-1 flex-grow min-w-0">
                          <p className={`text-xs font-mono font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-805'}`}>{job.targetUrl}</p>
                          <p className="text-[9px] font-mono text-slate-510">Job ID: {job.id} • Created: {new Date(job.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                            job.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : job.status === 'running'
                              ? 'bg-amber-500/10 text-amber-450 border border-amber-500/20 animate-pulse'
                              : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                          }`}>
                            {job.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-650'}`}>
                            {job.pagesCrawled} Pages
                          </span>
                        </div>
                      </div>

                      {/* URL leaf list */}
                      {job.results && job.results.length > 0 && (
                        <div className="space-y-1.5 pl-3 border-l border-indigo-500/30">
                          <p className="text-[9px] uppercase tracking-wider font-mono text-slate-510 font-bold">Crawl path resolved schema tree:</p>
                          {job.results.map((res, index) => (
                            <div key={index} className="flex items-center justify-between text-[11px] font-mono py-1">
                              <span className="text-slate-505 truncate max-w-sm flex items-center gap-1">
                                <ArrowRight className="w-2.5 h-2.5 text-indigo-400" />
                                <span>{res.url}</span>
                              </span>
                              
                              <div className="flex items-center gap-2 text-[9px] flex-shrink-0">
                                <span className={`font-semibold ${res.status === 'success' ? 'text-emerald-400' : 'text-rose-450'}`}>
                                  {res.status === 'success' ? 'Scraped Title: ' + res.title.substring(0, 20) + '...' : 'Network Timeout'}
                                </span>
                                {res.keywords.length > 0 && (
                                  <span className="text-slate-510 lowercase text-[8px] bg-slate-800 px-1 py-0.5 rounded">
                                    {res.keywords.slice(0, 2).join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* Subtab 3: Competitor Analytics */}
      {activeSubTab === 'competitor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Controls form card */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'} space-y-4 h-fit`}>
            <div className="flex items-center gap-2 text-indigo-400">
              <Layers className="w-4 h-4" />
              <h3 className="text-xs uppercase font-mono tracking-wider font-extrabold">Sector Competitor analysis</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Insert any competitor domain profile. Our Competitor Analysis Agent scrapes their structure, determines content strategy types, extracts keyword positioning density, and generates an assessment overview.
            </p>

            <form onSubmit={handleCompetitorAnalysis} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-semibold text-slate-500 block">Competitor URL Leaf</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-505" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. competitor.com/blog"
                    value={competitorUrl}
                    onChange={(e) => setCompetitorUrl(e.target.value)}
                    className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-505 ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-55 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              {competitorError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-[10px] rounded-lg text-rose-450 leading-relaxed font-mono">
                  {competitorError}
                </div>
              )}

              <button
                type="submit"
                disabled={isCompetitorLoading}
                className="w-full bg-indigo-500 hover:bg-indigo-650 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isCompetitorLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Strategy...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                    <span>Analyze Competitor</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Competitor detailed displays viewport */}
          <div className="lg:col-span-2 space-y-6">

            {/* If no competitor analyzed yet */}
            {!competitorReport && !isCompetitorLoading && (
              <div className={`p-12 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center ${
                isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <Search className="w-10 h-10 text-slate-600 mb-3" />
                <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-850'}`}>No Competitor Profiles Extracted</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Analyze competitor landing directories to build index visibility rankings against core business benchmarks.
                </p>
              </div>
            )}

            {/* If loading view */}
            {isCompetitorLoading && (
              <div className={`p-16 rounded-2xl border flex flex-col items-center justify-center text-center ${
                isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="w-12 h-12 bg-indigo-500/15 rounded-full flex items-center justify-center border border-indigo-500/40 relative mb-4 animate-pulse">
                  <Layers className="w-6 h-6 text-indigo-400" />
                  <span className="absolute inset-0 rounded-full border border-indigo-500 border-t-transparent animate-spin"></span>
                </div>
                <h4 className={`text-sm font-bold truncate mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Map Competitor Authority...</h4>
                <p className="text-xs text-slate-550 max-w-sm">
                  Performing deep analysis. Mashing link ratios, analyzing keyword authority coefficients, and querying strategy assessments...
                </p>
              </div>
            )}

            {competitorReport && (
              <div className="space-y-6">
                
                {/* Competitor Strategic Report Grid */}
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/10 pb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Sector Competitor Seed</span>
                      <h4 className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>{competitorReport.competitorDomain}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Competitor strength score</p>
                        <p className="text-xl font-bold text-indigo-400">{competitorReport.overallScore}/100</p>
                      </div>
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Competitor Strategy Assessment</span>
                    </p>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {competitorReport.strategyAssessment}
                    </p>
                  </div>

                  {/* Discovered Keywords */}
                  {competitorReport.topCompetitorKeywords && competitorReport.topCompetitorKeywords.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/10">
                      <p className="text-[10px] font-mono text-slate-505 uppercase font-bold">Harvester top organic density keywords</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {competitorReport.topCompetitorKeywords.map((k, i) => (
                          <div key={i} className={`p-2.5 rounded border text-xs ${
                            isDarkMode ? 'bg-[#0a0c10] border-slate-855' : 'bg-slate-50 border-slate-150'
                          }`}>
                            <p className="font-mono font-semibold truncate text-[#cbd5e1]">{k.keyword}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                              <span>Density: {k.density}%</span>
                              <span>Freq: {k.frequency}x</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats Map */}
                  <div className="grid grid-cols-2 gap-4 text-center text-xs pt-4 border-t border-slate-800/10">
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-slate-50'}`}>
                      <p className="text-[10px] font-mono text-slate-510 uppercase">Index page leaves</p>
                      <p className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>{competitorReport.pageCountSeeded}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-slate-50'}`}>
                      <p className="text-[10px] font-mono text-slate-510 uppercase font-semibold">Heuristic Page authority rating</p>
                      <p className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>{competitorReport.backlinkSignalsScore}/100</p>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
