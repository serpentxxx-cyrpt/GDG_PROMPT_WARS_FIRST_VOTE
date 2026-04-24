import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const LEVELS_PREVIEW = [
  { num: 0, icon: "📋", title: "Register", desc: "Create your Voter ID on the NVSP portal" },
  { num: 1, icon: "🚶", title: "Gauntlet", desc: "Resist bribes and political pressure on the street" },
  { num: 2, icon: "👝", title: "Documents", desc: "Pick the right ID from your wallet" },
  { num: 3, icon: "👮", title: "Booth", desc: "Navigate the three-officer protocol" },
  { num: 4, icon: "🗳️", title: "Vote", desc: "Use the EVM and verify the VVPAT" },
  { num: 5, icon: "📺", title: "Results", desc: "Watch the result declaration live" },
];

export default function Landing() {
  const { t } = useGame();
  const navigate = useNavigate();


  return (
    <div style={{ paddingTop: "70px" }}>
      {/* India flag top strip */}
      <div className="india-flag-strip" />

      {/* ======================================================
          HERO SECTION
         ====================================================== */}
      <section className="landing-hero" id="hero">
        <div className="landing-bg" />

        {/* Floating background orbs */}
        <div style={{
          position: "absolute", width: "600px", height: "600px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(255,153,51,0.06) 0%, transparent 70%)",
          top: "10%", left: "-10%", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", width: "500px", height: "500px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(26,58,107,0.1) 0%, transparent 70%)",
          bottom: "10%", right: "-5%", pointerEvents: "none"
        }} />

        <div style={{
          textAlign: "center", padding: "40px 20px", maxWidth: "800px",
          position: "relative", zIndex: 1
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.3)",
            borderRadius: "999px", padding: "6px 18px", marginBottom: "24px",
            fontSize: "0.85rem", color: "var(--color-saffron)", fontWeight: 600,
            animation: "float-up 0.6s ease"
          }}>
            🏆 GDG Prompt Wars 2026 · Build with AI
          </div>

          <h1 style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, var(--color-saffron) 50%, var(--color-blue-light) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundSize: "200% 200%", animation: "gradient-move 4s ease infinite",
            marginBottom: "12px", lineHeight: 1.1
          }}>
            The First Vote
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)", color: "var(--text-secondary)",
            maxWidth: "600px", margin: "0 auto 16px",
            animation: "float-up 0.6s ease 0.1s both"
          }}>
            India's first AI-powered First-Person Voter Simulator.
            Learn every step of the election process through immersive gameplay.
          </p>

          <p style={{
            fontSize: "1rem", color: "var(--color-saffron)", fontWeight: 600,
            marginBottom: "36px", animation: "float-up 0.6s ease 0.2s both"
          }}>
            🌐 English · हिंदी · বাংলা
          </p>

          <div style={{
            display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
            animation: "float-up 0.6s ease 0.3s both"
          }}>
            <Link to="/create" className="btn btn-primary btn-large" id="hero-start-btn">
              ▶ Start the Game
            </Link>
            <Link to="/learn" className="btn btn-secondary btn-large" id="hero-learn-btn">
              📖 How to Play
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "40px", justifyContent: "center", marginTop: "48px",
            animation: "float-up 0.6s ease 0.4s both", flexWrap: "wrap"
          }}>
            {[
              { value: "6", label: "Levels" },
              { value: "210", label: "Max IP" },
              { value: "3", label: "Endings" },
              { value: "100%", label: "Free" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--color-saffron)" }}>{s.value}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          ABOUT THE GAME
         ====================================================== */}
      <section id="about-game" style={{ padding: "80px 40px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-block", background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.2)",
            borderRadius: "999px", padding: "4px 16px", fontSize: "0.8rem", color: "var(--color-saffron)",
            fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px"
          }}>About the Game</div>
          <h2>Experience Democracy, Don't Just Read About It</h2>
          <p style={{ maxWidth: "600px", margin: "16px auto 0", fontSize: "1.05rem" }}>
            "The First Vote" is a civics education simulation built to teach every Indian voter
            their rights, responsibilities, and the complete electoral process — through play.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {[
            { icon: "🤖", title: "Powered by Gemini AI", desc: "Vivek, your Democratic Conscience AI companion, is powered by Google Gemini. Ask anything — from IPC sections to VVPAT procedures — and get real answers." },
            { icon: "🏛️", title: "100% ECI Accurate", desc: "Every step follows the actual Election Commission of India guidelines — the officers, the documents, the ink, the EVM procedure. All real." },
            { icon: "🛡️", title: "Integrity Points System", desc: "Your decisions build a Democratic Reputation. Resist bribes, verify your vote, report fraud — and earn the Guardian of Democracy badge." },
            { icon: "🌐", title: "Multilingual", desc: "Play in English, Hindi, or Bengali. Vivek speaks your language — naturally, not robotically." },
          ].map(f => (
            <div key={f.title} className="glass-card" style={{ padding: "28px", transition: "var(--transition-mid)" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "0.9rem" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================
          LEVEL JOURNEY MAP
         ====================================================== */}
      <section style={{ padding: "80px 40px", background: "rgba(15,23,41,0.5)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2>The Journey: 6 Levels to Guardian</h2>
            <p>From registration to result night — experience the complete Indian election cycle.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "20px" }}>
            {LEVELS_PREVIEW.map((lvl, i) => (
              <div key={lvl.num} style={{ position: "relative" }}>
                <div className="glass-card" style={{
                  padding: "24px 16px", textAlign: "center",
                  borderColor: "rgba(255,153,51,0.2)", cursor: "default",
                  transition: "var(--transition-mid)"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-saffron)"; e.currentTarget.style.transform = "translateY(-6px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,153,51,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--color-saffron), var(--color-saffron-dark))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 800, margin: "0 auto 12px", color: "white"
                  }}>{lvl.num === 0 ? "0" : lvl.num}</div>
                  <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{lvl.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "6px" }}>{lvl.title}</div>
                  <p style={{ fontSize: "0.78rem", lineHeight: 1.4 }}>{lvl.desc}</p>
                </div>
                {i < LEVELS_PREVIEW.length - 1 && (
                  <div style={{
                    position: "absolute", top: "50%", right: "-14px",
                    color: "var(--color-saffron)", fontSize: "1.2rem", zIndex: 1,
                    display: window.innerWidth > 768 ? "block" : "none"
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          ABOUT THE DEVELOPER
         ====================================================== */}
      <section id="about-section" style={{ padding: "80px 40px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-block", background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)",
            borderRadius: "999px", padding: "4px 16px", fontSize: "0.8rem", color: "var(--color-blue-light)",
            fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px"
          }}>About the Developer</div>
          <h2>Built by a First-Time Builder</h2>
        </div>

        <div className="glass-card" style={{ padding: "40px", display: "grid", gridTemplateColumns: "200px 1fr", gap: "40px", alignItems: "center" }}>
          {/* Photo */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "160px", height: "160px", borderRadius: "50%", overflow: "hidden",
              border: "3px solid var(--color-saffron)", margin: "0 auto 16px",
              boxShadow: "0 0 30px var(--color-saffron-glow)"
            }}>
              <img
                src="/tridibesh.jpg"
                alt="Tridibesh Sen"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;background:var(--bg-card-2)">👤</div>';
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <a href="https://www.linkedin.com/in/tridibesh-sen-a39218380" target="_blank" rel="noopener noreferrer"
                style={{ color: "#60A5FA", fontSize: "0.85rem", textDecoration: "none" }}
                id="dev-linkedin-link">LinkedIn ↗</a>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 style={{ fontSize: "1.8rem", marginBottom: "4px" }}>Tridibesh Sen</h3>
            <div style={{ color: "var(--color-saffron)", fontWeight: 600, marginBottom: "16px", fontSize: "0.95rem" }}>
              B.Tech CSE (Data Science) · IEM Newtown, Kolkata
            </div>
            <p style={{ marginBottom: "20px", lineHeight: 1.8 }}>
              B.Tech Computer Science student specializing in Data Science with a strong foundation
              in full-stack web development and IoT integration. Proven track record of building
              functional AI-driven projects, including VectorCore AI (TinyML) and WalletO.
              Passionate about developing scalable, real-time tech solutions to solve urban challenges.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["Full-Stack Dev", "IoT · ESP32", "Python · JS", "Generative AI", "Data Science"].map(skill => (
                <span key={skill} style={{
                  padding: "4px 12px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 600,
                  background: "var(--bg-glass-light)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)"
                }}>{skill}</span>
              ))}
            </div>

            <div style={{ marginTop: "20px" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Projects</div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {[
                  { name: "Solisticx AI", desc: "Automated Workflow Engine" },
                  { name: "GestureSync", desc: "TinyML Gesture Control" },
                  { name: "ROUTE-কলকাতা", desc: "Real-Time Transit" },
                ].map(p => (
                  <div key={p.name} style={{
                    padding: "8px 14px", background: "var(--bg-card-2)", borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)"
                  }}>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{p.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA FOOTER SECTION
         ====================================================== */}
      <section style={{
        padding: "80px 40px", textAlign: "center",
        background: "linear-gradient(180deg, transparent, rgba(255,153,51,0.05))"
      }}>
        <h2 style={{ marginBottom: "16px" }}>Ready to Cast Your First Vote?</h2>
        <p style={{ marginBottom: "32px" }}>Join thousands of Indians learning their democratic rights through play.</p>
        <Link to="/create" className="btn btn-primary btn-large" id="footer-start-btn">
          🗳️ Begin Your Journey
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "24px 40px", borderTop: "1px solid var(--border-subtle)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: "0.85rem", color: "var(--text-muted)", flexWrap: "wrap", gap: "12px"
      }}>
        <div>🗳️ The First Vote · Built for GDG Prompt Wars 2026</div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          Built with
          <span style={{ color: "var(--color-saffron)" }}>Anti-Gravity</span> ·
          <span style={{ color: "#4285F4" }}>Gemini</span> ·
          <span style={{ color: "#FFA000" }}>Firebase</span> ·
          <span style={{ color: "#34A853" }}>Cloud Run</span>
        </div>
        <div>© 2026 Tridibesh Sen</div>
      </footer>
    </div>
  );
}
