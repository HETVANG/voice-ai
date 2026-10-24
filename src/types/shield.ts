export type RiskLevel = 'High' | 'Medium' | 'Low' | 'Unknown';

export const RISK_LEVELS = ['High', 'Medium', 'Low', 'Unknown'] as const;

export type AnalysisSource = 'gemini' | 'sarvam' | 'local_lexicon' | 'unknown';

export interface ShieldAssessment {
  riskLevel: RiskLevel;
  score: number; // 0 to 100
  warningSigns: string[];
  evidence: string[];
  recommendedAction: string;
  language: string; // 'Gujarati' | 'Hindi' | 'Indian English'
  analysisSource: AnalysisSource;
  transcript: string;
  category?: string;
  summary: string;
  error?: string;
}

export type SupportedLanguage = 'gu' | 'hi' | 'en';

