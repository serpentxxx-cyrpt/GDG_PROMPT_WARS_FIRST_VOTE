import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Restore saved theme before anything renders
const savedTheme = localStorage.getItem("tfv_theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

import { GameProvider } from "./context/GameContext";
import Navbar from "./components/Navbar";
import VivekWidget from "./components/VivekWidget";
import IPMeter from "./components/IPMeter";
import DisqualificationModal from "./components/DisqualificationModal";
import { startMusic, setMusicMuted, getMusicMuted } from "./services/audioManager";

// Pages
import Landing from "./pages/Landing";
import Learn from "./pages/Learn";
import Settings from "./pages/Settings";
import CharacterCreate from "./pages/CharacterCreate";
import Prologue from "./pages/Prologue";
import Level0 from "./pages/levels/Level0";
import Level1 from "./pages/levels/Level1";
import Level2 from "./pages/levels/Level2";
import Level3 from "./pages/levels/Level3";
import Level4 from "./pages/levels/Level4";
import Level5 from "./pages/levels/Level5";
import Epilogue from "./pages/Epilogue";
import Certificate from "./pages/Certificate";

// Error boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Game Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "3rem" }}>⚠️</div>
          <h2 style={{ color: "#EF4444" }}>Something went wrong</h2>
          <p style={{ color: "#94A3B8", maxWidth: "400px" }}>
            {this.state.error?.message || "An unexpected error occurred in the game."}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = "/"; }}
          >
            Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [musicMuted, setMusicMutedState] = useState(
    () => localStorage.getItem('tfv_music_muted') === 'true'
  );
  const [musicStarted, setMusicStarted] = useState(false);

  // Start music on first user interaction (browser autoplay policy)
  useEffect(() => {
    const handleFirstClick = () => {
      if (!musicStarted) {
        setMusicStarted(true);
        startMusic();
        setMusicMuted(musicMuted);
      }
    };
    document.addEventListener('click', handleFirstClick, { once: true });
    document.addEventListener('keydown', handleFirstClick, { once: true });
    return () => {
      document.removeEventListener('click', handleFirstClick);
      document.removeEventListener('keydown', handleFirstClick);
    };
  }, []);

  const toggleMusic = () => {
    const next = !musicMuted;
    setMusicMutedState(next);
    setMusicMuted(next);
    if (!musicStarted) { startMusic(); setMusicStarted(true); }
  };

  return (
    <ErrorBoundary>
      <GameProvider>
        <BrowserRouter>
          <Navbar />
          <DisqualificationModal />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/create" element={<CharacterCreate />} />
            <Route path="/prologue" element={<Prologue />} />
            <Route path="/level/0" element={<Level0 />} />
            <Route path="/level/1" element={<Level1 />} />
            <Route path="/level/2" element={<Level2 />} />
            <Route path="/level/3" element={<Level3 />} />
            <Route path="/level/4" element={<Level4 />} />
            <Route path="/level/5" element={<Level5 />} />
            <Route path="/epilogue" element={<Epilogue />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* Vivek + IP Meter only show during game */}
          <VivekWidget />
          <IPMeter />

          {/* Floating music toggle — always visible */}
          <button
            id="music-toggle-btn"
            onClick={toggleMusic}
            title={musicMuted ? 'Unmute background music' : 'Mute background music'}
            style={{
              position: 'fixed', bottom: '80px', right: '20px',
              width: '42px', height: '42px', borderRadius: '50%',
              background: musicMuted
                ? 'rgba(30,58,92,0.85)'
                : 'linear-gradient(135deg,#FF9933,#E67E22)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', fontSize: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 9000,
              backdropFilter: 'blur(8px)',
              boxShadow: musicMuted ? 'none' : '0 0 14px rgba(255,153,51,0.4)',
              transition: 'all 0.25s ease'
            }}
          >
            {musicMuted ? '🔇' : '🎵'}
          </button>
        </BrowserRouter>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;
