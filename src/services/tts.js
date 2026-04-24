// ============================================================
// TEXT-TO-SPEECH SERVICE — NPC Voices
// Uses Web Speech API (browser built-in, free, no API needed)
// ============================================================

const LANG_CODES = {
  en: "en-IN",  // Indian English accent
  hi: "hi-IN",  // Hindi
  bn: "bn-IN",  // Bengali
};

let currentUtterance = null;
let isSpeaking = false;

// Check if browser supports speech synthesis
export const isTTSSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;

// Get best available voice for language
const getVoice = (langCode) => {
  if (!isTTSSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  // Try exact match first
  let voice = voices.find(v => v.lang === langCode);
  // Fallback to language prefix match
  if (!voice) voice = voices.find(v => v.lang.startsWith(langCode.split("-")[0]));
  // Final fallback to any English
  if (!voice) voice = voices.find(v => v.lang.startsWith("en"));
  return voice;
};

// ============================================================
// SPEAK — Main TTS function
// ============================================================
export const speak = (text, { language = "en", rate = 0.9, pitch = 1.0, onEnd } = {}) => {
  if (!isTTSSupported() || !text) return;

  try {
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = LANG_CODES[language] || "en-IN";
    utterance.lang = langCode;
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Set voice with delay to ensure voices are loaded
    const setVoiceAndSpeak = () => {
      const voice = getVoice(langCode);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => { isSpeaking = true; };
      utterance.onend = () => {
        isSpeaking = false;
        if (onEnd) onEnd();
      };
      utterance.onerror = (err) => {
        isSpeaking = false;
        console.warn("TTS error:", err.error);
        if (onEnd) onEnd();
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    };

    // Voices may not be loaded yet on first call
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    } else {
      setVoiceAndSpeak();
    }
  } catch (err) {
    console.error("TTS speak error:", err);
  }
};

export const stopSpeaking = () => {
  if (isTTSSupported()) {
    try {
      window.speechSynthesis.cancel();
      isSpeaking = false;
    } catch (err) {
      console.error("TTS stop error:", err);
    }
  }
};

export const getIsSpeaking = () => isSpeaking;

// ============================================================
// NPC VOICE PRESETS
// Different voices for different NPC types
// ============================================================
export const NPC_VOICES = {
  VIVEK: { pitch: 1.1, rate: 0.95 },           // Wise, calm
  BRIBE_NPC: { pitch: 0.8, rate: 1.1 },        // Gruff, hurried
  OFFICER_1: { pitch: 0.9, rate: 0.85 },       // Official, formal
  OFFICER_2: { pitch: 1.0, rate: 0.9 },        // Neutral
  OFFICER_3: { pitch: 0.95, rate: 0.9 },       // Official
  NEIGHBOR: { pitch: 1.2, rate: 1.05 },        // Friendly, casual
  NEWS_ANCHOR: { pitch: 1.05, rate: 1.0 },     // Professional
};
