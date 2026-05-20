import React, { useState } from 'react';
import { DatabaseSchema, SEOAgent, BlogPost, ScheduledJob, AgentAutomationLog, PublishingLog } from '../types';
import { 
  Bot, 
  Cpu, 
  Calendar, 
  Play, 
  Pause, 
  Plus, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Check, 
  RefreshCw,
  AlertCircle,
  Terminal,
  Server,
  Zap,
  RotateCcw,
  Globe,
  FileCode,
  Image as ImageIcon,
  CheckCircle,
  Wifi,
  Trash2
} from 'lucide-react';

interface AutonomousAgentsViewProps {
  db: DatabaseSchema;
  isDarkMode: boolean;
  onCreateAgent: (agent: Partial<SEOAgent>) => void;
  onRunAgentCycle: (agentId: string) => Promise<BlogPost>;
  onToggleAgentStatus: (agentId: string) => void;
  onRefreshState?: () => Promise<void>;
}

export default function AutonomousAgentsView({ 
  db, 
  isDarkMode, 
  onCreateAgent, 
  onRunAgentCycle,
  onToggleAgentStatus,
  onRefreshState
}: AutonomousAgentsViewProps) {
  
  // Custom Scheduler and CEO Loop hook states
  const [isRunningLoop, setIsRunningLoop] = useState(false);
  const [isInjectingJob, setIsInjectingJob] = useState(false);
  const [manualAgentId, setManualAgentId] = useState(db.agents[0]?.id || 'manual-admin');
  const [manualJobType, setManualJobType] = useState<ScheduledJob['taskType']>('content_writing');
  const [offsetSeconds, setOffsetSeconds] = useState(0);

  // Deploy Bot Modal states
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'geeky' | 'creative' | 'persuasive'>('professional');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'hourly_demo'>('daily');
  const [topicHub, setTopicHub] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const [executingAgentId, setExecutingAgentId] = useState<string | null>(null);
  const [newlyPublishedPost, setNewlyPublishedPost] = useState<BlogPost | null>(null);

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !purpose.trim()) return;

    const keywordsArr = targetKeywords.split(',').map(k => k.trim()).filter(Boolean);

    onCreateAgent({
      name,
      purpose,
      targetKeywords: keywordsArr.length > 0 ? keywordsArr : ['autonomous intelligence metrics'],
      voiceTone: tone,
      frequency,
      topicHub: topicHub.trim() || 'General SEO',
      status: 'active',
      generatedCount: 0,
      nextRun: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    });

    setName('');
    setPurpose('');
    setTargetKeywords('');
    setTopicHub('');
    setIsCreating(false);
  };

  const handleRunAgentManualOverride = async (agentId: string) => {
    setExecutingAgentId(agentId);
    setNewlyPublishedPost(null);
    try {
      const post = await onRunAgentCycle(agentId);
      setNewlyPublishedPost(post);
      if (onRefreshState) await onRefreshState();
    } catch (e) {
      console.error(e);
    } finally {
      setExecutingAgentId(null);
    }
  };

  // --- API BACKEND CONTROLLERS TRIGGER HANDLERS ---

  const handleTriggerCEOLoop = async () => {
    setIsRunningLoop(true);
    setNewlyPublishedPost(null);
    try {
      const res = await fetch('/api/automation/run-loop', { method: 'POST' });
      const data = await res.json();
      if (data.success && onRefreshState) {
        await onRefreshState();
        // Grab latest published post if any
        const latestPost = db.posts[0];
        if (latestPost && latestPost.authorType === 'AI Agent') {
          setNewlyPublishedPost(latestPost);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningLoop(false);
    }
  };

  const handleEnqueueCustomJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/queues/enqueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: manualAgentId,
          taskType: manualJobType,
          offsetSec: offsetSeconds
        })
      });
      const data = await res.json();
      if (data.success && onRefreshState) {
        await onRefreshState();
        setIsInjectingJob(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetQueue = async () => {
    try {
      const res = await fetch('/api/queues/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success && onRefreshState) {
        await onRefreshState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearCompletedQueue = async () => {
    try {
      const res = await fetch('/api/queues/clear', { method: 'POST' });
      const data = await res.json();
      if (data.success && onRefreshState) {
        await onRefreshState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Safe default arrays for sub-structures
  const jobs = db.scheduledJobs || [];
  const logs = db.automationLogs || [];
  const pubLogs = db.publishingLogs || [];
  const hostUrl = `https://${db.domain || 'my-saas-platform.com'}`;

  // Calculated Queue KPI Metrics
  const activeBotsCount = db.agents.filter(a => a.status === 'active').length;
  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const runningCount = jobs.filter(j => j.status === 'running').length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;
  const failedCount = jobs.filter(j => j.status === 'failed').length;

  return (
    <div id="autonomous-agents-view" className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-sans font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Autonomous AI SEO Scheduler & Agents
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Build and deploy a self-operating SEO enterprise company layer. Orchestrate multi-agent queues tracking keywords, writing H1-H3 meta drafts, and updating indexable Web sitemaps automatically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="trigger-ceo-loop-btn"
            onClick={handleTriggerCEOLoop}
            disabled={isRunningLoop}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg shadow-teal-500/10"
          >
            {isRunningLoop ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-slate-950" />
            )}
            <span>Trigger CEO Auto-Loop</span>
          </button>

          <button
            id="toggle-create-agent-btn"
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer border border-slate-700/55"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Deploy Master Bot</span>
          </button>
        </div>
      </div>

      {/* Floating Success Overlay for newly published posts */}
      {newlyPublishedPost && (
        <div className="p-5 bg-teal-950/30 border border-teal-500/30 text-teal-300 rounded-xl space-y-3 relative z-20 shadow-xl animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20 mt-0.5">
              <Bot className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Autonomous Agent Loop Completed Successfully</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                The agent spider crawled topical schemas, injected comparison backlinks, and published: <span className="font-semibold text-teal-300">"{newlyPublishedPost.title}"</span>.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">Word Count: {newlyPublishedPost.wordCount}</span>
                <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">SEO Score: {newlyPublishedPost.seoScore}%</span>
                <span className="text-[10px] bg-teal-900/35 border border-teal-700/30 text-teal-300 px-2 py-0.5 rounded font-mono">Status: LIVE</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setNewlyPublishedPost(null)}
            className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded transition-all cursor-pointer self-start sm:self-center"
          >
            Acknowledge Index
          </button>
        </div>
      )}

      {/* Deploy Agent Form Area */}
      {isCreating && (
        <div className={`p-6 rounded-xl border relative shadow-xl ${
          isDarkMode ? 'bg-[#0f1218] border-slate-850' : 'bg-white border-slate-200'
        }`}>
          <div className="absolute top-0 left-0 w-2 h-full bg-teal-500 rounded-l" />
          
          <h3 className={`text-base font-bold flex items-center gap-2 mb-4 ${isDarkMode ? 'text-white' : 'text-slate-850'}`}>
            <Sparkles className="w-5 h-5 text-teal-400" />
            <span>Configure Core Autonomous Bot Parameters</span>
          </h3>

          <form onSubmit={handleCreateAgent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label htmlFor="agent-name" className="text-xs font-semibold text-slate-400">Agent Identifier Class</label>
              <input
                id="agent-name"
                type="text"
                required
                placeholder="e.g. Enterprise Backlink Specialist"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="agent-topic-hub" className="text-xs font-semibold text-slate-400">Topic Hub Pillar</label>
              <input
                id="agent-topic-hub"
                type="text"
                required
                placeholder="e.g. Programmatic Indexing Solutions"
                value={topicHub}
                onChange={(e) => setTopicHub(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="agent-purpose" className="text-xs font-semibold text-slate-400">Core Scrape & Write Instructions (System Prompter)</label>
              <textarea
                id="agent-purpose"
                required
                placeholder="Monitor low difficulty gaps continuously, map search entities with technical structured FAQs..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="agent-target-keywords" className="text-xs font-semibold text-slate-400">Bootstrapping Keywords (comma-separated)</label>
              <input
                id="agent-target-keywords"
                type="text"
                placeholder="automated site metadata, backlink reporting API, crawl latency correction"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="agent-tone" className="text-xs font-semibold text-slate-400">Voice Profile</label>
              <select
                id="agent-tone"
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="professional">Professional / Analytical</option>
                <option value="casual">Casual / Narrative</option>
                <option value="geeky">Deep Tech / Code Oriented</option>
                <option value="creative">Creative / Visionary</option>
                <option value="persuasive">Persuasive / Growth focused</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="agent-frequency" className="text-xs font-semibold text-slate-400">Scheduler Frequency</label>
              <select
                id="agent-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              >
                <option value="hourly_demo">Hot Quick Demo (15s scanner interval)</option>
                <option value="daily">Daily Cron Loop (Every 24h)</option>
                <option value="weekly">Weekly Cron Loop (Every 7d)</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                id="cancel-create-agent-btn"
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white text-xs rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                id="submit-create-agent-btn"
                type="submit"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                Deploy Bot
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Executive Core Analytics KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500">Autonomous Crawlers</span>
            <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-mono font-bold text-white">{activeBotsCount} / {db.agents.length}</h3>
            <p className="text-[10px] text-emerald-400 font-semibold mt-0.5 font-sans">Active daemon cron workers</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500">Queue Backlog</span>
            <Server className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-mono font-bold text-white">{pendingCount} pending</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 font-sans">{runningCount} actively evaluating</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500">CMS publishing logs</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-mono font-bold text-white">{completedCount} success</h3>
            <p className="text-[10px] text-rose-500 font-semibold mt-0.5 font-sans">{failedCount} logger collisions</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500">Dynamic Sitemap</span>
            <Globe className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2.5 flex items-end justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-300">Live XML Feed</h3>
              <p className="text-[10px] text-indigo-400 font-semibold mt-0.5 font-mono">/sitemap.xml</p>
            </div>
            <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">PING LIVE</span>
          </div>
        </div>

      </div>

      {/* Deployed Active Agents Grid */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold">Active Sitemaps Crawlers Bots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {db.agents.map((agent) => {
            const isRunning = executingAgentId === agent.id;
            return (
              <div key={agent.id} className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 relative ${
                isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                {/* Agent Header */}
                <div className="flex items-start justify-between min-w-0">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                      agent.status === 'active' 
                        ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
                        : 'bg-slate-800 border-slate-755 text-slate-500'
                    }`}>
                      <Bot className={`w-4.5 h-4.5 ${agent.status === 'active' ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold truncate max-w-[180px] ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {agent.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">Topic: <span className="text-teal-400 font-mono">{agent.topicHub}</span></p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                    agent.status === 'active' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}>{agent.status}</span>
                </div>

                {/* Agent Purpose */}
                <p className="text-xs text-slate-400 font-medium line-clamp-2">{agent.purpose}</p>

                {/* Keywords target */}
                <div className="flex flex-wrap gap-1">
                  {agent.targetKeywords.slice(0, 3).map((kw, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#0a0c10] border border-slate-850 text-[9px] font-mono text-slate-450 rounded">
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* Sub parameters block */}
                <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-850/40 pt-2.5 text-slate-500">
                  <span>Tone: <strong className="text-slate-300 capitalize">{agent.voiceTone}</strong></span>
                  <span>Crawl: <strong className="text-slate-350">{agent.frequency.replace('_', ' ')}</strong></span>
                  <span>Generations: <strong className="text-teal-400">{agent.generatedCount}</strong></span>
                </div>

                {/* Control Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onToggleAgentStatus(agent.id)}
                    className={`py-1 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      agent.status === 'active'
                        ? 'bg-[#0a0c10] border-slate-800 text-slate-450 hover:text-white'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {agent.status === 'active' ? (
                      <>
                        <Pause className="w-3 h-3" />
                        <span>Pause Crawl</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Resume Bot</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleRunAgentManualOverride(agent.id)}
                    disabled={isRunning}
                    className="py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    {isRunning ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-slate-950" />
                    ) : (
                      <Play className="w-3 h-3 fill-slate-950 text-slate-950" />
                    )}
                    <span>Fork Cycle</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SYSTEM QUEUE MONITOR & CONTROL CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scheduler Task Backlog Queues */}
        <div className={`p-5 rounded-xl border lg:col-span-2 flex flex-col justify-between ${
          isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-850/50 pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase font-sans">Scheduled Task Backlog Queues</h3>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetQueue}
                  className="p-1 rounded bg-[#0a0c10] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-705 transition-all cursor-pointer"
                  title="Retry Failed Jobs"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button
                  onClick={handleClearCompletedQueue}
                  className="p-1 rounded bg-[#0a0c10] border border-slate-800 text-slate-400 hover:text-rose-450 hover:border-slate-705 transition-all cursor-pointer"
                  title="Clear Completed Queue"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setIsInjectingJob(!isInjectingJob)}
                  className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded text-[10px] font-bold uppercase cursor-pointer hover:bg-teal-500/20"
                >
                  + Inject Job
                </button>
              </div>
            </div>

            {/* Injected Job Form */}
            {isInjectingJob && (
              <form onSubmit={handleEnqueueCustomJob} className="p-3 bg-[#0a0c10] rounded-lg border border-slate-850 mb-4 space-y-3 shadow-inner">
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase">Target Bot</label>
                    <select
                      value={manualAgentId}
                      onChange={(e) => setManualAgentId(e.target.value)}
                      className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-xs focus:ring-1 focus:ring-teal-500"
                    >
                      {db.agents.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                      <option value="manual-admin">Manual Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase">Task Pipeline Step</label>
                    <select
                      value={manualJobType}
                      onChange={(e) => setManualJobType(e.target.value as any)}
                      className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-xs"
                    >
                      <option value="keyword_research">1. Keyword Discovery</option>
                      <option value="content_writing">2. Copywriter Writer</option>
                      <option value="seo_optimization">3. SEO Optimizer</option>
                      <option value="publishing">4. Publish Instantly</option>
                      <option value="analytics_tracking">5. Analytics Spider Tracker</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-850 pt-2.5">
                  <div className="text-[10px] text-slate-500">
                    Will execute immediately on scheduler's next scan.
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsInjectingJob(false)}
                      className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[10px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-teal-500 text-slate-950 font-bold rounded text-[10px] cursor-pointer"
                    >
                      Trigger
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Task list queue scrollable */}
            <div className="max-h-72 overflow-y-auto pr-1 space-y-2.5">
              {jobs.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 font-mono">
                  Queue registry is completely empty. Deploy master crawler tasks to schedule background jobs.
                </div>
              ) : (
                jobs.map(job => {
                  const correlatedAgent = db.agents.find(a => a.id === job.agentId);
                  return (
                    <div key={job.id} className="p-3 bg-[#0a0c10] border border-slate-850 rounded-lg flex items-center justify-between text-xs transition-hover hover:border-slate-800">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            job.status === 'pending' ? 'bg-[#cbd5e1]' :
                            job.status === 'running' ? 'bg-indigo-400 animate-pulse' :
                            job.status === 'completed' ? 'bg-emerald-400' : 'bg-rose-500'
                          }`} />
                          <span className="font-mono font-bold uppercase tracking-wider text-[10px]">
                            {job.taskType.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          Bot: {correlatedAgent ? correlatedAgent.name : "System Daemon Service"}
                        </p>
                        <p className="text-[9px] text-slate-500 font-mono">
                          Schedule: {new Date(job.scheduledAt).toLocaleTimeString()} (Attempt: {job.attempts}/{job.maxAttempts})
                        </p>
                        {job.errorMessage && (
                          <p className="text-[9px] text-rose-400 font-mono truncate leading-tight mt-1 bg-rose-950/25 p-1 rounded border border-rose-950/40">
                            Err: {job.errorMessage}
                          </p>
                        )}
                      </div>

                      <span className={`ml-3 px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase shrink-0 ${
                        job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/15' :
                        job.status === 'running' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/15' :
                        job.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/15' :
                        'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>{job.status}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-850/30 pt-3 flex sm:flex-row flex-col justify-between sm:items-center gap-1">
            <span>Server Container: node-cron emulation ACTIVE</span>
            <span>Thread sync interval: 15 seconds</span>
          </div>
        </div>

        {/* CMS Live XML, Robots and RSS Channels */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-slate-850/50 pb-2">
              <Globe className="w-4.5 h-4.5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase font-sans">Index Web Channels</h3>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-[#0a0c10] border border-slate-850 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 font-semibold font-sans">Sitemap Generator</span>
                  <span className="text-emerald-400 flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-400" /> ONLINE</span>
                </div>
                <div className="flex items-center justify-between">
                  <a href="/sitemap.xml" target="_blank" className="text-[10px] text-teal-400 hover:underline font-mono truncate mr-2">
                    {hostUrl}/sitemap.xml
                  </a>
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 text-slate-500 rounded border border-slate-800 uppercase font-mono tracking-widest leading-none">XML</span>
                </div>
              </div>

              <div className="p-3 bg-[#0a0c10] border border-slate-850 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 font-semibold font-sans">Robots crawlers configuration</span>
                  <span className="text-emerald-400"><Wifi className="w-3 h-3 text-emerald-400 inline" /> ACTIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <a href="/robots.txt" target="_blank" className="text-[10px] text-teal-400 hover:underline font-mono truncate mr-2">
                    {hostUrl}/robots.txt
                  </a>
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 text-slate-500 rounded border border-slate-800 uppercase font-mono tracking-widest leading-none">TXT</span>
                </div>
              </div>

              <div className="p-3 bg-[#0a0c10] border border-slate-850 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 font-semibold font-sans">XML RSS Feeds</span>
                  <span className="text-indigo-450"><Wifi className="w-3 h-3 text-indigo-400 inline" /> FEED_SYNCED</span>
                </div>
                <div className="flex items-center justify-between">
                  <a href="/rss.xml" target="_blank" className="text-[10px] text-teal-400 hover:underline font-mono truncate mr-2">
                    {hostUrl}/rss.xml
                  </a>
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 text-slate-500 rounded border border-slate-800 uppercase font-mono tracking-widest leading-none">RSS XML</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[8.5px] font-mono text-slate-500 leading-tight mt-3">
            Search listings, page canonical schemas, Open Graph markup cards, and cache updates rebuild instantly upon any publication pipeline success.
          </div>
        </div>

      </div>

      {/* CORE TERMINAL EVENT LOG MONITOR */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-3 border-b border-slate-850/50 pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase font-sans">Master AI Automation Event Logs</h3>
          </div>
          <span className="text-[10px] bg-slate-900 border border-slate-800 text-indigo-400 font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
            <span>REAL-TIME POLLING FEED</span>
          </span>
        </div>

        {/* Scrollable logs layout */}
        <div className="bg-[#050608] rounded-xl border border-slate-900 p-4 font-mono text-xs overflow-y-auto max-h-64 space-y-2 h-64 shadow-inner">
          {logs.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              Waiting for automation scheduler thread to output agent activities logs...
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 leading-relaxed text-[11px]">
                <span className="text-slate-500 font-medium shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className="text-indigo-400 font-bold shrink-0 uppercase tracking-wide">[{log.agentName}]</span>
                <span className="text-teal-450 font-bold shrink-0 font-mono">[{log.actionType}]</span>
                
                <span className={`flex-grow leading-relaxed ${
                  log.level === 'error' ? 'text-rose-450 font-bold bg-rose-955/20 px-1.5 py-0.5 rounded border border-rose-950/40' :
                  log.level === 'warning' ? 'text-amber-450' : 'text-slate-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
