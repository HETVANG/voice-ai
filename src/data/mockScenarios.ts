import { CallScenario, ActiveCallRecord } from '../types/telecom';

export const SCENARIOS: CallScenario[] = [
  {
    id: 'scen-pgvcl-electricity',
    title: 'PGVCL / Torrent Power Disconnection Scam',
    category: 'utility_disconnection',
    primaryLanguage: 'gu',
    callerNumber: '+91 98250 11492 (Spoofed VoIP Gateway)',
    callerLocation: 'Jamtara Server via Cambodia Proxy',
    callerCarrier: 'SIP Virtual Trunk',
    targetNumber: '+91 94280 44819',
    targetName: 'Kiritbhai Patel (Senior Citizen, 68)',
    targetLocation: 'Vastrapur, Ahmedabad, Gujarat',
    initialRisk: 28,
    peakRisk: 96,
    description: 'Fraudster impersonates Gujarat electricity board (PGVCL/Torrent Power), claiming power will be cut off within 15 minutes unless an urgent APK/remote app is installed.',
    recommendedWhisperGu: 'ચેતવણી! PGVCL ક્યારેય ફોન પર પાવર કટ કરવાની ધમકી આપતી નથી કે એપ ડાઉનલોડ કરાવતી નથી. ફોન તરત કટ કરો.',
    recommendedWhisperHi: 'सावधान! बिजली विभाग कभी कॉल पर बिल भुगतान या ऐप डाउनलोड करने को नहीं कहता। कॉल तुरंत काटें।',
    recommendedWhisperEn: 'URGENT: Torrent Power / PGVCL never demands urgent remote app installation over phone. Disconnect immediately.',
    lines: [
      {
        id: 'l1',
        timestamp: '00:04',
        speaker: 'scammer',
        language: 'gu',
        text: 'નમસ્તે કિરીટભાઈ, હું અમદાવાદ PGVCL ઈલેક્ટ્રિસિટી હેડ ઓફિસથી ઓફિસર રાઠોડ બોલું છું.',
        translationEn: 'Hello Kiritbhai, I am Officer Rathod speaking from Ahmedabad PGVCL Electricity Head Office.',
        riskScoreDelta: 15,
        highlightedKeywords: ['PGVCL', 'ઓફિસર રાઠોડ'],
        fraudIndicators: ['Authority Impersonation', 'Target Name Recon']
      },
      {
        id: 'l2',
        timestamp: '00:11',
        speaker: 'citizen',
        language: 'gu',
        text: 'હા બોલો સાહેબ, શું કામ હતું? મેં તો ગયા મહિને જ બિલ ભરી દીધું છે.',
        translationEn: 'Yes sir, what is the matter? I already paid my electricity bill last month.',
        riskScoreDelta: 0
      },
      {
        id: 'l3',
        timestamp: '00:19',
        speaker: 'scammer',
        language: 'gu',
        text: 'તમારું બિલ સર્વરમાં અપડેટ નથી થયું. સિસ્ટમ ઓટોમેટિકલી આજે રાત્રે 9:30 વાગ્યે તમારું કનેક્શન કાપી નાખશે.',
        translationEn: 'Your bill did not update on the server. The automated system will disconnect your power tonight at 9:30 PM.',
        riskScoreDelta: 25,
        highlightedKeywords: ['સર્વરમાં અપડેટ નથી થયું', 'કનેક્શન કાપી નાખશે', '9:30 વાગ્યે'],
        fraudIndicators: ['Artificial Urgency', 'Threat of Disconnection']
      },
      {
        id: 'l4',
        timestamp: '00:28',
        speaker: 'citizen',
        language: 'gu',
        text: 'અરે પણ સાહેબ, ઘરમાં વડીલ બીમાર છે, લાઈટ બંધ થઈ જશે તો કેવી રીતે ચાલશે? કોઈ રસ્તો છે?',
        translationEn: 'Oh no sir, elders are sick at home, how can we manage if power cuts? Is there any way out?',
        riskScoreDelta: 5
      },
      {
        id: 'l5',
        timestamp: '00:36',
        speaker: 'scammer',
        language: 'gu',
        text: 'તમે ચિંતા ના કરો. પ્લે સ્ટોર ખોલો અને "QuickSupport" અથવા "AnyDesk" એપ ડાઉનલોડ કરો. ફક્ત ₹10 નું ટોકન અપડેટ કરવું પડશે.',
        translationEn: 'Do not worry. Open Play Store and download QuickSupport or AnyDesk app. You only have to pay a ₹10 token update.',
        riskScoreDelta: 30,
        highlightedKeywords: ['QuickSupport', 'AnyDesk', '₹10 નું ટોકન અપડેટ'],
        fraudIndicators: ['Remote Access Tool (RAT)', 'Sub-Rupee Micro-payment Trap']
      },
      {
        id: 'l6',
        timestamp: '00:48',
        speaker: 'scammer',
        language: 'gu',
        text: 'એપમાં 9 આંકડાનો કોડ દેખાશે તે મને તરત બોલો, અને ફોન બિલકુલ કટ ના કરતા નહીં તો લાઈટ કાયમ માટે બંધ થઈ જશે.',
        translationEn: 'Read out the 9-digit code shown in the app immediately, and do not disconnect the call or power will be terminated permanently.',
        riskScoreDelta: 21,
        highlightedKeywords: ['9 આંકડાનો કોડ', 'ફોન બિલકુલ કટ ના કરતા'],
        fraudIndicators: ['Session Hijacking Token', 'Isolation Coercion']
      }
    ]
  },
  {
    id: 'scen-digital-arrest',
    title: 'Digital Arrest / Cyber Crime Police Impersonation',
    category: 'digital_arrest',
    primaryLanguage: 'hi',
    callerNumber: '+91 22 2652 9900 (Spoofed Mumbai Police CLI)',
    callerLocation: 'Mewat/Nuh GSM Relay via Virtual PBX',
    callerCarrier: 'Interconnect Bypass',
    targetNumber: '+91 98791 20034',
    targetName: 'Dr. Meena Shah (Cardiologist, 54)',
    targetLocation: 'Bodakdev, Ahmedabad, Gujarat',
    initialRisk: 42,
    peakRisk: 99,
    description: 'Impersonators posing as CBI / Mumbai Police officers claim an illegal courier with narcotics and fake passports was registered with her Aadhaar, imposing unlawful "Digital Arrest".',
    recommendedWhisperGu: 'ચેતવણી! ભારતીય કાયદામાં "ડિજિટલ એરેસ્ટ" જેવું કોઈ પ્રાવધાન નથી. પોલીસ ક્યારેય વીડિયો કોલ પર અટકાયત કરતી નથી. ફોન કાપી 1930 ડાયલ કરો.',
    recommendedWhisperHi: 'अलर्ट! कानून में "डिजिटल अरेस्ट" का कोई प्रावधान नहीं है। पुलिस कभी फोन या वीडियो कॉल पर जमानत राशि नहीं मांगती। तुरंत 1930 पर कॉल करें।',
    recommendedWhisperEn: 'HIGH ALERT: "Digital Arrest" is a fictitious scam. Indian Law Enforcement never detains via video/phone call. Terminate call now.',
    lines: [
      {
        id: 'da-1',
        timestamp: '00:05',
        speaker: 'scammer',
        language: 'hi',
        text: 'डॉ. मीना शाह? मैं इंस्पेक्टर विक्रम राठौर, क्राइम ब्रांच मुंबई से बात कर रहा हूं।',
        translationEn: 'Dr. Meena Shah? I am Inspector Vikram Rathore speaking from Crime Branch Mumbai.',
        riskScoreDelta: 20,
        highlightedKeywords: ['इंस्पेक्टर विक्रम राठौर', 'क्राइम ब्रांच'],
        fraudIndicators: ['Police Impersonation', 'Badge Spoofing']
      },
      {
        id: 'da-2',
        timestamp: '00:14',
        speaker: 'citizen',
        language: 'en',
        text: 'Yes? Why is Mumbai Police calling my personal cell number?',
        translationEn: 'Yes? Why is Mumbai Police calling my personal cell number?',
        riskScoreDelta: 0
      },
      {
        id: 'da-3',
        timestamp: '00:22',
        speaker: 'scammer',
        language: 'hi',
        text: 'कैनरा बैंक में आपके आधार कार्ड से 16 फर्जी खाते खोले गए हैं, जिसमें 3.8 करोड़ रुपये की मनी लॉन्ड्रिंग और ड्रग्स कार्टेल का पैसा आया है।',
        translationEn: '16 fraudulent accounts were opened with your Aadhaar in Canara Bank involving ₹3.8 Crores from money laundering and a narcotics cartel.',
        riskScoreDelta: 35,
        highlightedKeywords: ['आधार कार्ड', 'मनी लॉन्ड्रिंग', 'ड्रग्स कार्टेल'],
        fraudIndicators: ['Severe Criminal Allegation', 'Fabricated PMLA Case']
      },
      {
        id: 'da-4',
        timestamp: '00:33',
        speaker: 'citizen',
        language: 'hi',
        text: 'क्या बकवास है! मेरा इससे कोई लेना-देना नहीं है। मैंने कभी मुंबई में खाता नहीं खोला!',
        translationEn: 'What nonsense! I have nothing to do with this. I never opened an account in Mumbai!',
        riskScoreDelta: 5
      },
      {
        id: 'da-5',
        timestamp: '00:44',
        speaker: 'scammer',
        language: 'hi',
        text: 'सुप्रीम कोर्ट के आदेश पर आप इस वक्त "डिजिटल अरेस्ट" के तहत हैं। कमरे का दरवाजा बंद करें। किसी को बताया तो जेल होगी।',
        translationEn: 'Under Supreme Court directives, you are now under "Digital Arrest". Lock your room door. If you tell anyone, you will be jailed.',
        riskScoreDelta: 30,
        highlightedKeywords: ['डिजिटल अरेस्ट', 'कमरे का दरवाजा बंद करें', 'जेल होगी'],
        fraudIndicators: ['Fictitious "Digital Arrest"', 'Hostage Isolation Demand']
      },
      {
        id: 'da-6',
        timestamp: '00:58',
        speaker: 'scammer',
        language: 'en',
        text: 'To avoid non-bailable warrant, immediately deposit 15 lakh rupees into RBI secret verification escrow account for forensic clearance.',
        translationEn: 'To avoid non-bailable warrant, immediately deposit 15 lakh rupees into RBI secret verification escrow account for forensic clearance.',
        riskScoreDelta: 9,
        highlightedKeywords: ['RBI secret verification escrow', 'deposit 15 lakh rupees', 'non-bailable warrant'],
        fraudIndicators: ['Bogus RBI Escrow', 'Extortion Coercion']
      }
    ]
  },
  {
    id: 'scen-sbi-kyc',
    title: 'SBI / Bank Account KYC Suspension Fraud',
    category: 'kyc_suspension',
    primaryLanguage: 'gu',
    callerNumber: '+91 79 4001 8234 (Spoofed Toll-Free)',
    callerLocation: 'Deoghar Call Center Hub',
    callerCarrier: 'Cloud PBX Forwarder',
    targetNumber: '+91 99245 88120',
    targetName: 'Hasmukhbhai Soni (Jeweller, 61)',
    targetLocation: 'Maninagar, Ahmedabad, Gujarat',
    initialRisk: 22,
    peakRisk: 94,
    description: 'Scammer warns of imminent SBI NetBanking deactivation due to expired PAN-Aadhaar linking, attempting to capture SMS OTP over the phone.',
    recommendedWhisperGu: 'સાવધાન! સ્ટેટ બેંક ક્યારેય OTP કે આધાર લિંક માટે ફોન કરતી નથી. કોઈપણ OTP આપશો નહીં.',
    recommendedWhisperHi: 'चेतावनी! बैंक कभी फोन पर ओटीपी या पासवर्ड नहीं मांगता। अपना ओटीपी किसी से साझा न करें।',
    recommendedWhisperEn: 'ALERT: SBI will NEVER call asking for OTP or PAN-Aadhaar verification. Do NOT disclose verification codes.',
    lines: [
      {
        id: 'sbi-1',
        timestamp: '00:03',
        speaker: 'scammer',
        language: 'gu',
        text: 'નમસ્કાર હસમુખભાઈ, સ્ટેટ બેંક ઓફ ઇન્ડિયા કસ્ટમર વેરિફિકેશન સેલ અમદાવાદથી કોલ છે.',
        translationEn: 'Greetings Hasmukhbhai, this is State Bank of India Customer Verification Cell, Ahmedabad.',
        riskScoreDelta: 12,
        highlightedKeywords: ['સ્ટેટ બેંક ઓફ ઇન્ડિયા', 'વેરિફિકેશન સેલ'],
        fraudIndicators: ['Bank Brand Spoofing']
      },
      {
        id: 'sbi-2',
        timestamp: '00:10',
        speaker: 'citizen',
        language: 'gu',
        text: 'હા બોલો, મારી તો આખી જિંદગીનું ખાતું તમારી બ્રાન્ચમાં જ છે.',
        translationEn: 'Yes tell me, my lifelong account is in your branch only.',
        riskScoreDelta: 0
      },
      {
        id: 'sbi-3',
        timestamp: '00:18',
        speaker: 'scammer',
        language: 'gu',
        text: 'તમારું PAN કાર્ડ આધાર સાથે લિંક નથી થયું. જો 1 કલાકમાં અપડેટ નહીં કરો તો ખાતું ફ્રીઝ થઈ જશે અને ₹10,000 દંડ લાગશે.',
        translationEn: 'Your PAN card is not linked with Aadhaar. If not updated within 1 hour, account will be frozen with ₹10,000 fine.',
        riskScoreDelta: 32,
        highlightedKeywords: ['ખાતું ફ્રીઝ થઈ જશે', '₹10,000 દંડ', '1 કલાકમાં'],
        fraudIndicators: ['Penalty Extortion', 'Financial Deadline Panic']
      },
      {
        id: 'sbi-4',
        timestamp: '00:27',
        speaker: 'citizen',
        language: 'gu',
        text: 'ના સાહેબ, આવતીકાલે સવારે તો ચેક ક્લિયર થવાનો છે! કેવી રીતે અપડેટ થશે?',
        translationEn: 'No sir, tomorrow morning my clearing cheque is due! How can it be updated?',
        riskScoreDelta: 5
      },
      {
        id: 'sbi-5',
        timestamp: '00:37',
        speaker: 'scammer',
        language: 'gu',
        text: 'મેં તમારા ફોન પર બેંકનું સિક્યોર ઓનલાઈન પોર્ટલ પેકેટ મોકલ્યું છે. એમાં આવેલો 6 અંકનો વન ટાઈમ પાસવર્ડ (OTP) મને તરત બોલો.',
        translationEn: 'I have dispatched a secure banking portal packet to your phone. Dictate the 6-digit One Time Password (OTP) immediately.',
        riskScoreDelta: 45,
        highlightedKeywords: ['6 અંકનો વન ટાઈમ પાસવર્ડ', 'OTP', 'તરત બોલો'],
        fraudIndicators: ['Direct OTP Interception', 'Credential Theft Vector']
      }
    ]
  },
  {
    id: 'scen-fedex-customs',
    title: 'FedEx / Mumbai Customs Narcotics Trap',
    category: 'customs_courier',
    primaryLanguage: 'en',
    callerNumber: '+91 80 4911 3320 (Automated IVR Spoof)',
    callerLocation: 'Bangkok Gateway VOIP Route',
    callerCarrier: 'Overseas Gateway Direct',
    targetNumber: '+91 97129 19402',
    targetName: 'Rohan Trivedi (Software Engineer, 29)',
    targetLocation: 'Infocity, Gandhinagar, Gujarat',
    initialRisk: 35,
    peakRisk: 91,
    description: 'Robocall claiming an overseas parcel to Taiwan contained MDMA narcotics and stolen passports, transferring to fake customs agent.',
    recommendedWhisperGu: 'સાવધાન! ફેડેક્સ કે કસ્ટમ્સ ક્યારેય ફોન પર કેસ પતાવવા પૈસા નથી માંગતા. કોલ કટ કરો.',
    recommendedWhisperHi: 'अलर्ट! कूरियर या कस्टम विभाग फोन पर ड्रग्स जब्ती या मनी ट्रांसफर की बात नहीं करता।',
    recommendedWhisperEn: 'FRAUD ALERT: FedEx international courier scam detected. Never transfer money to arbitrary bank accounts for "customs clearance".',
    lines: [
      {
        id: 'fd-1',
        timestamp: '00:04',
        speaker: 'scammer',
        language: 'en',
        text: 'Automated notification from FedEx Logistics. Your package tracking ID FD-88291 to Taipei has been intercepted by customs.',
        translationEn: 'Automated notification from FedEx Logistics. Your package tracking ID FD-88291 to Taipei has been intercepted by customs.',
        riskScoreDelta: 25,
        highlightedKeywords: ['FedEx Logistics', 'intercepted by customs'],
        fraudIndicators: ['Robocall Spoofing', 'Logistics Impersonation']
      },
      {
        id: 'fd-2',
        timestamp: '00:15',
        speaker: 'citizen',
        language: 'en',
        text: 'Wait, I never dispatched any parcel to Taiwan. Who booked this parcel?',
        translationEn: 'Wait, I never dispatched any parcel to Taiwan. Who booked this parcel?',
        riskScoreDelta: 0
      },
      {
        id: 'fd-3',
        timestamp: '00:24',
        speaker: 'scammer',
        language: 'hi',
        text: 'सर, पार्सल में 140 ग्राम MDMA ड्रग्स और 5 फर्जी पासपोर्ट पाए गए हैं। नारकोटिक्स कंट्रोल ब्यूरो (NCB) ने FIR दर्ज कर ली है।',
        translationEn: 'Sir, 140g MDMA drugs and 5 fake passports were discovered in the package. Narcotics Control Bureau has filed an FIR.',
        riskScoreDelta: 38,
        highlightedKeywords: ['MDMA ड्रग्स', 'नारकोटिक्स कंट्रोल ब्यूरो', 'FIR'],
        fraudIndicators: ['Narcotics Blackmail', 'Criminal Threat Weaponization']
      },
      {
        id: 'fd-4',
        timestamp: '00:36',
        speaker: 'scammer',
        language: 'en',
        text: 'If you want to clear your name, transfer ₹2.5 Lakhs to the Treasury Clearance Escrow via immediate IMPS payment right now.',
        translationEn: 'If you want to clear your name, transfer ₹2.5 Lakhs to the Treasury Clearance Escrow via immediate IMPS payment right now.',
        riskScoreDelta: 28,
        highlightedKeywords: ['Treasury Clearance Escrow', 'transfer ₹2.5 Lakhs', 'IMPS payment'],
        fraudIndicators: ['Coerced Wire Transfer', 'Extortion']
      }
    ]
  },
  {
    id: 'scen-nominal-call',
    title: 'Nominal Benchmark: Pharmacy Prescription Call',
    category: 'nominal_verified',
    primaryLanguage: 'gu',
    callerNumber: '+91 79 2685 4100 (Verified Landline)',
    callerLocation: 'Ahmedabad West Telecom Exchange',
    callerCarrier: 'BSNL Fixed Network',
    targetNumber: '+91 98254 99112',
    targetName: 'Neelamben Dave',
    targetLocation: 'Paldi, Ahmedabad, Gujarat',
    initialRisk: 2,
    peakRisk: 6,
    description: 'Routine verified prescription verification call from local registered pharmacy. Baseline to verify zero false positives.',
    recommendedWhisperGu: 'આ કોલ સામાન્ય અને સુરક્ષિત છે.',
    recommendedWhisperHi: 'यह सामान्य और सुरक्षित कॉल है।',
    recommendedWhisperEn: 'Normal verified legitimate transaction. No threat detected.',
    lines: [
      {
        id: 'nom-1',
        timestamp: '00:03',
        speaker: 'scammer',
        language: 'gu',
        text: 'નમસ્તે નીલમબેન, એપોલો ફાર્મસી પાલડીથી ફાર્માસિસ્ટ મનીષ બોલું છું. તમારા ડાયાબિટીસની દવા રેડી છે.',
        translationEn: 'Hello Neelamben, Pharmacist Manish speaking from Apollo Pharmacy Paldi. Your diabetes medicine is ready.',
        riskScoreDelta: 1
      },
      {
        id: 'nom-2',
        timestamp: '00:10',
        speaker: 'citizen',
        language: 'gu',
        text: 'હા મનીષભાઈ, શું સાંજે હોમ ડિલિવરી મોકલી શકશો? હું રોકડા આપી દઈશ.',
        translationEn: 'Yes Manishbhai, can you send home delivery this evening? I will pay cash.',
        riskScoreDelta: 1
      },
      {
        id: 'nom-3',
        timestamp: '00:17',
        speaker: 'scammer',
        language: 'gu',
        text: 'ચોક્કસ, સાંજે 5:00 વાગ્યે ડિલિવરી બોય આવી જશે. બિલ ₹420 થયું છે. આભાર.',
        translationEn: 'Sure, delivery boy will arrive at 5:00 PM. The bill is ₹420. Thank you.',
        riskScoreDelta: 1
      }
    ]
  }
];

export const MOCK_ACTIVE_CALLS: ActiveCallRecord[] = [
  {
    id: 'CALL-GJ-88219',
    callerCLI: '+91 98250 11492',
    isSpoofed: true,
    targetNumber: '+91 94280 44819',
    targetName: 'Kiritbhai Patel',
    circle: 'Gujarat (Ahmedabad)',
    cellTower: 'Tower GJ-AHM-049 (Vastrapur Lake)',
    language: 'gu',
    scamType: 'utility_disconnection',
    riskScore: 96,
    status: 'warning_whispered',
    durationSeconds: 148,
    packetsAnalyzed: 1840,
    interventionsTriggered: 2
  },
  {
    id: 'CALL-GJ-88220',
    callerCLI: '+91 22 2652 9900',
    isSpoofed: true,
    targetNumber: '+91 98791 20034',
    targetName: 'Dr. Meena Shah',
    circle: 'Gujarat (Ahmedabad)',
    cellTower: 'Tower GJ-AHM-112 (Bodakdev SG Highway)',
    language: 'hi',
    scamType: 'digital_arrest',
    riskScore: 99,
    status: 'call_severed',
    durationSeconds: 212,
    packetsAnalyzed: 2650,
    interventionsTriggered: 3
  },
  {
    id: 'CALL-GJ-88221',
    callerCLI: '+91 79 4001 8234',
    isSpoofed: true,
    targetNumber: '+91 99245 88120',
    targetName: 'Hasmukhbhai Soni',
    circle: 'Gujarat (Ahmedabad)',
    cellTower: 'Tower GJ-AHM-018 (Maninagar Cross)',
    language: 'gu',
    scamType: 'kyc_suspension',
    riskScore: 94,
    status: 'active_monitoring',
    durationSeconds: 84,
    packetsAnalyzed: 920,
    interventionsTriggered: 1
  },
  {
    id: 'CALL-GJ-88222',
    callerCLI: '+91 80 4911 3320',
    isSpoofed: true,
    targetNumber: '+91 97129 19402',
    targetName: 'Rohan Trivedi',
    circle: 'Gujarat (Gandhinagar)',
    cellTower: 'Tower GJ-GNR-007 (Infocity Sector 0)',
    language: 'en',
    scamType: 'customs_courier',
    riskScore: 91,
    status: 'active_monitoring',
    durationSeconds: 62,
    packetsAnalyzed: 740,
    interventionsTriggered: 1
  },
  {
    id: 'CALL-GJ-88223',
    callerCLI: '+91 98980 33412',
    isSpoofed: false,
    targetNumber: '+91 98251 77210',
    targetName: 'Sanjaybhai Mehta',
    circle: 'Gujarat (Surat)',
    cellTower: 'Tower GJ-SRT-082 (Varachha Ring Rd)',
    language: 'gu',
    scamType: 'lottery_reward',
    riskScore: 88,
    status: 'warning_whispered',
    durationSeconds: 110,
    packetsAnalyzed: 1200,
    interventionsTriggered: 2
  },
  {
    id: 'CALL-GJ-88224',
    callerCLI: '+91 79 2685 4100',
    isSpoofed: false,
    targetNumber: '+91 98254 99112',
    targetName: 'Neelamben Dave',
    circle: 'Gujarat (Ahmedabad)',
    cellTower: 'Tower GJ-AHM-031 (Paldi Bhattha)',
    language: 'gu',
    scamType: 'nominal_verified',
    riskScore: 4,
    status: 'cleared',
    durationSeconds: 95,
    packetsAnalyzed: 1050,
    interventionsTriggered: 0
  }
];

export const FRAUD_TAXONOMY = [
  {
    code: 'TAX-01',
    name: 'Digital Arrest / Fake Police Warrant',
    languages: ['Hindi', 'English', 'Gujarati'],
    triggerTokens: ['CBI', 'Cyber Crime', 'Digital Arrest', 'Money Laundering', 'Supreme Court', 'PMLA', 'Escrow account'],
    severity: 'CRITICAL',
    statGjAhmedabad: '₹42.8 Cr lost in Gujarat (2024-2025)',
    modusOperandi: 'Fraudsters keep targets on non-stop video/voice calls for 4 to 72 hours, coercing RTGS/IMPS transfers to bogus "RBI forensic verification" accounts.'
  },
  {
    code: 'TAX-02',
    name: 'Utility Cutoff / Power Bill Scam',
    languages: ['Gujarati', 'Hindi'],
    triggerTokens: ['PGVCL', 'UGVCL', 'Torrent Power', 'લાઈટ બિલ', 'કનેક્શન કાપી નાખશે', 'QuickSupport', 'AnyDesk', '₹10 ટોકન'],
    severity: 'HIGH',
    statGjAhmedabad: '3,800+ complaints lodged at Cyber Cell 1930 Ahmedabad',
    modusOperandi: 'Sent via SMS / fake calls threatening immediate power blackout. Victims lured into installing remote-access tools under the guise of paying a nominal ₹10 reconnect fee.'
  },
  {
    code: 'TAX-03',
    name: 'Bank KYC / Aadhaar-PAN Suspension',
    languages: ['Gujarati', 'Hindi', 'English'],
    triggerTokens: ['SBI Yono', 'Account Freeze', 'PAN Card Link', 'OTP', 'ખાતું બ્લોક', '6 અંકનો પાસવર્ડ', 'NetBanking'],
    severity: 'HIGH',
    statGjAhmedabad: 'Over 12,000 cases registered across Gujarat telecom circles',
    modusOperandi: 'Impersonates SBI, HDFC, or Bank of Baroda. Triggers urgent panic about cheque bounce or fine, tricking the citizen into dictating the incoming 2FA SMS code.'
  },
  {
    code: 'TAX-04',
    name: 'FedEx / Customs Narcotics Trap',
    languages: ['English', 'Hindi'],
    triggerTokens: ['FedEx', 'DHL', 'Customs Mumbai', 'MDMA', 'Narcotics Control Bureau', 'Passport seized', 'Taipei', 'Clearance Fee'],
    severity: 'CRITICAL',
    statGjAhmedabad: 'Frequently targets tech professionals in Gandhinagar & SG Highway IT corridors',
    modusOperandi: 'Automated robocalls transfer victims to fake customs officials who threaten non-bailable arrest unless immediate "escrow verification" funds are wired.'
  }
];
