import React, { useState } from 'react';
import { Volume2, VolumeX, PhoneOff, Send, Download, CheckCircle2, ShieldAlert } from 'lucide-react';
import { speakText, stopSpeaking } from '../lib/speechVoice';
import { CallScenario } from '../types/telecom';

interface ShieldInterventionsProps {
  scenario: CallScenario;
  riskScore: number;
  isCallSevered: boolean;
  onSeverCall: () => void;
  whisperLanguage: 'gu' | 'hi' | 'en';
  setWhisperLanguage: (lang: 'gu' | 'hi' | 'en') => void;
  onWhisperDispatched: () => void;
}

export const ShieldInterventions: React.FC<ShieldInterventionsProps> = ({
  scenario,
  riskScore,
  isCallSevered,
  onSeverCall,
  whisperLanguage,
  setWhisperLanguage,
  onWhisperDispatched
}) => {
  const [isWhisperingAudio, setIsWhisperingAudio] = useState(false);
  const [whisperSuccess, setWhisperSuccess] = useState(false);
  const [guardianAlertSent, setGuardianAlertSent] = useState(false);

  const getWhisperText = () => {
    if (whisperLanguage === 'gu') return scenario.recommendedWhisperGu;
    if (whisperLanguage === 'hi') return scenario.recommendedWhisperHi;
    return scenario.recommendedWhisperEn;
  };

  const handlePlayWhisper = () => {
    if (isWhisperingAudio) {
      stopSpeaking();
      setIsWhisperingAudio(false);
      return;
    }

    const text = getWhisperText();
    setIsWhisperingAudio(true);
    speakText(text, whisperLanguage, 1.05, 0.95, () => {
      setIsWhisperingAudio(false);
      setWhisperSuccess(true);
      onWhisperDispatched();
      setTimeout(() => setWhisperSuccess(false), 3000);
    });
  };

  const handleSendGuardianAlert = () => {
    setGuardianAlertSent(true);
    setTimeout(() => {
      setGuardianAlertSent(false);
    }, 4000);
  };

  const handleExportDossier = () => {
    const dossierData = {
      incidentId: `CYBER-GJ-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      telecomJurisdiction: 'Gujarat Circle (Ahmedabad Cyber Crime Unit 1930)',
      targetCitizen: {
        name: scenario.targetName,
        phone: scenario.targetNumber,
        location: scenario.targetLocation
      },
      perpetratorTelemetry: {
        callerCLI: scenario.callerNumber,
        geoOrigin: scenario.callerLocation,
        carrierTrunk: scenario.callerCarrier,
        isSpoofed: true
      },
      fraudCategory: scenario.category,
      threatScore: `${riskScore}%`,
      transcriptLog: scenario.lines,
      defensiveIntervention: {
        whisperDispatched: getWhisperText(),
        language: whisperLanguage,
        carrierSevered: isCallSevered
      }
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberCrime1930_Dossier_${scenario.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-slate-200 font-semibold">
            Mid-Call Shield Interventions
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Latency: 140ms
        </span>
      </div>

      {/* Intervention 1: In-Ear Audio Whisper */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
            <span>In-Ear AI Whisper Alert</span>
            {whisperSuccess && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3" /> Injected
              </span>
            )}
          </span>

          {/* Language Selector */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded border border-slate-800 text-xs">
            <button
              onClick={() => setWhisperLanguage('gu')}
              className={`px-2 py-0.5 rounded transition-colors ${
                whisperLanguage === 'gu'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ગુજરાતી
            </button>
            <button
              onClick={() => setWhisperLanguage('hi')}
              className={`px-2 py-0.5 rounded transition-colors ${
                whisperLanguage === 'hi'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setWhisperLanguage('en')}
              className={`px-2 py-0.5 rounded transition-colors ${
                whisperLanguage === 'en'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
          "{getWhisperText()}"
        </p>

        <button
          onClick={handlePlayWhisper}
          className={`w-full py-2 px-3 text-xs font-semibold rounded flex items-center justify-center gap-2 transition-all ${
            isWhisperingAudio
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isWhisperingAudio ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Playing Whisper Voice</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Transmit Defensive Whisper to Citizen</span>
            </>
          )}
        </button>
      </div>

      {/* Intervention 2 & 3: Carrier Drop & Kin Alert */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onSeverCall}
          disabled={isCallSevered}
          className={`py-2 px-3 text-xs font-semibold rounded flex items-center justify-center gap-2 border transition-colors ${
            isCallSevered
              ? 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-300 hover:bg-rose-900/60'
          }`}
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>{isCallSevered ? 'Trunk Severed' : 'Force Drop Call'}</span>
        </button>

        <button
          onClick={handleSendGuardianAlert}
          className="py-2 px-3 text-xs font-semibold rounded flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
        >
          <Send className="w-3.5 h-3.5 text-sky-400" />
          <span>{guardianAlertSent ? 'SOS Dispatched!' : 'Family Guardian SOS'}</span>
        </button>
      </div>

      {guardianAlertSent && (
        <div className="p-2.5 bg-sky-950/40 border border-sky-800/50 rounded text-xs text-sky-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-400" />
          <span>SMS & WhatsApp dispatched to Kin Contact (+91 98250 88219 - Son) with GPS location & caller audio snippet.</span>
        </div>
      )}

      {/* Intervention 4: Export Dossier */}
      <button
        onClick={handleExportDossier}
        className="w-full py-2 px-3 text-xs font-medium text-slate-300 bg-slate-950/60 border border-slate-800 rounded hover:border-slate-700 hover:text-white flex items-center justify-center gap-2 transition-colors"
      >
        <Download className="w-3.5 h-3.5 text-slate-400" />
        <span>Download Cyber Crime 1930 FIR Dossier</span>
      </button>
    </div>
  );
};
