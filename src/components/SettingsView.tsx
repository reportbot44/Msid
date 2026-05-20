import React, { useState } from 'react';
import { DatabaseSchema } from '../types';
import { 
  Settings, 
  Globe, 
  KeyRound, 
  Cpu, 
  Check, 
  AlertTriangle, 
  Server, 
  RefreshCw,
  FileCode
} from 'lucide-react';

interface SettingsViewProps {
  db: DatabaseSchema;
  isDarkMode: boolean;
  onSaveSettings: (domain: string, openaiKey: string, geminiModel: string) => void;
}

export default function SettingsView({ db, isDarkMode, onSaveSettings }: SettingsViewProps) {
  const [domain, setDomain] = useState(db.domain || 'my-saas-platform.com');
  const [openaiKey, setOpenaiKey] = useState(db.openaiKey || '');
  const [geminiModel, setGeminiModel] = useState(db.geminiModel || 'gemini-3.5-flash');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(domain.trim(), openaiKey.trim(), geminiModel);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-3xl">
      
      {/* View Header */}
      <div>
        <h2 className={`text-2xl font-sans font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Console API & Platform Settings
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Configure organic search crawl models, connect proxy SEO credentials, and manage active monitored sitemap properties.
        </p>
      </div>

      <form onSubmit={handleSave} className={`p-6 rounded-xl border space-y-6 ${
        isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Domain tracking setup */}
        <div className="space-y-2">
          <h3 className={`text-xs uppercase font-mono tracking-wider font-bold text-teal-400 flex items-center gap-1.5`}>
            <Globe className="w-4 h-4" />
            <span>Monitored Digital Domain Property</span>
          </h3>
          <p className="text-[10px] text-slate-500">The primary domain targeted during content audits, sitemap generation, and gap analysis simulations.</p>
          <div className="relative">
            <input
              id="settings-domain"
              type="text"
              required
              placeholder="my-company.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
            />
            <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* AI Model selections */}
        <div className="space-y-2 pt-2 border-t border-slate-850/60">
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>SEO Orchestrator Inference Model</span>
          </h3>
          <p className="text-[10px] text-slate-500">Choose the standard level of thinking applied by autonomous content generation tasks and clustering scripts.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              id="model-flash"
              type="button"
              onClick={() => setGeminiModel('gemini-3.5-flash')}
              className={`p-3 rounded-xl border text-left flex flex-col space-y-1 transition-all ${
                geminiModel === 'gemini-3.5-flash'
                  ? 'bg-teal-500/10 border-teal-500 text-teal-400 font-bold'
                  : 'bg-[#0a0c10] border-slate-800 text-slate-400 hover:text-slate-350'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs">Gemini 3.5 Flash</span>
                {geminiModel === 'gemini-3.5-flash' && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[9px] font-sans font-medium text-slate-500 uppercase leading-none mt-2">Best for generation speeds & general audits</span>
            </button>

            <button
              id="model-lite"
              type="button"
              onClick={() => setGeminiModel('gemini-3.1-flash-lite')}
              className={`p-3 rounded-xl border text-left flex flex-col space-y-1 transition-all ${
                geminiModel === 'gemini-3.1-flash-lite'
                  ? 'bg-teal-500/10 border-teal-500 text-teal-400 font-bold'
                  : 'bg-[#0a0c10] border-slate-800 text-slate-400 hover:text-slate-350'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs">Gemini 3.1 Flash Lite</span>
                {geminiModel === 'gemini-3.1-flash-lite' && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[9px] font-sans font-medium text-slate-500 uppercase leading-none mt-2">Zero-latency, optimized parsing weights</span>
            </button>
          </div>
        </div>

        {/* Credentials toggling proxy integrations */}
        <div className="space-y-2 pt-2 border-t border-slate-850/60">
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-400 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4" />
            <span>OpenAI API Key Proxy Integration</span>
          </h3>
          <p className="text-[10px] text-slate-500">Provide optional backup OpenAI secrets if you intend to stream direct comparative GPT audits inside your CMS sitemaps.</p>
          <div className="relative">
            <input
              id="settings-openai-key"
              type="password"
              placeholder="sk-proj-••••••••••••••••"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
            />
            <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* Safe feedback alerts messages */}
        <div className="p-3 bg-[#0a0c10] border border-slate-800 rounded-lg flex items-center gap-2 text-[10px] text-slate-500 leading-normal">
          <Server className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>Note: System is currently powered out-of-the-box by the built-in server-side Gemini API client key. No actions are required from your end to run the primary SEO engines.</span>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between border-t border-slate-850/60 pt-4">
          {isSaved ? (
            <span className="text-xs text-emerald-400 font-medium font-mono flex items-center gap-1 animate-pulse">
              <Check className="w-4 h-4" />
              <span>Platform sitemaps reconfigured successfully!</span>
            </span>
          ) : (
            <span />
          )}

          <button
            id="save-settings-btn"
            type="submit"
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-950" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
}
