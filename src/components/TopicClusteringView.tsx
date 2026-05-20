import React, { useState } from 'react';
import { DatabaseSchema, TopicCluster } from '../types';
import { 
  Cpu, 
  Layers, 
  Sparkles, 
  HelpCircle, 
  VolumeX, 
  Share2, 
  Plus, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  FolderMinus,
  AlertCircle
} from 'lucide-react';

interface TopicClusteringViewProps {
  db: DatabaseSchema;
  isDarkMode: boolean;
  onClustering: (keywords: string[]) => Promise<void>;
}

export default function TopicClusteringView({ db, isDarkMode, onClustering }: TopicClusteringViewProps) {
  const [selectedKws, setSelectedKws] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customWord, setCustomWord] = useState('');

  const handleToggleKw = (kw: string) => {
    setSelectedKws(prev => 
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    );
  };

  const handleSelectAll = () => {
    if (selectedKws.length === db.keywords.length) {
      setSelectedKws([]);
    } else {
      setSelectedKws(db.keywords.map(k => k.keyword));
    }
  };

  const handleRunClusterAnalysis = async () => {
    if (selectedKws.length === 0) return;
    setIsLoading(true);
    try {
      await onClustering(selectedKws);
      setSelectedKws([]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="clustering-view" className="space-y-6">
      
      {/* View Header */}
      <div>
        <h2 className={`text-2xl font-sans font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Natural Language Topic Clustering Engine
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Cluster disparate target search keywords into structured, high-authority parent topical hubs. Map pillar content topics and intent groupings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Side Selector box */}
        <div className={`lg:col-span-4 p-5 rounded-xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Select Input Keywords</h3>
              <button
                id="select-all-kws-btn"
                type="button"
                onClick={handleSelectAll}
                className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold hover:underline"
              >
                Toggle Selection
              </button>
            </div>

            {/* Render checklist of all active keyword search entries */}
            <div className={`p-2 border border-slate-800 rounded-lg max-h-[220px] overflow-y-auto space-y-1 ${
              isDarkMode ? 'bg-[#0a0c10]' : 'bg-white'
            }`}>
              {db.keywords.length === 0 ? (
                <p className="text-[10px] text-slate-500 p-2">No researched keywords available. Seed keyword entries first.</p>
              ) : (
                db.keywords.map((kw) => {
                  const isChecked = selectedKws.includes(kw.keyword);
                  return (
                    <button
                      key={kw.id}
                      type="button"
                      onClick={() => handleToggleKw(kw.keyword)}
                      className={`w-full flex items-center justify-between p-2 rounded text-xs transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-teal-500/10 text-teal-400 font-semibold' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      <span className="truncate max-w-[180px]">{kw.keyword}</span>
                      <span className="font-mono text-[9px] text-slate-500">Vol: {kw.volume}</span>
                    </button>
                  );
                })
              )}
            </div>

            <div className={`p-3 border border-slate-800 rounded-lg flex items-center gap-2 text-[10px] text-slate-500 leading-normal ${
              isDarkMode ? 'bg-[#0a0c10]' : 'bg-slate-50'
            }`}>
              <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>We group words using cosine semantic matching. Selected words will map to their primary pillar hubs.</span>
            </div>
          </div>

          <button
            id="run-clustering-btn"
            disabled={isLoading || selectedKws.length === 0}
            onClick={handleRunClusterAnalysis}
            className="w-full mt-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                <span>Cluster Selected Keywords ({selectedKws.length})</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side: Render Visual Group blocks of current clustered topic centers */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-850'}`}>Active Semantic Topical Hubs</h3>
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">{db.clusters.length} parent clusters</span>
          </div>

          {db.clusters.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-xl flex flex-col justify-center items-center space-y-3 bg-slate-905 min-h-[300px]">
              <FolderMinus className="w-12 h-12 text-slate-650 animate-pulse" />
              <p className="text-xs font-bold text-white">No active topic clusters identified</p>
              <p className="text-[10px] text-slate-500 max-w-sm">Select keywords on the left panel checklist, click analyze to trigger Natural Language grouping clusters automatically.</p>
            </div>
          ) : (
            <div id="clustering-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {db.clusters.map((cluster) => (
                <div key={cluster.id} className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-tr from-teal-500/10 to-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between min-w-0">
                      <div>
                        <h4 className={`text-sm font-bold leading-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-850'}`}>
                          {cluster.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">intent: {cluster.mainIntent}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-mono font-bold">
                        {cluster.volume.toLocaleString()}/mo v
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-normal">{cluster.description}</p>
                  </div>

                  {/* Suggested Pillar Theme */}
                  <div className={`p-3 border rounded-lg space-y-1 ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-800' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className="text-[9px] uppercase font-bold text-teal-400 font-mono tracking-wide">Suggested Anchor Pillar Page:</span>
                    <p className={`text-xs font-bold font-sans truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{cluster.pillarTopic}</p>
                  </div>

                  {/* List of matched tags */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Matched search keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {cluster.keywords.map((kw, i) => (
                        <span key={i} className={`px-2 py-0.5 border text-[10px] font-mono rounded ${
                          isDarkMode ? 'bg-[#0a0c10] text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-205'
                        }`}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
