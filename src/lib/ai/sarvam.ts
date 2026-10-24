import type { ShieldAssessment, RiskLevel } from '../../types/shield.ts';

/**
 * Sarvam AI Speech-to-Text and Regional Fraud Lexicon Engine
 * Supports Gujarati (gu-IN), Hindi (hi-IN), and Indian English (en-IN).
 */

interface FraudPattern {
  name: string;
  category: string;
  riskWeight: number; // 1-100
  // All patterns in an 'all' list must match (contextual co-occurrence)
  coOccur?: string[][];
  // Direct explicit phrases that are unmistakable scam indicators
  exactPhrases: string[];
  warningSign: string;
  recommendedGuidance: string;
}

const FRAUD_PATTERNS: FraudPattern[] = [
  {
    name: 'Digital Arrest / Fake Police Warrant',
    category: 'Digital Arrest Scam',
    riskWeight: 95,
    exactPhrases: [
      'digital arrest',
      'ડિજિટલ એરેસ્ટ',
      'डिजिटल अरेस्ट',
      'कमरे का दरवाजा बंद करें',
      'कमरा बंद कर लो',
      'दरवाજો બંધ કરો',
      'lock the room door',
      'stay on video call'
    ],
    coOccur: [
      ['cbi', 'arrest'],
      ['crime branch', 'money laundering'],
      ['cyber crime', 'warrant'],
      ['क्राइम ब्रांच', 'गिरफ्तारी'],
      ['સીબીઆઈ', 'વોરંટ'],
      ['સુપ્રીમ કોર્ટ', 'એરેસ્ટ'],
      ['ड्रग्स', 'कस्टम्स', 'पार्सल']
    ],
    warningSign: 'Caller falsely claiming police, CBI, or Supreme Court "Digital Arrest" with demands to isolate in a room and stay on the call.',
    recommendedGuidance: 'Hang up immediately. Indian Law does NOT have any provision for "Digital Arrest". Report to National Cyber Crime Helpline 1930.'
  },
  {
    name: 'Utility Cutoff / Power Bill Scam',
    category: 'Electricity Bill Fraud',
    riskWeight: 90,
    exactPhrases: [
      'લાઈટ બિલ બાકી',
      'કનેક્શન કાપી નાખશે',
      'પાવર કટ થઈ જશે',
      'bijli cut jayegi',
      'power cut tonight',
      'electricity disconnection',
      '₹10 નું ટોકન',
      '10 rupaye update'
    ],
    coOccur: [
      ['pgvcl', 'quicksupport'],
      ['pgvcl', 'anydesk'],
      ['torrent power', 'code'],
      ['લાઈટ બિલ', 'એપ'],
      ['बिजली बिल', 'ऐप डाउनलोड'],
      ['power office', 'urgent']
    ],
    warningSign: 'Fraudulent power cutoff threat demanding urgent remote app download (AnyDesk/QuickSupport) or token recharge.',
    recommendedGuidance: 'Do NOT install AnyDesk or QuickSupport. PGVCL, Torrent Power, and electricity boards never disconnect power over arbitrary phone demands.'
  },
  {
    name: 'Bank KYC / Account Freeze OTP Theft',
    category: 'KYC & OTP Phishing',
    riskWeight: 92,
    exactPhrases: [
      'ખાતું બ્લોક',
      'ખાતું ફ્રીઝ',
      'खाता फ्रीज',
      'account suspended',
      'otp આપો',
      'ઓટીપી બોલો',
      'ओटीपी बताओ',
      'share otp',
      'tell me the 6 digit code',
      '6 અંકનો કોડ'
    ],
    coOccur: [
      ['sbi', 'otp'],
      ['aadhaar', 'pan', 'blocked'],
      ['આધાર', 'લિંક', 'કોડ'],
      ['बैंक', 'ओटीपी', 'वेरिफिकेशन'],
      ['pan card', 'deactivated', 'urgent']
    ],
    warningSign: 'Fake bank representative coercing disclosure of OTP, NetBanking credentials, or Aadhaar-PAN verification codes.',
    recommendedGuidance: 'NEVER disclose OTP or PIN to anyone. Banks and RBI never request One-Time Passwords over voice calls.'
  },
  {
    name: 'Customs / Courier Narcotics Extortion',
    category: 'Customs & Courier Scam',
    riskWeight: 88,
    exactPhrases: [
      'parcel seized with mdma',
      'illegal contraband in package',
      'passport seized in mumbai',
      'पार्सल में ड्रग्स मिला',
      'કુરિયરમાં ડ્રગ્સ પકડાયું',
      'customs clearance fee',
      'narcotics control bureau'
    ],
    coOccur: [
      ['fedex', 'customs'],
      ['dhl', 'police'],
      ['parcel', 'escrow'],
      ['कूरियर', 'एफआईआर']
    ],
    warningSign: 'Impersonation of FedEx or Mumbai Customs alleging illegal parcels seized under citizen name to extort clearance wire transfers.',
    recommendedGuidance: 'Hang up. Legitimate couriers do not transfer calls to police or demand escrow wire payments.'
  },
  {
    name: 'Coerced UPI Transfer / Remote Access Code',
    category: 'Remote Screen & UPI Extortion',
    riskWeight: 85,
    exactPhrases: [
      'quicksupport 9 digit',
      'anydesk address',
      '9 આંકડાનો કોડ',
      'स्क्रीन शेयर करो',
      'enter upi pin to receive',
      'रिफंड पाने के लिए पिन डालें'
    ],
    coOccur: [
      ['upi', 'pin', 'refund'],
      ['anydesk', 'code'],
      ['teamviewer', 'access']
    ],
    warningSign: 'Attempting to gain remote control of device via screen-sharing apps or tricking citizen into entering UPI PIN.',
    recommendedGuidance: 'Never share AnyDesk/QuickSupport codes. Entering your UPI PIN always DEDUCTS money, it never receives refunds.'
  }
];

/**
 * Perform contextual fraud lexicon analysis on speech transcript.
 */
export function analyzeTranscriptWithLexicon(
  transcript: string,
  declaredLanguage: string = 'gu'
): ShieldAssessment {
  const normalized = transcript.toLowerCase();

  // If transcript is empty or negligible
  if (!normalized || normalized.trim().length < 5) {
    return {
      riskLevel: 'Unknown',
      score: 0,
      warningSigns: ['Insufficient audio or speech could not be transcribed.'],
      evidence: [],
      recommendedAction: 'Ensure audio recording is clear and in Gujarati, Hindi, or English, then retry.',
      language: mapLanguageName(declaredLanguage),
      analysisSource: 'local_lexicon',
      transcript: transcript || '(No clear speech detected)',
      summary: 'Could not transcribe sufficient speech to determine call authenticity.'
    };
  }

  const detectedWarningSigns: string[] = [];
  const detectedEvidence: string[] = [];
  const detectedCategories: string[] = [];
  let maxRiskWeight = 0;
  let totalScoreAcc = 0;

  for (const pattern of FRAUD_PATTERNS) {
    let patternMatched = false;

    // 1. Check exact explicit phrases
    for (const phrase of pattern.exactPhrases) {
      if (normalized.includes(phrase.toLowerCase())) {
        patternMatched = true;
        detectedEvidence.push(`Exact match: "${phrase}"`);
      }
    }

    // 2. Check contextual co-occurrence
    if (pattern.coOccur) {
      for (const pair of pattern.coOccur) {
        const allPresent = pair.every(term => normalized.includes(term.toLowerCase()));
        if (allPresent) {
          patternMatched = true;
          detectedEvidence.push(`Contextual co-occurrence: [${pair.join(' + ')}]`);
        }
      }
    }

    if (patternMatched) {
      if (!detectedWarningSigns.includes(pattern.warningSign)) {
        detectedWarningSigns.push(pattern.warningSign);
      }
      if (!detectedCategories.includes(pattern.category)) {
        detectedCategories.push(pattern.category);
      }
      maxRiskWeight = Math.max(maxRiskWeight, pattern.riskWeight);
      totalScoreAcc += pattern.riskWeight * 0.4;
    }
  }

  // Detect language from text characters if mixed
  let resolvedLang = mapLanguageName(declaredLanguage);
  if (/[\u0A80-\u0AFF]/.test(transcript)) resolvedLang = 'Gujarati';
  else if (/[\u0900-\u097F]/.test(transcript)) resolvedLang = 'Hindi';

  // Compute final risk score and level
  let finalScore = Math.min(100, Math.round(maxRiskWeight > 0 ? Math.max(maxRiskWeight, maxRiskWeight + totalScoreAcc * 0.2) : 10));
  
  let riskLevel: RiskLevel = 'Low';
  let recommendedAction = 'Call appears nominal. Continue normal precautions and never share private banking codes.';

  if (finalScore >= 75) {
    riskLevel = 'High';
    recommendedAction = 'HANG UP IMMEDIATELY. This call displays severe characteristics of cyber fraud. Do not share OTPs, download remote apps, or transfer funds. Call Cyber Helpline 1930.';
  } else if (finalScore >= 45) {
    riskLevel = 'Medium';
    recommendedAction = 'Exercise extreme caution. Verify caller identity independently through official published numbers before proceeding.';
  }

  return {
    riskLevel,
    score: finalScore,
    warningSigns: detectedWarningSigns.length > 0 ? detectedWarningSigns : ['No prominent fraud signatures detected in spoken audio.'],
    evidence: detectedEvidence.slice(0, 5),
    recommendedAction,
    language: resolvedLang,
    analysisSource: 'sarvam',
    transcript,
    category: detectedCategories.length > 0 ? detectedCategories.join(' / ') : 'Nominal / Unclassified',
    summary: detectedWarningSigns.length > 0 
      ? `High-risk indicators identified: ${detectedCategories.join(', ')}. Contextual co-occurrence confirms predatory coercion patterns.`
      : 'Conversational audio does not match registered telecom scam modus operandi.'
  };
}

/**
 * Calls official Sarvam AI Speech-to-Text API.
 */
export async function transcribeWithSarvam(
  audioBuffer: Buffer,
  mimeType: string,
  languageCode: string = 'gu-IN'
): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error('SARVAM_API_KEY is not configured on the server.');
  }

  // Map user code to Sarvam supported language code (gu-IN, hi-IN, en-IN)
  let sarvamLang = 'gu-IN';
  if (languageCode.startsWith('hi')) sarvamLang = 'hi-IN';
  else if (languageCode.startsWith('en')) sarvamLang = 'en-IN';
  else if (languageCode.startsWith('gu')) sarvamLang = 'gu-IN';

  // Prepare FormData
  const formData = new FormData();
  const audioBlob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType || 'audio/wav' });
  formData.append('file', audioBlob, 'audio_sample.wav');
  formData.append('model', 'saarika:v2');
  formData.append('language_code', sarvamLang);

  const response = await fetch('https://api.sarvam.ai/speech-to-text', {
    method: 'POST',
    headers: {
      'api-subscription-key': apiKey
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sarvam AI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as { transcript?: string };
  if (!data.transcript) {
    throw new Error('Sarvam AI returned empty transcript response.');
  }

  return data.transcript;
}

/**
 * End-to-end Sarvam Speech-to-Text + Contextual Lexicon Assessment.
 */
export async function assessAudioWithSarvam(
  audioBuffer: Buffer,
  mimeType: string,
  declaredLanguage: string
): Promise<ShieldAssessment> {
  const transcript = await transcribeWithSarvam(audioBuffer, mimeType, declaredLanguage);
  const assessment = analyzeTranscriptWithLexicon(transcript, declaredLanguage);
  assessment.analysisSource = 'sarvam';
  return assessment;
}

function mapLanguageName(code: string): string {
  if (code.startsWith('gu')) return 'Gujarati';
  if (code.startsWith('hi')) return 'Hindi';
  return 'Indian English';
}
