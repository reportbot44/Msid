import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Coins, 
  ArrowUpRight, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Wallet, 
  Send, 
  FileText, 
  Sliders, 
  SlidersHorizontal, 
  Download, 
  Maximize2 
} from 'lucide-react';
import { DatabaseSchema, UserSession } from '../types';

interface SaaSMonetizationViewProps {
  db: DatabaseSchema;
  isDarkMode: boolean;
  userSession: UserSession;
  onUpgradeTier: (tier: 'Free' | 'Pro' | 'Enterprise') => void;
}

export default function SaaSMonetizationView({ db, isDarkMode, userSession, onUpgradeTier }: SaaSMonetizationViewProps) {
  // Config estimator variables
  const [estMonthlyVisitors, setEstMonthlyVisitors] = useState(5000);
  const [conversionRate, setConversionRate] = useState(1.5); // %
  const [avgProjectTicket, setAvgProjectTicket] = useState(12000); // USD average room redesign ticket
  const [averageMonthlyPpcAdBudget, setAverageMonthlyPpcAdBudget] = useState(3000); // USD

  // Proposal Branding Generator state
  const [agencyName, setAgencyName] = useState('MS INTERIOR DECORATION');
  const [proposalColor, setProposalColor] = useState('indigo');
  const [proposalNotes, setProposalNotes] = useState('MS INTERIOR DECORATION has curated this customized organic SEO blueprint to dominate the biophilic styling, luxury terrazzo, and minimalist interior search landscapes.');
  const [exportedProposal, setExportedProposal] = useState<any | null>(null);

  // Math equations
  const calculatedTrafficSavingsFromSEO = averageMonthlyPpcAdBudget;
  const projectAcquisitionsFromOrganicPerMonth = Math.round((estMonthlyVisitors * (conversionRate / 100)));
  const calculatedGrossMonthlyRedesignsRevenue = projectAcquisitionsFromOrganicPerMonth * avgProjectTicket;
  
  // High impact SaaS Tier configuration setup
  const plans = [
    {
      name: 'Free',
      price: '$0',
      tagline: 'Essential crawling & keywords tools',
      features: [
        '5 Single site audits / month',
        '25 Keyword research queries / month',
        '1 Active automated crawling bot',
        '2 Content drafts generated / month',
        'Standard metadata markup builders'
      ],
      cta: 'Current Plan',
      tierVal: 'Free' as const,
      disabled: userSession.tier === 'Free'
    },
    {
      name: 'Pro',
      price: '$129',
      interval: 'month',
      tagline: 'The ultimate suite for local interior designers',
      features: [
        'Unlimited SEO site audits & crawler jobs',
        'Deep organic competitor gap analytics',
        '5 High-frequency autonomous spider bots',
        '100 Full-pillar styled articles / month',
        'Cloudflare Edge Firewalls enabled',
        'AI JSON-LD schema creators'
      ],
      cta: 'Upgrade to Professional',
      tierVal: 'Pro' as const,
      disabled: userSession.tier === 'Pro',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: '$499',
      interval: 'month',
      tagline: 'A global system for high-end home decor retail brands',
      features: [
        'Dedicated server-side Gemini clusters',
        'White-label executive report builders',
        'Custom webhook publishing (Shopify/WP)',
        'Full security log stream exports',
        'Custom anchor linking silo auto-injectors',
        '24/7 dedicated SEO engineer support'
      ],
      cta: 'Acquire Corporate Clearance',
      tierVal: 'Enterprise' as const,
      disabled: userSession.tier === 'Enterprise'
    }
  ];

  const handleCompileWhiteLabelProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const mockProposal = {
      id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      agencyName,
      compiledAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      notes: proposalNotes,
      stats: {
        seoRevenueOpportunity: calculatedGrossMonthlyRedesignsRevenue,
        organicLeadPipeline: projectAcquisitionsFromOrganicPerMonth,
        ppcBlowingSavings: calculatedTrafficSavingsFromSEO,
        targetKeywordsCount: db.keywords ? db.keywords.length : 12,
        highPriorityAuditIssues: db.issues ? db.issues.filter(i => i.status === 'pending').length : 3
      }
    };
    setExportedProposal(mockProposal);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro section */}
      <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'} space-y-1.5`}>
        <div className="flex items-center gap-2">
          <span className="p-1 px-2 text-[9px] font-mono bg-indigo-550/10 text-indigo-400 border border-indigo-500/20 rounded font-bold">
            BUSINESS PLANNING UTILITY
          </span>
          <span className="text-[10px] text-slate-500 font-mono">MS INTERIOR DECORATION Integration Suite</span>
        </div>
        <h2 className={`text-lg font-bold uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Organic Growth ROI Architect & Proposal Compiler
        </h2>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          Estimate high-fidelity organic client leads, calculate precise search budget cost savings relative to high PPC bidding, and instantly compile beautifully-branded blueprints for prospective residential or commercial clients.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Client ROI Calculator */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-205'} space-y-4`}>
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/10">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs uppercase font-mono tracking-wider font-extrabold text-slate-250">
              Agency Client ROI Projection Calculator
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure target metrics below to visually present potential organic growth revenue to luxury design firms, proving why organic content silos represent massive cost savings relative to high PPC ad bidding.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1 bg-[#0a0c10]/40 p-3 rounded-xl border border-slate-850">
              <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Organic Traffic Goal</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={estMonthlyVisitors}
                  onChange={(e) => setEstMonthlyVisitors(parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-mono bg-transparent border-none text-emerald-450 font-bold focus:outline-none focus:ring-none p-0"
                />
                <span className="text-[10px] text-slate-500">visitors/mo</span>
              </div>
              <input
                type="range"
                min={1000}
                max={50000}
                step={1000}
                value={estMonthlyVisitors}
                onChange={(e) => setEstMonthlyVisitors(parseInt(e.target.value))}
                className="w-full accent-emerald-555 h-1 bg-slate-800 rounded-lg cursor-pointer mt-2"
              />
            </div>

            <div className="space-y-1 bg-[#0a0c10]/40 p-3 rounded-xl border border-slate-850">
              <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Conversion Rate (Redesign Lead)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-mono bg-transparent border-none text-indigo-400 font-bold focus:outline-none focus:ring-none p-0"
                />
                <span className="text-[10px] text-slate-500">% CR</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={10.0}
                step={0.1}
                value={conversionRate}
                onChange={(e) => setConversionRate(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 bg-[#0a0c10]/40 p-3 rounded-xl border border-slate-850">
              <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Average Project Redesign Ticket</label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">$</span>
                <input
                  type="text"
                  value={avgProjectTicket}
                  onChange={(e) => setAvgProjectTicket(parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-mono bg-transparent border-none text-amber-450 font-bold focus:outline-none focus:ring-none p-0"
                />
                <span className="text-[10px] text-slate-500">USD</span>
              </div>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={avgProjectTicket}
                onChange={(e) => setAvgProjectTicket(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer mt-2"
              />
            </div>

            <div className="space-y-1 bg-[#0a0c10]/40 p-3 rounded-xl border border-slate-850">
              <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Monthly PPC Bidding Savings</label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">$</span>
                <input
                  type="text"
                  value={averageMonthlyPpcAdBudget}
                  onChange={(e) => setAverageMonthlyPpcAdBudget(parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-mono bg-transparent border-none text-rose-400 font-bold focus:outline-none focus:ring-none p-0"
                />
                <span className="text-[10px] text-slate-500">USD / mo</span>
              </div>
              <input
                type="range"
                min={500}
                max={25000}
                step={500}
                value={averageMonthlyPpcAdBudget}
                onChange={(e) => setAverageMonthlyPpcAdBudget(parseInt(e.target.value))}
                className="w-full accent-rose-455 h-1 bg-slate-800 rounded-lg cursor-pointer mt-2"
              />
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0a0c10] border-emerald-950/30' : 'bg-emerald-50/20 border-emerald-100/50'} space-y-3`}>
            <span className="text-[10px] font-mono font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Calculated High-End Client Capture Metrics:</span>
            </span>

            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
              <div className="bg-[#0f1218]/40 p-2 rounded border border-slate-850">
                <span className="text-[9px] text-slate-500 block uppercase">Client Leads/Mo</span>
                <span className="font-extrabold text-emerald-300">{projectAcquisitionsFromOrganicPerMonth} acquisitions</span>
              </div>

              <div className="bg-[#0f1218]/40 p-2 rounded border border-slate-850">
                <span className="text-[9px] text-slate-500 block uppercase">PPC Budget Retained</span>
                <span className="font-extrabold text-amber-450">${calculatedTrafficSavingsFromSEO.toLocaleString()} saved</span>
              </div>

              <div className="bg-[#0f1218]/40 p-2 rounded border border-slate-850">
                <span className="text-[9px] text-slate-500 block uppercase">Est. Monthly GMV</span>
                <span className="font-extrabold text-indigo-300">${calculatedGrossMonthlyRedesignsRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Branded White-label Report Proposal Panel */}
        <div className="space-y-4">
          
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-205'} space-y-4`}>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800/10">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs uppercase font-mono tracking-wider font-extrabold text-slate-250">
                Custom White-label Proposal Compiler
              </h3>
            </div>

            <form onSubmit={handleCompileWhiteLabelProposal} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Consulting Agency Brand Name</label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Theme Palette Accents</label>
                  <select
                    value={proposalColor}
                    onChange={(e) => setProposalColor(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="emerald">Emerald Botanical Green</option>
                    <option value="indigo">Royal Indigo Classic</option>
                    <option value="amber">Warm Amber Terrazzo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Executive Commentary Notes</label>
                <textarea
                  value={proposalNotes}
                  onChange={(e) => setProposalNotes(e.target.value)}
                  rows={2}
                  className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-350" />
                <span>Build White-Label Client Proposal</span>
              </button>
            </form>

            {/* Exported Proposal Viewport */}
            {exportedProposal && (
              <div className={`p-4 rounded-xl border relative shadow-lg ${
                isDarkMode ? 'bg-[#0a0c10] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                {/* Visual header */}
                <div className="flex justify-between items-start border-b border-dashed border-slate-800/10 pb-3">
                  <div>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold block w-fit mb-1.5">
                      AUDITED PARTNERSHIP PROPOSAL
                    </span>
                    <h5 className="font-bold text-white text-xs uppercase tracking-wide">{exportedProposal.agencyName}</h5>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Report Index: {exportedProposal.id} | {exportedProposal.compiledAt}</p>
                  </div>

                  <button
                    onClick={() => {
                      const text = JSON.stringify(exportedProposal, null, 2);
                      const element = document.createElement("a");
                      const file = new Blob([text], { type: 'text/plain' });
                      element.href = URL.createObjectURL(file);
                      element.download = `white_label_seo_proposal_${exportedProposal.id}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    title="Export report specs"
                    className="p-1 px-2 border border-slate-800 text-[10px] font-mono font-bold text-slate-400 hover:text-white rounded flex items-center gap-1 transition-all"
                  >
                    <Download className="w-3 h-3 text-indigo-400" /> EXPORT
                  </button>
                </div>

                <div className="space-y-3 pt-3 text-xs leading-normal font-sans text-slate-300">
                  <p className="italic text-slate-400">"{exportedProposal.notes}"</p>
                  
                  <div className="grid grid-cols-2 gap-3 font-mono bg-[#0f1218]/45 p-3 rounded-lg border border-slate-850 text-[11px]">
                    <div>
                      <span className="text-slate-500 uppercase text-[9px] block">Keywords Target Count</span>
                      <strong className="text-white">{exportedProposal.stats.targetKeywordsCount} Niche styling terms</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 uppercase text-[9px] block">Technical Fixes Backlog</span>
                      <strong className="text-rose-400">{exportedProposal.stats.highPriorityAuditIssues} critical warning fixes</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 uppercase text-[9px] block">Calculated Leads Capture Potential</span>
                      <strong className="text-emerald-400">+{exportedProposal.stats.organicLeadPipeline} clients / mo</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 uppercase text-[9px] block">Valuation of Organic Savings</span>
                      <strong className="text-amber-450">${exportedProposal.stats.ppcBlowingSavings.toLocaleString()} value / mo</strong>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider block pt-2 border-t border-dashed border-slate-800/10">
                    Calculated Monthly Value Capture Potential: <span className="font-extrabold text-emerald-400 font-mono">${exportedProposal.stats.seoRevenueOpportunity.toLocaleString()}</span>
                  </p>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
