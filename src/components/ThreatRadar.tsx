import React from 'react';
import { ThreatVectors, ScamType } from '../types/telecom';
import { AlertTriangle, ShieldCheck, UserX, Clock, Lock, CreditCard, Key } from 'lucide-react';

interface ThreatRadarProps {
  riskScore: number;
  vectors: ThreatVectors;
  scamType: ScamType;
  detectedKeywords: string[];
}

export const ThreatRadar: React.FC<ThreatRadarProps> = ({
  riskScore,
  vectors,
  scamType,
  detectedKeywords
}) => {
  const getSeverity = (score: number) => {
    if (score >= 85) return { label: 'CRITICAL THREAT', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
    if (score >= 60) return { label: 'ELEVATED RISK', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (score >= 30) return { label: 'SUSPICIOUS PATTERN', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };
    return { label: 'NOMINAL VERIFIED', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  };

  const severity = getSeverity(riskScore);

  const vectorItems = [
    {
      label: 'Authority Impersonation',
      score: vectors.impersonationScore,
      icon: UserX,
      desc: 'CBI, Police, PGVCL, SBI'
    },
    {
      label: 'Urgency & Pressure',
      score: vectors.urgencyLevel,
      icon: Clock,
      desc: '15-min cutoff, instant arrest'
    },
    {
      label: 'Isolation & Secrecy',
      score: vectors.isolationPressure,
      icon: Lock,
      desc: 'Do not disconnect, lock door'
    },
    {
      label: 'Financial Extortion',
      score: vectors.financialCoercion,
      icon: CreditCard,
      desc: 'RBI escrow, IMPS, token fee'
    },
    {
      label: 'Credential / RAT Harvest',
      score: vectors.credentialHarvesting,
      icon: Key,
      desc: 'OTP extraction, AnyDesk access'
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Mid-Call Risk Vector Engine
          </div>
          <div className="text-xs font-mono text-slate-400">
            Rule Set: IN-TRAI-GJ26
          </div>
        </div>

        {/* Primary Gauge */}
        <div className="my-4 flex items-center gap-5">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            {/* Circular SVG Gauge */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * riskScore) / 100}
                strokeLinecap="round"
                className={`transition-all duration-500 ${
                  riskScore >= 80 ? 'text-rose-500' : riskScore >= 50 ? 'text-amber-500' : 'text-emerald-500'
                }`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                {riskScore}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                Risk Index
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className={`text-xs font-semibold tracking-wider font-mono ${severity.color}`}>
              {severity.label}
            </div>
            <div className="text-sm font-medium text-slate-200 capitalize">
              {scamType.replace(/_/g, ' ')}
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Real-time multi-dimensional scoring against Gujarat telecom telemetry signatures.
            </div>
          </div>
        </div>

        {/* Vector breakdown */}
        <div className="space-y-2.5 mt-3 pt-3 border-t border-slate-800/80">
          {vectorItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-mono text-slate-200 font-medium tabular-nums">
                    {item.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      item.score > 70
                        ? 'bg-rose-500'
                        : item.score > 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500/70'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detected keyword triggers */}
      {detectedKeywords.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
            <span>Extracted Fraud Tokens ({detectedKeywords.length}):</span>
            <span className="text-[11px] text-slate-500 font-mono">Multilingual OCR/ASR</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {detectedKeywords.map((token, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 font-mono"
              >
                {token}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
