import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGame } from "../context/GameContext";

const GENDERS = [
  { id: "male", labelKey: "male", emoji: "👨" },
  { id: "female", labelKey: "female", emoji: "👩" },
  { id: "other", labelKey: "other", emoji: "🧑" },
];

export default function CharacterCreate() {
  const { setPlayer, startGame, language, t } = useGame();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [nameError, setNameError] = useState("");

  const handleStartGame = () => {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setNameError(t("nameError"));
      return;
    }
    if (!selectedGender) {
      setNameError(t("genderError"));
      return;
    }
    setNameError("");
    setPlayer(trimmedName, selectedGender);
    startGame();
    navigate("/prologue");
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "100px 20px 40px", position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse at 50% 0%, rgba(255,153,51,0.08) 0%, transparent 60%)"
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "520px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🗳️</div>
          <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>{t("createVoter")}</h1>
          <p style={{ color: "var(--text-secondary)" }}>You're about to cast your first vote in history</p>

          {/* Language reminder */}
          <div style={{
            marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,153,51,0.08)", border: "1px solid rgba(255,153,51,0.2)",
            borderRadius: "999px", padding: "4px 14px", fontSize: "0.8rem", color: "var(--color-saffron)"
          }}>
            🌐 {language === "hi" ? "हिंदी" : language === "bn" ? "বাংলা" : "English"}
            <Link to="/settings" style={{ color: "var(--text-muted)", textDecoration: "underline", fontSize: "0.75rem" }}>
              Change
            </Link>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "36px" }}>
          {/* Name */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block", fontSize: "0.85rem", fontWeight: 600,
              color: "var(--text-secondary)", marginBottom: "8px",
              textTransform: "uppercase", letterSpacing: "1px"
            }}>{t("yourName")}</label>
            <input
              id="player-name-input"
              className="input"
              type="text"
              placeholder={t("enterName")}
              value={name}
              onChange={e => { setName(e.target.value); setNameError(""); }}
              maxLength={30}
              autoFocus
            />
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px", textAlign: "right" }}>
              {name.length}/30
            </div>
          </div>

          {/* Gender */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block", fontSize: "0.85rem", fontWeight: 600,
              color: "var(--text-secondary)", marginBottom: "12px",
              textTransform: "uppercase", letterSpacing: "1px"
            }}>{t("gender")}</label>
            <div style={{ display: "flex", gap: "12px" }}>
              {GENDERS.map(g => (
                <button
                  key={g.id}
                  id={`gender-${g.id}`}
                  onClick={() => { setSelectedGender(g.id); setNameError(""); }}
                  style={{
                    flex: 1, padding: "16px 8px", borderRadius: "var(--radius-md)",
                    border: `2px solid ${selectedGender === g.id ? "var(--color-saffron)" : "var(--border-subtle)"}`,
                    background: selectedGender === g.id ? "rgba(255,153,51,0.1)" : "var(--bg-glass-light)",
                    cursor: "pointer", transition: "var(--transition-mid)", textAlign: "center",
                    boxShadow: selectedGender === g.id ? "0 0 16px var(--color-saffron-glow)" : "none"
                  }}
                >
                  <div style={{ fontSize: "1.8rem", marginBottom: "4px" }}>{g.emoji}</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: selectedGender === g.id ? "var(--color-saffron)" : "var(--text-secondary)" }}>
                    {t(g.labelKey)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {nameError && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "var(--radius-md)", padding: "10px 14px",
              color: "#FCA5A5", fontSize: "0.88rem", marginBottom: "20px"
            }}>
              ⚠️ {nameError}
            </div>
          )}

          {/* Preview */}
          {name.trim() && selectedGender && (
            <div style={{
              background: "rgba(255,153,51,0.05)", border: "1px solid rgba(255,153,51,0.2)",
              borderRadius: "var(--radius-md)", padding: "14px 16px",
              marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px"
            }}>
              <span style={{ fontSize: "1.5rem" }}>{GENDERS.find(g => g.id === selectedGender)?.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{name.trim()}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Age 18 · First-time voter · South Kolkata</div>
              </div>
              <div style={{
                marginLeft: "auto", padding: "4px 12px", borderRadius: "999px",
                background: "rgba(255,153,51,0.2)", color: "var(--color-saffron)",
                fontSize: "0.75rem", fontWeight: 700
              }}>VOTER #247</div>
            </div>
          )}

          <button className="btn btn-primary btn-large" onClick={handleStartGame} id="start-game-btn" style={{ width: "100%" }}>
            🗳️ {t("beginJourney")}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          🔒 Your data stays on your device. No personal info is stored.
        </p>
      </div>
    </div>
  );
}
