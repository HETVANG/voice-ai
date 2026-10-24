import { GoogleGenAI } from '@google/genai';
import { ShieldAssessment, RiskLevel } from '../../types/shield';

/**
 * Gemini AI Telecom Fraud & Scam Assessment Engine
 */

export async function assessWithGemini(
  audioBuffer?: Buffer,
  mimeType?: string,
  transcriptText?: string,
  declaredLanguage: string = 'gu'
): Promise<ShieldAssessment> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
You are Scam Call Shield, an expert telecom fraud analyst specifically trained for Indian fraud vectors (particularly in Gujarat, Ahmedabad, and pan-India).
You analyze spoken dialogue and audio transcripts in Gujarati, Hindi, and Indian English.

You must identify:
1. Impersonation of police, CBI, Cyber Crime, customs, courts, or utility companies (PGVCL, UGVCL, Torrent Power, SBI, RBI).
2. "Digital Arrest" demands (threatening arrest via video/voice call, forcing isolation in a room).
3. Urgent demands to install Remote Access Tools (AnyDesk, QuickSupport, TeamViewer).
4. Direct extortion of OTPs, passwords, UPI PINs, or PAN/Aadhaar details.
5. Coerced wire transfers under the guise of "verification escrow", "security deposits", or "token fees".

Format your response strictly as a JSON object with this exact shape:
{
  "riskLevel": "High" | "Medium" | "Low" | "Unknown",
  "score": number (0-100),
  "warningSigns": string[],
  "evidence": string[],
  "recommendedAction": string,
  "language": "Gujarati" | "Hindi" | "Indian English",
  "category": string,
  "summary": string,
  "transcript": string
}
`;

  const contents: any[] = [];

  if (audioBuffer && audioBuffer.length > 0) {
    const base64Audio = audioBuffer.toString('base64');
    contents.push({
      inlineData: {
        data: base64Audio,
        mimeType: mimeType || 'audio/wav'
      }
    });
    contents.push({
      text: `Analyze this audio recording of a phone call. The declared language is ${declaredLanguage}. Transcribe the speech accurately and assess if this call is a telecom scam. If the audio is completely unintelligible or empty, set riskLevel to "Unknown".`
    });
  } else if (transcriptText) {
    contents.push({
      text: `Analyze this phone call dialogue transcript. The declared language is ${declaredLanguage}:\n\n"""\n${transcriptText}\n"""\n\nAssess whether this dialogue indicates telecom fraud or a scam.`
    });
  } else {
    throw new Error('Neither audio nor transcript was provided for Gemini analysis.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents,
    config: {
      systemInstruction,
      responseMimeType: 'application/json'
    }
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error('Gemini returned an empty response.');
  }

  try {
    const parsed = JSON.parse(responseText);

    let riskLevel: RiskLevel = 'Unknown';
    if (parsed.riskLevel === 'High' || parsed.riskLevel === 'Medium' || parsed.riskLevel === 'Low' || parsed.riskLevel === 'Unknown') {
      riskLevel = parsed.riskLevel;
    } else if (typeof parsed.score === 'number') {
      if (parsed.score >= 70) riskLevel = 'High';
      else if (parsed.score >= 40) riskLevel = 'Medium';
      else riskLevel = 'Low';
    }

    return {
      riskLevel,
      score: typeof parsed.score === 'number' ? parsed.score : (riskLevel === 'High' ? 85 : riskLevel === 'Medium' ? 50 : 15),
      warningSigns: Array.isArray(parsed.warningSigns) && parsed.warningSigns.length > 0 
        ? parsed.warningSigns 
        : ['No obvious fraud signatures found.'],
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
      recommendedAction: parsed.recommendedAction || 'Hang up immediately if caller asks for money or codes.',
      language: parsed.language || (declaredLanguage.startsWith('gu') ? 'Gujarati' : declaredLanguage.startsWith('hi') ? 'Hindi' : 'Indian English'),
      analysisSource: 'gemini',
      transcript: parsed.transcript || transcriptText || '',
      category: parsed.category || 'General Assessment',
      summary: parsed.summary || 'Gemini multi-modal telecom fraud evaluation complete.'
    };
  } catch (err) {
    throw new Error(`Failed to parse Gemini JSON output: ${err instanceof Error ? err.message : String(err)}`);
  }
}
