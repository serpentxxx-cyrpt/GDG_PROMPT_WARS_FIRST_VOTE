import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { VOTER_PROFILES } from "../data/gameData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Certificate() {
  const { playerName, playerGender, ip, voterProfile, resetGame } = useGame();
  const navigate = useNavigate();
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const endingKey = ip >= 81 ? "guardian" : ip >= 41 ? "conscious" : "passive";
  const profile = VOTER_PROFILES[endingKey === "guardian" ? 2 : endingKey === "conscious" ? 1 : 0];
  const emoji = playerGender === "female" ? "👩" : playerGender === "other" ? "🧑" : "👨";

  useEffect(() => {
    if (!playerName) navigate("/");
  }, [playerName, navigate]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: "#080C14",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`TheFirstVote_Certificate_${playerName?.replace(/\s/g, "_")}.pdf`);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed. Try right-clicking the certificate and saving as image.");
    } finally {
      setDownloading(false);
    }
  };

  const today = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  const BADGE_CONFIG = {
    guardian: { color: "#22C55E", glow: "rgba(34,197,94,0.3)", label: "Guardian of Democracy", stars: "⭐⭐⭐", border: "#22C55E" },
    conscious: { color: "#F59E0B", glow: "rgba(245,158,11,0.3)", label: "Conscious Citizen", stars: "⭐⭐", border: "#F59E0B" },
    passive: { color: "#6B7280", glow: "rgba(107,114,128,0.2)", label: "Passive Spectator", stars: "⭐", border: "#6B7280" },
  };
  const badge = BADGE_CONFIG[endingKey];

  return (
    <div style={{ minHeight: "100vh", padding: "100px 20px 60px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ marginBottom: "8px", textAlign: "center" }}>Your Certificate</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "32px", textAlign: "center" }}>
        Download and share your Democratic achievement!
      </p>

      {/* Certificate */}
      <div ref={certRef} className="certificate-container" style={{ width: "100%", maxWidth: "640px" }}>
        {/* Header decoration */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(to right, var(--color-saffron), ${badge.color}, var(--color-blue-mid))` }} />
        <div style={{ position: "absolute", inset: "12px", border: `1px solid ${badge.color}30`, borderRadius: "calc(var(--radius-xl) - 8px)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🗳️</div>
        <div style={{ fontSize: "0.7rem", color: "var(--color-saffron)", textTransform: "uppercase", letterSpacing: "4px", marginBottom: "4px", fontWeight: 700 }}>
          THE FIRST VOTE · GDG PROMPT WARS 2026
        </div>
        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "28px" }}>
          Powered by Google Gemini · Firebase · Cloud Run
        </div>

        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>This certifies that</div>
        <div style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "4px" }}>{emoji} {playerName}</div>
        <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
          has completed the Indian Voter Simulation
        </div>

        {/* Badge */}
        <div style={{
          display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "8px",
          background: `${badge.color}15`, border: `2px solid ${badge.color}`,
          borderRadius: "var(--radius-xl)", padding: "20px 40px", marginBottom: "24px",
          boxShadow: `0 0 30px ${badge.glow}`
        }}>
          <div style={{ fontSize: "3rem" }}>{profile.emoji}</div>
          <div style={{ fontWeight: 800, fontSize: "1.3rem", color: badge.color }}>{badge.label}</div>
          <div>{badge.stars}</div>
        </div>

        {/* Score */}
        <div style={{ display: "flex", gap: "40px", justifyContent: "center", marginBottom: "24px" }}>
          {[
            { label: "Integrity Points", value: ip },
            { label: "Max Possible", value: 210 },
            { label: "Percentile", value: `${Math.round((ip / 210) * 100)}%` },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: badge.color }}>{s.value}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div style={{
          background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)", padding: "14px 20px", marginBottom: "24px",
          fontStyle: "italic", fontSize: "0.9rem", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)"
        }}>
          "{profile.message}"
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-secondary)" }}>Tridibesh Sen</div>
            <div>Developer · IEM Newtown, Kolkata</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.6rem", marginBottom: "4px" }}>VERIFIED BY VIVEK AI</div>
            <div style={{ fontSize: "1.2rem" }}>🔵</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>Issued: {today}</div>
            <div>#TheFirstVote</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "16px", marginTop: "28px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          className="btn btn-primary btn-large"
          onClick={handleDownload}
          disabled={downloading}
          id="download-cert-btn"
        >
          {downloading ? "⏳ Generating PDF..." : "⬇️ Download Certificate"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => { resetGame(); navigate("/"); }}
          id="cert-home-btn"
        >
          🏠 Return Home
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => { resetGame(); navigate("/create"); }}
          id="cert-replay-btn"
        >
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
