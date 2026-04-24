import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { speak } from "../services/tts";
import { VOTER_PROFILES } from "../data/gameData";

const ENDINGS = {
  guardian: {
    profile: VOTER_PROFILES[2],
    newsHeadline: "Citizens Praised for Exceptional Vigilance in Historic Clean Election",
    newsBody: "The Election Commission of India today acknowledged citizens who actively reported electoral malpractice, verified VVPAT slips, and maintained the integrity of the democratic process.",
    scene: "Arjun is being interviewed outside the polling station. A crowd applauds.",
    vivekQuote: "You didn't just vote — you protected democracy itself. The Election Commission thanks citizens like you. You are the Guardian of Democracy.",
    emoji: "🛡️",
    bg: "linear-gradient(135deg, #0A1F0A, #0F1729)",
    borderColor: "rgba(34,197,94,0.5)",
  },
  conscious: {
    profile: VOTER_PROFILES[1],
    newsHeadline: "Record Voter Turnout as Citizens Exercise Democratic Rights",
    newsBody: "Voters across West Bengal turned out in record numbers, with most reporting a smooth and transparent experience at polling stations.",
    scene: "You're at a tea stall, explaining the voting process to your younger cousin.",
    vivekQuote: "You did well. You followed the rules and successfully navigated the polling station. The next generation will learn from you.",
    emoji: "🗳️",
    bg: "linear-gradient(135deg, #0F1525, #1A3A6B20)",
    borderColor: "rgba(255,153,51,0.4)",
  },
  passive: {
    profile: VOTER_PROFILES[0],
    newsHeadline: "Election Concludes Amid Concerns Over Civic Awareness",
    newsBody: "While voter turnout remained adequate, civic groups raised concerns about voter education and the need for greater awareness of electoral procedures and rights.",
    scene: "You're sitting at home, watching the news quietly.",
    vivekQuote: "You voted. That matters. But democracy needs you to be its guardian, not just its participant. Will you try again?",
    emoji: "👁️",
    bg: "linear-gradient(135deg, #0F0F14, #1A1A2E)",
    borderColor: "rgba(239,68,68,0.3)",
  },
};

export default function Epilogue() {
  const { playerName, playerGender, ip, voterProfile, resetGame, language } = useGame();
  const navigate = useNavigate();
  const [scene, setScene] = useState(0); // 0 = news, 1 = vivek, 2 = profile reveal
  const [visible, setVisible] = useState(true);

  const endingKey = ip >= 81 ? "guardian" : ip >= 41 ? "conscious" : "passive";
  const ending = ENDINGS[endingKey];
  const emoji = playerGender === "female" ? "👩" : playerGender === "other" ? "🧑" : "👨";

  useEffect(() => {
    if (!playerName) { navigate("/create"); return; }
    speak(`${ending.newsHeadline}`, { language });
    if (window.vivekSay) window.vivekSay(ending.vivekQuote);
  }, []);

  const advance = () => {
    setVisible(false);
    setTimeout(() => {
      setScene(s => s + 1);
      setVisible(true);
    }, 400);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: ending.bg, padding: "100px 20px 40px", position: "relative", overflow: "hidden"
    }}>
      {/* India flag strip */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(to right, var(--color-saffron) 33%, white 33%, white 66%, var(--color-green) 66%)"
      }} />

      <div style={{
        maxWidth: "700px", width: "100%",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.4s ease, transform 0.4s ease"
      }}>

        {/* SCENE 0: News Broadcast */}
        {scene === 0 && (
          <div style={{ animation: "float-up 0.5s ease" }}>
            {/* TV Frame */}
            <div style={{
              background: "#0A0F1E", borderRadius: "var(--radius-xl)", padding: "4px",
              border: "4px solid #1F2937", boxShadow: "0 0 60px rgba(0,0,0,0.5)"
            }}>
              {/* TV Screen */}
              <div style={{
                background: "#050810", borderRadius: "calc(var(--radius-xl) - 4px)",
                padding: "28px", position: "relative", overflow: "hidden"
              }}>
                {/* News ticker */}
                <div style={{ background: "#DC2626", padding: "6px 16px", borderRadius: "4px", marginBottom: "20px", fontSize: "0.75rem", fontWeight: 700 }}>
                  🔴 LIVE RESULTS · Democratic Voice News
                </div>

                <h2 style={{ fontSize: "1.4rem", marginBottom: "12px", lineHeight: 1.3 }}>{ending.newsHeadline}</h2>
                <p style={{ marginBottom: "20px", fontSize: "0.9rem" }}>{ending.newsBody}</p>

                {/* Anchor */}
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)", padding: "14px" }}>
                  <div style={{ fontSize: "2rem" }}>📺</div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--color-saffron)", fontWeight: 700, marginBottom: "4px" }}>ANCHOR — DEMOCRATIC VOICE NEWS</div>
                    <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>"{ending.newsBody}"</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-large" style={{ width: "100%", marginTop: "20px" }} onClick={advance} id="epilogue-next-1">
              → Continue
            </button>
          </div>
        )}

        {/* SCENE 1: Your story */}
        {scene === 1 && (
          <div style={{ textAlign: "center", animation: "float-up 0.5s ease" }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>{emoji}</div>
            <h2 style={{ marginBottom: "12px" }}>{playerName}</h2>
            <div style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)", padding: "24px", marginBottom: "24px", fontStyle: "italic", fontSize: "1.05rem"
            }}>
              {ending.scene}
            </div>

            {/* Vivek message */}
            <div style={{
              background: "rgba(26,58,107,0.3)", border: "1px solid rgba(37,99,235,0.3)",
              borderRadius: "var(--radius-md)", padding: "20px",
              display: "flex", gap: "14px", alignItems: "flex-start", textAlign: "left", marginBottom: "24px"
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
                background: "radial-gradient(circle, #60A5FA, #1A3A6B)",
                border: "2px solid var(--color-saffron)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem"
              }}>🔵</div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--color-saffron)", fontWeight: 700, marginBottom: "6px" }}>VIVEK — DEMOCRATIC CONSCIENCE</div>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--text-primary)" }}>"{ending.vivekQuote}"</p>
              </div>
            </div>

            <button className="btn btn-primary btn-large" style={{ width: "100%" }} onClick={advance} id="epilogue-next-2">
              🏆 See Your Results
            </button>
          </div>
        )}

        {/* SCENE 2: Final profile */}
        {scene === 2 && (
          <div style={{ textAlign: "center", animation: "float-up 0.5s ease" }}>
            {/* Badge reveal */}
            <div style={{
              background: ending.bg, border: `2px solid ${ending.borderColor}`,
              borderRadius: "var(--radius-xl)", padding: "40px", marginBottom: "24px",
              boxShadow: `0 0 40px ${ending.borderColor}`
            }}>
              <div style={{ fontSize: "5rem", marginBottom: "16px", animation: "float-up 0.5s ease" }}>{ending.emoji}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "8px" }}>
                Your Voter Profile
              </div>
              <h2 style={{ fontSize: "2rem", marginBottom: "8px" }}>{ending.profile.title}</h2>
              <p style={{ marginBottom: "20px", fontSize: "0.95rem" }}>{ending.profile.message}</p>

              {/* Score */}
              <div style={{ display: "flex", gap: "32px", justifyContent: "center", marginBottom: "24px" }}>
                <div>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: ending.profile.color }}>{ip}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Integrity Points</div>
                </div>
                <div>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900 }}>210</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Maximum</div>
                </div>
                <div>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--color-saffron)" }}>{Math.round((ip / 210) * 100)}%</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Score</div>
                </div>
              </div>

              <div style={{
                display: "inline-block", padding: "8px 24px", borderRadius: "999px",
                background: `${ending.profile.color}20`, border: `1px solid ${ending.profile.color}60`,
                color: ending.profile.color, fontWeight: 700, fontSize: "0.9rem"
              }}>
                {ending.profile.range}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/certificate" className="btn btn-primary btn-large" style={{ flex: 1 }} id="goto-certificate-btn">
                🏅 Get Certificate
              </Link>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => { resetGame(); navigate("/"); }}
                id="play-again-btn"
              >
                🔄 Play Again
              </button>
            </div>

            {/* Share card */}
            <div style={{ marginTop: "16px", padding: "16px", background: "var(--bg-card-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "0.85rem" }}>
              📲 <strong>Share your result:</strong>{" "}
              "I scored {ip}/210 as '{ending.profile.title}' in The First Vote! 🗳️ #TheFirstVote #GDGPromptWars"
              <button
                className="btn btn-secondary"
                style={{ marginLeft: "12px", padding: "6px 14px", fontSize: "0.8rem" }}
                onClick={() => navigator.clipboard?.writeText(`I scored ${ip}/210 as '${ending.profile.title}' in The First Vote! 🗳️ #TheFirstVote #GDGPromptWars`).then(() => alert("Copied!")).catch(() => {})}
                id="copy-share-btn"
              >Copy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
