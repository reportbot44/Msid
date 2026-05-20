import React from 'react';
import { UserSession } from '../types';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Bot, 
  Cpu, 
  Layers, 
  Settings, 
  LogOut, 
  Globe, 
  Moon, 
  Sun,
  Flame,
  User,
  BarChart3,
  ShieldCheck,
  Code,
  Coins
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  userSession: UserSession;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Sidebar({ 
  currentTab, 
  setTab, 
  userSession, 
  onLogout, 
  isDarkMode, 
  toggleTheme 
}: SidebarProps) {
  
  const navItems = [
    { id: 'dashboard', label: 'SEO Console Hub', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'keywords', label: 'Keyword Research', icon: Search },
    { id: 'scraping-audit', label: 'AI Scraper & Audits', icon: ShieldCheck },
    { id: 'gap-analysis', label: 'Competitor Content Gap', icon: Layers },
    { id: 'topic-clustering', label: 'Topic Clustering Hub', icon: Cpu },
    { id: 'content-generator', label: 'AI Blog Writer', icon: FileText },
    { id: 'autonomous-agents', label: 'Autonomous AI Agents', icon: Bot },
    { id: 'schema-suite', label: 'Google Rich Snippets', icon: Code },
    { id: 'monetization', label: 'Client ROI & Proposals', icon: Coins },
    { id: 'settings', label: 'API & Settings', icon: Settings }
  ];

  return (
    <aside id="dashboard-sidebar" className={`w-64 border-r flex flex-col justify-between transition-all duration-200 z-50 ${
      isDarkMode 
        ? 'bg-[#0f1218] border-slate-800 text-slate-200' 
        : 'bg-white border-slate-200 text-slate-700'
    }`}>
      {/* Brand & Logo */}
      <div className="flex flex-col">
        <div className={`p-5 border-b flex items-center gap-3 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className={`text-xs font-sans font-extrabold leading-tight tracking-wider select-none truncate ${
              isDarkMode ? 'text-indigo-400' : 'text-indigo-900'
            }`}>
              MS INTERIOR
            </h1>
            <span className="text-[9px] uppercase font-mono tracking-widest font-extrabold text-slate-500 block">DECORATION</span>
          </div>
        </div>

        {/* Current Working Domain Tracker */}
        <div className={`mx-4 mt-4 p-3 rounded-xl flex items-center gap-2 border ${
          isDarkMode 
            ? 'bg-[#0a0c10] border-slate-800 text-slate-300' 
            : 'bg-slate-50 border-slate-100 text-slate-600'
        }`}>
          <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Tracked Property</span>
            <span className="text-xs font-semibold truncate font-mono">{userSession.domain || 'none'}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 flex-grow">
          <div className={`text-[10px] uppercase tracking-wider font-semibold mb-2 px-2 ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>Main Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                id={`sidebar-item-${item.id}`}
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all relative ${
                  isActive
                    ? (isDarkMode 
                        ? 'bg-slate-800/50 text-white border border-slate-700/50'
                        : 'bg-teal-50 text-teal-700 font-bold border-l-2 border-teal-500 pl-2.5')
                    : (isDarkMode
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`} />
                <span>{item.label}</span>
                {item.id === 'autonomous-agents' && (
                  <span className="ml-auto flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Controls & Dark Mode */}
      <div className={`p-4 border-t flex flex-col space-y-3 ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}>
        {/* Connection Mode & Theme Toggle */}
        <div className="flex items-center justify-between">
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg border flex items-center gap-2 hover:opacity-90 text-[10px] font-mono leading-none font-bold uppercase transition-all ${
              isDarkMode 
                ? 'bg-[#0a0c10] border-slate-800 text-slate-400 hover:text-white' 
                : 'bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Theme: Dark</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Theme: Light</span>
              </>
            )}
          </button>

          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold leading-none bg-indigo-505/10 text-indigo-400 border border-indigo-500/20">
            EXECUTIVE ACCESS
          </span>
        </div>

        {/* User Card */}
        <div className={`p-2 rounded-xl flex items-center justify-between gap-3 border ${
          isDarkMode 
            ? 'bg-[#0a0c10] border-slate-800' 
            : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
            <User className={`w-4 h-4 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} />
          </div>
          <div className="flex-grow min-w-0">
            <p className={`text-[11px] font-bold truncate ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              {userSession.email?.split('@')[0] || 'admin'}
            </p>
            <p className="text-[9px] text-slate-500 truncate font-mono">
              {userSession.email}
            </p>
          </div>
          <button
            id="logout-btn"
            onClick={onLogout}
            title="Disconnect console"
            className={`p-1.5 rounded-lg transition-all ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-rose-400' : 'hover:bg-slate-200 text-slate-600 hover:text-rose-600'
            }`}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
