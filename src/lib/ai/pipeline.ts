import type { ShieldAssessment } from '../../types/shield.ts';
import { assessWithGemini } from './gemini.ts';
import { assessAudioWithSarvam, analyzeTranscriptWithLexicon } from './sarvam.ts';

export interface AnalysisInput {
  audioBuffer?: Buffer;
  mimeType?: string;
  transcriptText?: string;
  language?: string; // 'gu' | 'hi' | 'en' | 'gu-IN' | 'hi-IN' | 'en-IN'
}

/**
 * Robust Scam Shield Fallback Pipeline:
 * Step 1: Attempt Gemini multi-modal analysis.
 * Step 2: On Gemini failure, fallback to Sarvam Speech-to-Text + Contextual Regional Lexicon.
 * Step 3: If both fail, or text-only fallback is needed, run local lexicon or return structured Unknown assessment.
 * Never fabricate results or label calls safe on failure.
 */
export async function runScamShieldPipeline(input: AnalysisInput): Promise<ShieldAssessment> {
  const language = input.language || 'gu';
  let geminiError: string | null = null;
  let sarvamError: string | null = null;

  // Step 1: Try Gemini with an 18-second timeout for audio and text
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timed out after 18s')), 18000)
    );
    const assessment = await Promise.race([
      assessWithGemini(
        input.audioBuffer,
        input.mimeType,
        input.transcriptText,
        language
      ),
      timeoutPromise
    ]);
    return assessment;
  } catch (err) {
    geminiError = err instanceof Error ? err.message : String(err);
    console.warn('[ScamShield Pipeline] Gemini step failed, attempting fallback:', geminiError);
  }

  // Step 2: Try Sarvam + Local Lexicon
  if (input.audioBuffer && input.audioBuffer.length > 0) {
    try {
      const assessment = await assessAudioWithSarvam(
        input.audioBuffer,
        input.mimeType || 'audio/wav',
        language
      );
      // Annotate summary to indicate fallback
      assessment.summary = `[Fallback via Sarvam STT] ${assessment.summary}`;
      return assessment;
    } catch (err) {
      sarvamError = err instanceof Error ? err.message : String(err);
      console.warn('[ScamShield Pipeline] Sarvam step failed:', sarvamError);
    }
  }

  // Step 3: If transcript was supplied or local acoustic heuristics are available
  if (input.transcriptText && input.transcriptText.trim().length > 0) {
    const localAssessment = analyzeTranscriptWithLexicon(input.transcriptText, language);
    localAssessment.analysisSource = 'local_lexicon';
    localAssessment.summary = `[Local Lexicon Engine] ${localAssessment.summary} (Gemini: ${geminiError || 'skipped'})`;
    return localAssessment;
  }

  // Step 4: Unknown State - Never mark as safe when analysis failed!
  return {
    riskLevel: 'Unknown',
    score: 0,
    warningSigns: [
      `Analysis pipeline could not process audio.`,
      geminiError ? `Gemini API error: ${geminiError}` : 'Gemini unavailable',
      sarvamError ? `Sarvam API error: ${sarvamError}` : 'Sarvam unavailable'
    ],
    evidence: [],
    recommendedAction: 'Do not assume this call is safe. Verify caller through official independent channels or call Cyber Helpline 1930.',
    language: language.startsWith('gu') ? 'Gujarati' : language.startsWith('hi') ? 'Hindi' : 'Indian English',
    analysisSource: 'unknown',
    transcript: '',
    category: 'Analysis Incomplete',
    summary: 'Both primary AI (Gemini) and fallback provider (Sarvam) were unable to process the audio.',
    error: `Gemini: ${geminiError || 'none'}; Sarvam: ${sarvamError || 'none'}`
  };
}
