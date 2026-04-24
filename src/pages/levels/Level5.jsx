import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { speak, stopSpeaking } from "../../services/tts";
import { CANDIDATES } from "../../data/gameData";

const generateResults = () => {
  const totalVotes = 847293;
  let remaining = totalVotes;
  const results = CANDIDATES.map((c, i) => {
    const pct = i === 0 ? 0.38 : i === 1 ? 0.28 : i === 2 ? 0.22 : 0.12;
    const votes = i < CANDIDATES.length - 1 ? Math.floor(totalVotes * pct) : remaining;
    remaining -= Math.floor(totalVotes * pct);
    return { ...c, votes: Math.floor(totalVotes * pct), percentage: Math.round(pct * 100) };
  });
  return results.sort((a, b) => b.votes - a.votes);
};

const TICKER_ITEMS = [
  "📊 South Kolkata results declared | 847,293 votes counted",
  "🗳️ Voter turnout reaches historic 76.3% in West Bengal",
  "📍 EVM sealed and transferred to strong room under CRPF escort",
  "✅ Election Commission declares results valid — no irregularities reported",
  "🏆 Model Code of Conduct officially lifted across all constituencies",
];

export default function Level5() {
  const { playerName, language, ip, completeGame, goToLevel, flags } = useGame();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("counting"); // counting → revealed → analysis → complete
  const [results] = useState(generateResults());
  const [revealedCount, setRevealedCount] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const countingInterval = useRef(null);
  const tickerInterval = useRef(null);

  useEffect(() => {
    if (!playerName) { navigate("/create"); return; }
    goToLevel(5);
    speak(`It's result day, ${playerName}. The counting has begun. The whole country is watching.`, { language });
    if (window.vivekSay) window.vivekSay("Welcome to Result Day! The counting process is underway. Every vote is being counted — including yours. Democracy is speaking.");

    // Reveal results one by one
    countingInterval.current = setInterval(() => {
      setRevealedCount(prev => {
        if (prev >= results.length) {
          clearInterval(countingInterval.current);
          setTimeout(() => {
            setPhase("revealed");
            speak(`Results declared! ${results[0].name} of ${results[0].party} wins South Kolkata with ${results[0].votes.toLocaleString()} votes.`, { language });
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    // Ticker
    tickerInterval.current = setInterval(() => {
      setTickerIndex(i => (i + 1) % TICKER_ITEMS.length);
    }, 4000);

    return () => {
      clearInterval(countingInterval.current);
      clearInterval(tickerInterval.current);
    };
  }, []);

  const winner = results[0];
  const margin = results[0].votes - results[1].votes;

  const handleProceedToEpilogue = () => { stopSpeaking();
    completeGame();
    navigate("/epilogue");
  };

  return (
    <div className="game-container" style={{ background: "#050810" }}>
      {/* News Ticker */}
      <div style={{
        background: "#DC2626", padding: "8px 0", overflow: "hidden",
        borderBottom: "2px solid #B91C1C", position: "sticky", top: "70px", zIndex: 100
      }}>
        <div style={{ display: "flex", gap: "60px", animation: "gradient-move 0s" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "white", whiteSpace: "nowrap", padding: "0 40px" }}>
            🔴 LIVE: {TICKER_ITEMS[tickerIndex]}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 40px" }}>
        {/* News Studio Header */}
        <div style={{
          background: "linear-gradient(135deg, #0F1729, #1A3A6B)",
          borderRadius: "var(--radius-xl)", padding: "28px 32px", marginBottom: "32px",
          border: "1px solid rgba(37,99,235,0.3)", position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(to right, var(--color-saffron), white, var(--color-green))" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "#DC2626", borderRadius: "4px", padding: "4px 10px", fontSize: "0.75rem", fontWeight: 800, animation: "orb-alert 0.8s ease infinite alternate" }}>
              🔴 LIVE
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.3rem" }}>Democratic Voice News — Election Results</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>South Kolkata Assembly Constituency | Counting Centre LIVE</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Total Registered Voters</div>
              <div style={{ fontWeight: 800, fontSize: "1.2rem" }}>8,47,293</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
          {/* Results Board */}
          <div>
            <h2 style={{ marginBottom: "20px" }}>
              {phase === "counting" ? "⏳ Counting in progress..." : "🏆 Final Results — South Kolkata"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {results.map((candidate, i) => {
                const isRevealed = i < revealedCount;
                const isWinner = i === 0 && phase === "revealed";

                return (
                  <div
                    key={candidate.id}
                    style={{
                      background: isWinner ? "rgba(34,197,94,0.1)" : "var(--bg-card-2)",
                      borderRadius: "var(--radius-md)", padding: "16px 20px",
                      border: `1px solid ${isWinner ? "rgba(34,197,94,0.4)" : "var(--border-subtle)"}`,
                      opacity: isRevealed ? 1 : 0.3,
                      transition: "all 0.5s ease",
                      transform: isWinner ? "scale(1.02)" : "scale(1)",
                      boxShadow: isWinner ? "0 0 30px rgba(34,197,94,0.2)" : "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                      <div style={{ width: "40px", height: "40px", background: candidate.color, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
                        {candidate.symbol}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: 800, fontSize: "1rem" }}>{candidate.name}</span>
                          {isWinner && <span style={{ background: "#22C55E", color: "white", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px" }}>WINNER</span>}
                          {!isRevealed && <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Counting...</span>}
                        </div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{candidate.party} · {candidate.abbr}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{isRevealed ? candidate.votes.toLocaleString() : "—"}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{isRevealed ? `${candidate.percentage}%` : ""}</div>
                      </div>
                    </div>
                    {isRevealed && (
                      <div style={{ height: "6px", background: "var(--bg-glass-light)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "3px",
                          width: `${candidate.percentage}%`,
                          background: `linear-gradient(to right, ${candidate.color}, ${candidate.color}88)`,
                          transition: "width 1s ease"
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {phase === "revealed" && (
              <div style={{ marginTop: "24px", animation: "float-up 0.5s ease" }}>
                {/* What-If feature */}
                <button
                  className="btn btn-secondary"
                  style={{ marginBottom: "16px" }}
                  onClick={() => setShowWhatIf(!showWhatIf)}
                  id="whatif-btn"
                >
                  💭 What if more people voted?
                </button>

                {showWhatIf && (
                  <div style={{
                    background: "rgba(255,153,51,0.08)", border: "1px solid rgba(255,153,51,0.2)",
                    borderRadius: "var(--radius-md)", padding: "16px", marginBottom: "16px",
                    animation: "float-up 0.3s ease"
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: "8px" }}>📊 Democratic Impact Analysis</div>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                      The winning margin was <strong style={{ color: "var(--color-saffron)" }}>{margin.toLocaleString()} votes</strong>.
                      If just <strong style={{ color: "var(--color-saffron)" }}>{Math.ceil(margin / 100)} more voters per polling booth</strong> had cast their ballot, the result could have been different.
                      <br /><br />
                      Voter turnout in South Kolkata was <strong style={{ color: "var(--color-green)" }}>76.3%</strong>.
                      The remaining <strong>23.7% chose not to vote</strong> — that's {Math.floor(847293 * 0.237).toLocaleString()} voices unheard.
                    </p>
                    <div style={{ marginTop: "12px", display: "flex", gap: "6px", alignItems: "center" }}>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-saffron)", fontWeight: 600 }}>🔵 Vivek:</div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                        "Democracy doesn't promise your candidate wins. It promises your voice was heard."
                      </p>
                    </div>
                  </div>
                )}

                <button className="btn btn-primary btn-large" onClick={handleProceedToEpilogue} id="goto-epilogue-btn">
                  📺 Watch the Epilogue →
                </button>
              </div>
            )}
          </div>

          {/* Right Panel — Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Your vote */}
            <div style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(26,58,107,0.2))",
              borderRadius: "var(--radius-md)", padding: "20px",
              border: "1px solid rgba(37,99,235,0.3)"
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Your Vote</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "4px" }}>Counted among {(847293 * 0.763).toLocaleString()}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Serial No. 247 · South Kolkata
              </div>
            </div>

            {/* IP so far */}
            <div style={{
              background: "var(--bg-card-2)", borderRadius: "var(--radius-md)", padding: "20px",
              border: "1px solid var(--border-subtle)"
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Your Integrity Score</div>
              <div style={{ fontWeight: 800, fontSize: "2rem", color: ip >= 80 ? "var(--ip-high)" : ip >= 40 ? "var(--ip-mid)" : "var(--ip-low)" }}>
                {ip} <span style={{ fontSize: "0.9rem", fontWeight: 400, color: "var(--text-muted)" }}>/ 210</span>
              </div>
              <div style={{ marginTop: "8px" }}>
                {flags?.declinedBribeBeforeAI && <div style={{ fontSize: "0.8rem", color: "#86EFAC" }}>⚡ Quick Reflex earned</div>}
                {flags?.caughtFakeInkFraud && <div style={{ fontSize: "0.8rem", color: "#86EFAC" }}>🚨 Caught electoral fraud</div>}
                {flags?.reportedVVPATMismatch && <div style={{ fontSize: "0.8rem", color: "#86EFAC" }}>🏆 Reported VVPAT mismatch</div>}
              </div>
            </div>

            {/* Turnout stat */}
            <div style={{
              background: "var(--bg-card-2)", borderRadius: "var(--radius-md)", padding: "20px",
              border: "1px solid var(--border-subtle)"
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Constituency Turnout</div>
              {[
                { label: "Voted", pct: 76.3, color: "var(--ip-high)" },
                { label: "Didn't Vote", pct: 23.7, color: "var(--ip-low)" },
              ].map(s => (
                <div key={s.label} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.85rem" }}>
                    <span>{s.label}</span>
                    <span style={{ color: s.color, fontWeight: 700 }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: "6px", background: "var(--bg-glass-light)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: "3px", transition: "width 1.5s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
