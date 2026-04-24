import React, { useState, useRef, useEffect, useCallback } from "react";
import { useGame } from "../context/GameContext";
import { askVivek, isGeminiAvailable } from "../services/gemini";
import { speak, NPC_VOICES } from "../services/tts";
import { useLocation } from "react-router-dom";

const LEVEL_NAMES = {
  "/level/0": "Level 0: Registration",
  "/level/1": "Level 1: Campaign Gauntlet",
  "/level/2": "Level 2: Document Wallet",
  "/level/3": "Level 3: Three-Officer Protocol",
  "/level/4": "Level 4: Voting Compartment",
  "/level/5": "Level 5: Result Day",
  "/prologue": "Prologue",
  "/epilogue": "Epilogue",
};

const GAME_PATHS = ["/level", "/prologue", "/epilogue", "/create"];

// Greeting message per language
const GREETING = {
  en: "Namaste! I'm Vivek, your Democratic Conscience. Ask me anything about the election process! 🗳️",
  hi: "नमस्ते! मैं विवेक हूं, आपकी लोकतांत्रिक चेतना। चुनाव प्रक्रिया के बारे में कुछ भी पूछें! 🗳️",
  bn: "নমস্কার! আমি বিবেক, আপনার গণতান্ত্রিক চেতনা। নির্বাচন প্রক্রিয়া সম্পর্কে যেকোনো কিছু জিজ্ঞেস করুন! 🗳️",
};

const PLACEHOLDER = {
  en: "Ask Vivek anything...",
  hi: "विवेक से कुछ भी पूछें...",
  bn: "বিবেককে যেকোনো কিছু জিজ্ঞেস করুন...",
};

const THINKING = {
  en: "Thinking...",
  hi: "सोच रहा हूं...",
  bn: "ভাবছি...",
};

export default function VivekWidget() {
  const { playerName, language, ip, isGameStarted, t, constituency } = useGame();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: "vivek", text: GREETING[language] || GREETING.en }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orbState, setOrbState] = useState("normal"); // normal | alert | success
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const currentSpeechRef = useRef(null); // track active speech, don't kill on panel close

  const isGameRoute = GAME_PATHS.some(p => location.pathname.startsWith(p));

  // (early return moved to after all hooks — see below)

  // When language changes, update the greeting
  useEffect(() => {
    setMessages([{ id: 1, from: "vivek", text: GREETING[language] || GREETING.en }]);
  }, [language]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Speak text in the current game language — does NOT stop when chat closes
  const vivekSpeak = useCallback((text) => {
    speak(text, { language, ...NPC_VOICES.VIVEK });
  }, [language]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { id: Date.now(), from: "user", text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      let response;

      if (isGeminiAvailable) {
        response = await askVivek({
          playerName: playerName || "Player",
          level: LEVEL_NAMES[location.pathname] || "Game",
          language,
          ipScore: ip,
          userMessage: trimmed,
          gameContext: `Player is at: ${location.pathname}. Language: ${language}. Respond ONLY in ${language === "hi" ? "Hindi (Hinglish)" : language === "bn" ? "Bengali (বাংলা)" : "English"}.`,
          constituency,
        });
      } else {
        // Fallback responses in correct language
        const fallbacks = {
          en: "Great question! The Election Commission of India ensures free and fair elections through strict protocols. Always follow the Presiding Officer's instructions at the booth.",
          hi: "बहुत अच्छा सवाल! भारत का चुनाव आयोग कड़े नियमों से स्वतंत्र और निष्पक्ष चुनाव सुनिश्चित करता है।",
          bn: "চমৎকার প্রশ্ন! ভারতের নির্বাচন কমিশন কঠোর নিয়মের মাধ্যমে স্বাধীন ও নিরপেক্ষ নির্বাচন নিশ্চিত করে।",
        };
        response = fallbacks[language] || fallbacks.en;
      }

      const vivekMsg = { id: Date.now() + 1, from: "vivek", text: response };
      setMessages(prev => [...prev, vivekMsg]);

      // Speak response in selected language — independent of chat panel state
      vivekSpeak(response);

    } catch (err) {
      console.error("Vivek send error:", err);
      const errMsgs = {
        en: "I'm having trouble connecting right now. But remember: when in doubt, ask the Presiding Officer at the booth!",
        hi: "मुझे अभी कनेक्ट करने में परेशानी हो रही है। लेकिन याद रखें: संदेह होने पर पीठासीन अधिकारी से पूछें!",
        bn: "আমি এখন সংযোগ করতে পারছি না। কিন্তু মনে রাখবেন: সন্দেহ হলে প্রিসাইডিং অফিসারকে জিজ্ঞেস করুন!",
      };
      const errMsg = { id: Date.now() + 1, from: "vivek", text: errMsgs[language] || errMsgs.en };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Expose global hook for game levels to push messages
  useEffect(() => {
    window.vivekSay = (text, state = "normal") => {
      setOrbState(state);
      // Translate to current language if possible — game events trigger this
      const msg = { id: Date.now(), from: "vivek", text };
      setMessages(prev => [...prev, msg]);

      // Remove auto-open to prevent intruding on gameplay
      // setIsOpen(true);
      setTimeout(() => setOrbState("normal"), 4000);

      // Speak in selected language
      vivekSpeak(text);
    };
    return () => { window.vivekSay = null; };
  }, [language, vivekSpeak]);

  // Only render during actual gameplay routes
  if (!isGameRoute) return null;


  return (
    <>
      {/* Chat Panel — rendered OUTSIDE the orb container to avoid z-index stacking */}
      {isOpen && (
        <div
          className="vivek-chat-panel"
          style={{
            // Positioned from right edge, above the orb, max height so it never covers game buttons
            position: "fixed",
            bottom: "96px",  // orb(60) + gap(12) + orb-offset(24) = 96
            right: "24px",
            zIndex: 2001,
            width: "340px",
            maxHeight: "50vh", // Never taller than half the screen
            display: "flex",
            flexDirection: "column",
            animation: "float-up 0.25s ease",
          }}
        >
          {/* Header */}
          <div className="vivek-chat-header">
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "radial-gradient(circle, #60A5FA, #1A3A6B)",
              border: "1.5px solid var(--color-saffron)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0
            }}>✦</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#F0F4FF" }}>
                {language === "hi" ? "विवेक" : language === "bn" ? "বিবেক" : "Vivek"}
              </div>
              <div style={{ fontSize: "0.65rem", color: "#94A3B8", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{
                  display: "inline-block", width: "6px", height: "6px", borderRadius: "50%",
                  background: isGeminiAvailable ? "#22C55E" : "#F59E0B",
                  animation: isGeminiAvailable ? "orb-pulse 2s infinite" : "none"
                }} />
                {isGeminiAvailable ? "Gemini AI · Live" : "Fallback mode"}
              </div>
            </div>
            {/* Close — does NOT stop voice */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                marginLeft: "auto", background: "none", border: "none",
                color: "#94A3B8", cursor: "pointer", fontSize: "1rem",
                padding: "4px", borderRadius: "4px",
              }}
              title="Close chat (voice continues)"
              aria-label="Close Vivek chat"
            >✕</button>
          </div>

          {/* Messages */}
          <div className="vivek-chat-messages" style={{ flex: 1, overflowY: "auto" }}>
            {messages.map((msg, idx) => (
              <div
                key={`${msg.id}-${idx}`}
                className={`vivek-message ${msg.from === "user" ? "user-message" : ""}`}
              >
                {msg.from === "vivek" && (
                  <span style={{
                    fontSize: "0.65rem", color: "var(--color-saffron)",
                    fontWeight: 700, display: "block", marginBottom: "4px"
                  }}>
                    {language === "hi" ? "🔵 विवेक" : language === "bn" ? "🔵 বিবেক" : "🔵 VIVEK"}
                  </span>
                )}
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="vivek-message">
                <span style={{ fontSize: "0.65rem", color: "var(--color-saffron)", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  {language === "hi" ? "🔵 विवेक" : language === "bn" ? "🔵 বিবেক" : "🔵 VIVEK"}
                </span>
                <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                  {THINKING[language] || THINKING.en}
                  <span style={{ animation: "orb-pulse 1s infinite" }}> ●</span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="vivek-chat-input">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDER[language] || PLACEHOLDER.en}
              disabled={isLoading}
              autoFocus
            />
            <button
              className="vivek-send-btn"
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              title="Send"
            >➤</button>
          </div>
        </div>
      )}

      {/* Orb Button */}
      <div className="vivek-widget">
        <button
          className={`vivek-orb ${orbState}`}
          onClick={() => {
            setIsOpen(prev => {
              if (!prev) setTimeout(() => inputRef.current?.focus(), 100);
              return !prev;
            });
          }}
          title={t("vivekTitle")}
          aria-label="Open Vivek AI Assistant"
          id="vivek-orb-btn"
        >
          🔵
        </button>
      </div>
    </>
  );
}
