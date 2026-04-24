import React from "react";
import { Link } from "react-router-dom";
import { VOTER_PROFILES } from "../data/gameData";

const LEVELS_INFO = [
  { num: 0, icon: "📋", title: "Level 0: Register", render: "2D Portal", desc: "Simulate filling NVSP Form 6, verify your age under Article 326, select your constituency. Earn your EPIC card." },
  { num: 1, icon: "🚶", title: "Level 1: Gauntlet", render: "3D Street", desc: "Navigate a 3D street scene and resist 3 types of electoral influence: cash bribes (IPC 171B), free transport (IPC 171C), and peer pressure." },
  { num: 2, icon: "👝", title: "Level 2: Documents", render: "2D Cards", desc: "Pick the correct identity document from 7 options. Rare documents like Passport and MNREGA card give bonus IP." },
  { num: 3, icon: "👮", title: "Level 3: Booth", render: "3D Booth", desc: "Navigate the three-officer protocol: identity check, indelible ink on Form 17A, and EVM activation. Catch an impersonator for bonus points." },
  { num: 4, icon: "🗳️", title: "Level 4: Vote", render: "3D EVM", desc: "Press your vote on a 3D EVM model, then watch the VVPAT for 7 seconds. A 30% random tamper event tests your vigilance." },
  { num: 5, icon: "📺", title: "Level 5: Results", render: "2D Data", desc: "Watch the live results declaration with animated charts, a 'what-if' analysis, and your personal Integrity Points summary." },
];

export default function Learn() {
  return (
    <div style={{ paddingTop: "90px", maxWidth: "900px", margin: "0 auto", padding: "100px 40px 60px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ marginBottom: "12px" }}>How to Play</h1>
        <p style={{ fontSize: "1.05rem" }}>Everything you need to know before starting your democratic journey.</p>
      </div>

      {/* Integrity Points system */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ marginBottom: "20px" }}>🛡️ The Integrity Points System</h2>
        <div className="glass-card" style={{ padding: "28px" }}>
          <p style={{ marginBottom: "20px" }}>
            Your <strong style={{ color: "var(--color-saffron)" }}>Integrity Points (IP)</strong> are your Democratic Reputation.
            Every decision in the game adds or subtracts from your score out of a maximum of 210.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            {[
              { tier: "Tier 1 — Ethical", desc: "Resisting bribes, reporting fraud", earn: "+20", penalty: "−50", color: "#EF4444" },
              { tier: "Tier 2 — Procedural", desc: "Right documents, following instructions", earn: "+10", penalty: "−5", color: "#F59E0B" },
              { tier: "Tier 3 — Vigilance", desc: "Verifying VVPAT, checking ink", earn: "+15", penalty: "−10", color: "#3B82F6" },
            ].map(t => (
              <div key={t.tier} style={{ background: "var(--bg-card-2)", borderRadius: "var(--radius-md)", padding: "16px", border: `1px solid ${t.color}30` }}>
                <div style={{ fontWeight: 700, color: t.color, marginBottom: "6px", fontSize: "0.9rem" }}>{t.tier}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "10px" }}>{t.desc}</div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <span style={{ color: "var(--ip-high)", fontWeight: 700 }}>✅ {t.earn}</span>
                  <span style={{ color: "var(--ip-low)", fontWeight: 700 }}>❌ {t.penalty}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(255,153,51,0.08)", border: "1px solid rgba(255,153,51,0.2)", borderRadius: "var(--radius-md)", padding: "14px", fontSize: "0.88rem" }}>
            ⚡ <strong>Quick Reflex Bonus:</strong> If you make the right choice BEFORE Vivek's warning appears (within 3 seconds), you earn +5 extra IP for genuine knowledge!
          </div>
        </div>
      </section>

      {/* Endings */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ marginBottom: "20px" }}>🏆 Three Endings</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {VOTER_PROFILES.map(p => (
            <div key={p.id} className="glass-card" style={{ padding: "24px", textAlign: "center", borderColor: `${p.color}30` }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{p.emoji}</div>
              <div style={{ fontWeight: 700, color: p.color, marginBottom: "6px" }}>{p.title}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-saffron)", marginBottom: "10px" }}>{p.range}</div>
              <p style={{ fontSize: "0.82rem" }}>{p.message}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Level breakdown */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ marginBottom: "20px" }}>🗺️ Level-by-Level Guide</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {LEVELS_INFO.map(l => (
            <div key={l.num} className="glass-card" style={{ padding: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, var(--color-saffron), var(--color-saffron-dark))",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem"
              }}>{l.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700 }}>{l.title}</span>
                  <span style={{
                    padding: "2px 10px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 600,
                    background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.2)", color: "var(--color-saffron)"
                  }}>{l.render}</span>
                </div>
                <p style={{ fontSize: "0.88rem", margin: 0 }}>{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ marginBottom: "20px" }}>🤖 Vivek — Your AI Guide</h2>
        <div className="glass-card" style={{ padding: "24px" }}>
          <p style={{ marginBottom: "16px" }}>Vivek is your <strong>Democratic Conscience</strong> powered by <strong style={{ color: "#4285F4" }}>Google Gemini</strong>. The floating blue orb (bottom-right) is always available.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              "Ask any election law question in your language",
              "Automatically intervenes when you make a wrong choice",
              "Cites actual IPC sections and RPA 1951 clauses",
              "Changes color: Blue = neutral, Red = warning, Green = praise",
              "Speaks aloud using browser text-to-speech",
              "Never tells you who to vote for — that's your right",
            ].map(f => (
              <div key={f} style={{ display: "flex", gap: "8px", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--color-saffron)", flexShrink: 0 }}>✦</span>
                <span style={{ color: "var(--text-secondary)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ textAlign: "center" }}>
        <Link to="/create" className="btn btn-primary btn-large" id="learn-start-btn">
          🗳️ Ready — Start the Game
        </Link>
      </div>
    </div>
  );
}
