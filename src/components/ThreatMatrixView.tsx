import React, { useState } from 'react';
import { FRAUD_TAXONOMY } from '../data/mockScenarios';
import { ShieldAlert, AlertTriangle, BookOpen, MapPin, ExternalLink, CheckCircle } from 'lucide-react';

export const ThreatMatrixView: React.FC = () => {
  const [selectedTaxonomy, setSelectedTaxonomy] = useState(FRAUD_TAXONOMY[0]);

  const regionalHotspots = [
    { city: 'Ahmedabad (SG Highway / Vastrapur / Bodakdev)', alertCount: 1420, trend: '+14% MoM', primaryRisk: 'Digital Arrest & KYC Phishing' },
    { city: 'Gandhinagar (Infocity / Sector 0 Tech Corridor)', alertCount: 890, trend: '+8% MoM', primaryRisk: 'Courier & Customs Contraband Scams' },
    { city: 'Surat (Diamond Bourse / Varachha / Katargam)', alertCount: 1180, trend: '+22% MoM', primaryRisk: 'PGVCL Power Cutoff & WhatsApp Loan Trap' },
    { city: 'Vadodara (Alkapuri / Makarpura)', alertCount: 640, trend: '+5% MoM', primaryRisk: 'Utility Disconnection & Remote APK Fraud' },
    { city: 'Rajkot (Yagnik Road / Kalawad Road)', alertCount: 520, trend: '+9% MoM', primaryRisk: 'Bank KYC & Aadhaar OTP Extortion' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Cyber Crime Prevention Intelligence
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Gujarat Telecom Fraud Matrix & TRAI Taxonomy
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Standardized classification ruleset compiled for Garbathon 2026 (GDG Ahmedabad). 
              Covers regional psychological coercion patterns, linguistic code-switching triggers across Gujarati, Hindi, and English, and automated AI defensive whisper protocols.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-950 p-3 rounded border border-slate-800 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">National Helpline</div>
              <div className="text-lg font-bold font-mono text-emerald-400">1930 / cybercrime.gov.in</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Taxonomy List (Left) + Detailed Deep Dive (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Taxonomy Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-1">
            Modus Operandi Catalog
          </div>
          {FRAUD_TAXONOMY.map((tax) => (
            <div
              key={tax.code}
              onClick={() => setSelectedTaxonomy(tax)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedTaxonomy.code === tax.code
                  ? 'bg-slate-800/90 border-emerald-500/80 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold text-emerald-400">
                  {tax.code}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    tax.severity === 'CRITICAL'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                  }`}
                >
                  {tax.severity}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">
                {tax.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                {tax.modusOperandi}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>{tax.statGjAhmedabad}</span>
                <span className="font-mono text-slate-500">{tax.languages.join(' · ')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Deep Dive Dossier */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {selectedTaxonomy.code} SPECIFICATION
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedTaxonomy.name}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Jurisdiction: Pan-India / Gujarat
              </span>
            </div>

            {/* Modus Operandi Explanation */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Modus Operandi & Psychological Coercion
              </div>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800/80">
                {selectedTaxonomy.modusOperandi}
              </p>
            </div>

            {/* Trigger Keywords in Gujarati, Hindi & English */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Acoustic & Linguistic Fraud Signatures
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTaxonomy.triggerTokens.map((token, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1 text-xs rounded bg-slate-950 border border-slate-800 text-slate-200 font-mono"
                  >
                    "{token}"
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Metric */}
            <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div className="text-xs text-rose-200">
                <span className="font-semibold">Reported Threat Level in Gujarat: </span>
                {selectedTaxonomy.statGjAhmedabad}. Primary targets are senior citizens and tech professionals.
              </div>
            </div>
          </div>

          {/* Regional Telecom Cluster Telemetry */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs uppercase tracking-wider text-slate-200 font-semibold">
                  Gujarat Telecom Circle Hotspots
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                BSNL / Jio / Airtel Exchange Feeds
              </span>
            </div>

            <div className="space-y-2">
              {regionalHotspots.map((hotspot) => (
                <div
                  key={hotspot.city}
                  className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800/80 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-medium text-slate-200">{hotspot.city}</div>
                    <div className="text-[11px] text-slate-400">{hotspot.primaryRisk}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-slate-200 font-bold tabular-nums">
                      {hotspot.alertCount} Intercepts
                    </div>
                    <div className="text-[10px] text-rose-400 font-mono">{hotspot.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
