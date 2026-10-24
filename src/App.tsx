/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, DashboardTab } from './components/Header';
import { SimpleShieldMain } from './components/SimpleShieldMain';
import { LiveCallInterceptor } from './components/LiveCallInterceptor';
import { ActiveCallsTable } from './components/ActiveCallsTable';
import { ThreatMatrixView } from './components/ThreatMatrixView';
import { CustomCallSimulator } from './components/CustomCallSimulator';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('simple_shield');
  const [isGlobalSevered, setIsGlobalSevered] = useState(false);
  const [keyReset, setKeyReset] = useState(0);

  const handleTriggerEmergencyDrop = () => {
    setIsGlobalSevered(true);
  };

  const handleResetCall = () => {
    setIsGlobalSevered(false);
    setKeyReset(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Contract Compliant Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerEmergencyDrop={handleTriggerEmergencyDrop}
        isCallSevered={isGlobalSevered}
        onResetCall={handleResetCall}
      />

      {/* Main Workspace Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Contextual Sub-bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">System Mode:</span>
            <span className="font-mono text-emerald-400">
              {activeTab === 'simple_shield' ? 'CITIZEN-SHIELD-V2' : 'CARRIER-TELECOM-OPERATIONS'}
            </span>
            <span className="text-slate-600">/</span>
            <span>Garbathon '26 Fraud Defense Gateway</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">
              Active Dialects: <strong className="text-slate-200">Gujarati · Hindi · English</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              National Helpline: <strong className="text-emerald-400">1930</strong>
            </span>
          </div>
        </div>

        {/* Global Severed Call Notification Banner */}
        {isGlobalSevered && (
          <div className="bg-rose-950/60 border border-rose-800/80 rounded-lg p-3 text-xs text-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>CARRIER EMERGENCY DROP ACTIVATED:</strong> SIP BYE packet sent. Inbound caller trunk severed to protect citizen.
              </span>
            </div>
            <button
              onClick={handleResetCall}
              className="px-2.5 py-1 text-[11px] font-semibold bg-rose-900 hover:bg-rose-800 text-white rounded transition-colors whitespace-nowrap ml-4"
            >
              Reset Trunk State
            </button>
          </div>
        )}

        {/* Dynamic Tab Content */}
        {activeTab === 'simple_shield' && (
          <SimpleShieldMain onOpenAdvancedConsole={() => setActiveTab('interceptor')} />
        )}

        {activeTab === 'interceptor' && (
          <LiveCallInterceptor key={`interceptor-${keyReset}`} />
        )}

        {activeTab === 'telecom_fleet' && (
          <ActiveCallsTable
            onSelectCall={() => {
              setActiveTab('interceptor');
            }}
          />
        )}

        {activeTab === 'threat_matrix' && (
          <ThreatMatrixView />
        )}

        {activeTab === 'simulator' && (
          <CustomCallSimulator />
        )}
      </main>

      {/* Clean quiet footer */}
      <footer className="border-t border-slate-900 mt-12 py-6 text-center text-xs text-slate-400">
        <p>
          Scam Call Shield · Garbathon 2026 (GDG Ahmedabad) · AI-Powered Telecom Fraud Defense
        </p>
      </footer>
    </div>
  );
}
