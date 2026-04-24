import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Restore saved theme before anything renders
const savedTheme = localStorage.getItem("tfv_theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

import { GameProvider } from "./context/GameContext";
import Navbar from "./components/Navbar";
import VivekWidget from "./components/VivekWidget";
import IPMeter from "./components/IPMeter";
import DisqualificationModal from "./components/DisqualificationModal";

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
        </BrowserRouter>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;
