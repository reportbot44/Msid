import React, { useState, useEffect } from 'react';
import { DatabaseSchema, BlogPost } from '../types';
import { 
  Sparkles, 
  Settings, 
  Gauge, 
  Eye, 
  FileEdit, 
  Check, 
  Plus, 
  RefreshCw, 
  AlertCircle,
  FileText,
  Bookmark,
  ChevronDown,
  BookOpen
} from 'lucide-react';

interface ContentGeneratorViewProps {
  db: DatabaseSchema;
  isDarkMode: boolean;
  preselectedKeywords: string[];
  onGeneratePost: (title: string, keywords: string[], tone: string, outline: string) => Promise<BlogPost>;
  setTab: (tab: string) => void;
  onClearPreselectedIndex: () => void;
}

export default function ContentGeneratorView({ 
  db, 
  isDarkMode, 
  preselectedKeywords, 
  onGeneratePost, 
  setTab,
  onClearPreselectedIndex
}: ContentGeneratorViewProps) {
  const [title, setTitle] = useState('');
  const [outline, setOutline] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'geeky' | 'creative' | 'persuasive'>('professional');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [customKeyword, setCustomKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDraft, setActiveDraft] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    if (preselectedKeywords.length > 0) {
      // Safely insert keywords sent from research tab
      setSelectedKeywords(prev => Array.from(new Set([...prev, ...preselectedKeywords])));
      if (!title) {
        setTitle(`The Masterclass Guide to ${preselectedKeywords[0]}`);
      }
      onClearPreselectedIndex();
    }
  }, [preselectedKeywords]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedKeywords.length === 0) return;
    setIsLoading(true);
    setActiveTab('preview');
    try {
      const draft = await onGeneratePost(title, selectedKeywords, tone, outline);
      setActiveDraft(draft);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectKeyword = (kw: string) => {
    setSelectedKeywords(prev => 
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    );
  };

  const handleAddCustomKeyword = () => {
    if (customKeyword.trim() && !selectedKeywords.includes(customKeyword.trim())) {
      setSelectedKeywords(prev => [...prev, customKeyword.trim()]);
      setCustomKeyword('');
    }
  };

  // On-page SEO checking checks
  const getOnPageAnalysis = (draft: BlogPost | null) => {
    if (!draft) return [];
    
    const checks = [
      { text: "Title contains primary keyword", status: draft.title.toLowerCase().includes(draft.keywordsUsed[0]?.toLowerCase() || 'xyz') },
      { text: "Word count exceeds 700 units", status: draft.wordCount >= 700 },
      { text: "Meta description matches limits", status: draft.metaDescription.length > 80 && draft.metaDescription.length <= 160 },
      { text: "Organic headers density match (H2/H3 counts)", status: draft.content.includes('##') },
      { text: "SEO Score is optimized above 85", status: draft.seoScore >= 85 }
    ];
    return checks;
  };

  const checks = getOnPageAnalysis(activeDraft);

  return (
    <div id="content-generator-view" className="space-y-6">
      
      {/* View Header */}
      <div>
        <h2 className={`text-2xl font-sans font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          AI SEO Article Writer & Optimizer
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Generate structurally complete, long-form blog articles optimized with schema titles, custom descriptions, and correct entity densities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Creation Panel controls */}
        <div className="lg:col-span-4 space-y-4">
          <form onSubmit={handleCreatePost} className={`p-5 rounded-xl border space-y-4 ${
            isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              <Settings className="w-4 h-4 text-teal-400" />
              <span>Generation Parameters</span>
            </h3>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label htmlFor="article-title" className="text-xs font-semibold text-slate-400">Target Core Title</label>
              <input
                id="article-title"
                type="text"
                required
                placeholder="e.g. Masterclass guide to semantic indexing models"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500`}
              />
            </div>

            {/* Target Keywords select checklist pill list */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Inject Target Keywords</span>
                <span className="text-[10px] text-teal-400 font-mono font-bold uppercase">{selectedKeywords.length} selected</span>
              </label>

              {/* Keyword Pills selection box wrapper */}
              <div className={`p-2 border border-slate-800 rounded-lg max-h-[110px] overflow-y-auto flex flex-wrap gap-1.5 ${
                isDarkMode ? 'bg-[#0a0c10]' : 'bg-slate-50'
              }`}>
                {db.keywords.length === 0 ? (
                  <span className="text-[10px] text-slate-500 p-1">No keywords available. Search in keywords tab first.</span>
                ) : (
                  db.keywords.map((item) => {
                    const isChecked = selectedKeywords.includes(item.keyword);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleSelectKeyword(item.keyword)}
                        className={`px-2 py-1 rounded text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer truncate max-w-[150px] ${
                          isChecked 
                            ? 'bg-teal-500/10 border border-teal-500 text-teal-400' 
                            : 'bg-slate-800/45 border border-slate-705 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-teal-400 flex-shrink-0" />}
                        <span>{item.keyword}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Custom Keyword Adder */}
              <div className="flex gap-2">
                <input
                  id="custom-kw-input"
                  type="text"
                  placeholder="Add custom keyword..."
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#0a0c10] border border-slate-800 rounded-lg text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  id="add-custom-kw-btn"
                  type="button"
                  onClick={handleAddCustomKeyword}
                  className="px-3 bg-slate-800 text-slate-200 text-xs rounded-lg hover:bg-slate-700 transition-all font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Voice Tone Selector */}
            <div className="space-y-1.5">
              <label htmlFor="voice-tone" className="text-xs font-semibold text-slate-400">Brand Voice Tone</label>
              <select
                id="voice-tone"
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="professional">Professional / Analytical</option>
                <option value="casual">Casual / Narrative</option>
                <option value="geeky">Deep Tech / Code Oriented</option>
                <option value="creative">Creative / Visionary</option>
                <option value="persuasive">Persuasive / Sales Catalyst</option>
              </select>
            </div>

            {/* Customized outline constraints */}
            <div className="space-y-1.5">
              <label htmlFor="custom-outline" className="text-xs font-semibold text-slate-400">Sub-headings & Structure Outline (optional)</label>
              <textarea
                id="custom-outline"
                placeholder="Introduction, Semantic framework advantages, Case studies, Schema steps..."
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none font-sans"
              />
            </div>

            {/* Run Button */}
            <button
              id="generate-article-btn"
              type="submit"
              disabled={isLoading || !title || selectedKeywords.length === 0}
              className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-500/10 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-950" />
                  <span>Generate Complete Article</span>
                </>
              )}
            </button>
          </form>

          {/* Active SEO audit crawler analyzer scorecard triggers */}
          {activeDraft && (
            <div id="seo-score-gauge" className={`p-4 rounded-xl border flex flex-col space-y-3 ${
              isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Indexed Content Analysis</span>
                <span className={`text-base font-mono font-bold ${
                  activeDraft.seoScore >= 90 ? 'text-emerald-400' : 'text-amber-400'
                }`}>{activeDraft.seoScore}/100 Score</span>
              </div>

              {/* Quick checks list rendering */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] font-sans">
                    <span className="text-slate-400">{check.text}</span>
                    <span className={`font-mono font-bold ${check.status ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {check.status ? "PASS" : "WARN"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Markdown Previewer / Generated Display */}
        <div id="content-preview-container" className="lg:col-span-8 flex flex-col space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex gap-2">
              <button
                id="tab-edit"
                onClick={() => setActiveTab('editor')}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'editor'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <FileEdit className="w-4 h-4" />
                  <span>Meta Information</span>
                </div>
              </button>
              <button
                id="tab-prev"
                onClick={() => setActiveTab('preview')}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>Article Preview</span>
                </div>
              </button>
            </div>

            {activeDraft && (
              <span className="text-[10px] text-slate-500 font-mono tracking-wider font-bold">
                CRAWL PATH:  {activeDraft.slug}  |  {activeDraft.wordCount} WORDS
              </span>
            )}
          </div>

          {!activeDraft ? (
            <div className="flex-grow p-12 text-center border-2 border-dashed border-slate-800 rounded-xl flex flex-col justify-center items-center space-y-3 bg-[#0f1218]/20 min-h-[400px]">
              <FileText className="w-12 h-12 text-slate-600 animate-pulse" />
              <p className="text-xs font-bold text-white">No article generated in current session</p>
              <p className="text-[10px] text-slate-500 max-w-sm">Configure target parameters on left sidebar, add highCPC search target keywords, and click Generate Article.</p>
            </div>
          ) : (
            <div className={`p-6 rounded-xl border flex-grow min-h-[400px] overflow-y-auto ${
              isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}>
              {activeTab === 'editor' ? (
                /* Meta Config Tab */
                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-teal-400 uppercase">Search Engine snippet mockup</span>
                  
                  {/* Google Snippet Box */}
                  <div className="p-4 bg-[#0a0c10] border border-slate-800 rounded-xl space-y-1.5 shadow">
                    <span className="text-[10px] text-slate-405 truncate flex items-center gap-1">
                      <span>{db.domain}</span>
                      <span className="text-[8px]">▶ sitemap ▶ {activeDraft.slug}</span>
                    </span>
                    <h4 className="text-[15px] font-sans text-blue-400 hover:underline cursor-pointer tracking-tight font-medium leading-tight">
                      {activeDraft.metaTitle}
                    </h4>
                    <p className="text-xs text-slate-350 leading-normal">
                      {activeDraft.metaDescription}
                    </p>
                  </div>

                  {/* Core Form data elements for view editing */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400">Meta Title</span>
                      <input
                        id="meta-title-view"
                        type="text"
                        value={activeDraft.metaTitle}
                        onChange={(e) => setActiveDraft({ ...activeDraft, metaTitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400">Slug Handle</span>
                      <input
                        id="meta-slug-view"
                        type="text"
                        value={activeDraft.slug}
                        onChange={(e) => setActiveDraft({ ...activeDraft, slug: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 font-sans">Meta Description Snippet ({activeDraft.metaDescription.length}/160)</span>
                    <textarea
                      id="meta-description-view"
                      rows={3}
                      value={activeDraft.metaDescription}
                      onChange={(e) => setActiveDraft({ ...activeDraft, metaDescription: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0a0c10] border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                /* Actual rendered blog tab display */
                <article className="prose prose-invert max-w-none text-xs text-slate-300 space-y-4 font-sans leading-relaxed">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bookmark className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-[10px] font-mono text-teal-400 font-bold uppercase uppercase leading-none">Published under Sitemaps</span>
                    </div>
                    <h1 className={`text-xl sm:text-2xl font-bold font-sans ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                      {activeDraft.title}
                    </h1>
                  </div>

                  {/* Quick markdown interpreter loop */}
                  <div className="space-y-3 whitespace-pre-wrap font-sans text-slate-350 bg-[#0a0c10] p-4 border border-slate-800 font-sans rounded-xl leading-relaxed text-sm">
                    {activeDraft.content}
                  </div>
                </article>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
