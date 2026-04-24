import React from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

const DISQUALIFICATION_LAWS = {
  ACCEPT_BRIBE: {
    law: "IPC Section 171B",
    title: "Electoral Bribery",
    description: "Accepting any gift, money, or valuable consideration as an inducement to vote for a particular candidate is a criminal offense under Indian law.",
    punishment: "Punishable with imprisonment up to 1 year, or a fine, or both.",
  },
  IGNORE_FAKE_INK: {
    law: "Representation of the People Act 1951 — Section 62",
    title: "Failure to Report Electoral Fraud",
    description: "A citizen who witnesses electoral impersonation and fails to report it to the Presiding Officer has allowed the democratic process to be compromised.",
    punishment: "While not directly punishable, it enables electoral fraud which carries penalties of up to 3 years imprisonment for the perpetrator.",
  },
  DEFAULT: {
    law: "Representation of the People Act 1951",
    title: "Electoral Misconduct",
    description: "Your actions have violated the standards of conduct expected during a democratic election.",
    punishment: "The Presiding Officer has the authority to ask you to leave the polling station.",
  }
};

export default function DisqualificationModal() {
  const { showDisqualificationModal, disqualificationReason, closeDisqualificationModal, resetFromDisqualification, goToLevel, currentLevel } = useGame();
  const navigate = useNavigate();

  if (!showDisqualificationModal) return null;

  const law = DISQUALIFICATION_LAWS[disqualificationReason] || DISQUALIFICATION_LAWS.DEFAULT;

  const handleRetry = () => {
    resetFromDisqualification();
    closeDisqualificationModal();
    // Stay on the same level
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="disq-title">
      <div className="modal-content" style={{ maxWidth: "520px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🚫</div>
          <h2 className="disq-modal-title" id="disq-title">Disqualified!</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            The Presiding Officer has flagged your conduct.
          </p>
        </div>

        {/* Law Citation */}
        <div className="law-citation">
          <div style={{ fontWeight: 700, marginBottom: "6px", color: "#EF4444" }}>
            ⚖️ {law.law} — {law.title}
          </div>
          <p style={{ color: "#FCA5A5", fontSize: "0.88rem", margin: 0 }}>{law.description}</p>
        </div>

        {/* Punishment */}
        <div style={{
          background: "rgba(239, 68, 68, 0.05)",
          border: "1px solid rgba(239, 68, 68, 0.15)",
          borderRadius: "var(--radius-md)",
          padding: "12px 16px",
          marginBottom: "20px"
        }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>REAL-WORLD CONSEQUENCE</div>
          <div style={{ fontSize: "0.9rem", color: "#FDA4AF" }}>{law.punishment}</div>
        </div>

        {/* Vivek Message */}
        <div style={{
          background: "rgba(26, 58, 107, 0.2)",
          border: "1px solid rgba(37, 99, 235, 0.3)",
          borderRadius: "var(--radius-md)",
          padding: "12px 16px",
          marginBottom: "24px",
          display: "flex",
          gap: "10px",
          alignItems: "flex-start"
        }}>
          <span style={{ fontSize: "1.2rem" }}>🔵</span>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0 }}>
            <strong style={{ color: "var(--color-saffron)" }}>Vivek says:</strong>{" "}
            "Every mistake is a lesson, {"{"}player{"}"}. Democracy depends on informed, ethical citizens. Use this knowledge — restart and show me you've learned."
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRetry} id="disq-retry-btn">
            🔄 Retry This Level
          </button>
          <button className="btn btn-secondary" onClick={() => { closeDisqualificationModal(); navigate("/"); }} id="disq-home-btn">
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}
