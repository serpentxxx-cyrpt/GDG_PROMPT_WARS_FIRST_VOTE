// ============================================================
// GEMINI SERVICE — Democratic Conscience AI (Vivek)
// Model: gemini-2.0-flash (Free tier)
// ============================================================

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;
const MODEL_PRIORITY = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"];

// Security: Rate Limiting
let lastCallTime = 0;
const RATE_LIMIT_MS = 2500; // 2.5s cooldown between AI hits

const initGemini = () => {
  if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE" || !API_KEY.trim()) {
    console.warn("⚠️ Gemini API key not configured.");
    return false;
  }
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: MODEL_PRIORITY[0] });
    console.log(`✅ Vivek (${MODEL_PRIORITY[0]}) initialized.`);
    return true;
  } catch (err) {
    console.error("Gemini init error:", err);
    return false;
  }
};

export const isGeminiAvailable = initGemini();

// ============================================================
// FALLBACK RESPONSES (when API key is missing or call fails)
// ============================================================
const FALLBACK_RESPONSES = {
  bribe: "Stop! Section 171B of the IPC classifies accepting money or gifts from political parties as bribery. Your vote is your power — not a commodity. Decline immediately!",
  transport: "Section 171C of the IPC prohibits accepting free transport arranged by a candidate or party on election day. Walk to the booth independently.",
  document: "The ECI accepts 12 specific documents for voter identification. These include your Voter ID (EPIC), Aadhaar Card, Passport, MNREGA Card, and others. College IDs and PAN cards are NOT accepted.",
  vvpat: "The VVPAT shows your vote as a printed slip for 7 seconds. If the symbol doesn't match your choice, immediately alert the Presiding Officer.",
  ink: "The indelible ink is applied to your left forefinger before voting. Manufactured by Mysore Paints and Varnish Ltd., it lasts 14-21 days. No solvent can remove it.",
  evm: "The Electronic Voting Machine (EVM) is a secure, standalone device used to cast votes in India. It consists of a Control Unit and a Ballot Unit.",
  age: "According to Article 326 of the Constitution, the minimum age for voting in India is 18 years.",
  general: "I'm experiencing high server load (API Quota Exceeded). As an AI Helpdesk, I'm temporarily running on basic fallback mode. Try asking about specific topics like EVM, VVPAT, bribery, or voting age.",
};

const FALLBACK_RESPONSES_HI = {
  bribe: "रुकिए! IPC धारा 171B के तहत राजनीतिक दलों से पैसे या उपहार लेना रिश्वत है। आपका वोट आपकी शक्ति है!",
  transport: "IPC धारा 171C के तहत चुनाव के दिन पार्टी द्वारा व्यवस्थित परिवहन लेना अवैध है।",
  document: "ECI 12 विशिष्ट दस्तावेज़ स्वीकार करता है — Voter ID, Aadhaar, Passport आदि। College ID और PAN card नहीं चलते।",
  vvpat: "VVPAT 7 सेकंड के लिए पर्ची दिखाता है। अगर प्रतीक गलत हो तो तुरंत पीठासीन अधिकारी को बताएं।",
  ink: "अमिट स्याही आपकी बाईं तर्जनी पर लगाई जाती है। यह 14-21 दिन रहती है — कोई भी सॉल्वेंट इसे नहीं हटा सकता।",
  evm: "इलेक्ट्रॉनिक वोटिंग मशीन (EVM) भारत में मतदान के लिए उपयोग किया जाने वाला एक सुरक्षित उपकरण है।",
  age: "संविधान के अनुच्छेद 326 के अनुसार, भारत में मतदान के लिए न्यूनतम आयु 18 वर्ष है।",
  general: "सर्वर पर अधिक लोड है (API कोटा समाप्त)। मैं अभी बुनियादी मोड पर चल रहा हूँ। EVM, VVPAT या मतदान की आयु के बारे में पूछें।",
};

const FALLBACK_RESPONSES_BN = {
  bribe: "থামুন! IPC ধারা 171B অনুযায়ী রাজনৈতিক দলের কাছ থেকে টাকা বা উপহার নেওয়া ঘুষ। আপনার ভোট আপনার শক্তি!",
  transport: "IPC ধারা 171C অনুযায়ী ভোটের দিন দলের ব্যবস্থায় পরিবহন নেওয়া বেআইনি।",
  document: "ECI ১২টি নির্দিষ্ট নথি গ্রহণ করে — Voter ID, Aadhaar, Passport ইত্যাদি। College ID ও PAN card গ্রহণযোগ্য নয়।",
  vvpat: "VVPAT ৭ সেকেন্ডের জন্য স্লিপ দেখায়। প্রতীক ভুল হলে তাৎক্ষণিক প্রিসাইডিং অফিসারকে জানান।",
  ink: "অমোচনীয় কালি বাম তর্জনীতে লাগানো হয়। এটি ১৪-২১ দিন থাকে — কোনো দ্রাবক এটি তুলতে পারে না।",
  evm: "ইলেকট্রনিক ভোটিং মেশিন (EVM) হলো ভারতে ভোট দেওয়ার জন্য ব্যবহৃত একটি নিরাপদ ডিভাইস।",
  age: "সংবিধানের ৩২৬ অনুচ্ছেদ অনুযায়ী, ভারতে ভোট দেওয়ার ন্যূনতম বয়স ১৮ বছর।",
  general: "সার্ভারে খুব বেশি লোড রয়েছে (API কোটা শেষ)। আমি এখন সাধারণ মোডে চলছি। EVM, VVPAT বা ভোটের বয়স সম্পর্কে জিজ্ঞাসা করুন।",
};

const getFallbackResponse = (context, language = "en") => {
  const map = language === "hi" ? FALLBACK_RESPONSES_HI : language === "bn" ? FALLBACK_RESPONSES_BN : FALLBACK_RESPONSES;
  const msg = (context || "").toLowerCase();
  if (msg.includes("bribe") || msg.includes("money") || msg.includes("gift") || msg.includes("रिश्वत") || msg.includes("ঘুষ")) return map.bribe;
  if (msg.includes("transport") || msg.includes("bus") || msg.includes("ride")) return map.transport;
  if (msg.includes("document") || msg.includes("id card") || msg.includes("पहचान") || msg.includes("পরিচয়")) return map.document;
  if (msg.includes("vvpat") || msg.includes("slip") || msg.includes("paper") || msg.includes("पर्ची") || msg.includes("স্লিপ")) return map.vvpat;
  if (msg.includes("ink") || msg.includes("finger") || msg.includes("स्याही") || msg.includes("কালি")) return map.ink;
  if (msg.includes("evm") || msg.includes("machine") || msg.includes("मशीन") || msg.includes("মেশিন")) return map.evm;
  if (msg.includes("age") || msg.includes("years") || msg.includes("old") || msg.includes("आयु") || msg.includes("বয়স")) return map.age;
  return map.general;
};

// ============================================================
// MAIN VIVEK CHAT FUNCTION
// ============================================================
export const askVivek = async ({ playerName, level, language, ipScore, userMessage, gameContext, constituency }) => {
  const langMap = { en: "English", hi: "Hindi (natural conversational Hinglish)", bn: "Bengali (বাংলা)" };
  const langName = langMap[language] || "English";

  const systemPrompt = `You are Vivek (विवेक / বিবেক), a warm and knowledgeable Democratic Conscience AI companion in an Indian voter education simulation game called "The First Vote" (GDG Prompt Wars 2026).

Player Details:
- Name: ${playerName || "the player"}
- Current Level: ${level || "Unknown"}
- Constituency: ${constituency || "South Kolkata"}
- Integrity Points: ${ipScore ?? 50}/210

Rules: Respond in ${langName}. Max 3 sentences. Cite laws (IPC 171B=bribery, 171C=transport, RPA 1951, Article 326) when relevant. NEVER say who to vote for. Be warm and educational.

Game context: ${gameContext || "general"}
Player: "${userMessage}"`;

  if (!isGeminiAvailable) {
    return getFallbackResponse(userMessage, language);
  }

  // Rate limiting safety check
  const now = Date.now();
  if (now - lastCallTime < RATE_LIMIT_MS) {
    console.warn("Vivek is thinking... throttling request to preserve API quota.");
    return getFallbackResponse(userMessage, language);
  }
  lastCallTime = now;

  // Try each model in priority order
  for (let i = 0; i < MODEL_PRIORITY.length; i++) {
    try {
      const m = i === 0 ? model : genAI.getGenerativeModel({ model: MODEL_PRIORITY[i] });
      const result = await m.generateContent(systemPrompt);
      const text = result.response.text().trim();
      if (text) {
        console.log(`✅ Vivek replied via ${MODEL_PRIORITY[i]}`);
        return text;
      }
    } catch (error) {
      console.warn(`Model ${MODEL_PRIORITY[i]} failed:`, error?.message || error);
      
      // If it's a quota error, immediately return fallback so we don't spam other models
      if (error?.message?.includes("Quota") || error?.message?.includes("429")) {
        return getFallbackResponse(userMessage, language);
      }

      if (i === MODEL_PRIORITY.length - 1) {
        // All models exhausted
        return getFallbackResponse(userMessage, language);
      }
    }
  }
  return getFallbackResponse(userMessage, language);
};


// ============================================================
// LEVEL HINT SERVICE — Proactive context-aware tips
// Shown on the game dashboard / HUD
// ============================================================
const LEVEL_HINTS = {
  en: {
    "/level/0": [
      "💡 Article 326 guarantees voting rights to all citizens aged 18+.",
      "💡 Your constituency is determined by your residential address, not your workplace.",
      "💡 Form 6 is the official ECI form for first-time voter registration on NVSP.",
    ],
    "/level/1": [
      "⚖️ IPC Section 171B: Accepting any gift as an inducement to vote is bribery — up to 1 year jail.",
      "⚖️ IPC Section 171C: Accepting free transport from a candidate's party is illegal on polling day.",
      "🗳️ Your vote is a secret ballot. No one can force you to reveal or change it.",
    ],
    "/level/2": [
      "📋 ECI accepts 12 documents — Voter ID, Aadhaar, Passport, MNREGA Card are all valid.",
      "🚫 PAN Card and College IDs are NOT accepted by ECI for voter identification.",
      "💡 Even without your physical Voter ID, you can vote if your name is on the Electoral Roll!",
    ],
    "/level/3": [
      "🖊️ Indelible ink is manufactured by Mysore Paints and Varnish Ltd. It lasts 14–21 days.",
      "📝 Form 17A is the Register of Voters — you MUST sign it before voting.",
      "🚨 Report any impersonation attempt immediately to the Presiding Officer.",
    ],
    "/level/4": [
      "👁️ Watch the VVPAT window for 7 seconds after pressing your button.",
      "🚨 If the VVPAT slip shows the wrong symbol, report it immediately — do NOT leave.",
      "🔒 The EVM locks after your vote — no one can change it after you leave the compartment.",
    ],
    "/level/5": [
      "📊 Counting starts after all polling stations close and EVMs are sealed.",
      "🏆 A candidate needs a simple majority (most votes) to win in a constituency.",
      "🗳️ Every vote counts — the margin can be as small as a few hundred votes!",
    ],
  },
  hi: {
    "/level/0": [
      "💡 अनुच्छेद 326: 18+ हर भारतीय नागरिक को मतदान का अधिकार है।",
      "💡 आपका निर्वाचन क्षेत्र आपके निवास पते से निर्धारित होता है।",
      "💡 NVSP पर Form 6 भरकर पहली बार मतदाता पंजीकरण करें।",
    ],
    "/level/1": [
      "⚖️ IPC धारा 171B: रिश्वत लेना 1 साल की जेल हो सकती है।",
      "⚖️ IPC धारा 171C: चुनाव दिन पार्टी का वाहन लेना गैरकानूनी है।",
      "🗳️ आपका वोट गुप्त मतपत्र है — कोई आपको बाध्य नहीं कर सकता।",
    ],
    "/level/2": [
      "📋 ECI 12 दस्तावेज़ स्वीकार करता है — Voter ID, Aadhaar, Passport वैध हैं।",
      "🚫 PAN Card और College ID ECI के लिए मान्य नहीं हैं।",
      "💡 Electoral Roll पर नाम होने पर बिना Voter ID के भी मतदान संभव है!",
    ],
    "/level/3": [
      "🖊️ अमिट स्याही मैसूर पेंट्स द्वारा बनाई जाती है, 14-21 दिन रहती है।",
      "📝 Form 17A पर हस्ताक्षर करना अनिवार्य है।",
      "🚨 किसी भी प्रतिरूपण की रिपोर्ट तुरंत पीठासीन अधिकारी को दें।",
    ],
    "/level/4": [
      "👁️ बटन दबाने के बाद VVPAT खिड़की 7 सेकंड देखें।",
      "🚨 पर्ची में गलत निशान हो तो तुरंत रिपोर्ट करें।",
      "🔒 आपका वोट डालने के बाद EVM लॉक हो जाती है।",
    ],
    "/level/5": [
      "📊 मतगणना सभी मतदान केंद्र बंद होने के बाद शुरू होती है।",
      "🏆 सबसे अधिक मत पाने वाला उम्मीदवार जीतता है।",
      "🗳️ हर वोट मायने रखता है — अंतर कुछ सौ वोट का भी हो सकता है!",
    ],
  },
  bn: {
    "/level/0": [
      "💡 অনুচ্ছেদ ৩২৬: ১৮+ প্রতিটি ভারতীয় নাগরিকের ভোটাধিকার আছে।",
      "💡 আপনার নির্বাচন কেন্দ্র আপনার বাসস্থানের ঠিকানা অনুযায়ী নির্ধারিত হয়।",
      "💡 NVSP-তে Form 6 পূরণ করে প্রথমবার ভোটার নিবন্ধন করুন।",
    ],
    "/level/1": [
      "⚖️ IPC ধারা 171B: ঘুষ নিলে ১ বছর পর্যন্ত কারাদণ্ড হতে পারে।",
      "⚖️ IPC ধারা 171C: ভোটের দিন দলের পরিবহন নেওয়া বেআইনি।",
      "🗳️ আপনার ভোট গোপন — কেউ আপনাকে বাধ্য করতে পারবে না।",
    ],
    "/level/2": [
      "📋 ECI ১২টি নথি গ্রহণ করে — Voter ID, Aadhaar, Passport বৈধ।",
      "🚫 PAN Card ও College ID ECI-র কাছে গ্রহণযোগ্য নয়।",
      "💡 Electoral Roll-এ নাম থাকলে Voter ID ছাড়াও ভোট দেওয়া সম্ভব!",
    ],
    "/level/3": [
      "🖊️ অমোচনীয় কালি মাইসোর পেইন্টস তৈরি করে, ১৪-২১ দিন থাকে।",
      "📝 Form 17A-তে স্বাক্ষর করা বাধ্যতামূলক।",
      "🚨 যেকোনো ছদ্মবেশের ঘটনা অবিলম্বে প্রিসাইডিং অফিসারকে জানান।",
    ],
    "/level/4": [
      "👁️ বোতাম চাপার পর VVPAT উইন্ডো ৭ সেকেন্ড দেখুন।",
      "🚨 ভুল প্রতীক দেখলে তাৎক্ষণিক রিপোর্ট করুন।",
      "🔒 ভোট দেওয়ার পর EVM লক হয়ে যায়।",
    ],
    "/level/5": [
      "📊 সব বুথ বন্ধের পর ভোট গণনা শুরু হয়।",
      "🏆 সর্বোচ্চ ভোট পাওয়া প্রার্থী জিতবেন।",
      "🗳️ প্রতিটি ভোট গুরুত্বপূর্ণ — ব্যবধান মাত্র কয়েক শত ভোটেরও হতে পারে!",
    ],
  },
};

export const getLevelHint = async (pathname, language = "en") => {
  const langHints = LEVEL_HINTS[language] || LEVEL_HINTS.en;
  const hints = langHints[pathname];

  if (!hints) return null;

  // Rotate through hints based on time (new hint every 30s)
  const index = Math.floor(Date.now() / 30000) % hints.length;
  const staticHint = hints[index];

  // Try to generate a fresh Gemini hint if available
  if (isGeminiAvailable) {
    const langMap = { en: "English", hi: "Hindi", bn: "Bengali" };
    const levelNames = {
      "/level/0": "Voter Registration on NVSP portal",
      "/level/1": "Resisting bribes and pressure on the way to polling station",
      "/level/2": "Choosing the correct identity document",
      "/level/3": "The three-officer protocol inside the polling booth",
      "/level/4": "Voting on the EVM and verifying the VVPAT",
      "/level/5": "Election result day and counting",
    };
    const levelName = levelNames[pathname] || "the game";
    const prompt = `Generate ONE short educational hint (max 1 sentence) for a player who is at the level: "${levelName}" in an Indian voter education game. The hint should teach a specific fact about Indian electoral law or procedure. Language: ${langMap[language] || "English"}. Do not start with "Did you know". Be direct. Use an emoji at the start.`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      if (text && text.length < 200) return text;
    } catch (_) {
      // Fall through to static hint
    }
  }

  return staticHint;
};

// ============================================================
// VIVEK INTERVENTION — Triggered by game events (not user messages)
// ============================================================
export const getVivekIntervention = async ({ event, playerName, language, ipScore }) => {
  const langMap = { en: "English", hi: "Hindi", bn: "Bengali" };
  const interventions = {
    bribe_offered: `${playerName}, wait! Section 171B of the IPC classifies this as bribery. Accepting gifts or money from political parties can lead to a fine or imprisonment. Your vote is your power!`,
    transport_offered: `${playerName}, be careful! Section 171C makes it illegal to accept transport from a candidate's party on election day. Walk independently to preserve your electoral integrity.`,
    wrong_document: `That document isn't accepted by the Election Commission of India. The ECI recognizes 12 specific photo-bearing documents. Try your Voter ID (EPIC) or Aadhaar card.`,
    vvpat_reminder: `Look at the VVPAT glass window! You have 7 seconds to verify the printed slip shows the correct candidate symbol. If it doesn't match, alert the Presiding Officer immediately!`,
    disqualification_warning: `⚠️ Warning, ${playerName}! Your Integrity Points are critically low. One more violation could lead to disqualification. Stay on the right path!`,
    ink_fraud: `${playerName}! That person is lying — check your own finger. You already have the indelible ink mark. Report this impersonation attempt to the Presiding Officer immediately!`,
  };

  return interventions[event] || await askVivek({ playerName, language, ipScore, userMessage: event, gameContext: event });
};

// ============================================================
// TRANSLATE UI TEXT (Gemini-powered for dynamic strings)
// ============================================================
export const translateText = async (text, targetLanguage) => {
  if (targetLanguage === "en" || !isGeminiAvailable) return text;

  const langNames = { hi: "Hindi", bn: "Bengali" };
  const langName = langNames[targetLanguage];

  try {
    const prompt = `Translate this game text to natural, conversational ${langName}. Keep proper nouns (ECI, VVPAT, EVM, IPC, NVSP) as-is. Return only the translated text, nothing else:\n\n"${text}"`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim().replace(/^["']|["']$/g, "");
  } catch (err) {
    console.error("Translation error:", err);
    return text;
  }
};

// ============================================================
// DYNAMIC SCENARIO GENERATION (Structured JSON Output)
// ============================================================
export const generateDynamicScenario = async (level, language = "en") => {
  if (!isGeminiAvailable) return null;

  const langMap = { en: "English", hi: "Hindi", bn: "Bengali" };
  const prompt = `Generate a dynamic multiple-choice question for an Indian voter education game.
Level context: ${level}.
Language: ${langMap[language] || "English"}.
You must respond with a valid JSON object matching this schema:
{
  "question": "The scenario text",
  "options": [
    { "text": "Option A", "isCorrect": false },
    { "text": "Option B", "isCorrect": true }
  ],
  "explanation": "Why the answer is correct"
}`;

  try {
    const jsonModel = genAI.getGenerativeModel({
      model: MODEL_PRIORITY[0],
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await jsonModel.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (err) {
    console.error("JSON generation error:", err);
    return null;
  }
};

