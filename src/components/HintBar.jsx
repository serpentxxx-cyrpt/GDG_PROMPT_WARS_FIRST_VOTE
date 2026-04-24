import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { getLevelHint, isGeminiAvailable } from "../services/gemini";

const GAME_PATHS = ["/level", "/prologue", "/epilogue"];
const REFRESH_INTERVAL = 30000; // 30 seconds

export default function HintBar() {
  const { language } = useGame();
  const location = useLocation();
  const [hint, setHint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const isGameRoute = GAME_PATHS.some(p => location.pathname.startsWith(p));

  const fetchHint = useCallback(async () => {
    if (!isGameRoute || !location.pathname.startsWith("/level")) return;
    setIsLoading(true);
    try {
      const newHint = await getLevelHint(location.pathname, language);
      if (newHint) {
        setHint(null); // trigger animation
        setTimeout(() => setHint(newHint), 150);
      }
    } catch (err) {
      console.error("Hint fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [location.pathname, language]);

  // Fetch on level change
  useEffect(() => {
    fetchHint();
  }, [fetchHint, refreshCount]);

  // Auto-rotate hints every 30s (unless pinned)
  useEffect(() => {
    if (isPinned) return;
    const interval = setInterval(() => {
      setRefreshCount(c => c + 1);
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [isPinned]);

  if (!isGameRoute || !location.pathname.startsWith("/level") || !isVisible || !hint) return null;

  return (
    <div
      className="hint-bar"
      style={{ animation: hint ? "float-up 0.3s ease" : "none" }}
      role="status"
      aria-live="polite"
    >
      {/* Gemini indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <div style={{
          width: "20px", height: "20px", borderRadius: "50%",
          background: isGeminiAvailable
            ? "radial-gradient(circle, #60A5FA, #1A3A6B)"
            : "radial-gradient(circle, #6B7280, #374151)",
          border: `1px solid ${isGeminiAvailable ? "var(--color-saffron)" : "var(--border-subtle)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.6rem", flexShrink: 0
        }}>
          {isGeminiAvailable ? "✦" : "•"}
        </div>
        <span style={{
          fontSize: "0.65rem", fontWeight: 700, color: "var(--color-saffron)",
          textTransform: "uppercase", letterSpacing: "1.5px", whiteSpace: "nowrap"
        }}>
          {isGeminiAvailable ? "AI HINT" : "HINT"}
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: "1px", height: "16px", background: "var(--border-subtle)", flexShrink: 0 }} />

      {/* Hint text */}
      <div style={{
        fontSize: "0.82rem", color: "var(--text-secondary)", flex: 1,
        opacity: isLoading ? 0.5 : 1, transition: "opacity 0.3s ease"
      }}>
        {isLoading ? "Getting hint from Vivek..." : hint}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
        {/* Refresh */}
        <button
          onClick={() => setRefreshCount(c => c + 1)}
          disabled={isLoading}
          title="Next hint"
          style={{
            background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer",
            fontSize: "0.75rem", padding: "2px 4px", borderRadius: "4px",
            transition: "var(--transition-fast)",
            opacity: isLoading ? 0.4 : 1
          }}
          onMouseEnter={e => e.target.style.color = "var(--color-saffron)"}
          onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
          id="hint-refresh-btn"
        >
          ↻
        </button>

        {/* Pin */}
        <button
          onClick={() => setIsPinned(p => !p)}
          title={isPinned ? "Unpin hint" : "Pin hint (stop rotating)"}
          style={{
            background: "none", border: "none",
            color: isPinned ? "var(--color-saffron)" : "var(--text-muted)",
            cursor: "pointer", fontSize: "0.7rem", padding: "2px 4px", borderRadius: "4px",
            transition: "var(--transition-fast)"
          }}
          id="hint-pin-btn"
        >
          {isPinned ? "📌" : "📍"}
        </button>

        {/* Dismiss */}
        <button
          onClick={() => setIsVisible(false)}
          title="Dismiss hints"
          style={{
            background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer",
            fontSize: "0.75rem", padding: "2px 4px", borderRadius: "4px",
            transition: "var(--transition-fast)"
          }}
          onMouseEnter={e => e.target.style.color = "#EF4444"}
          onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
          id="hint-dismiss-btn"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
