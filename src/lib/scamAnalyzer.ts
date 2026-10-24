import { ThreatVectors, ScamType, LanguageCode } from '../types/telecom';

export interface AnalysisResult {
  riskScore: number; // 0-100
  scamCategory: ScamType;
  primaryLanguage: LanguageCode;
  detectedKeywords: string[];
  threatVectors: ThreatVectors;
  reasoning: string;
  recommendedWhisper: {
    gu: string;
    hi: string;
    en: string;
  };
  recommendedAction: 'NONE' | 'MONITOR' | 'WHISPER_ALERT' | 'SEVER_CALL';
}

const GUJARATI_FRAUD_PATTERNS = [
  { term: 'PGVCL', weight: 25, vector: 'impersonation' },
  { term: 'UGVCL', weight: 25, vector: 'impersonation' },
  { term: 'ટોરેન્ટ', weight: 20, vector: 'impersonation' },
  { term: 'Torrent Power', weight: 20, vector: 'impersonation' },
  { term: 'ઓફિસર', weight: 15, vector: 'impersonation' },
  { term: 'લાઈટ બિલ', weight: 20, vector: 'urgency' },
  { term: 'કનેક્શન કાપી નાખશે', weight: 35, vector: 'urgency' },
  { term: 'પાવર કટ', weight: 30, vector: 'urgency' },
  { term: 'QuickSupport', weight: 40, vector: 'credential' },
  { term: 'AnyDesk', weight: 40, vector: 'credential' },
  { term: 'TeamViewer', weight: 40, vector: 'credential' },
  { term: 'ટોકન', weight: 20, vector: 'coercion' },
  { term: '₹10', weight: 25, vector: 'coercion' },
  { term: 'રૂપિયા', weight: 15, vector: 'coercion' },
  { term: 'OTP', weight: 45, vector: 'credential' },
  { term: 'વન ટાઈમ પાસવર્ડ', weight: 45, vector: 'credential' },
  { term: 'ખાતું બ્લોક', weight: 35, vector: 'urgency' },
  { term: 'ખાતું ફ્રીઝ', weight: 35, vector: 'urgency' },
  { term: 'આધાર લિંક', weight: 25, vector: 'impersonation' },
  { term: 'PAN કાર્ડ', weight: 20, vector: 'impersonation' },
  { term: 'કોલ કટ ના કરતા', weight: 35, vector: 'isolation' },
  { term: 'ફોન બિલકુલ કટ ના કરતા', weight: 40, vector: 'isolation' },
  { term: '9 આંકડાનો કોડ', weight: 35, vector: 'credential' },
  { term: 'ડિજિટલ એરેસ્ટ', weight: 50, vector: 'isolation' }
];

const HINDI_FRAUD_PATTERNS = [
  { term: 'डिजिटल अरेस्ट', weight: 55, vector: 'isolation' },
  { term: 'क्राइम ब्रांच', weight: 30, vector: 'impersonation' },
  { term: 'सीबीआई', weight: 30, vector: 'impersonation' },
  { term: 'CBI', weight: 30, vector: 'impersonation' },
  { term: 'पुलिस', weight: 20, vector: 'impersonation' },
  { term: 'इंस्पेक्टर', weight: 25, vector: 'impersonation' },
  { term: 'सुप्रीम कोर्ट', weight: 35, vector: 'impersonation' },
  { term: 'मनी लॉन्ड्रिंग', weight: 35, vector: 'coercion' },
  { term: 'ड्रग्स कार्टेल', weight: 40, vector: 'coercion' },
  { term: 'एमडीएमए', weight: 40, vector: 'coercion' },
  { term: 'MDMA', weight: 40, vector: 'coercion' },
  { term: 'वारंट', weight: 30, vector: 'urgency' },
  { term: 'गिरफ्तारी', weight: 30, vector: 'urgency' },
  { term: 'कमरे का दरवाजा बंद करें', weight: 45, vector: 'isolation' },
  { term: 'किसी को बताया तो', weight: 35, vector: 'isolation' },
  { term: 'आरबीआई', weight: 25, vector: 'impersonation' },
  { term: 'एस्क्रो अकाउंट', weight: 35, vector: 'coercion' },
  { term: 'वेरिफिकेशन राशि', weight: 30, vector: 'coercion' },
  { term: 'ओटीपी', weight: 45, vector: 'credential' },
  { term: 'OTP', weight: 45, vector: 'credential' },
  { term: 'खाता फ्रीज', weight: 30, vector: 'urgency' }
];

const ENGLISH_FRAUD_PATTERNS = [
  { term: 'digital arrest', weight: 55, vector: 'isolation' },
  { term: 'customs', weight: 25, vector: 'impersonation' },
  { term: 'narcotics control bureau', weight: 35, vector: 'impersonation' },
  { term: 'ncb', weight: 30, vector: 'impersonation' },
  { term: 'fedex', weight: 25, vector: 'impersonation' },
  { term: 'illegal package', weight: 30, vector: 'urgency' },
  { term: 'mdma', weight: 40, vector: 'coercion' },
  { term: 'escrow account', weight: 35, vector: 'coercion' },
  { term: 'immediate transfer', weight: 30, vector: 'urgency' },
  { term: 'non-bailable warrant', weight: 40, vector: 'urgency' },
  { term: 'clearance fee', weight: 30, vector: 'coercion' },
  { term: 'verification code', weight: 40, vector: 'credential' },
  { term: 'anydesk', weight: 45, vector: 'credential' },
  { term: 'quicksupport', weight: 45, vector: 'credential' },
  { term: 'do not disconnect', weight: 35, vector: 'isolation' }
];

export function analyzeCallTranscript(text: string): AnalysisResult {
  const normalized = text.toLowerCase();
  
  // Detect language
  let lang: LanguageCode = 'en';
  const gujaratiRegex = /[\u0A80-\u0AFF]/;
  const hindiRegex = /[\u0900-\u097F]/;
  
  if (gujaratiRegex.test(text)) {
    lang = 'gu';
  } else if (hindiRegex.test(text)) {
    lang = 'hi';
  }

  const detectedKeywords: string[] = [];
  let impersonation = 0;
  let urgency = 0;
  let isolation = 0;
  let coercion = 0;
  let credential = 0;

  // Scan patterns
  const allPatterns = [...GUJARATI_FRAUD_PATTERNS, ...HINDI_FRAUD_PATTERNS, ...ENGLISH_FRAUD_PATTERNS];

  for (const item of allPatterns) {
    if (text.includes(item.term) || normalized.includes(item.term.toLowerCase())) {
      if (!detectedKeywords.includes(item.term)) {
        detectedKeywords.push(item.term);
      }
      if (item.vector === 'impersonation') impersonation += item.weight;
      if (item.vector === 'urgency') urgency += item.weight;
      if (item.vector === 'isolation') isolation += item.weight;
      if (item.vector === 'coercion') coercion += item.weight;
      if (item.vector === 'credential') credential += item.weight;
    }
  }

  // Cap sub-vectors to 100
  const threatVectors: ThreatVectors = {
    impersonationScore: Math.min(100, impersonation),
    urgencyLevel: Math.min(100, urgency),
    isolationPressure: Math.min(100, isolation),
    financialCoercion: Math.min(100, coercion),
    credentialHarvesting: Math.min(100, credential)
  };

  // Calculate weighted risk
  const rawRisk = 
    threatVectors.impersonationScore * 0.25 +
    threatVectors.urgencyLevel * 0.20 +
    threatVectors.isolationPressure * 0.25 +
    threatVectors.financialCoercion * 0.15 +
    threatVectors.credentialHarvesting * 0.15;

  let riskScore = Math.min(100, Math.round(rawRisk));

  // Category determination
  let scamCategory: ScamType = 'nominal_verified';
  if (riskScore >= 30) {
    if (threatVectors.isolationPressure >= 40 || detectedKeywords.some(k => k.toLowerCase().includes('arrest') || k.includes('ડિજિટલ એરેસ્ટ') || k.includes('डिजिटल अरेस्ट'))) {
      scamCategory = 'digital_arrest';
      riskScore = Math.max(riskScore, 85);
    } else if (detectedKeywords.some(k => k.toLowerCase().includes('pgvcl') || k.toLowerCase().includes('torrent') || k.includes('લાઈટ બિલ') || k.includes('પાવર કટ'))) {
      scamCategory = 'utility_disconnection';
      riskScore = Math.max(riskScore, 78);
    } else if (threatVectors.credentialHarvesting >= 40 || detectedKeywords.some(k => k.toLowerCase().includes('otp') || k.includes('ખાતું') || k.includes('sbi'))) {
      scamCategory = 'kyc_suspension';
      riskScore = Math.max(riskScore, 75);
    } else if (detectedKeywords.some(k => k.toLowerCase().includes('fedex') || k.toLowerCase().includes('customs') || k.toLowerCase().includes('mdma'))) {
      scamCategory = 'customs_courier';
      riskScore = Math.max(riskScore, 80);
    }
  }

  // Action threshold
  let recommendedAction: AnalysisResult['recommendedAction'] = 'NONE';
  if (riskScore >= 85) {
    recommendedAction = 'SEVER_CALL';
  } else if (riskScore >= 60) {
    recommendedAction = 'WHISPER_ALERT';
  } else if (riskScore >= 30) {
    recommendedAction = 'MONITOR';
  }

  // Construct localized whisper
  let whisperGu = 'ચેતવણી! શંકાસ્પદ છેતરપિંડી કોલ. કોઈ પણ વ્યક્તિગત માહિતી કે પૈસા આપશો નહીં.';
  let whisperHi = 'सावधान! यह संदिग्ध धोखाधड़ी कॉल है। कोई भी ओटीपी या पैसे ट्रांसफर न करें।';
  let whisperEn = 'CAUTION! High-risk telecom scam detected. Do not share OTP or transfer funds.';

  if (scamCategory === 'digital_arrest') {
    whisperGu = 'ચેતવણી! ભારતીય કાયદામાં ડિજિટલ એરેસ્ટનું કોઈ પ્રાવધાન નથી. તાત્કાલિક કોલ કાપો અને 1930 ડાયલ કરો.';
    whisperHi = 'अलर्ट! कानून में "डिजिटल अरेस्ट" फर्जी है। कोई पुलिस फोन पर पैसे नहीं मांगती। तुरंत कॉल काटें।';
    whisperEn = 'HIGH ALERT: "Digital Arrest" is a complete fraud. Police never detain via phone. Terminate call immediately.';
  } else if (scamCategory === 'utility_disconnection') {
    whisperGu = 'સાવધાન! PGVCL ક્યારેય ફોન પર પાવર કટ કરવાની ધમકી આપી QuickSupport કે AnyDesk ડાઉનલોડ કરાવતી નથી.';
    whisperHi = 'सावधान! बिजली बोर्ड कभी कॉल पर एनीडेस्क या क्विकसपोर्ट ऐप इंस्टॉल नहीं करवाता। कॉल काटें।';
    whisperEn = 'WARNING: Electricity providers never force remote app installs over call. Terminate call.';
  } else if (scamCategory === 'kyc_suspension') {
    whisperGu = 'ચેતવણી! સ્ટેટ બેંક કે કોઈ પણ બેંક ક્યારેય ફોન પર OTP કે પાસવર્ડ માંગતી નથી. OTP આપશો નહીં.';
    whisperHi = 'अलर्ट! बैंक कभी फोन पर ओटीपी या पासवर्ड नहीं पूछता। फोन तुरंत काटें।';
    whisperEn = 'SECURITY ALERT: Never disclose OTP or passwords to inbound callers claiming bank affiliation.';
  }

  const reasoning = detectedKeywords.length > 0 
    ? `Identified high-risk triggers [${detectedKeywords.join(', ')}] with elevated ${threatVectors.isolationPressure > 40 ? 'isolation pressure' : threatVectors.urgencyLevel > 40 ? 'artificial urgency' : 'credential harvesting vector'}.`
    : 'No critical fraud triggers identified. Audio stream exhibits nominal conversational acoustic characteristics.';

  return {
    riskScore,
    scamCategory,
    primaryLanguage: lang,
    detectedKeywords,
    threatVectors,
    reasoning,
    recommendedWhisper: {
      gu: whisperGu,
      hi: whisperHi,
      en: whisperEn
    },
    recommendedAction
  };
}
