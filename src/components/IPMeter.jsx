import React from "react";
import { useGame } from "../context/GameContext";
import { useLocation } from "react-router-dom";

const GAME_PATHS = ["/level", "/prologue", "/epilogue"];
const MAX_IP = 210;

export default function IPMeter() {
  const { ip, t } = useGame();
  const location = useLocation();
  const isGameRoute = GAME_PATHS.some(p => location.pathname.startsWith(p));

  if (!isGameRoute) return null;

  const pct = Math.min(100, Math.max(0, (ip / MAX_IP) * 100));
  const color = ip >= 80 ? "var(--ip-high)" : ip >= 40 ? "var(--ip-mid)" : "var(--ip-low)";

  return (
    <div className="ip-meter" role="status" aria-label={`Integrity Points: ${ip}`}>
      <span className="ip-label">{t("integrityPoints")}</span>
      <span className="ip-score" style={{ color }}>{ip}</span>
      <div className="ip-bar-container">
        <div
          className="ip-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
