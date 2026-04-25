import React, { useState, useRef, useEffect, useCallback } from "react";
import { useGame } from "../context/GameContext";
import { askVivek, isGeminiAvailable } from "../services/gemini";
import { useLocation } from "react-router-dom";

// Greeting message per language
const GREETING = {
  en: "Namaste! I'm Vivek, your AI Helpdesk. Ask me anything about voting, election results, or rules! 🗳️",
  hi: "नमस्ते! मैं विवेक हूं, आपका एआई हेल्पडेस्क। मतदान, चुनाव परिणाम या नियमों के बारे में कुछ भी पूछें! 🗳️",
  bn: "নমস্কার! আমি বিবেক, আপনার এআই হেল্পডেস্ক। ভোট, নির্বাচনের ফলাফল বা নিয়ম সম্পর্কে যেকোনো কিছু জিজ্ঞেস করুন! 🗳️",
};

const PLACEHOLDER = {
  en: "Ask Vivek anything about voting...",
  hi: "विवेक से मतदान के बारे में कुछ भी पूछें...",
  bn: "বিবেককে ভোট সম্পর্কে যেকোনো কিছু জিজ্ঞেস করুন...",
};

const THINKING = {
  en: "Thinking...",
  hi: "सोच रहा हूं...",
  bn: "ভাবছি...",
};

export default function VivekWidget() {
  const { language, t } = useGame();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: "vivek", text: GREETING[language] || GREETING.en }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ONLY show on landing and leaderboard
  const isHelpdeskRoute = location.pathname === "/" || location.pathname === "/leaderboard";

  useEffect(() => {
    setMessages([{ id: 1, from: "vivek", text: GREETING[language] || GREETING.en }]);
  }, [language]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

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
          playerName: "Citizen",
          level: "Helpdesk",
          language,
          ipScore: 0,
          userMessage: trimmed,
          gameContext: `User is at the Helpdesk. Language: ${language}. You are Vivek, an AI Helpdesk. Answer ONLY questions based on voting, election results, rules, or the Electoral system. Keep it brief. Respond ONLY in ${language === "hi" ? "Hindi (Hinglish)" : language === "bn" ? "Bengali (বাংলা)" : "English"}.`,
          constituency: "India",
        });
      } else {
        const fallbacks = {
          en: "The Election Commission of India ensures free and fair elections through strict protocols.",
          hi: "भारत का चुनाव आयोग कड़े नियमों से स्वतंत्र और निष्पक्ष चुनाव सुनिश्चित करता है।",
          bn: "ভারতের নির্বাচন কমিশন কঠোর নিয়মের মাধ্যমে স্বাধীন ও নিরপেক্ষ নির্বাচন নিশ্চিত করে।",
        };
        response = fallbacks[language] || fallbacks.en;
      }

      const vivekMsg = { id: Date.now() + 1, from: "vivek", text: response };
      setMessages(prev => [...prev, vivekMsg]);
    } catch (err) {
      console.error("Vivek send error:", err);
      const errMsgs = {
        en: "I'm having trouble connecting right now. Please try again.",
        hi: "मुझे अभी कनेक्ट करने में परेशानी हो रही है। कृपया पुनः प्रयास करें।",
        bn: "আমি এখন সংযোগ করতে পারছি না। অনুগ্রহ করে আবার চেষ্টা করুন।",
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

  if (!isHelpdeskRoute) return null;

  return (
    <>
      {isOpen && (
        <div
          id="vivek-chat-panel"
          className="vivek-chat-panel"
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            zIndex: 2001,
            width: "340px",
            maxHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            animation: "float-up 0.25s ease",
            background: "var(--bg-glass)",
            backdropFilter: "blur(10px)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)"
          }}
        >
          <div className="vivek-chat-header" style={{ padding: "12px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "radial-gradient(circle, #60A5FA, #1A3A6B)",
              border: "1.5px solid var(--color-saffron)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0
            }}>✦</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#F0F4FF" }}>
                AI Helpdesk (Vivek)
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
            <button
              onClick={() => setIsOpen(false)}
              style={{
                marginLeft: "auto", background: "none", border: "none",
                color: "#94A3B8", cursor: "pointer", fontSize: "1rem",
                padding: "4px", borderRadius: "4px",
              }}
            >✕</button>
          </div>

          <div className="vivek-chat-messages" style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {messages.map((msg, idx) => (
              <div
                key={`${msg.id}-${idx}`}
                className={`vivek-message ${msg.from === "user" ? "user-message" : ""}`}
                style={{
                  background: msg.from === "user" ? "rgba(255,153,51,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${msg.from === "user" ? "rgba(255,153,51,0.3)" : "rgba(255,255,255,0.1)"}`,
                  padding: "8px 12px",
                  borderRadius: msg.from === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                  alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  fontSize: "0.85rem"
                }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="vivek-message" style={{ background: "rgba(255,255,255,0.05)", padding: "8px 12px", borderRadius: "12px 12px 12px 0", alignSelf: "flex-start", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                  {THINKING[language] || THINKING.en}
                  <span style={{ animation: "orb-pulse 1s infinite" }}> ●</span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="vivek-chat-input" style={{ padding: "12px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "8px" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDER[language] || PLACEHOLDER.en}
              disabled={isLoading}
              autoFocus
              style={{ flex: 1, background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "8px 12px", color: "white", fontSize: "0.85rem" }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{ background: "var(--color-saffron)", color: "white", border: "none", borderRadius: "var(--radius-md)", width: "36px", height: "36px", cursor: isLoading || !input.trim() ? "not-allowed" : "pointer", opacity: isLoading || !input.trim() ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
            >➤</button>
          </div>
        </div>
      )}

      <div className="vivek-widget">
        <button
          className="vivek-orb normal"
          onClick={() => {
            setIsOpen(prev => {
              if (!prev) setTimeout(() => inputRef.current?.focus(), 100);
              return !prev;
            });
          }}
          title="AI Helpdesk"
          aria-label={isOpen ? "Close AI Helpdesk" : "Open AI Helpdesk"}
          aria-expanded={isOpen}
          aria-controls="vivek-chat-panel"
        >
          {isOpen ? "✕" : "💬"}
        </button>
      </div>
    </>
  );
}
