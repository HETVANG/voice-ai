import React from 'react';
import { ShieldAlert, PhoneOff, RefreshCw } from 'lucide-react';

export type DashboardTab = 'simple_shield' | 'interceptor' | 'telecom_fleet' | 'threat_matrix' | 'simulator';

interface HeaderProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onTriggerEmergencyDrop: () => void;
  isCallSevered: boolean;
  onResetCall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onTriggerEmergencyDrop,
  isCallSevered,
  onResetCall
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <button 
        onClick={() => setActiveTab('simple_shield')}
        className="flex items-center gap-3 shrink-0 text-left hover:opacity-90 transition-opacity"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            Scam Call Shield
          </span>
          <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">
            Garbathon '26 · GDG Ahmedabad
          </span>
        </div>
      </button>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('simple_shield')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 ${
            activeTab === 'simple_shield'
              ? 'text-emerald-400 border-b border-emerald-400 font-semibold'
              : ''
          }`}
        >
          Call Shield Analyzer
        </button>
        <button
          onClick={() => setActiveTab('interceptor')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 ${
            activeTab === 'interceptor'
              ? 'text-emerald-400 border-b border-emerald-400 font-semibold'
              : ''
          }`}
        >
          Live Call Interceptor
        </button>
        <button
          onClick={() => setActiveTab('telecom_fleet')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 ${
            activeTab === 'telecom_fleet'
              ? 'text-emerald-400 border-b border-emerald-400 font-semibold'
              : ''
          }`}
        >
          Active Fleet
        </button>
        <button
          onClick={() => setActiveTab('threat_matrix')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 ${
            activeTab === 'threat_matrix'
              ? 'text-emerald-400 border-b border-emerald-400 font-semibold'
              : ''
          }`}
        >
          Gujarat Threat Matrix
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 ${
            activeTab === 'simulator'
              ? 'text-emerald-400 border-b border-emerald-400 font-semibold'
              : ''
          }`}
        >
          AI Speech Tester
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onResetCall}
          title="Reset Active Session"
          className="p-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/60 rounded-md hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onTriggerEmergencyDrop}
          disabled={isCallSevered}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md flex items-center gap-2 transition-all whitespace-nowrap shrink-0 ${
            isCallSevered
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-900/40 active:scale-95'
          }`}
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>{isCallSevered ? 'Trunk Severed' : 'Carrier Kill Switch'}</span>
        </button>
      </div>
    </header>
  );
};
