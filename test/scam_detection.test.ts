import { analyzeTranscriptWithLexicon } from '../src/lib/ai/sarvam';
import { runScamShieldPipeline } from '../src/lib/ai/pipeline';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('--- Running Scam Call Shield Unit Tests ---\n');

  // Test 1: Gujarati PGVCL Scam Detection
  console.log('Test 1: Gujarati PGVCL Power Cutoff Scam Detection');
  const gujaratiScam = 'નમસ્તે, હું PGVCL ઓફિસથી બોલું છું. તમારું લાઈટ બિલ બાકી છે અને આજે રાત્રે કનેક્શન કાપી નાખવામાં આવશે. તાત્કાલિક QuickSupport અથવા AnyDesk ડાઉનલોડ કરીને ₹10 નું ટોકન ભરો.';
  const gujaratiResult = analyzeTranscriptWithLexicon(gujaratiScam, 'gu');
  assert(gujaratiResult.riskLevel === 'High', `Expected High risk, got ${gujaratiResult.riskLevel}`);
  assert(gujaratiResult.score >= 80, `Expected score >= 80, got ${gujaratiResult.score}`);
  assert(gujaratiResult.category?.includes('Electricity') || gujaratiResult.category?.includes('Fraud') || false, 'Expected Electricity Bill Fraud category');
  assert(gujaratiResult.warningSigns.length > 0, 'Expected detected warning signs');
  console.log('✓ Passed: Gujarati PGVCL scam correctly flagged as High Risk with specific warning signs.\n');

  // Test 2: Hindi Digital Arrest Scam Detection
  console.log('Test 2: Hindi Digital Arrest & Police Impersonation Detection');
  const hindiScam = 'मैं इंस्पेक्टर विक्रम राठौर मुंबई साइबर क्राइम ब्रांच से बोल रहा हूं। आपके आधार कार्ड से मनी लॉन्ड्रिंग हुई है। सुप्रीम कोर्ट के तहत आप डिजिटल अरेस्ट पर हैं। कमरे का दरवाजा बंद करें।';
  const hindiResult = analyzeTranscriptWithLexicon(hindiScam, 'hi');
  assert(hindiResult.riskLevel === 'High', `Expected High risk, got ${hindiResult.riskLevel}`);
  assert(hindiResult.score >= 85, `Expected score >= 85, got ${hindiResult.score}`);
  assert(hindiResult.category?.includes('Digital Arrest') || false, 'Expected Digital Arrest category');
  console.log('✓ Passed: Hindi Digital Arrest scam correctly identified.\n');

  // Test 3: SBI KYC & OTP Phishing
  console.log('Test 3: Bank KYC Account Freeze & OTP Extortion');
  const bankScam = 'તમારું સ્ટેટ બેંક ખાતું બ્લોક થઈ ગયું છે. અનબ્લોક કરવા માટે મોબાઈલ પર આવેલો 6 અંકનો OTP વેરિફિકેશન કોડ તરત બોલો.';
  const bankResult = analyzeTranscriptWithLexicon(bankScam, 'gu');
  assert(bankResult.riskLevel === 'High', `Expected High risk, got ${bankResult.riskLevel}`);
  assert(bankResult.evidence.length > 0, 'Expected evidence phrases extracted');
  console.log('✓ Passed: Bank KYC OTP theft detected.\n');

  // Test 4: Legitimate Nominal Call (Zero False Positive Check)
  console.log('Test 4: Legitimate Pharmacy Delivery Call (Zero False Positive Check)');
  const nominalCall = 'Hello, this is Manish from Apollo Pharmacy confirming your prescription for home delivery this evening. The total is 420 rupees cash on delivery.';
  const nominalResult = analyzeTranscriptWithLexicon(nominalCall, 'en');
  assert(nominalResult.riskLevel === 'Low', `Expected Low risk, got ${nominalResult.riskLevel}`);
  assert(nominalResult.score <= 30, `Expected score <= 30, got ${nominalResult.score}`);
  console.log('✓ Passed: Legitimate delivery call flagged as Low Risk / Nominal.\n');

  // Test 5: Fallback & Error Integrity Check
  console.log('Test 5: Fallback & Unknown State Integrity (Never label failed calls safe)');
  const emptyAudioResult = await runScamShieldPipeline({
    audioBuffer: Buffer.from([]),
    transcriptText: '',
    language: 'gu'
  });
  assert(emptyAudioResult.riskLevel === 'Unknown', `Expected Unknown risk on empty/failed audio, got ${emptyAudioResult.riskLevel}`);
  assert(emptyAudioResult.analysisSource === 'unknown', 'Expected analysisSource unknown');
  console.log('✓ Passed: Failure pipeline safely reports Unknown state instead of false safe rating.\n');

  console.log('========================================');
  console.log('All 5 Scam Call Shield tests passed successfully!');
  console.log('========================================');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
