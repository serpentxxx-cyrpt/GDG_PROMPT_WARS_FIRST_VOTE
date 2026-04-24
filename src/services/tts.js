// ============================================================
// TEXT-TO-SPEECH SERVICE — NPC Voices
// Uses Web Speech API (browser built-in, free, no API needed)
// Queue-based: each speak() waits for the previous to finish
// ============================================================

const LANG_CODES = {
  en: "en-IN",  // Indian English accent
  hi: "hi-IN",  // Hindi
  bn: "bn-IN",  // Bengali
};

let isSpeaking = false;
let speakQueue = [];         // queue of { text, options, resolve }
let currentUtterance = null;

// Deduplication state
let lastSpokenText = "";
let lastSpokenTime = 0;

// ─── Internal queue processor ───────────────────────────────
const processQueue = () => {
  if (isSpeaking || speakQueue.length === 0) return;

  const { text, options, resolve } = speakQueue.shift();
  const { language = "en", rate = 0.85, pitch = 1.0, onEnd } = options;

  try {
    const langCode = LANG_CODES[language] || "en-IN";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = rate;
    utterance.pitch = pitch;

    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const genderPref = localStorage.getItem("tfv_voice_gender") || "female";

      // 1. Filter by language
      let langVoices = voices.filter(v => v.lang === langCode);
      if (langVoices.length === 0) langVoices = voices.filter(v => v.lang.startsWith(langCode.split("-")[0]));
      if (langVoices.length === 0) langVoices = voices.filter(v => v.lang.startsWith("en"));

      // 2. Try to match preferred gender based on known voice names/metadata
      let selectedVoice = null;
      if (genderPref === "male") {
        selectedVoice = langVoices.find(v => /male|david|ravi|mark|george/i.test(v.name) && !/female/i.test(v.name));
      } else {
        selectedVoice = langVoices.find(v => /female|zira|samantha|heera|hazel/i.test(v.name));
      }

      // 3. Fallback if preferred gender isn't found in this language
      if (!selectedVoice) selectedVoice = langVoices[0] || voices[0];

      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onstart = () => { isSpeaking = true; };
      utterance.onend = () => {
        isSpeaking = false;
        currentUtterance = null;
        if (onEnd) onEnd();
        if (resolve) resolve();
        // Process next item after a small breath gap
        setTimeout(processQueue, 300);
      };
      utterance.onerror = (err) => {
        // Ignore "interrupted" errors — they're expected on cancel()
        if (err.error !== "interrupted" && err.error !== "canceled") {
          console.warn("TTS error:", err.error);
        }
        isSpeaking = false;
        currentUtterance = null;
        if (onEnd) onEnd();
        if (resolve) resolve();
        setTimeout(processQueue, 300);
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    } else {
      setVoiceAndSpeak();
    }
  } catch (err) {
    console.error("TTS speak error:", err);
    isSpeaking = false;
    if (resolve) resolve();
    setTimeout(processQueue, 300);
  }
};

// ============================================================
// SPEAK — Main TTS function (queued, non-overlapping)
// Returns a Promise that resolves when this utterance finishes
// ============================================================
export const speak = (text, options = {}) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text?.trim()) {
    return Promise.resolve();
  }

  // Deduplication: prevent the exact same text from being enqueued repeatedly
  const now = Date.now();
  if (text === lastSpokenText && (now - lastSpokenTime < 2500)) {
    return Promise.resolve(); // Ignore rapid identical requests
  }
  // Check if it's already pending in the queue
  if (speakQueue.some(item => item.text === text)) {
    return Promise.resolve(); 
  }

  lastSpokenText = text;
  lastSpokenTime = now;

  return new Promise(resolve => {
    speakQueue.push({ text, options, resolve });
    processQueue();
  });
};

// ============================================================
// SPEAK INTERRUPT — Cancels everything, speaks immediately
// Use only for urgent/important interruptions
// ============================================================
export const speakNow = (text, options = {}) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text?.trim()) {
    return Promise.resolve();
  }

  // Deduplication for instant speech
  const now = Date.now();
  if (text === lastSpokenText && (now - lastSpokenTime < 1500)) {
    return Promise.resolve(); 
  }

  lastSpokenText = text;
  lastSpokenTime = now;

  // Clear queue and cancel current speech
  speakQueue = [];
  window.speechSynthesis.cancel();
  isSpeaking = false;
  currentUtterance = null;

  return new Promise(resolve => {
    speakQueue.push({ text, options, resolve });
    // Small delay to let browser process the cancel()
    setTimeout(processQueue, 120);
  });
};

// ============================================================
// STOP — Cancel all speech and clear queue
// ============================================================
export const stopSpeaking = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      speakQueue = [];
      window.speechSynthesis.cancel();
      isSpeaking = false;
      currentUtterance = null;
    } catch (err) {
      console.error("TTS stop error:", err);
    }
  }
};

export const isTTSSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

export const getIsSpeaking = () => isSpeaking;

// ============================================================
// NPC VOICE PRESETS
// ============================================================
export const NPC_VOICES = {
  VIVEK:      { pitch: 1.1,  rate: 0.85 },  // Wise, calm, slightly slow
  BRIBE_NPC:  { pitch: 0.8,  rate: 0.95 },  // Gruff, hurried
  OFFICER_1:  { pitch: 0.9,  rate: 0.82 },  // Official, formal
  OFFICER_2:  { pitch: 1.0,  rate: 0.85 },  // Neutral
  OFFICER_3:  { pitch: 0.95, rate: 0.85 },  // Official
  NEIGHBOR:   { pitch: 1.2,  rate: 0.90 },  // Friendly
  NEWS_ANCHOR:{ pitch: 1.05, rate: 0.88 },  // Professional
};
