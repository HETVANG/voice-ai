export type LanguageCode = 'gu' | 'hi' | 'en';

export type CallStatus = 
  | 'active_monitoring' 
  | 'warning_whispered' 
  | 'call_severed' 
  | 'cleared' 
  | 'escalated';

export type ScamType = 
  | 'digital_arrest' 
  | 'utility_disconnection' 
  | 'kyc_suspension' 
  | 'customs_courier' 
  | 'lottery_reward' 
  | 'nominal_verified';

export interface ThreatVectors {
  impersonationScore: number; // 0-100
  isolationPressure: number;  // 0-100
  financialCoercion: number;  // 0-100
  urgencyLevel: number;       // 0-100
  credentialHarvesting: number; // 0-100
}

export interface TranscriptLine {
  id: string;
  timestamp: string; // e.g. "00:12"
  speaker: 'scammer' | 'citizen' | 'shield_ai';
  language: LanguageCode;
  text: string;
  translationEn?: string;
  riskScoreDelta: number;
  highlightedKeywords?: string[];
  fraudIndicators?: string[];
}

export interface CallScenario {
  id: string;
  title: string;
  category: ScamType;
  primaryLanguage: LanguageCode;
  callerNumber: string;
  callerLocation: string;
  callerCarrier: string;
  targetNumber: string;
  targetLocation: string;
  targetName: string;
  initialRisk: number;
  peakRisk: number;
  description: string;
  lines: TranscriptLine[];
  recommendedWhisperGu: string;
  recommendedWhisperHi: string;
  recommendedWhisperEn: string;
}

export interface ActiveCallRecord {
  id: string;
  callerCLI: string;
  isSpoofed: boolean;
  targetNumber: string;
  targetName: string;
  circle: string;
  cellTower: string;
  language: LanguageCode;
  scamType: ScamType;
  riskScore: number;
  status: CallStatus;
  durationSeconds: number;
  packetsAnalyzed: number;
  interventionsTriggered: number;
}
