import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { speak, NPC_VOICES } from "../../services/tts";
import { DOCUMENTS } from "../../data/gameData";

export default function Level2() {
  const { playerName, language, awardIPEvent, addIP, goToLevel, t } = useGame();
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null); // { type: "success"|"error", message, doc }
  const [isComplete, setIsComplete] = useState(false);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    if (!playerName) { navigate("/create"); return; }
    goToLevel(2);
    speak(`Level 2, ${playerName}. You've reached the entrance of the polling station. Present a valid identity document to the officer.`, { language });
    if (window.vivekSay) window.vivekSay(`You're at the booth entrance, ${playerName}! The officer will ask for a valid ID. The ECI accepts 12 specific documents — pick the right one from your wallet!`);
    setTimeout(() => setShowTip(false), 5000);
  }, []);

  const officerDialogue = "Please present a valid photo identity document as per Election Commission of India guidelines.";

  const handleDocSelect = (doc) => {
    if (isComplete) return;
    setSelectedDoc(doc.id);

    if (doc.valid) {
      // Success
      const isRare = doc.isRare;
      if (isRare) {
        addIP(20, "CORRECT_DOC_RARE");
        speak(`Excellent! ${doc.name} is accepted. And most people don't even know this! +20 IP bonus!`, { language });
      } else if (attempts === 0) {
        awardIPEvent("CORRECT_DOC_FIRST_TRY");
        speak(`${doc.name} accepted. You chose the right document on the first try.`, { language });
      } else {
        addIP(5, "CORRECT_DOC_AFTER_ATTEMPTS");
        speak(`${doc.name} accepted.`, { language });
      }

      setFeedback({ type: "success", doc, message: doc.reason });
      speak(officerDialogue + ` ${doc.name} verified. Please proceed.`, { language, ...NPC_VOICES.OFFICER_1 });

      setTimeout(() => {
        setIsComplete(true);
      }, 1500);

    } else {
      // Wrong document
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      addIP(-5, "WRONG_DOC");
      setFeedback({ type: "error", doc, message: doc.reason });
      speak(`${doc.name} is not accepted. ${doc.reason}`, { language, ...NPC_VOICES.VIVEK });
      if (window.vivekSay) window.vivekSay(`"${doc.name}" is not on the ECI's approved list. ${doc.reason}`, "alert");
    }
  };

  const handleProceed = () => {
    navigate("/level/3");
  };

  return (
    <div className="game-container">
      <div className="level-header">
        <div className="level-badge">👝 Level 2 — The Document Wallet</div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Attempts: {attempts} · {attempts > 0 ? <span style={{ color: "var(--ip-low)" }}>−{attempts * 5} IP</span> : <span style={{ color: "var(--ip-high)" }}>No penalties yet</span>}
        </div>
      </div>

      <div style={{ padding: "20px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", maxWidth: "1100px", margin: "0 auto", flex: 1 }}>

        {/* Left: Officer Scene */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Booth illustration */}
          <div style={{
            background: "linear-gradient(135deg, var(--bg-card-2), var(--color-blue) 200%)",
            borderRadius: "var(--radius-xl)", padding: "40px 24px", textAlign: "center",
            border: "1px solid var(--border-subtle)", position: "relative", overflow: "hidden", minHeight: "220px"
          }}>
            {/* 3D-ish booth depth effect */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(37,99,235,0.05) 0%, transparent 100%)",
              pointerEvents: "none"
            }} />

            {/* Officer */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "3.5rem" }}>👮</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-saffron)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                1st Polling Officer — Identification
              </div>
            </div>

            {/* Officer dialogue */}
            <div style={{
              background: "rgba(0,0,0,0.4)", borderRadius: "var(--radius-md)",
              padding: "12px 16px", fontSize: "0.9rem", color: "var(--text-primary)",
              border: "1px solid var(--border-subtle)", textAlign: "left"
            }}>
              "{officerDialogue}"
            </div>

            {/* ECI Logo/Sign */}
            <div style={{
              position: "absolute", top: "12px", right: "12px",
              background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.2)",
              borderRadius: "var(--radius-sm)", padding: "4px 10px", fontSize: "0.7rem",
              color: "var(--color-saffron)", fontWeight: 700
            }}>🗳️ ECI</div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div style={{
              background: feedback.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${feedback.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              borderRadius: "var(--radius-md)", padding: "16px",
              animation: "float-up 0.3s ease"
            }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.3rem" }}>{feedback.type === "success" ? "✅" : "❌"}</span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "4px", color: feedback.type === "success" ? "var(--ip-high)" : "var(--ip-low)" }}>
                    {feedback.doc.name} — {feedback.type === "success" ? "Accepted" : "Not Accepted"}
                  </div>
                  <p style={{ fontSize: "0.85rem", margin: 0 }}>{feedback.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Pro tip */}
          {showTip && (
            <div style={{
              background: "rgba(255,153,51,0.08)", border: "1px solid rgba(255,153,51,0.2)",
              borderRadius: "var(--radius-md)", padding: "12px 16px", fontSize: "0.85rem",
              animation: "float-up 0.3s ease"
            }}>
              💡 <strong style={{ color: "var(--color-saffron)" }}>Pro Tip:</strong>{" "}
              You can vote even without your physical Voter ID — if your name is on the Electoral Roll and you have Aadhaar!
            </div>
          )}

          {/* Success CTA */}
          {isComplete && (
            <button className="btn btn-primary btn-large" onClick={handleProceed} id="level2-proceed-btn" style={{ animation: "float-up 0.3s ease" }}>
              🏛️ Enter the Booth →
            </button>
          )}
        </div>

        {/* Right: Document Wallet */}
        <div>
          <h3 style={{ marginBottom: "6px" }}>Your Document Wallet</h3>
          <p style={{ fontSize: "0.88rem", marginBottom: "20px" }}>
            {t("pickDocument")} — Tap to present to the officer
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {DOCUMENTS.map(doc => {
              const isSelected = selectedDoc === doc.id;
              const isCorrect = isSelected && doc.valid;
              const isWrong = isSelected && !doc.valid;

              return (
                <button
                  key={doc.id}
                  id={`doc-${doc.id}`}
                  onClick={() => handleDocSelect(doc)}
                  disabled={isComplete}
                  className={`doc-card ${isCorrect ? "selected" : ""} ${isWrong ? "invalid-selected" : ""}`}
                  style={{ cursor: isComplete ? "default" : "pointer" }}
                >
                  <span className="doc-icon">{doc.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>{doc.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{doc.description}</span>
                  {doc.isRare && (
                    <span style={{
                      fontSize: "0.65rem", padding: "2px 8px", borderRadius: "999px",
                      background: "rgba(255,153,51,0.15)", color: "var(--color-saffron)", fontWeight: 700
                    }}>RARE KNOWLEDGE +BONUS</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ECI Reference */}
          <div style={{
            marginTop: "20px", background: "var(--bg-card-2)", borderRadius: "var(--radius-md)",
            padding: "12px 16px", fontSize: "0.8rem", color: "var(--text-muted)",
            border: "1px solid var(--border-subtle)"
          }}>
            ℹ️ <strong>ECI Reference:</strong> The Election Commission of India accepts 12 specific documents for voter identification. These were last updated by ECI Notification No. 23/MCC/2019.
          </div>
        </div>
      </div>
    </div>
  );
}
