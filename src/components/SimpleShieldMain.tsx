import React, { useState, useRef } from 'react';
import { ShieldAssessment, SupportedLanguage } from '../types/shield';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Mic, 
  Square, 
  Upload, 
  FileAudio, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Info,
  CheckCircle2,
  XCircle,
  PhoneCall
} from 'lucide-react';
import { speakText, stopSpeaking } from '../lib/speechVoice';
import { analyzeTranscriptWithLexicon } from '../lib/ai/sarvam';

interface SimpleShieldMainProps {
  onOpenAdvancedConsole?: () => void;
}

export const SimpleShieldMain: React.FC<SimpleShieldMainProps> = ({ onOpenAdvancedConsole }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('gu');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [sampleTranscript, setSampleTranscript] = useState<string>('');
  const [selectedDemoName, setSelectedDemoName] = useState<string>('');

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [assessment, setAssessment] = useState<ShieldAssessment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Whisper speech state
  const [isSpeakingWhisper, setIsSpeakingWhisper] = useState(false);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Pre-configured real-world demo scenarios for 1-click hackathon evaluation
  const demoScenarios = [
    {
      id: 'demo-pgvcl',
      title: 'PGVCL Power Cut Threat',
      lang: 'gu' as SupportedLanguage,
      langLabel: 'Gujarati (ગુજરાતી)',
      text: 'નમસ્તે, હું અમદાવાદ PGVCL પાવર ઓફિસથી બોલું છું. તમારું લાઈટ બિલ બાકી હોવાથી આજે રાત્રે 9:30 વાગ્યે તમારું કનેક્શન કાપી નાખવામાં આવશે. બિલ અપડેટ કરવા માટે તરત જ પ્લે સ્ટોર પરથી QuickSupport અથવા AnyDesk એપ ડાઉનલોડ કરો અને 9 આંકડાનો કોડ આપો. ₹10 નું ટોકન અપડેટ કરવું પડશે.'
    },
    {
      id: 'demo-digital-arrest',
      title: 'CBI Digital Arrest Threat',
      lang: 'hi' as SupportedLanguage,
      langLabel: 'Hindi (हिन्दी)',
      text: 'मैं इंस्पेक्टर विक्रम मुंबई साइबर क्राइम ब्रांच से बात कर रहा हूं। आपके आधार कार्ड से 3.8 करोड़ की मनी लॉन्ड्रिंग और ड्रग्स कार्टेल का खाता पकड़ा गया है। सुप्रीम कोर्ट के आदेश पर आप डिजिटल अरेस्ट के तहत हैं। कमरे का दरवाजा बंद करें और तुरंत वेरिफिकेशन एस्क्रो में 5 लाख रुपये ट्रांसफर करें।'
    },
    {
      id: 'demo-sbi-otp',
      title: 'SBI KYC Freeze & OTP Theft',
      lang: 'gu' as SupportedLanguage,
      langLabel: 'Gujarati (ગુજરાતી)',
      text: 'નમસ્કાર, સ્ટેટ બેંક ઓફ ઇન્ડિયા કસ્ટમર વેરિફિકેશન સેલથી કોલ છે. તમારું પાન કાર્ડ આધાર સાથે લિંક નથી થયું. જો 1 કલાકમાં અપડેટ નહીં કરો તો ખાતું ફ્રીઝ થઈ જશે. તમારા ફોન પર બેંકનો 6 અંકનો વન ટાઈમ પાસવર્ડ (OTP) આવ્યો છે, એ મને તરત બોલો.'
    },
    {
      id: 'demo-nominal',
      title: 'Legitimate Pharmacy Order',
      lang: 'en' as SupportedLanguage,
      langLabel: 'Indian English',
      text: 'Hello, this is Manish from Apollo Pharmacy Paldi Ahmedabad confirming your prescription for home delivery this evening at 5 PM. The total amount is ₹420 and you can pay cash on delivery. Thank you.'
    }
  ];

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setRecordedAudioBlob(null);
      setSampleTranscript('');
      setSelectedDemoName('');
      setAssessment(null);
      setErrorMessage(null);
    }
  };

  // Start microphone recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudioBlob(audioBlob);
        setAudioFile(null);
        setSampleTranscript('');
        setSelectedDemoName('');
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      setAssessment(null);
      setErrorMessage(null);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setErrorMessage('Microphone access was denied or is not supported in this browser.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  // Select demo sample
  const handleSelectDemo = (demo: typeof demoScenarios[0]) => {
    setSelectedDemoName(demo.title);
    setSampleTranscript(demo.text);
    setSelectedLanguage(demo.lang);
    setAudioFile(null);
    setRecordedAudioBlob(null);
    setAssessment(null);
    setErrorMessage(null);
  };

  // Safe response parser that never throws on HTML error pages
  const parseResponseSafely = async (res: Response) => {
    const rawText = await res.text();
    let data: any = null;
    let isJson = false;

    try {
      if (rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
        data = JSON.parse(rawText);
        isJson = true;
      }
    } catch {
      isJson = false;
    }

    return { isJson, data, rawText };
  };

  // Run scam analysis
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAssessment(null);
    setErrorMessage(null);
    stopSpeaking();
    setIsSpeakingWhisper(false);

    try {
      if (audioFile || recordedAudioBlob) {
        setAnalysisStep('Uploading audio stream...');
        const formData = new FormData();

        if (audioFile) {
          formData.append('audio', audioFile);
        } else if (recordedAudioBlob) {
          formData.append('audio', recordedAudioBlob, 'recorded_call.webm');
        }

        formData.append('language', selectedLanguage);

        setAnalysisStep('Connecting to AI Scam Shield (Gemini / Sarvam)...');
        const res = await fetch('/api/analyze-audio', {
          method: 'POST',
          body: formData
        });

        const { isJson, data, rawText } = await parseResponseSafely(res);

        if (!res.ok || !isJson) {
          console.warn('Audio analysis backend response was non-JSON or not OK:', res.status, rawText.slice(0, 100));
          throw new Error(
            data?.error || (isJson ? `Server error ${res.status}` : 'Audio analysis service returned an unexpected response. Please try again.')
          );
        }

        setAnalysisStep('Evaluating regional fraud signatures...');
        setAssessment(data as ShieldAssessment);
      } else if (sampleTranscript) {
        setAnalysisStep('Analyzing transcript with AI pipeline...');
        
        let analysisCompleted = false;

        try {
          const res = await fetch('/api/analyze-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: sampleTranscript,
              language: selectedLanguage
            })
          });

          const { isJson, data } = await parseResponseSafely(res);

          if (res.ok && isJson && data && data.riskLevel) {
            setAssessment(data as ShieldAssessment);
            analysisCompleted = true;
          }
        } catch (fetchErr) {
          console.warn('Direct API call failed, using client-side fallback:', fetchErr);
        }

        // If backend failed, timed out, or returned HTML, run client-side regional lexicon!
        if (!analysisCompleted) {
          setAnalysisStep('Running regional fraud lexicon fallback...');
          const fallbackData = analyzeTranscriptWithLexicon(sampleTranscript, selectedLanguage);
          fallbackData.analysisSource = 'local_lexicon';
          fallbackData.summary = `[Local Regional Lexicon] ${fallbackData.summary}`;
          setAssessment(fallbackData);
        }
      } else {
        setErrorMessage('Please upload an audio file, record your voice, or pick a sample scenario first.');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      const friendlyMessage = err instanceof Error && !err.message.includes('<!doctype') && !err.message.includes('Unexpected token')
        ? err.message
        : 'The analysis service encountered an unexpected error. Please try again or test with a sample scenario.';
      setErrorMessage(friendlyMessage);

      // If we have a transcript, fallback to local lexicon rather than failing!
      if (sampleTranscript) {
        const fallback = analyzeTranscriptWithLexicon(sampleTranscript, selectedLanguage);
        fallback.analysisSource = 'local_lexicon';
        setAssessment(fallback);
      } else {
        // Never report safe on failure: show Unknown assessment
        setAssessment({
          riskLevel: 'Unknown',
          score: 0,
          warningSigns: ['Could not complete automated scan.'],
          evidence: [],
          recommendedAction: 'Verify caller directly through independent published contact channels. Do not share money or sensitive codes.',
          language: selectedLanguage === 'gu' ? 'Gujarati' : selectedLanguage === 'hi' ? 'Hindi' : 'Indian English',
          analysisSource: 'unknown',
          transcript: sampleTranscript || '(Audio file upload failed to process)',
          summary: 'Analysis could not be completed due to a connection or provider error.',
          error: friendlyMessage
        });
      }
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Clear inputs
  const handleClear = () => {
    setAudioFile(null);
    setRecordedAudioBlob(null);
    setSampleTranscript('');
    setSelectedDemoName('');
    setAssessment(null);
    setErrorMessage(null);
    stopSpeaking();
    setIsSpeakingWhisper(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Play spoken whisper
  const togglePlayWhisper = () => {
    if (isSpeakingWhisper) {
      stopSpeaking();
      setIsSpeakingWhisper(false);
      return;
    }

    if (!assessment) return;

    let whisperText = assessment.recommendedAction;
    if (assessment.riskLevel === 'High') {
      whisperText = selectedLanguage === 'gu'
        ? 'ચેતવણી! આ કોલ ગંભીર સાયબર છેતરપિંડી છે. ફોન તરત કાપી નાખો અને કોઈ પણ OTP કે પૈસા આપશો નહીં.'
        : selectedLanguage === 'hi'
        ? 'सावधान! यह कॉल धोखाधड़ी है। फोन तुरंत काटें और कोई भी ओटीपी या पैसे ट्रांसफर न करें।'
        : 'High risk fraud detected! Hang up immediately and never disclose OTPs or passwords.';
    }

    setIsSpeakingWhisper(true);
    speakText(whisperText, selectedLanguage, 1.05, 0.95, () => {
      setIsSpeakingWhisper(false);
    });
  };

  const hasInput = Boolean(audioFile || recordedAudioBlob || sampleTranscript);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title & Short Description */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Garbathon 2026 · GDG Ahmedabad</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Scam Call Shield
        </h1>
        <p className="text-base text-slate-300 max-w-xl mx-auto">
          AI-powered protection against suspicious calls in <strong className="text-emerald-400 font-semibold">Gujarati</strong>, <strong className="text-emerald-400 font-semibold">Hindi</strong>, and <strong className="text-emerald-400 font-semibold">Indian English</strong>.
        </p>
      </div>

      {/* Main Card: Input & Language Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl space-y-5">
        {/* Step 1: Language Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            1. Select Spoken Language
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedLanguage('gu')}
              className={`py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-semibold transition-all text-center ${
                selectedLanguage === 'gu'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              ગુજરાતી (Gujarati)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('hi')}
              className={`py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-semibold transition-all text-center ${
                selectedLanguage === 'hi'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('en')}
              className={`py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-semibold transition-all text-center ${
                selectedLanguage === 'en'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              Indian English
            </button>
          </div>
        </div>

        {/* Step 2: Audio Input (Upload, Record, or 1-Click Sample) */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            2. Provide Call Audio
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Upload File */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm"
                onChange={handleFileChange}
                className="hidden"
                id="call-audio-upload"
              />
              <label
                htmlFor="call-audio-upload"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border border-dashed cursor-pointer transition-all h-28 text-center ${
                  audioFile
                    ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <Upload className="w-5 h-5 mb-1.5 text-slate-400" />
                <span className="text-xs font-semibold">
                  {audioFile ? audioFile.name : 'Upload Recorded Call'}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  {audioFile
                    ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB · Click to change`
                    : 'WAV, MP3, M4A, WebM (up to 25 MB)'}
                </span>
              </label>
            </div>

            {/* Record Live Microphone */}
            <div>
              <div
                className={`flex flex-col items-center justify-center p-4 rounded-lg border h-28 text-center transition-all ${
                  isRecording
                    ? 'bg-rose-950/40 border-rose-500/80 text-rose-200 animate-pulse'
                    : recordedAudioBlob
                    ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                {isRecording ? (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex flex-col items-center gap-1.5 text-rose-300 hover:text-white"
                  >
                    <Square className="w-6 h-6 text-rose-500 fill-current" />
                    <span className="text-xs font-bold">Stop Recording ({recordingSeconds}s)</span>
                    <span className="text-[10px] text-rose-400">Click to finish audio capture</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex flex-col items-center gap-1.5 text-slate-300 hover:text-white"
                  >
                    <Mic className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-semibold">
                      {recordedAudioBlob ? 'Re-record Spoken Audio' : 'Record Call Live'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {recordedAudioBlob
                        ? 'Audio recorded successfully'
                        : 'Use device microphone'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Demo Samples for instant testing */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Or test with verified scam scenarios:</span>
              {selectedDemoName && (
                <span className="text-emerald-400 font-mono">Loaded: {selectedDemoName}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {demoScenarios.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleSelectDemo(demo)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    selectedDemoName === demo.title
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {demo.title}
                </button>
              ))}
            </div>
          </div>

          {/* Transcript preview if loaded */}
          {sampleTranscript && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Selected Scenario Dialogue:</span>
                <button onClick={handleClear} className="text-slate-500 hover:text-slate-300">
                  Clear
                </button>
              </div>
              <p className="font-sans leading-relaxed text-slate-200 italic">
                "{sampleTranscript}"
              </p>
            </div>
          )}
        </div>

        {/* Step 3: Analyze Button & Status */}
        <div className="pt-2 space-y-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!hasInput || isAnalyzing}
            className={`w-full py-3.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              !hasInput || isAnalyzing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60 active:scale-[0.99]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{analysisStep || 'Analyzing Audio...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Call for Scams</span>
              </>
            )}
          </button>

          {errorMessage && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Step 4: Simple, Easy-To-Understand Results Section */}
      {assessment && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl space-y-5 animate-in fade-in-50 duration-300">
          {/* Risk Level Banner */}
          <div
            className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              assessment.riskLevel === 'High'
                ? 'bg-rose-950/50 border-rose-700/80 text-rose-100'
                : assessment.riskLevel === 'Medium'
                ? 'bg-amber-950/50 border-amber-700/80 text-amber-100'
                : assessment.riskLevel === 'Low'
                ? 'bg-emerald-950/50 border-emerald-700/80 text-emerald-100'
                : 'bg-slate-950 border-slate-700 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {assessment.riskLevel === 'High' && (
                <div className="w-10 h-10 rounded-full bg-rose-600/30 border border-rose-500 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
              )}
              {assessment.riskLevel === 'Medium' && (
                <div className="w-10 h-10 rounded-full bg-amber-600/30 border border-amber-500 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
              )}
              {assessment.riskLevel === 'Low' && (
                <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
              )}
              {assessment.riskLevel === 'Unknown' && (
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-slate-400" />
                </div>
              )}

              <div>
                <div className="text-xs uppercase font-mono tracking-wider opacity-80">
                  Risk Level Assessment
                </div>
                <div className="text-xl font-bold tracking-tight">
                  {assessment.riskLevel === 'High' && 'HIGH RISK SCAM DETECTED'}
                  {assessment.riskLevel === 'Medium' && 'MEDIUM RISK — SUSPICIOUS CALL'}
                  {assessment.riskLevel === 'Low' && 'LOW RISK — LIKELY SAFE'}
                  {assessment.riskLevel === 'Unknown' && 'UNKNOWN — INSUFFICIENT DATA'}
                </div>
              </div>
            </div>

            {/* Score & Category */}
            <div className="text-left sm:text-right font-mono">
              <div className="text-2xl font-extrabold tabular-nums">
                {assessment.riskLevel === 'Unknown' ? '—' : `${assessment.score}%`}
              </div>
              <div className="text-xs opacity-80">
                {assessment.category || 'Fraud Probability'}
              </div>
            </div>
          </div>

          {/* Context Details (Language & Provider Source) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 uppercase text-[10px] tracking-wider">Detected Language</div>
              <div className="font-semibold text-slate-200 mt-0.5">{assessment.language}</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 uppercase text-[10px] tracking-wider">Analysis Engine</div>
              <div className="font-semibold text-emerald-400 mt-0.5 capitalize">
                {assessment.analysisSource === 'gemini'
                  ? 'Gemini 2.5 Flash'
                  : assessment.analysisSource === 'sarvam'
                  ? 'Sarvam AI STT + Lexicon'
                  : assessment.analysisSource === 'local_lexicon'
                  ? 'Local Regional Lexicon'
                  : 'Provider Incomplete'}
              </div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-slate-400 uppercase text-[10px] tracking-wider">Helpline Support</div>
              <div className="font-semibold text-slate-200 mt-0.5 font-mono">Cyber Cell 1930</div>
            </div>
          </div>

          {/* Detected Warning Signs */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Detected Warning Signs:
            </h3>
            <ul className="space-y-1.5">
              {assessment.warningSigns.map((sign, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Evidence Transcript Quotes */}
          {assessment.evidence && assessment.evidence.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Evidence from Spoken Call:
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {assessment.evidence.map((ev, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded bg-slate-950 text-slate-200 border border-slate-800 font-mono"
                  >
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Action */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Recommended Next Action:
            </div>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {assessment.recommendedAction}
            </p>
          </div>

          {/* Voice Whisper Warning Button */}
          <button
            type="button"
            onClick={togglePlayWhisper}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              isSpeakingWhisper
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isSpeakingWhisper ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Voice Warning</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Hear Spoken Warning in {assessment.language}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Optional Link to Deep Telecom Console for Judges */}
      {onOpenAdvancedConsole && (
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={onOpenAdvancedConsole}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            <span>Open Advanced Telecom Carrier Interceptor & Fleet Telemetry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
