import React, { useState } from 'react';
import { analyzeCallTranscript, AnalysisResult } from '../lib/scamAnalyzer';
import { speakText, stopSpeaking } from '../lib/speechVoice';
import { Sparkles, Play, Volume2, VolumeX, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export const CustomCallSimulator: React.FC = () => {
  const [inputText, setInputText] = useState(
    'તમારું લાઈટ બિલ બાકી હોવાથી આજે રાત્રે કનેક્શન કાપી નાખવામાં આવશે. QuickSupport એપ ડાઉનલોડ કરો અને 9 આંકડાનો કોડ આપો.'
  );
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(() =>
    analyzeCallTranscript(inputText)
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeWhisperLang, setActiveWhisperLang] = useState<'gu' | 'hi' | 'en'>('gu');

  const presetSamples = [
    {
      label: 'PGVCL Power Cut (Gujarati)',
      lang: 'gu',
      text: 'નમસ્તે, હું PGVCL ઓફિસથી બોલું છું. તમારું લાઈટ બિલ બાકી છે અને 15 મિનિટમાં પાવર કટ થઈ જશે. તાત્કાલિક AnyDesk અથવા QuickSupport ડાઉનલોડ કરીને ₹10 નું ટોકન ભરો.'
    },
    {
      label: 'Digital Arrest Warrant (Hindi)',
      lang: 'hi',
      text: 'मैं इंस्पेक्टर मुंबई साइबर क्राइम से बोल रहा हूं। आपके आधार कार्ड से 4 करोड़ की मनी लॉन्ड्रिंग हुई है। सुप्रीम कोर्ट के तहत आप डिजिटल अरेस्ट पर हैं। कमरे का दरवाजा बंद करें।'
    },
    {
      label: 'SBI Bank Account Freeze (Gujarati)',
      lang: 'gu',
      text: 'તમારું સ્ટેટ બેંક એકાઉન્ટ આધાર લિંક ન હોવાથી બ્લોક થઈ ગયું છે. અનબ્લોક કરવા માટે મોબાઈલ પર આવેલો 6 અંકનો OTP વેરિફિકેશન કોડ તરત બોલો.'
    },
    {
      label: 'FedEx Customs Parcel Seizure (English)',
      lang: 'en',
      text: 'This is an urgent call from FedEx Customs Clearance. A parcel addressed to you containing MDMA narcotics was confiscated. You must transfer ₹2.5 Lakhs to the official escrow account immediately.'
    },
    {
      label: 'Nominal Doctor Appointment (Safe Benchmark)',
      lang: 'en',
      text: 'Hello, this is Sterling Hospital confirming your cardiology appointment for tomorrow at 11:30 AM with Dr. Shah. Please bring your previous prescription.'
    }
  ];

  const handleAnalyze = () => {
    stopSpeaking();
    setIsSpeaking(false);
    const res = analyzeCallTranscript(inputText);
    setAnalysisResult(res);
    setActiveWhisperLang(res.primaryLanguage);
  };

  const handleSelectPreset = (sample: typeof presetSamples[0]) => {
    stopSpeaking();
    setIsSpeaking(false);
    setInputText(sample.text);
    const res = analyzeCallTranscript(sample.text);
    setAnalysisResult(res);
    setActiveWhisperLang(sample.lang as 'gu' | 'hi' | 'en');
  };

  const handlePlayWhisper = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const whisperText = analysisResult.recommendedWhisper[activeWhisperLang];
    setIsSpeaking(true);
    speakText(whisperText, activeWhisperLang, 1.05, 0.95, () => {
      setIsSpeaking(false);
    });
  };

  return (
    <div className="space-y-5">
      {/* Overview Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Live Interactive ASR & Multi-Dialect Phrase Tester
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Evaluate custom mid-call sentences in Gujarati (ગુજરાતી), Hindi (हिन्दी), or English to benchmark ASR token extraction, threat scoring, and synthesized protective audio whispers in real time.
        </p>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-800/80">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mr-1">
            Quick Prompts:
          </span>
          {presetSamples.map((preset, i) => (
            <button
              key={i}
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1 text-xs rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors font-sans"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Input Box */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Input Inbound Telecom Audio Transcript
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              Supports Gujarati, Hindi, English
            </span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
            placeholder="Type or paste call transcript here in Gujarati, Hindi or English..."
          />

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleAnalyze}
              className="px-4 py-2 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evaluate Mid-Call Threat & Generate Whisper</span>
            </button>

            <button
              onClick={() => {
                setInputText('');
                setAnalysisResult(analyzeCallTranscript(''));
              }}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          </div>

          {/* Extracted Tokens */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-xs text-slate-400 mb-2">
              Detected Trigger Keywords ({analysisResult.detectedKeywords.length}):
            </div>
            {analysisResult.detectedKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.detectedKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-xs bg-rose-950/70 border border-rose-800/50 text-rose-300 font-mono"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-500 font-mono">
                No known high-risk fraud signatures flagged in input.
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Instant Evaluation & Generated Whisper */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
              Live Threat Assessment
            </span>
            <span className="font-mono text-xs font-bold tabular-nums">
              Score: <span className={analysisResult.riskScore >= 70 ? 'text-rose-400' : analysisResult.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'}>{analysisResult.riskScore}%</span>
            </span>
          </div>

          {/* Scam Category & Recommended Protocol */}
          <div className="space-y-1.5">
            <div className="text-xs text-slate-400">Classified Category:</div>
            <div className="text-sm font-semibold text-white capitalize">
              {analysisResult.scamCategory.replace(/_/g, ' ')}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800/80">
              {analysisResult.reasoning}
            </p>
          </div>

          {/* Synthesized Whisper Advisory */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                Generated Protective Audio Whisper:
              </span>

              {/* Language Selector */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveWhisperLang('gu')}
                  className={`px-1.5 py-0.5 rounded ${
                    activeWhisperLang === 'gu' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400'
                  }`}
                >
                  GU
                </button>
                <button
                  onClick={() => setActiveWhisperLang('hi')}
                  className={`px-1.5 py-0.5 rounded ${
                    activeWhisperLang === 'hi' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400'
                  }`}
                >
                  HI
                </button>
                <button
                  onClick={() => setActiveWhisperLang('en')}
                  className={`px-1.5 py-0.5 rounded ${
                    activeWhisperLang === 'en' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs text-emerald-300 font-sans leading-relaxed">
              "{analysisResult.recommendedWhisper[activeWhisperLang]}"
            </div>

            <button
              onClick={handlePlayWhisper}
              className={`w-full py-2 px-3 text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors ${
                isSpeaking
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Spoken Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Test Hearing Spoken AI Whisper ({activeWhisperLang.toUpperCase()})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
