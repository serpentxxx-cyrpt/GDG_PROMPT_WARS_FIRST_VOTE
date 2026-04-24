import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { loginWithGoogle, logout } from "../services/firebase";
import { setMusicMuted, getMusicMuted, setMusicVolume } from "../services/audioManager";

const LANGUAGES = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", native: "বাংলা", flag: "🇮🇳" },
];

const NAV_SECTIONS = [
  { label: "PREFERENCES", items: [
    { id: "language",  icon: "🌐", label: "Language" },
    { id: "audio",     icon: "🔊", label: "Audio & Voice" },
    { id: "gameplay",  icon: "🎮", label: "Gameplay" },
    { id: "display",   icon: "🖥️",  label: "Display" },
  ]},
  { label: "ACCOUNT", items: [
    { id: "account",   icon: "👤", label: "Account & Login" },
  ]},
  { label: "INFO", items: [
    { id: "about",     icon: "ℹ️",  label: "About" },
  ]},
];

// ── Sub-components ───────────────────────────────────────────
function DashToggle({ id, checked, onChange }) {
  return (
    <button id={id} role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{
        width: "42px", height: "23px", borderRadius: "999px", border: "none", flexShrink: 0,
        background: checked ? "linear-gradient(135deg,#4F46E5,#7C3AED)" : "#CBD5E1",
        cursor: "pointer", position: "relative", transition: "background 0.2s ease"
      }}>
      <span style={{
        position: "absolute", top: "3px",
        left: checked ? "21px" : "3px",
        width: "17px", height: "17px", borderRadius: "50%", background: "white",
        transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
      }} />
    </button>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="dash-setting-row">
      <div>
        <div className="dash-setting-label">{label}</div>
        {desc && <div className="dash-setting-desc">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function DashSlider({ id, min, max, step, value, onChange, label, desc, format }) {
  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <div>
          <div className="dash-setting-label">{label}</div>
          {desc && <div className="dash-setting-desc">{desc}</div>}
        </div>
        <span style={{ color: "#4F46E5", fontWeight: 700, fontSize: "0.88rem", minWidth: "42px", textAlign: "right" }}>
          {format ? format(value) : value}
        </span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#4F46E5" }} />
    </div>
  );
}

function Card({ icon, title, children }) {
  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <div className="dash-card-icon">{icon}</div>
        <span className="dash-card-title">{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function Settings() {
  const { language, setLanguage, userId, setUserId } = useGame();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(location.state?.activeTab || "language");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActive(location.state.activeTab);
    }
  }, [location.state]);

  const handleLogin = async () => {
    try {
      const loggedUser = await loginWithGoogle();
      setUser(loggedUser);
      setUserId(loggedUser.uid);
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setUserId(null);
  };

  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem("tfv_theme") || "dark");
  const applyTheme = (t) => { document.documentElement.setAttribute("data-theme", t); localStorage.setItem("tfv_theme", t); setTheme(t); };

  // Audio
  const [soundEffects,  setSoundEffects]  = useState(() => JSON.parse(localStorage.getItem("tfv_sound") ?? "true"));
  const [voiceNarration, setVoiceNarration] = useState(() => JSON.parse(localStorage.getItem("tfv_narration") ?? "true"));
  const [npcVoice,      setNpcVoice]      = useState(() => JSON.parse(localStorage.getItem("tfv_npc_voice") ?? "true"));
  const [voiceSpeed,    setVoiceSpeed]    = useState(() => Number(localStorage.getItem("tfv_voice_speed") ?? "0.75"));
  const [voiceVolume,   setVoiceVolume]   = useState(() => Number(localStorage.getItem("tfv_voice_volume") ?? "1.0"));
  const [voiceGender,   setVoiceGender]   = useState(() => localStorage.getItem("tfv_voice_gender") || "female");
  const [musicMuted,    setMusicMutedState] = useState(() => localStorage.getItem("tfv_music_muted") === "true");
  const [musicVol,      setMusicVol]      = useState(() => Number(localStorage.getItem("tfv_music_vol") ?? "0.7"));

  const handleMusicMute = (muted) => { setMusicMutedState(muted); setMusicMuted(muted); };
  const handleMusicVol = (vol) => { setMusicVol(vol); setMusicVolume(vol); };

  // Gameplay
  const [showHints,     setShowHints]     = useState(() => JSON.parse(localStorage.getItem("tfv_hints") ?? "true"));
  const [aiDelay,       setAiDelay]       = useState(() => Number(localStorage.getItem("tfv_ai_delay") ?? "3"));
  const [ipAnim,        setIpAnim]        = useState(() => JSON.parse(localStorage.getItem("tfv_ip_anim") ?? "true"));
  const [autoAdv,       setAutoAdv]       = useState(() => JSON.parse(localStorage.getItem("tfv_auto") ?? "false"));

  // Display
  const [textSize,      setTextSize]      = useState(() => Number(localStorage.getItem("tfv_text_size") ?? "1"));
  const [contrast,      setContrast]      = useState(() => JSON.parse(localStorage.getItem("tfv_contrast") ?? "false"));
  const [reduceMotion,  setReduceMotion]  = useState(() => JSON.parse(localStorage.getItem("tfv_motion") ?? "false"));

  const handleToggle = (key, setter, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    setter(value);
    if (key === "tfv_contrast") document.documentElement.style.filter = value ? "contrast(1.2)" : "";
    if (key === "tfv_motion") document.documentElement.style.setProperty("--transition-mid", value ? "0s" : "0.3s cubic-bezier(0.4,0,0.2,1)");
    if (key === "tfv_text_size") document.documentElement.style.fontSize = `${value * 16}px`;
  };

  const [saved, setSaved] = useState(false);
  const save = () => {
    localStorage.setItem("tfv_voice_speed", voiceSpeed);
    localStorage.setItem("tfv_voice_volume", voiceVolume);
    localStorage.setItem("tfv_ai_delay", aiDelay);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  // ── Panel renderers ──────────────────────────────────────
  const panels = {
    language: (
      <Card icon="🌐" title="Language / भाषा / ভাষা">
        <p style={{ fontSize: "0.82rem", color: "#64748B", marginBottom: "14px" }}>
          Changes all game text, NPC voices, and Vivek's responses. Set before starting the game.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
          {LANGUAGES.map(lang => {
            const active = language === lang.code;
            return (
              <button key={lang.code} id={`lang-${lang.code}`} onClick={() => setLanguage(lang.code)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px",
                  borderRadius: "10px",
                  border: `2px solid ${active ? "#4F46E5" : "#E2E8F0"}`,
                  background: active ? "#EEF2FF" : "transparent",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s ease"
                }}>
                <span style={{ fontSize: "1.4rem" }}>{lang.flag}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, color: "#1E293B" }}>{lang.label}</span>
                  <span style={{ color: "#94A3B8", marginLeft: "8px", fontSize: "0.88rem" }}>{lang.native}</span>
                </div>
                {active && (
                  <span style={{ background: "#4F46E5", color: "#fff", fontSize: "0.62rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px" }}>
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: "0.78rem", color: "#94A3B8", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>🔒</span> Language cannot be changed once the game starts.
        </div>
      </Card>
    ),

    audio: (
      <Card icon="🔊" title="Audio & Voice">
        <SettingRow label="🎵 Background Music" desc="Ambient Indian-themed music throughout the game">
          <DashToggle id="toggle-music" checked={!musicMuted} onChange={v => handleMusicMute(!v)} />
        </SettingRow>
        <DashSlider id="slider-music-vol" min={0} max={1} step={0.05} value={musicVol} onChange={handleMusicVol}
          label="Music Volume" format={v => `${Math.round(v * 100)}%`} />
        <SettingRow label="Sound Effects" desc="UI clicks, level transition sounds, IP gain/loss">
          <DashToggle id="toggle-sound" checked={soundEffects} onChange={v => handleToggle("tfv_sound", setSoundEffects, v)} />
        </SettingRow>
        <SettingRow label="Voice Narration" desc="Story narration starting from Level 0">
          <DashToggle id="toggle-narration" checked={voiceNarration} onChange={v => handleToggle("tfv_narration", setVoiceNarration, v)} />
        </SettingRow>
        <SettingRow label="NPC Dialogue Voice" desc="Characters speak their lines aloud">
          <DashToggle id="toggle-npc-voice" checked={npcVoice} onChange={v => handleToggle("tfv_npc_voice", setNpcVoice, v)} />
        </SettingRow>

        {/* Voice Gender Toggle */}
        <div style={{ padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
          <div className="dash-setting-label" style={{ marginBottom: "4px" }}>Voice Gender</div>
          <div className="dash-setting-desc" style={{ marginBottom: "12px" }}>Prefer Male or Female narrator voice (OS dependent)</div>
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { id: "female", emoji: "👩", label: "Female Voice" },
              { id: "male", emoji: "👨", label: "Male Voice" },
            ].map(opt => (
              <button key={opt.id} onClick={() => handleToggle("tfv_voice_gender", setVoiceGender, opt.id)}
                style={{
                  flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer",
                  border: `2px solid ${voiceGender === opt.id ? "#4F46E5" : "#E2E8F0"}`,
                  background: voiceGender === opt.id ? "#EEF2FF" : "transparent",
                  fontWeight: 600, color: "#1E293B", transition: "all 0.15s ease"
                }}>
                <span style={{ marginRight: "8px" }}>{opt.emoji}</span> {opt.label}
              </button>
            ))}
          </div>
        </div>

        <DashSlider id="slider-speed" min={0.5} max={1.5} step={0.05} value={voiceSpeed} onChange={setVoiceSpeed}
          label="Narration Speed" desc="Default: 0.75× (slower for clarity)" format={v => `${v.toFixed(2)}×`} />
        <DashSlider id="slider-volume" min={0} max={1} step={0.1} value={voiceVolume} onChange={setVoiceVolume}
          label="Voice Volume" format={v => `${Math.round(v * 100)}%`} />
        <div style={{ padding: "10px 0", fontSize: "0.78rem", color: "#94A3B8" }}>
          🖥️ Voice quality depends on OS language packs. For Hindi/Bengali install via <strong>Windows Settings → Language</strong>.
        </div>
      </Card>
    ),

    gameplay: (
      <Card icon="🎮" title="Gameplay">
        <SettingRow label="Show AI Hints" desc="Gemini hints inline at Level 0">
          <DashToggle id="toggle-hints" checked={showHints} onChange={v => handleToggle("tfv_hints", setShowHints, v)} />
        </SettingRow>
        <SettingRow label="IP Animations" desc="Flash +/− Integrity Points on choices">
          <DashToggle id="toggle-ip-anim" checked={ipAnim} onChange={v => handleToggle("tfv_ip_anim", setIpAnim, v)} />
        </SettingRow>
        <SettingRow label="Auto-Advance Dialogue" desc="NPC lines dismiss automatically after voice ends">
          <DashToggle id="toggle-auto" checked={autoAdv} onChange={v => handleToggle("tfv_auto", setAutoAdv, v)} />
        </SettingRow>
        <DashSlider id="slider-ai-delay" min={1} max={6} step={0.5} value={aiDelay} onChange={setAiDelay}
          label="Vivek Intervention Delay" desc="Seconds before Vivek warns you (shorter = harder)" format={v => `${v}s`} />
      </Card>
    ),

    display: (
      <Card icon="🖥️" title="Display">
        {/* Theme */}
        <div style={{ padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
          <div className="dash-setting-label" style={{ marginBottom: "4px" }}>Theme</div>
          <div className="dash-setting-desc" style={{ marginBottom: "12px" }}>Changes colour scheme across the entire app instantly</div>
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { id: "dark", emoji: "🌙", label: "Dark Mode", sub: "Deep blue (default)" },
              { id: "light", emoji: "☀️", label: "Light Mode", sub: "Clean & bright" },
            ].map(opt => (
              <button key={opt.id} id={`theme-${opt.id}`} onClick={() => applyTheme(opt.id)}
                style={{
                  flex: 1, padding: "14px 10px", borderRadius: "10px", cursor: "pointer",
                  border: `2px solid ${theme === opt.id ? "#4F46E5" : "#E2E8F0"}`,
                  background: theme === opt.id ? "#EEF2FF" : "transparent",
                  textAlign: "center", transition: "all 0.15s ease"
                }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>{opt.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: theme === opt.id ? "#4F46E5" : "#1E293B" }}>{opt.label}</div>
                <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <DashSlider id="slider-text" min={0.85} max={1.25} step={0.05} value={textSize}
          onChange={v => handleToggle("tfv_text_size", setTextSize, v)}
          label="Text Size" format={v => `${Math.round(v * 100)}%`} />
        <SettingRow label="High Contrast" desc="Increases text and border contrast for readability">
          <DashToggle id="toggle-contrast" checked={contrast} onChange={v => handleToggle("tfv_contrast", setContrast, v)} />
        </SettingRow>
        <SettingRow label="Reduce Animations" desc="Turns off non-essential transitions and motion effects">
          <DashToggle id="toggle-motion" checked={reduceMotion} onChange={v => handleToggle("tfv_motion", setReduceMotion, v)} />
        </SettingRow>
      </Card>
    ),

    account: (
      <Card icon="👤" title="Account & Login">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          {user ? (
            <div style={{ animation: "float-up 0.3s ease" }}>
              <img src={user.photoURL} alt="User" style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #4F46E5", marginBottom: "12px" }} />
              <h3 style={{ fontWeight: 800, marginBottom: "4px", color: "#1E293B" }}>{user.displayName}</h3>
              <p style={{ fontSize: "0.88rem", color: "#64748B", marginBottom: "20px" }}>{user.email}</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <div style={{ background: "#EEF2FF", padding: "10px 16px", borderRadius: "8px", border: "1px solid #E0E7FF" }}>
                  <div style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 700 }}>STATUS</div>
                  <div style={{ fontSize: "0.85rem", color: "#4F46E5", fontWeight: 700 }}>SIGNED IN</div>
                </div>
                <button className="btn-dash-secondary" onClick={handleLogout}>Sign Out</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>🔐</div>
              <h3 style={{ fontWeight: 800, marginBottom: "6px", color: "#1E293B" }}>Sign in to sync your progress</h3>
              <p style={{ fontSize: "0.88rem", color: "#64748B", marginBottom: "24px", maxWidth: "320px", margin: "0 auto 24px" }}>
                Login with Google to save Integrity Points, game history, and your Democracy Certificate across devices.
              </p>
              <button id="google-signin-btn" className="btn-dash-primary"
                style={{ margin: "0 auto", justifyContent: "center" }}
                onClick={handleLogin}>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/>
                  <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"/>
                  <path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"/>
                  <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}
          <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "12px" }}>🔒 No personal data stored without your consent.</p>
        </div>
      </Card>
    ),

    about: (
      <Card icon="ℹ️" title="About">
        {[
          ["Game Version", "v1.0.0 — GDG Prompt Wars 2026"],
          ["Developer", "Tridibesh Sen · IEM Newtown, Kolkata"],
          ["Stack", "React · Vite · Three.js · Gemini 1.5 Flash"],
          ["Gemini Status", isGeminiLive() ? "✅ Connected (1.5 Flash)" : "⚠️ API key missing"],
          ["Language Packs", "English · हिंदी · বাংলা"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F1F5F9", fontSize: "0.875rem" }}>
            <span style={{ color: "#64748B" }}>{k}</span>
            <span style={{ fontWeight: 600, color: "#1E293B", textAlign: "right" }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
          <a href="https://www.linkedin.com/in/tridibesh-sen-a39218380" target="_blank" rel="noopener noreferrer" className="btn-dash-secondary" style={{ textDecoration: "none", fontSize: "0.82rem", padding: "8px 14px" }}>
            LinkedIn ↗
          </a>
          <Link to="/" className="btn-dash-secondary" style={{ fontSize: "0.82rem", padding: "8px 14px" }}>
            ← Back to Home
          </Link>
        </div>
      </Card>
    ),
  };

  return (
    <div className="dashboard-layout">
      {/* ── SIDEBAR ── */}
      <aside className="dashboard-sidebar">
        {/* Branding */}
        <div style={{ padding: "0 18px 16px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0F172A" }}>⚙️ Settings</div>
          <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>The First Vote</div>
        </div>

        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map(item => (
              <button key={item.id} id={`nav-${item.id}`}
                className={`sidebar-nav-item${active === item.id ? " active" : ""}`}
                onClick={() => setActive(item.id)}>
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom actions */}
        <div style={{ marginTop: "auto", padding: "16px 18px", borderTop: "1px solid #F1F5F9" }}>
          <button className="btn-dash-primary" onClick={save} id="settings-save-btn"
            style={{ width: "100%", justifyContent: "center", marginBottom: "8px" }}>
            {saved ? "✓ Saved!" : "💾 Save Settings"}
          </button>
          <Link to="/create" className="btn-dash-secondary" id="settings-start-btn"
            style={{ display: "flex", justifyContent: "center", textDecoration: "none", fontSize: "0.82rem" }}>
            🗳️ Start Game
          </Link>
        </div>
      </aside>

      {/* ── CONTENT ── */}
      <main className="dashboard-content">
        <div className="dashboard-page-title">
          {NAV_SECTIONS.flatMap(s => s.items).find(i => i.id === active)?.label}
        </div>
        <div className="dashboard-page-subtitle">
          Customize your experience. All changes are saved locally.
        </div>
        {panels[active]}
      </main>
    </div>
  );
}

function isGeminiLive() {
  try {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    return key && key.trim() && key !== "YOUR_GEMINI_API_KEY_HERE";
  } catch { return false; }
}
