// ============================================================
// GAME DATA — Fictional Candidates (Level 4)
// Indian-sounding names, fictional parties — politically neutral
// ============================================================

export const CANDIDATES = [
  {
    id: 1,
    name: "Rajiv Sharma",
    party: "Bharatiya Vikas Dal",
    abbr: "BVD",
    symbol: "🌅",
    symbolName: "Rising Sun",
    color: "#FF6B35",
    manifesto: "Infrastructure development, rural employment, and digital connectivity for all citizens.",
  },
  {
    id: 2,
    name: "Priya Iyer",
    party: "Janashakti Party",
    abbr: "JSP",
    symbol: "🌳",
    symbolName: "Banyan Tree",
    color: "#2ECC71",
    manifesto: "Education reform, women empowerment, and sustainable environmental policies.",
  },
  {
    id: 3,
    name: "Mohammed Khan",
    party: "Rashtriya Ekta Manch",
    abbr: "REM",
    symbol: "📖",
    symbolName: "Open Book",
    color: "#3498DB",
    manifesto: "Minority rights, free education up to graduation, and healthcare for all.",
  },
  {
    id: 4,
    name: "Anita Das",
    party: "Pragatisheel Samaj Dal",
    abbr: "PSD",
    symbol: "🌾",
    symbolName: "Wheat Sheaf",
    color: "#F39C12",
    manifesto: "Farmers' rights, cooperative banking, and affordable housing for working class.",
  },
];

// ============================================================
// VALID DOCUMENTS (Level 2)
// ============================================================
export const DOCUMENTS = [
  {
    id: "epic",
    name: "Voter ID (EPIC)",
    valid: true,
    icon: "🪪",
    description: "Electoral Photo Identity Card issued by ECI",
    reason: "Primary ECI-issued document. Always accepted.",
  },
  {
    id: "aadhaar",
    name: "Aadhaar Card",
    valid: true,
    icon: "🔵",
    description: "Unique Identification Authority of India",
    reason: "Accepted as valid ID proof under ECI notification.",
  },
  {
    id: "passport",
    name: "Passport",
    valid: true,
    icon: "📕",
    description: "Government of India Passport",
    reason: "Valid photo ID accepted by ECI. Many first-timers don't know this!",
    isRare: true,
  },
  {
    id: "mnrega",
    name: "MNREGA Job Card",
    valid: true,
    icon: "🟩",
    description: "Mahatma Gandhi NREGA Photo Card",
    reason: "Specifically accepted by ECI for rural voters.",
    isRare: true,
  },
  {
    id: "college",
    name: "College ID Card",
    valid: false,
    icon: "🎓",
    description: "University/College Identity Card",
    reason:
      "While it has your photo, ECI does not accept private or institutional ID cards.",
  },
  {
    id: "pan",
    name: "PAN Card",
    valid: false,
    icon: "💳",
    description: "Permanent Account Number Card (Income Tax)",
    reason:
      "PAN is a government-issued document, but it is NOT in the ECI's approved list for voter identification.",
  },
  {
    id: "electricity",
    name: "Electricity Bill",
    valid: false,
    icon: "🔌",
    description: "Monthly Electricity Bill",
    reason:
      "This is an address proof, not an identity proof. ECI requires photo-bearing identity documents.",
  },
];

// ============================================================
// IP SCORING SYSTEM
// ============================================================
export const IP_EVENTS = {
  // Level 0 - Registration
  CORRECT_AGE_FIRST_TRY: { points: 10, tier: 2 },
  CORRECT_AGE_AFTER_ERROR: { points: 5, tier: 2 },
  CORRECT_CONSTITUENCY: { points: 10, tier: 2 },
  CONSTITUENCY_WITH_HELP: { points: 5, tier: 2 },

  // Level 1 - Campaign Gauntlet
  DECLINE_BRIBE_BEFORE_AI: { points: 25, tier: 1, bonus: 5 }, // 20 + 5 quick reflex
  DECLINE_BRIBE_AFTER_AI: { points: 20, tier: 1 },
  ACCEPT_BRIBE: { points: -50, tier: 1, disqualifyRisk: true },
  DECLINE_TRANSPORT: { points: 15, tier: 1 },
  ACCEPT_TRANSPORT: { points: 0, tier: 1 }, // Subtle — no penalty, just teaching
  DECLINE_PEER_PRESSURE: { points: 10, tier: 2 },

  // Level 2 - Document Wallet
  CORRECT_DOC_FIRST_TRY: { points: 10, tier: 2 },
  CORRECT_DOC_RARE: { points: 20, tier: 2, bonus: 10 }, // Passport or MNREGA
  WRONG_DOC: { points: -5, tier: 2 },

  // Level 3 - Three Officer Protocol
  CORRECT_NAME_CONFIRM: { points: 10, tier: 2 },
  CATCH_NAME_DISCREPANCY: { points: 15, tier: 3 },
  SIGN_FORM_17A: { points: 10, tier: 2 },
  REPORT_FAKE_INK: { points: 20, tier: 1 },
  IGNORE_FAKE_INK: { points: -10, tier: 3 },

  // Level 4 - EVM Voting
  WATCH_VVPAT_FULL: { points: 15, tier: 3 },
  DISMISS_VVPAT_EARLY: { points: -10, tier: 3 },
  REPORT_VVPAT_MISMATCH: { points: 20, tier: 1 },
  IGNORE_VVPAT_MISMATCH: { points: -15, tier: 3 },
  CHECK_INK_EASTER_EGG: { points: 5, tier: 3 },
};

export const IP_THRESHOLDS = {
  DISQUALIFICATION: 20,
  PASSIVE_SPECTATOR_MAX: 40,
  CONSCIOUS_CITIZEN_MAX: 80,
  // Above 80 = Guardian of Democracy
};

export const VOTER_PROFILES = [
  {
    id: "passive",
    title: "The Passive Spectator",
    emoji: "👁️",
    badge: "passive_spectator",
    color: "#E74C3C",
    message:
      "You voted, but you were easily misled or missed key steps. Democracy needs you to be more alert!",
    range: "0 – 40 IP",
  },
  {
    id: "conscious",
    title: "The Conscious Citizen",
    emoji: "🗳️",
    badge: "conscious_citizen",
    color: "#F39C12",
    message:
      "Good job! You followed the rules and successfully navigated the polling station.",
    range: "41 – 80 IP",
  },
  {
    id: "guardian",
    title: "The Guardian of Democracy",
    emoji: "🛡️",
    badge: "guardian_democracy",
    color: "#27AE60",
    message:
      "Perfect! You resisted all influence, verified your vote, and acted as a model for others.",
    range: "81+ IP",
  },
];

// ============================================================
// ELECTORAL ROLL DATA (Level 3)
// ============================================================
export const ELECTORAL_ROLL_ENTRIES = [
  { serial: 243, name: "Amit Roy", age: 34 },
  { serial: 244, name: "Sunita Bose", age: 28 },
  { serial: 245, name: "Ramesh Gupta", age: 52 },
  { serial: 246, name: "Fatima Begum", age: 41 },
  // Player's entry is dynamically inserted as serial 247
  { serial: 248, name: "Lakshmi Nair", age: 22 },
  { serial: 249, name: "Suresh Patel", age: 67 },
];

// ============================================================
// MULTILINGUAL UI STRINGS
// ============================================================
export const TRANSLATIONS = {
  en: {
    // Navigation
    startGame: "Start the Game",
    learn: "How to Play",
    about: "About",
    home: "Home",
    exit: "Exit",
    // Game UI
    integrityPoints: "Integrity Points",
    vivekTitle: "Vivek — Democratic Conscience",
    askVivek: "Ask Vivek anything...",
    // Level names
    level0: "Voter Registration",
    level1: "The Campaign Gauntlet",
    level2: "The Document Wallet",
    level3: "The Three-Officer Protocol",
    level4: "The Voting Compartment",
    level5: "Result Day",
    // Buttons
    decline: "Decline",
    accept: "Accept",
    submit: "Submit",
    continue: "Continue",
    restart: "Try Again",
    back: "Back",
    skip: "Skip",
    // Level 2
    pickDocument: "Pick your valid ID document",
    // Level 4
    chooseCandidate: "Choose your candidate",
    beginVoting: "Begin Voting",
    // Level 3
    extendFinger: "Extend Left Forefinger",
    confirmIdentity: "Yes, that's me!",
    reportFraud: "Report to Presiding Officer",
    ignore: "Ignore",
    proceedBooth: "Proceed to Voting Compartment",
    // Character create
    yourName: "Your Name",
    enterName: "Enter your character's name...",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    beginJourney: "Begin My Journey",
    chooseLanguage: "Choose Your Language",
    createVoter: "Create Your Voter",
    // Errors
    nameError: "Please enter a name of at least 2 characters.",
    genderError: "Please select a gender to continue.",
    // Results
    winner: "WINNER",
    turnout: "Voter Turnout",
    voted: "Voted",
    didNotVote: "Didn't Vote",
    // Certificate
    downloadCert: "Download Certificate",
    returnHome: "Return Home",
    playAgain: "Play Again",
    yourVoterProfile: "Your Voter Profile",
  },

  hi: {
    // Navigation
    startGame: "खेल शुरू करें",
    learn: "कैसे खेलें",
    about: "हमारे बारे में",
    home: "होम",
    exit: "बाहर निकलें",
    // Game UI
    integrityPoints: "अखंडता अंक",
    vivekTitle: "विवेक — लोकतांत्रिक विवेक",
    askVivek: "विवेक से कुछ भी पूछें...",
    // Level names
    level0: "मतदाता पंजीकरण",
    level1: "चुनाव प्रचार की चुनौती",
    level2: "दस्तावेज़ वॉलेट",
    level3: "तीन अधिकारी प्रोटोकॉल",
    level4: "मतदान कक्ष",
    level5: "परिणाम दिवस",
    // Buttons
    decline: "अस्वीकार करें",
    accept: "स्वीकार करें",
    submit: "जमा करें",
    continue: "आगे बढ़ें",
    restart: "फिर से कोशिश करें",
    back: "वापस",
    skip: "छोड़ें",
    // Level 2
    pickDocument: "अपना वैध पहचान पत्र चुनें",
    // Level 4
    chooseCandidate: "अपना उम्मीदवार चुनें",
    beginVoting: "मतदान शुरू करें",
    // Level 3
    extendFinger: "बाईं तर्जनी आगे बढ़ाएं",
    confirmIdentity: "हां, वो मैं हूं!",
    reportFraud: "पीठासीन अधिकारी को रिपोर्ट करें",
    ignore: "अनदेखा करें",
    proceedBooth: "मतदान कक्ष में जाएं",
    // Character create
    yourName: "आपका नाम",
    enterName: "अपने किरदार का नाम दर्ज करें...",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    beginJourney: "मेरी यात्रा शुरू करें",
    chooseLanguage: "अपनी भाषा चुनें",
    createVoter: "अपना मतदाता बनाएं",
    // Errors
    nameError: "कृपया कम से कम 2 अक्षरों का नाम दर्ज करें।",
    genderError: "जारी रखने के लिए कृपया लिंग चुनें।",
    // Results
    winner: "विजेता",
    turnout: "मतदाता मतदान",
    voted: "मतदान किया",
    didNotVote: "मतदान नहीं किया",
    // Certificate
    downloadCert: "प्रमाण पत्र डाउनलोड करें",
    returnHome: "होम पर वापस जाएं",
    playAgain: "फिर से खेलें",
    yourVoterProfile: "आपकी मतदाता प्रोफ़ाइल",
  },

  bn: {
    // Navigation
    startGame: "খেলা শুরু করুন",
    learn: "কীভাবে খেলবেন",
    about: "আমাদের সম্পর্কে",
    home: "হোম",
    exit: "বের হন",
    // Game UI
    integrityPoints: "সততা পয়েন্ট",
    vivekTitle: "বিবেক — গণতান্ত্রিক চেতনা",
    askVivek: "বিবেককে যেকোনো কিছু জিজ্ঞেস করুন...",
    // Level names
    level0: "ভোটার নিবন্ধন",
    level1: "প্রচারণার চ্যালেঞ্জ",
    level2: "ডকুমেন্ট ওয়ালেট",
    level3: "তিন অফিসার প্রোটোকল",
    level4: "ভোটদান কক্ষ",
    level5: "ফলাফল দিবস",
    // Buttons
    decline: "প্রত্যাখ্যান করুন",
    accept: "গ্রহণ করুন",
    submit: "জমা দিন",
    continue: "এগিয়ে যান",
    restart: "আবার চেষ্টা করুন",
    back: "পিছনে",
    skip: "এড়িয়ে যান",
    // Level 2
    pickDocument: "আপনার বৈধ পরিচয়পত্র বেছে নিন",
    // Level 4
    chooseCandidate: "আপনার প্রার্থী বেছে নিন",
    beginVoting: "ভোট দেওয়া শুরু করুন",
    // Level 3
    extendFinger: "বাম তর্জনী এগিয়ে দিন",
    confirmIdentity: "হ্যাঁ, আমিই!",
    reportFraud: "প্রিসাইডিং অফিসারকে জানান",
    ignore: "উপেক্ষা করুন",
    proceedBooth: "ভোটদান কক্ষে যান",
    // Character create
    yourName: "আপনার নাম",
    enterName: "আপনার চরিত্রের নাম লিখুন...",
    gender: "লিঙ্গ",
    male: "পুরুষ",
    female: "মহিলা",
    other: "অন্যান্য",
    beginJourney: "আমার যাত্রা শুরু করুন",
    chooseLanguage: "আপনার ভাষা বেছে নিন",
    createVoter: "আপনার ভোটার তৈরি করুন",
    // Errors
    nameError: "অনুগ্রহ করে কমপক্ষে ২টি অক্ষরের নাম দিন।",
    genderError: "চালিয়ে যেতে অনুগ্রহ করে লিঙ্গ নির্বাচন করুন।",
    // Results
    winner: "বিজয়ী",
    turnout: "ভোটার উপস্থিতি",
    voted: "ভোট দিয়েছেন",
    didNotVote: "ভোট দেননি",
    // Certificate
    downloadCert: "সার্টিফিকেট ডাউনলোড করুন",
    returnHome: "হোমে ফিরুন",
    playAgain: "আবার খেলুন",
    yourVoterProfile: "আপনার ভোটার প্রোফাইল",
  },
};

// ============================================================
// NPC DIALOGUE — Multilingual
// ============================================================
export const NPC_DIALOGUE = {
  // Level 1 encounters
  bribeOffer: {
    en: "Bhaiya, humari party ki taraf se... ₹500. Just vote for the rising sun symbol.",
    hi: "भैया, हमारी पार्टी की तरफ से... ₹500। बस उगते सूरज के निशान पर वोट करो।",
    bn: "দাদা, আমাদের দলের তরফ থেকে... ৳৫০০। শুধু উদীয়মান সূর্য প্রতীকে ভোট দিন।",
  },
  transportOffer: {
    en: "Come come! Free bus to the booth. Party-arranged! Quick quick!",
    hi: "आओ आओ! बूथ तक मुफ्त बस। पार्टी का इंतजाम! जल्दी जल्दी!",
    bn: "আসুন আসুন! বুথে বিনামূল্যে বাস। দল থেকে ব্যবস্থা! তাড়াতাড়ি!",
  },
  peerPressure: {
    en: "Vote for Rajiv Sharma only! Our whole colony is voting for him!",
    hi: "राजीव शर्मा को ही वोट दो! हमारी पूरी कॉलोनी उन्हें वोट दे रही है!",
    bn: "রাজীব শর্মাকেই ভোট দিন! আমাদের পুরো মহল্লা তাকে ভোট দিচ্ছে!",
  },
  // Level 3
  officerInk: {
    en: "Please extend your left forefinger. I will apply the indelible ink.",
    hi: "कृपया अपनी बाईं तर्जनी आगे बढ़ाएं। मैं अमिट स्याही लगाऊंगा।",
    bn: "অনুগ্রহ করে আপনার বাম তর্জনী এগিয়ে দিন। আমি অমোচনীয় কালি লাগাব।",
  },
  officerIDCheck: {
    en: "Please present a valid photo identity document as per ECI guidelines.",
    hi: "कृपया ECI दिशानिर्देशों के अनुसार एक वैध फोटो पहचान दस्तावेज़ प्रस्तुत करें।",
    bn: "অনুগ্রহ করে ECI নির্দেশিকা অনুযায়ী একটি বৈধ ছবি পরিচয়পত্র উপস্থাপন করুন।",
  },
};
