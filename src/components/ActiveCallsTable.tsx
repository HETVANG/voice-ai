import React, { useState } from 'react';
import { MOCK_ACTIVE_CALLS } from '../data/mockScenarios';
import { ActiveCallRecord } from '../types/telecom';
import { Search, Filter, ShieldAlert, PhoneOff, Radio, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ActiveCallsTableProps {
  onSelectCall?: (call: ActiveCallRecord) => void;
}

export const ActiveCallsTable: React.FC<ActiveCallsTableProps> = ({ onSelectCall }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [calls, setCalls] = useState<ActiveCallRecord[]>(MOCK_ACTIVE_CALLS);

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.callerCLI.includes(searchQuery) ||
      call.targetNumber.includes(searchQuery) ||
      call.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.cellTower.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    const matchesLang = languageFilter === 'all' || call.language === languageFilter;

    return matchesSearch && matchesStatus && matchesLang;
  });

  const handleSeverCall = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCalls((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'call_severed', riskScore: 0 } : c
      )
    );
  };

  const getStatusBadge = (status: ActiveCallRecord['status']) => {
    switch (status) {
      case 'active_monitoring':
        return <span className="text-amber-400 font-mono text-xs">Monitoring</span>;
      case 'warning_whispered':
        return <span className="text-sky-400 font-mono text-xs">Whisper Injected</span>;
      case 'call_severed':
        return <span className="text-rose-400 font-mono text-xs font-semibold">Trunk Severed</span>;
      case 'cleared':
        return <span className="text-emerald-400 font-mono text-xs">Nominal Cleared</span>;
      default:
        return <span className="text-slate-400 font-mono text-xs">{status}</span>;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Active Telecom Carrier Fleet Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Live SIP trunk sessions across Gujarat Circle exchanges with ASR fraud packet inspection.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CLI, Target, Tower..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-52"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="active_monitoring">Active Monitoring</option>
            <option value="warning_whispered">Whisper Injected</option>
            <option value="call_severed">Call Severed</option>
            <option value="cleared">Cleared</option>
          </select>

          {/* Language Filter */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Languages</option>
            <option value="gu">Gujarati (ગુજરાતી)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* High-Density Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
              <th className="py-2.5 px-3">Session ID</th>
              <th className="py-2.5 px-3">Caller CLI (Origin)</th>
              <th className="py-2.5 px-3">Target Citizen & Cell Tower</th>
              <th className="py-2.5 px-3">Dialect</th>
              <th className="py-2.5 px-3">Scam Vector</th>
              <th className="py-2.5 px-3 text-right">Risk Index</th>
              <th className="py-2.5 px-3">Carrier State</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredCalls.map((call) => (
              <tr
                key={call.id}
                className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                onClick={() => onSelectCall && onSelectCall(call)}
              >
                <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">
                  {call.id}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="font-mono text-slate-200">{call.callerCLI}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {call.isSpoofed ? 'VoIP Spoofed (High Risk)' : 'Standard Telecom Route'}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-medium text-slate-100">{call.targetName}</div>
                  <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                    {call.cellTower}
                  </div>
                </td>
                <td className="py-3 px-3 uppercase font-mono text-slate-300">
                  {call.language === 'gu' ? 'Gujarati' : call.language === 'hi' ? 'Hindi' : 'English'}
                </td>
                <td className="py-3 px-3 capitalize text-slate-300 whitespace-nowrap">
                  {call.scamType.replace(/_/g, ' ')}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                  <span
                    className={
                      call.riskScore >= 80
                        ? 'text-rose-400'
                        : call.riskScore >= 50
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }
                  >
                    {call.riskScore}%
                  </span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  {getStatusBadge(call.status)}
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  {call.status !== 'call_severed' && call.riskScore > 50 && (
                    <button
                      onClick={(e) => handleSeverCall(call.id, e)}
                      className="px-2.5 py-1 text-xs font-semibold bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-300 rounded transition-colors"
                      title="Terminate Call Trunk"
                    >
                      Sever Call
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCalls.length === 0 && (
        <div className="text-center py-8 text-xs text-slate-500 font-mono">
          No telecom sessions match the specified filter parameters.
        </div>
      )}
    </div>
  );
};
