import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Check, 
  CheckCheck, 
  Trash2, 
  Wifi, 
  WifiOff, 
  Signal, 
  X,
  Play
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationPanelProps {
  notifications: NotificationItem[];
  wsStatus: 'connecting' | 'connected' | 'disconnected';
  isDarkMode: boolean;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onTriggerSimulation: (type: 'ranking_change' | 'opportunity' | 'content_generation' | 'system_alert') => void;
}

export default function NotificationPanel({
  notifications,
  wsStatus,
  isDarkMode,
  onMarkRead,
  onMarkAllRead,
  onClearAll,
  onTriggerSimulation
}: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'content_generation':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'ranking_change':
        return <TrendingUp className="w-4 h-4 text-amber-500" />;
      case 'opportunity':
        return <Signal className="w-4 h-4 text-teal-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getNotifBadgeColor = (type: string) => {
    switch (type) {
      case 'content_generation':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/25';
      case 'ranking_change':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
      case 'opportunity':
        return 'bg-teal-500/10 text-teal-400 border border-teal-500/25';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Header Notification Action Buttons */}
      <div className="flex items-center gap-4">
        
        {/* Connection Status Bubble */}
        <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider border ${
          wsStatus === 'connected' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
            : wsStatus === 'connecting'
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/25 animate-pulse'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
        }`}>
          {wsStatus === 'connected' ? (
            <>
              <Wifi className="w-3 h-3" />
              <span>Real-time Live</span>
            </>
          ) : wsStatus === 'connecting' ? (
            <>
              <Signal className="w-3 h-3 animate-ping" />
              <span>Connecting</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span>Disconnected</span>
            </>
          )}
        </div>

        {/* WebSocket Broadcast Simulator Widgets */}
        <div className="hidden lg:flex items-center gap-1 py-1 px-2 border border-dashed rounded-lg border-slate-700/50 bg-slate-800/15">
          <span className="text-[9px] font-mono uppercase font-bold text-slate-500 mr-2">Simulate Websocket:</span>
          <button 
            id="sim-rank-btn"
            onClick={() => onTriggerSimulation('ranking_change')}
            className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 font-bold flex items-center gap-1 transition-all"
            title="Trigger a real WebSocket rank jump notification"
          >
            <Play className="w-2.5 h-2.5" /> Rank Jump
          </button>
          <button 
            id="sim-gap-btn"
            onClick={() => onTriggerSimulation('opportunity')}
            className="px-2 py-0.5 rounded text-[10px] bg-teal-500/10 hover:bg-teal-500/25 text-teal-400 font-bold flex items-center gap-1 transition-all"
            title="Trigger a real WebSocket gap discovery notification"
          >
            <Play className="w-2.5 h-2.5" /> Gap Alert
          </button>
          <button 
            id="sim-audit-btn"
            onClick={() => onTriggerSimulation('system_alert')}
            className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 font-bold flex items-center gap-1 transition-all"
            title="Trigger a real WebSocket technical audit alert"
          >
            <Play className="w-2.5 h-2.5" /> Audit Alert
          </button>
        </div>

        {/* Bell Icon Trigger */}
        <button
          id="notification-bell-icon"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
            isDarkMode 
              ? 'bg-[#0f1218] border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800' 
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span id="unread-notif-count" className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm font-mono animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div 
          id="notification-dropdown-view"
          className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border shadow-2xl z-[9999] overflow-hidden ${
            isDarkMode 
              ? 'bg-[#0f1218] border-slate-800 text-slate-200' 
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {/* Panel Header */}
          <div className={`p-4 flex items-center justify-between border-b ${
            isDarkMode ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold uppercase tracking-wide">Live Alerts</h4>
              <span className="px-2 py-0.5 text-[9px] font-bold font-mono rounded-full bg-indigo-500/10 text-indigo-400">
                {notifications.length} logged
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  id="mark-all-read-btn"
                  onClick={() => {
                    onMarkAllRead();
                  }}
                  title="Mark all as read"
                  className="p-1 rounded text-slate-400 hover:text-emerald-400 transition-all"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  id="clear-all-notif-btn"
                  onClick={onClearAll}
                  title="Clear all history"
                  className="p-1 rounded text-slate-400 hover:text-rose-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* List Section */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/20">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <Bell className="w-8 h-8 text-slate-600/30 mb-2 rotate-12" />
                <p className="text-xs text-slate-500 font-medium">All quiet here.</p>
                <p className="text-[10px] text-slate-500/80 font-mono mt-1">Real-time alerts show up here</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  id={`notif-${notif.id}`}
                  key={notif.id} 
                  className={`p-4 flex gap-3 transition-all relative ${
                    notif.isRead 
                      ? 'opacity-65' 
                      : isDarkMode 
                      ? 'bg-slate-800/10 border-l-2 border-indigo-500' 
                      : 'bg-slate-50 border-l-2 border-indigo-600'
                  }`}
                >
                  {/* Left Side Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getNotifBadgeColor(notif.type)}`}>
                    {getNotifIcon(notif.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-grow min-w-0 pr-4">
                    <p className="text-xs font-bold leading-tight">{notif.title}</p>
                    <p className={`text-[11px] mt-1 pr-1 font-medium leading-relaxed ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {notif.message}
                    </p>
                    <span className="text-[9px] font-mono text-slate-500 font-bold uppercase mt-2 block">
                      {formatTimeAgo(notif.createdAt)}
                    </span>
                  </div>

                  {/* Mark as read tick */}
                  {!notif.isRead && (
                    <button
                      id={`mark-read-${notif.id}`}
                      onClick={() => onMarkRead(notif.id)}
                      title="Mark read"
                      className="absolute right-3 top-4 p-1 hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 rounded-md transition-all shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className={`p-2.5 text-center border-t text-[9px] font-mono uppercase tracking-wider text-slate-500 bg-slate-805/5 font-semibold ${
            isDarkMode ? 'border-slate-800' : 'border-slate-100'
          }`}>
            WebSockets Connection ID: {(Math.random().toString(36).substring(4)).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
}
