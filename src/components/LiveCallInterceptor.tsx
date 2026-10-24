import React, { useState, useEffect, useRef } from 'react';
import { CallScenario, TranscriptLine } from '../types/telecom';
import { SCENARIOS } from '../data/mockScenarios';
import { AudioWaveform } from './AudioWaveform';
import { ThreatRadar } from './ThreatRadar';
import { ShieldInterventions } from './ShieldInterventions';
import { CallQualityMetrics } from './CallQualityMetrics';
import { speakText, stopSpeaking } from '../lib/speechVoice';
import { analyzeCallTranscript } from '../lib/scamAnalyzer';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  AlertOctagon, 
  PhoneCall, 
  User, 
  MapPin, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export const LiveCallInterceptor: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const scenario = SCENARIOS[selectedScenarioIndex];

  // Playback state
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceAudioEnabled, setVoiceAudioEnabled] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5>(1);
  const [isCallSevered, setIsCallSevered] = useState(false);
  const [whisperLanguage, setWhisperLanguage] = useState<'gu' | 'hi' | 'en'>(scenario.primaryLanguage);
  const [whispersInjectedCount, setWhispersInjectedCount] = useState(0);

  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Update whisper language when scenario changes
  useEffect(() => {
    setWhisperLanguage(scenario.primaryLanguage);
    handleReset();
  }, [selectedScenarioIndex]);

  // Derived current lines
  const visibleLines = scenario.lines.slice(0, currentLineIndex + 1);
  const activeLine: TranscriptLine | undefined = scenario.lines[currentLineIndex];

  // Aggregate text so far for real-time analysis
  const aggregateText = visibleLines.map(l => l.text).join(' ');
  const analysis = analyzeCallTranscript(aggregateText);

  // Dynamic risk calculation
  const calculatedRisk = isCallSevered 
    ? 0 
    : Math.max(scenario.initialRisk, analysis.riskScore);

  // Auto scroll transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentLineIndex]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying || isCallSevered) {
      stopSpeaking();
      return;
    }

    if (currentLineIndex >= scenario.lines.length - 1) {
      setIsPlaying(false);
      return;
    }

    const current = scenario.lines[currentLineIndex];
    if (voiceAudioEnabled && current) {
      const pitch = current.speaker === 'scammer' ? 0.95 : 1.1;
      speakText(current.text, current.language, pitch, playbackSpeed);
    }

    // Auto advance timer based on text length
    const delay = Math.max(2200, current ? current.text.length * 60 : 3000) / playbackSpeed;
    const timer = setTimeout(() => {
      setCurrentLineIndex((prev) => Math.min(prev + 1, scenario.lines.length - 1));
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentLineIndex, isCallSevered, voiceAudioEnabled, playbackSpeed, scenario]);

  const handleReset = () => {
    stopSpeaking();
    setIsPlaying(false);
    setCurrentLineIndex(0);
    setIsCallSevered(false);
    setWhispersInjectedCount(0);
  };

  const handleSeverCall = () => {
    stopSpeaking();
    setIsPlaying(false);
    setIsCallSevered(true);
  };

  const handleNextLine = () => {
    if (currentLineIndex < scenario.lines.length - 1) {
      const nextIndex = currentLineIndex + 1;
      setCurrentLineIndex(nextIndex);
      const nextLine = scenario.lines[nextIndex];
      if (voiceAudioEnabled && nextLine) {
        speakText(nextLine.text, nextLine.language, nextLine.speaker === 'scammer' ? 0.95 : 1.1, playbackSpeed);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Scenario Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-200 uppercase tracking-wider">Test Scenario:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {SCENARIOS.map((scen, idx) => (
            <button
              key={scen.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedScenarioIndex === idx
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span className="mr-1.5 uppercase font-mono text-[10px] text-emerald-200 opacity-80">
                {scen.primaryLanguage}
              </span>
              <span>{scen.title.split('/')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Call Stream & Telemetry (Left) + Threat Radar & Shield (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interceptor Call Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Call Metadata Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>{scenario.targetName}</span>
                    <span className="text-xs text-slate-400 font-mono font-normal">
                      ({scenario.targetNumber})
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{scenario.targetLocation}</span>
                  </div>
                </div>
              </div>

              {/* Status State */}
              <div className="text-right">
                <div className="text-xs font-mono font-medium text-slate-300">
                  {isCallSevered ? (
                    <span className="text-rose-400 font-bold">TRUNK DISCONNECTED</span>
                  ) : isPlaying ? (
                    <span className="text-emerald-400 font-semibold">STREAM CAPTURE ACTIVE</span>
                  ) : (
                    <span className="text-slate-400">PAUSED / READY</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Origin: {scenario.callerLocation}
                </div>
              </div>
            </div>

            {/* Inbound Route Telemetry */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Inbound CLI</div>
                <div className="font-mono text-slate-200 truncate mt-0.5">{scenario.callerNumber.split('(')[0]}</div>
              </div>
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Carrier Route</div>
                <div className="text-slate-200 truncate mt-0.5">{scenario.callerCarrier}</div>
              </div>
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Detected Tongue</div>
                <div className="text-slate-200 uppercase font-mono mt-0.5 font-medium">
                  {analysis.primaryLanguage === 'gu' ? 'Gujarati (ગુજરાતી)' : analysis.primaryLanguage === 'hi' ? 'Hindi (हिन्दी)' : 'English'}
                </div>
              </div>
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Interventions</div>
                <div className="font-mono text-slate-200 mt-0.5 tabular-nums">
                  {whispersInjectedCount} Whisper / {isCallSevered ? '1 Drop' : '0 Drops'}
                </div>
              </div>
            </div>

            {/* Audio Waveform Canvas */}
            <AudioWaveform
              isPlaying={isPlaying}
              activeSpeaker={activeLine?.speaker || null}
              riskScore={calculatedRisk}
            />

            {/* Playback & Audio Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isCallSevered}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${
                    isCallSevered
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Audio Feed</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Live Audio Stream</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNextLine}
                  disabled={isCallSevered || currentLineIndex >= scenario.lines.length - 1}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 disabled:opacity-40"
                  title="Advance one dialogue frame"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Next Sentence</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-950 rounded border border-slate-800 hover:border-slate-700"
                  title="Restart Call"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {/* Voice toggle */}
                <button
                  onClick={() => {
                    if (voiceAudioEnabled) stopSpeaking();
                    setVoiceAudioEnabled(!voiceAudioEnabled);
                  }}
                  className={`px-2 py-1 rounded flex items-center gap-1.5 border transition-colors ${
                    voiceAudioEnabled
                      ? 'bg-slate-800 border-slate-700 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                  title="Toggle Browser Voice Synthesis"
                >
                  {voiceAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{voiceAudioEnabled ? 'Voice On' : 'Voice Muted'}</span>
                </button>

                {/* Speed toggle */}
                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : 1)}
                  className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono hover:text-white"
                >
                  {playbackSpeed}x
                </button>
              </div>
            </div>
          </div>

          {/* Live Transcript Stream */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-200 uppercase tracking-wider">
                Real-Time ASR Speech-To-Text Feed
              </span>
              <span className="font-mono text-slate-400">
                Frame {currentLineIndex + 1} / {scenario.lines.length}
              </span>
            </div>

            {/* Transcript scroll area */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {visibleLines.map((line, idx) => {
                const isScammer = line.speaker === 'scammer';
                return (
                  <div
                    key={line.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isScammer
                        ? 'bg-slate-950/80 border-slate-800/90'
                        : 'bg-slate-900/60 border-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-xs ${
                            isScammer ? 'text-rose-400' : 'text-sky-400'
                          }`}
                        >
                          {isScammer ? 'Caller (Suspect)' : 'Citizen (Target)'}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="font-mono text-[11px] text-slate-400">{line.timestamp}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-[10px] uppercase font-mono text-slate-400">
                          {line.language}
                        </span>
                      </div>

                      {line.riskScoreDelta > 0 && (
                        <span className="text-[11px] font-mono text-rose-400 font-semibold">
                          +{line.riskScoreDelta}% risk
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-100 font-sans leading-relaxed">
                      {line.text}
                    </p>

                    {line.translationEn && line.language !== 'en' && (
                      <p className="text-xs text-slate-400 italic mt-1 font-sans">
                        "{line.translationEn}"
                      </p>
                    )}

                    {line.fraudIndicators && line.fraudIndicators.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {line.fraudIndicators.map((ind, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-800/40 text-rose-300 font-mono"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        </div>

        {/* Right Column: Threat Radar & Protective Interventions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <ThreatRadar
            riskScore={calculatedRisk}
            vectors={analysis.threatVectors}
            scamType={analysis.scamCategory}
            detectedKeywords={analysis.detectedKeywords}
          />

          <CallQualityMetrics
            isPlaying={isPlaying}
            isCallSevered={isCallSevered}
            callerCarrier={scenario.callerCarrier}
          />

          <ShieldInterventions
            scenario={scenario}
            riskScore={calculatedRisk}
            isCallSevered={isCallSevered}
            onSeverCall={handleSeverCall}
            whisperLanguage={whisperLanguage}
            setWhisperLanguage={setWhisperLanguage}
            onWhisperDispatched={() => setWhispersInjectedCount(c => c + 1)}
          />
        </div>
      </div>
    </div>
  );
};
