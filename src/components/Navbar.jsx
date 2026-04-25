import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useGame } from "../context/GameContext";

const GAME_PATHS = ["/level", "/prologue", "/epilogue", "/create"];
const LEVELS = ["Register", "Gauntlet", "Wallet", "Booth", "EVM", "Results"];

export default function Navbar() {
  const { isGameStarted, currentLevel, t, resetGame } = useGame();
  const location = useLocation();
  const navigate = useNavigate();
  const isGameRoute = GAME_PATHS.some(p => location.pathname.startsWith(p));

  const handleExit = () => {
    if (window.confirm("Exit the game? Your progress will be saved.")) {
      navigate("/");
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-brand" id="navbar-brand">
        <span style={{ fontSize: "1.4rem" }}>🗳️</span>
        <span style={{
          background: "linear-gradient(135deg, var(--color-saffron), var(--color-blue-light))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          The First Vote
        </span>
      </Link>

      {isGameRoute ? (
        // In-game navbar — show journey progress
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {LEVELS.map((name, i) => {
              const levelNum = i;
              const active = location.pathname === `/level/${levelNum}`;
              const complete = isGameStarted && typeof currentLevel === "number" && currentLevel > levelNum;
              return (
                <div
                  key={name}
                  title={name}
                  role="status"
                  aria-label={`Level ${levelNum + 1}: ${name} (${active ? 'Active' : complete ? 'Completed' : 'Locked'})`}
                  aria-current={active ? "step" : undefined}
                  style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: complete ? "var(--color-green)" : active ? "var(--color-saffron)" : "var(--border-subtle)",
                    transition: "var(--transition-mid)"
                  }}
                />
              );
            })}
          </div>
          <button className="btn btn-secondary" style={{ padding: "6px 16px", fontSize: "0.85rem" }} onClick={handleExit} id="navbar-exit-btn">
            ✕ Exit
          </button>
        </div>
      ) : (
        <ul className="navbar-links">
          <li><Link to="/" id="nav-home">Home</Link></li>
          <li><Link to="/leaderboard" id="nav-leaderboard">🏆 Leaderboard</Link></li>
          <li><Link to="/learn" id="nav-learn">{t("learn")}</Link></li>
          <li><Link to="/settings" id="nav-settings">⚙️ Settings</Link></li>
          <li>
            <a href="#about" id="nav-about" onClick={e => {
              e.preventDefault();
              if (location.pathname !== "/") {
                navigate("/");
                setTimeout(() => {
                  document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
                }, 350);
              } else {
                document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
              }
            }}>{t("about")}</a>
          </li>
          <li>
            <Link to="/create" className="btn btn-primary" style={{ padding: "8px 20px", fontSize: "0.9rem" }} id="nav-start-btn">
              {t("startGame")}
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
