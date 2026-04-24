import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const SCENES = [
  {
    id: 0,
    bg: "linear-gradient(135deg, #080C14, #0F1729)",
    text: "India. April 2026.",
    sub: "The largest democratic exercise on Earth is about to begin.",
    holdMs: 5000, // time to stay on this slide after voice
  },
  {
    id: 1,
    bg: "linear-gradient(135deg, #0F1729, #1A3A6B20)",
    text: "Lok Sabha Elections — Polling Day.",
    sub: "891 million registered voters. 4,000+ candidates. One winner per constituency.",
    holdMs: 5500,
  },
  {
    id: 2,
    bg: "linear-gradient(135deg, #080C14, #138808 10%, #080C14)",
    text: "You just turned 18.",
    sub: "Your Voter ID arrived in the mail last week. Your mother kept it safe.",
    holdMs: 5000,
  },
  {
    id: 3,
    bg: "linear-gradient(135deg, #0F1729, #FF990910)",
    text: null, // Character reveal
    sub: null,
    holdMs: 4500,
  },
  {
    id: 4,
    bg: "linear-gradient(135deg, #080C14, #1A3A6B20)",
    text: "Today, you will learn what it means to be a voter.",
    sub: "From the registration office to the voting booth — experience every step.",
    holdMs: 5000,
  },
];

// Narration per scene per language
const NARRATION = {
  en: [
    "India. April 2026. The largest democratic exercise on Earth is about to begin.",
    "Lok Sabha Elections, Polling Day. 891 million registered voters.",
    "You just turned 18. Your Voter ID arrived last week.",
    null, // filled with playerName at runtime
    "Today, you will learn what it means to be a voter. Let the journey begin.",
  ],
  hi: [
    "भारत। अप्रैल 2026। पृथ्वी पर सबसे बड़ा लोकतांत्रिक अभ्यास शुरू होने वाला है।",
    "लोकसभा चुनाव, मतदान दिवस। 89 करोड़ पंजीकृत मतदाता।",
    "आप अभी 18 साल के हुए हैं। आपकी वोटर आईडी पिछले हफ्ते आई।",
    null,
    "आज, आप जानेंगे कि मतदाता होने का क्या मतलब है। यात्रा शुरू हो।",
  ],
  bn: [
    "ভারত। এপ্রিল ২০২৬। পৃথিবীর সবচেয়ে বড় গণতান্ত্রিক অনুশীলন শুরু হতে চলেছে।",
    "লোকসভা নির্বাচন, ভোটের দিন। ৮৯ কোটি নিবন্ধিত ভোটার।",
    "আপনি সবে ১৮ বছরে পা দিয়েছেন। আপনার ভোটার কার্ড গত সপ্তাহে এসেছে।",
    null,
    "আজ, আপনি শিখবেন একজন ভোটার হওয়ার অর্থ কী। যাত্রা শুরু হোক।",
  ],
};

export default function Prologue() {
  const { playerName, playerGender, language } = useGame();
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(0);
  const [visible, setVisible] = useState(false); // start hidden, fade in
  const timerRef = useRef(null);

  const goNext = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      if (currentScene < SCENES.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        stopSpeaking();
        navigate("/level/0");
      }
    }, 600); // fade-out duration
  }, [currentScene, navigate]);

  useEffect(() => {
    if (!playerName) { navigate("/create"); return; }

    // Fade slide in
    setVisible(false);
    const fadeInTimer = setTimeout(() => setVisible(true), 80);

    // After slide is visible (300ms), do NOT fire voice — voice starts at Level 0

    // Hold slide for holdMs, then transition
    const holdMs = SCENES[currentScene]?.holdMs || 5000;
    timerRef.current = setTimeout(goNext, holdMs);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(timerRef.current);
    };
  }, [currentScene, playerName, language, goNext]);

  const handleSkip = () => {
    clearTimeout(timerRef.current);
    navigate("/level/0");
  };

  const emoji = playerGender === "female" ? "👩" : playerGender === "other" ? "🧑" : "👨";

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: SCENES[currentScene]?.bg || "#080C14",
      transition: "background 1.2s ease", position: "relative", overflow: "hidden"
    }}>
      {/* Particle dots */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${(i % 3) + 1}px`,
          height: `${(i % 3) + 1}px`,
          borderRadius: "50%",
          background: `rgba(255,153,51,${0.1 + (i % 4) * 0.08})`,
          top: `${(i * 17 + 7) % 97}%`,
          left: `${(i * 23 + 13) % 95}%`,
          animation: `spin-slow ${5 + (i % 6)}s linear infinite`,
          pointerEvents: "none"
        }} />
      ))}

      <div style={{
        textAlign: "center", padding: "40px 20px", maxWidth: "700px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s ease, transform 0.6s ease"
      }}>
        {currentScene === 3 ? (
          /* Character Reveal */
          <div>
            <div style={{ fontSize: "5rem", marginBottom: "16px", animation: "float-up 0.5s ease" }}>{emoji}</div>
            <h1 style={{ fontSize: "3rem", marginBottom: "8px" }}>{playerName}</h1>
            <div style={{ color: "var(--color-saffron)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "12px" }}>
              Serial No. 247 · First-Time Voter
            </div>
            <div style={{
              display: "inline-block", padding: "8px 24px",
              background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.3)",
              borderRadius: "999px", color: "var(--text-secondary)", fontSize: "0.9rem"
            }}>
              South Kolkata Assembly Constituency
            </div>
          </div>
        ) : (
          <>
            <div style={{
              display: "inline-block", padding: "4px 14px", borderRadius: "999px",
              background: "rgba(255,255,255,0.05)", fontSize: "0.75rem", color: "var(--text-muted)",
              marginBottom: "24px", fontWeight: 600, letterSpacing: "2px"
            }}>
              {currentScene + 1} / {SCENES.length}
            </div>

            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.8rem)", marginBottom: "20px", color: "white" }}>
              {SCENES[currentScene]?.text}
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
              {SCENES[currentScene]?.sub}
            </p>

            <div style={{
              width: "120px", height: "4px", margin: "32px auto 0",
              background: "linear-gradient(to right, var(--color-saffron) 33%, white 33%, white 66%, var(--color-green) 66%)",
              borderRadius: "2px"
            }} />
          </>
        )}

        {/* Progress dots */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "40px" }}>
          {SCENES.map((_, i) => (
            <div key={i} style={{
              width: i === currentScene ? "24px" : "8px", height: "8px", borderRadius: "4px",
              background: i <= currentScene ? "var(--color-saffron)" : "var(--border-subtle)",
              transition: "all 0.4s ease"
            }} />
          ))}
        </div>
      </div>

      {/* Skip button */}
      <button
        id="prologue-skip-btn"
        onClick={handleSkip}
        style={{
          position: "fixed", bottom: "32px", right: "32px",
          background: "none", border: "1px solid var(--border-subtle)",
          borderRadius: "999px", padding: "8px 20px", color: "var(--text-muted)",
          cursor: "pointer", fontSize: "0.85rem", transition: "var(--transition-fast)"
        }}
        onMouseEnter={e => { e.target.style.borderColor = "var(--color-saffron)"; e.target.style.color = "var(--color-saffron)"; }}
        onMouseLeave={e => { e.target.style.borderColor = "var(--border-subtle)"; e.target.style.color = "var(--text-muted)"; }}
      >
        Skip →
      </button>
    </div>
  );
}
