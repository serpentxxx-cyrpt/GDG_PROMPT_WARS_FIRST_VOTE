import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { VOTER_PROFILES } from "../data/gameData";
import { saveCertificateData } from "../services/firebase";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function Certificate() {
  const { playerName, playerGender, ip, voterProfile, resetGame, userId } = useGame();
  const navigate = useNavigate();
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const endingKey = ip >= 81 ? "guardian" : ip >= 41 ? "conscious" : "passive";
  const profile = VOTER_PROFILES[endingKey === "guardian" ? 2 : endingKey === "conscious" ? 1 : 0];
  const emoji = playerGender === "female" ? "👩" : playerGender === "other" ? "🧑" : "👨";

  const BADGE_CONFIG = {
    guardian: { color: "#22C55E", glow: "rgba(34,197,94,0.3)", label: "Guardian of Democracy", stars: "⭐⭐⭐", border: "#22C55E" },
    conscious: { color: "#F59E0B", glow: "rgba(245,158,11,0.3)", label: "Conscious Citizen", stars: "⭐⭐", border: "#F59E0B" },
    passive: { color: "#6B7280", glow: "rgba(107,114,128,0.2)", label: "Passive Spectator", stars: "⭐", border: "#6B7280" },
  };
  const badge = BADGE_CONFIG[endingKey];

  useEffect(() => {
    if (!playerName) navigate("/");
    
    // Save the certificate achievement to Firebase
    const { userId } = JSON.parse(localStorage.getItem("tfv_state") || "{}");
    if (userId) {
      saveCertificateData(userId, { ip, profile: badge.label });
    }
  }, [playerName, navigate, ip, badge.label]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      // Force scroll to top before capture to prevent clipping bugs
      window.scrollTo(0, 0);
      
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: "#080C14",
        useCORS: true,
        logging: false,
        onclone: (doc) => {
          const el = doc.getElementById('cert-capture-area');
          if (el) {
            el.style.maxWidth = '800px';
            el.style.width = '800px';
            el.style.transform = 'none';
          }
        }
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      const safeName = (playerName || "Citizen").replace(/[^a-zA-Z0-9]/g, "_");
      pdf.save(`TheFirstVote_Certificate_${safeName}.pdf`);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed. Please take a screenshot of your certificate!");
    } finally {
      setDownloading(false);
    }
  };

  const today = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });



  return (
    <div style={{ minHeight: "100vh", padding: "100px 20px 60px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ marginBottom: "8px", textAlign: "center" }}>Your Certificate</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "32px", textAlign: "center" }}>
        Download and share your Democratic achievement!
      </p>

      {/* Certificate */}
      <div 
        id="cert-capture-area"
        ref={certRef} 
        className="certificate-container" 
        style={{ 
          width: "100%", 
          maxWidth: "700px", 
          padding: "40px 30px", 
          position: "relative",
          margin: "0 auto",
          overflow: "hidden",
          background: "#080C14",
          border: `1px solid ${badge.color}50`
        }}
      >
        {/* Header decoration */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "8px", background: `linear-gradient(to right, var(--color-saffron), ${badge.color}, var(--color-blue-mid))` }} />
        <div style={{ position: "absolute", inset: "16px", border: `2px dashed ${badge.color}20`, borderRadius: "calc(var(--radius-xl) - 4px)", pointerEvents: "none" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", position: "relative", zIndex: 1 }}>
          {/* Logo & Branding */}
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "2rem", marginBottom: "4px" }}>🗳️</div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-saffron)", textTransform: "uppercase", letterSpacing: "3px", fontWeight: 800 }}>
              THE FIRST VOTE
            </div>
            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
              GDG PROMPT WARS 2026
            </div>
          </div>

          {/* Fictional Game Details */}
          <div style={{ textAlign: "right", fontSize: "0.65rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "2px" }}>
            <div><span style={{ color: "var(--text-muted)" }}>SIM ID:</span> {userId ? userId.substring(0, 8).toUpperCase() : "SIM-8X-99-B"}</div>
            <div><span style={{ color: "var(--text-muted)" }}>REGION:</span> SOUTH KOLKATA</div>
            <div><span style={{ color: "var(--text-muted)" }}>ELECTORAL AI:</span> VIVEK MODEL-X</div>
            <div><span style={{ color: "var(--text-muted)" }}>CLEARANCE:</span> LEVEL 5</div>
          </div>
        </div>

        {/* User Info & Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "2px" }}>
            Official Certification of Civic Duty
          </div>
          
          <div style={{ 
            width: "90px", height: "90px", borderRadius: "50%", 
            background: `linear-gradient(135deg, ${badge.color}20, ${badge.color}40)`,
            border: `3px solid ${badge.color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "3.5rem", marginBottom: "16px",
            boxShadow: `0 0 20px ${badge.glow}`
          }}>
            {emoji}
          </div>
          
          <div style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "4px", color: "#F8FAFC" }}>
            {playerName}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-saffron)", fontWeight: 700, letterSpacing: "2px", marginBottom: "8px" }}>
            VOTER ID: {userId ? userId.substring(0, 6).toUpperCase() : Math.floor(Math.random() * 9000 + 1000)}
          </div>
          <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            has successfully completed the Indian Voter Simulation
          </div>
        </div>

        {/* Badge */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          background: `${badge.color}10`, border: `1px solid ${badge.color}50`,
          borderRadius: "var(--radius-xl)", padding: "16px 40px", margin: "0 auto 24px",
          width: "fit-content",
          boxShadow: `0 0 30px ${badge.glow}`
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "-5px" }}>{profile.emoji}</div>
          <div style={{ fontWeight: 800, fontSize: "1.4rem", color: badge.color, textTransform: "uppercase", letterSpacing: "1px" }}>{badge.label}</div>
          <div style={{ letterSpacing: "2px" }}>{badge.stars}</div>
        </div>

        {/* Score */}
        <div style={{ display: "flex", gap: "clamp(20px, 5vw, 60px)", justifyContent: "center", flexWrap: "wrap", marginBottom: "32px" }}>
          {[
            { label: "Integrity Points", value: ip },
            { label: "Max Possible", value: 210 },
            { label: "Percentile", value: `${Math.round((ip / 210) * 100)}%` },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center", minWidth: "80px" }}>
              <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: badge.color }}>{s.value}</div>
              <div style={{ fontSize: "clamp(0.6rem, 2vw, 0.75rem)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quote & "Try Now" */}
        <div style={{
          background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)", padding: "16px 20px", marginBottom: "32px",
          border: "1px solid var(--border-subtle)", position: "relative", zIndex: 1, textAlign: "center"
        }}>
          <div style={{ fontStyle: "italic", fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
            "{profile.message}"
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--color-saffron)", fontWeight: 600, letterSpacing: "1px" }}>
            ▶ PLAY THE SIMULATION NOW AT <span style={{ color: "#FFF" }}>gdg-prompt-wars-first-vote.web.app</span>
          </div>
        </div>

        {/* Footer / Copyright */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "10px", fontSize: "clamp(0.6rem, 2vw, 0.75rem)", color: "var(--text-muted)", position: "relative", zIndex: 1 }}>
          <div style={{ flex: 1 }}></div>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "clamp(0.5rem, 1.5vw, 0.6rem)", marginBottom: "2px", letterSpacing: "1px" }}>VERIFIED BY VIVEK AI</div>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "radial-gradient(circle, #60A5FA, #1A3A6B)", border: "1.5px solid var(--color-saffron)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#FFF" }}>✦</div>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div>Issued: {today}</div>
            <div style={{ color: "var(--color-saffron)" }}>#TheFirstVote</div>
          </div>
        </div>
        
        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "1px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
          © 2026 THE FIRST VOTE / GDG PROMPT WARS. ALL RIGHTS RESERVED.
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
