import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { speak, NPC_VOICES } from "../../services/tts";
import { CANDIDATES } from "../../data/gameData";
import { Canvas, useFrame } from "@react-three/fiber";

// ============================================================
// 3D EVM + Voting Booth Scene
// ============================================================
import Human3D from "../../components/Human3D";

function VotingBoothScene({ pressedCandidate, lit, phase, playerGender, vvpatVisible, selectedCandidate }) {
  const slipRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // VVPAT slip falling animation
    if (slipRef.current && vvpatVisible) {
      slipRef.current.position.y = Math.max(-0.3, 0.8 - (t % 3) * 0.4);
      slipRef.current.rotation.z = Math.sin(t * 3) * 0.08;
      slipRef.current.rotation.x = Math.sin(t * 2) * 0.04;
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[0, 6, 3]} intensity={0.7} color="#FFF5E6" castShadow />
      {/* Booth lamp — warm yellow */}
      <pointLight position={[-1.5, 2.5, 0]} intensity={1.2} color="#F59E0B" distance={5} />
      <pointLight position={[1.5, 2.5, 0]} intensity={0.8} color="#FFF5E6" distance={4} />
      {/* Blue glow when lit (post-vote) */}
      {lit && <pointLight position={[1.8, 1.2, 0.6]} intensity={2} color="#3B82F6" distance={3} />}
      {lit && <pointLight position={[1.8, 0.8, 0.4]} intensity={1.5} color="#22C55E" distance={2} />}

      {/* ── ROOM ── */}
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.02, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#C0C0B8" roughness={0.9} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 1.5, -3]} receiveShadow>
        <boxGeometry args={[8, 6, 0.12]} />
        <meshStandardMaterial color="#E8E8D8" roughness={0.95} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-4, 1.5, 0]}>
        <boxGeometry args={[0.12, 6, 8]} />
        <meshStandardMaterial color="#DCDCCC" roughness={0.95} />
      </mesh>
      {/* Right wall */}
      <mesh position={[4, 1.5, 0]}>
        <boxGeometry args={[0.12, 6, 8]} />
        <meshStandardMaterial color="#DCDCCC" roughness={0.95} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[8, 0.12, 8]} />
        <meshStandardMaterial color="#F0F0E8" roughness={0.9} />
      </mesh>

      {/* Voting cubicle dividers */}
      <mesh position={[-0.9, 0.5, 1.5]}>
        <boxGeometry args={[0.06, 3, 2.5]} />
        <meshStandardMaterial color="#78716C" roughness={0.85} />
      </mesh>
      <mesh position={[0.9, 0.5, 1.5]}>
        <boxGeometry args={[0.06, 3, 2.5]} />
        <meshStandardMaterial color="#78716C" roughness={0.85} />
      </mesh>
      {/* Cubicle top */}
      <mesh position={[0, 2.0, 1.5]}>
        <boxGeometry args={[1.84, 0.06, 2.5]} />
        <meshStandardMaterial color="#6B7280" roughness={0.85} />
      </mesh>

      {/* Voting table */}
      <mesh position={[0, -0.28, -0.6]}>
        <boxGeometry args={[1.4, 0.07, 0.85]} />
        <meshStandardMaterial color="#92400E" roughness={0.7} />
      </mesh>
      <mesh position={[-0.65, -0.66, -0.6]}>
        <cylinderGeometry args={[0.035, 0.035, 0.75, 6]} />
        <meshStandardMaterial color="#78350F" roughness={0.8} />
      </mesh>
      <mesh position={[0.65, -0.66, -0.6]}>
        <cylinderGeometry args={[0.035, 0.035, 0.75, 6]} />
        <meshStandardMaterial color="#78350F" roughness={0.8} />
      </mesh>

      {/* ── EVM MACHINE ── */}
      <group position={[0, 0.2, -1.2]}>
        {/* Main body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.0, 1.4, 0.2]} />
          <meshStandardMaterial color="#2D3748" metalness={0.3} roughness={0.6} />
        </mesh>
        {/* Display screen */}
        <mesh position={[0, 0.44, 0.11]}>
          <planeGeometry args={[0.8, 0.3]} />
          <meshStandardMaterial color="#0F172A" emissive={lit ? "#1E3A8A" : "#000"} emissiveIntensity={0.8} />
        </mesh>
        {/* ECI logo plate (saffron strip) */}
        <mesh position={[0, 0.62, 0.11]}>
          <planeGeometry args={[0.85, 0.1]} />
          <meshStandardMaterial color="#FF9933" emissive="#FF9933" emissiveIntensity={0.2} />
        </mesh>
        {/* Candidate buttons */}
        {CANDIDATES.map((c, i) => {
          const y = 0.18 - i * 0.3;
          const isPressed = pressedCandidate === c.id;
          return (
            <group key={c.id} position={[0, y, 0.11]}>
              <mesh position={[-0.24, 0, 0]}>
                <boxGeometry args={[0.1, 0.08, 0.04]} />
                <meshStandardMaterial
                  color={isPressed ? "#3B82F6" : "#4B5563"}
                  emissive={isPressed ? "#3B82F6" : "#000"}
                  emissiveIntensity={isPressed ? 1.5 : 0}
                  metalness={0.4}
                />
              </mesh>
              {/* Party symbol circle */}
              <mesh position={[-0.06, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={isPressed ? 0.8 : 0.1} />
              </mesh>
              {/* Indicator LED */}
              <mesh position={[0.32, 0, 0]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshStandardMaterial
                  color={isPressed ? "#22C55E" : "#374151"}
                  emissive={isPressed ? "#22C55E" : "#000"}
                  emissiveIntensity={isPressed ? 3 : 0}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ── VVPAT MACHINE ── */}
      <group position={[0.8, -0.2, -1.1]}>
        {/* Main body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.38, 0.8, 0.18]} />
          <meshStandardMaterial color="#374151" metalness={0.2} roughness={0.7} />
        </mesh>
        {/* Glass viewing window */}
        <mesh position={[0, 0.16, 0.1]}>
          <boxGeometry args={[0.28, 0.32, 0.04]} />
          <meshStandardMaterial color="#93C5FD" transparent opacity={0.35} roughness={0.1} />
        </mesh>
        {/* Print slot at top */}
        <mesh position={[0, 0.42, 0.02]}>
          <boxGeometry args={[0.22, 0.03, 0.1]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        {/* VVPAT label strip */}
        <mesh position={[0, -0.25, 0.095]}>
          <planeGeometry args={[0.32, 0.1]} />
          <meshStandardMaterial color="#138808" />
        </mesh>
        {/* Green active light */}
        {lit && (
          <mesh position={[0.1, 0.38, 0.1]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={4} />
          </mesh>
        )}
        {/* VVPAT slip — 3D paper falling out */}
        {vvpatVisible && selectedCandidate && (
          <group ref={slipRef} position={[0, 0.8, 0.04]}>
            <mesh>
              <boxGeometry args={[0.2, 0.4, 0.003]} />
              <meshStandardMaterial color="#FFFBF0" roughness={0.9} />
            </mesh>
            {/* Colored symbol on slip */}
            <mesh position={[0, 0.05, 0.003]}>
              <boxGeometry args={[0.06, 0.06, 0.002]} />
              <meshStandardMaterial color={selectedCandidate?.color || "#3B82F6"} />
            </mesh>
            {/* Lines on slip */}
            {[-0.05, -0.1, -0.14].map((y, i) => (
              <mesh key={i} position={[0, y, 0.003]}>
                <boxGeometry args={[0.15, 0.008, 0.002]} />
                <meshStandardMaterial color="#374151" />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* ── PLAYER CHARACTER ── */}
      <Human3D
        gender={playerGender}
        position={[0, -1.0, 1.4]}
        rotation={[0, Math.PI, 0]}
        animation={phase === "pressed" || phase === "vvpat" ? "press" : "idle"}
        shirtColor="#2563EB"
        skinTone="#D4956A"
        scale={0.82}
      />

      <fog attach="fog" args={["#F0F0E8", 8, 18]} />
    </>
  );
}


// ============================================================
// VVPAT Slip Component
// ============================================================
function VVPATSlip({ candidate, isMismatch }) {
  const displayCandidate = isMismatch
    ? CANDIDATES.find(c => c.id !== candidate.id) || CANDIDATES[0]
    : candidate;

  return (
    <div style={{
      background: "white", borderRadius: "4px", padding: "10px 12px",
      width: "160px", margin: "0 auto", animation: "vvpat-print 0.5s ease",
      border: "1px solid #E5E7EB", fontFamily: "monospace", fontSize: "0.75rem"
    }}>
      <div style={{ textAlign: "center", fontWeight: 700, color: "#1A1A2E", marginBottom: "6px", fontSize: "0.65rem" }}>
        ELECTION COMMISSION OF INDIA
      </div>
      <div style={{ textAlign: "center", fontSize: "0.6rem", color: "#6B7280", marginBottom: "8px" }}>
        VVPAT SLIP — NOT A BALLOT PAPER
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <div style={{ width: "30px", height: "30px", background: displayCandidate.color, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
          {displayCandidate.symbol}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#1A1A2E", fontSize: "0.7rem" }}>{displayCandidate.name}</div>
          <div style={{ color: "#6B7280", fontSize: "0.6rem" }}>{displayCandidate.party}</div>
        </div>
      </div>
      <div style={{ fontSize: "0.6rem", color: "#9CA3AF", borderTop: "1px dashed #D1D5DB", paddingTop: "6px", textAlign: "center" }}>
        SL: WB/24/247 · {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}

// ============================================================
// Level 4 — Main Component
// ============================================================
export default function Level4() {
  const { playerName, playerGender, language, addIP, awardIPEvent, setFlag, flags, updateInventory, goToLevel } = useGame();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("enter"); // enter → choose → pressed → vvpat → complete
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [vvpatVisible, setVvpatVisible] = useState(false);
  const [vvpatTimer, setVvpatTimer] = useState(7);
  const [vvpatWatched, setVvpatWatched] = useState(false);
  const [isMismatch] = useState(Math.random() < 0.3); // 30% chance
  const [mismatchHandled, setMismatchHandled] = useState(false);
  const [inkEasterEgg, setInkEasterEgg] = useState(false);
  const vvpatIntervalRef = useRef(null);
  const hasCountedVvpat = useRef(false);

  useEffect(() => {
    if (!playerName) { navigate("/create"); return; }
    goToLevel(4);
    speak(`Level 4, ${playerName}. You're inside the voting compartment. The EVM is waiting. This is your moment.`, { language });
    if (window.vivekSay) window.vivekSay(`${playerName}, you're now in the voting compartment. This is the most sacred part of the process. Look at the 4 candidates and their symbols. Your choice is completely secret — I won't advise you here. After pressing, watch the VVPAT for 7 seconds.`);
  }, []);

  // VVPAT countdown
  useEffect(() => {
    if (!vvpatVisible || vvpatWatched) return;

    vvpatIntervalRef.current = setInterval(() => {
      setVvpatTimer(t => {
        if (t <= 1) {
          clearInterval(vvpatIntervalRef.current);
          setVvpatWatched(true);
          if (!hasCountedVvpat.current) {
            hasCountedVvpat.current = true;
            awardIPEvent("WATCH_VVPAT_FULL");
            if (isMismatch) {
              if (window.vivekSay) window.vivekSay("⚠️ The VVPAT slip shows a DIFFERENT symbol than what you pressed! This is a mismatch! Report it to the Presiding Officer immediately!", "alert");
              speak("The VVPAT slip shows a different symbol! Report to the Presiding Officer!", { language });
            } else {
              if (window.vivekSay) window.vivekSay("✅ The VVPAT slip correctly shows your chosen candidate. Your vote has been recorded accurately!", "success");
              speak("The VVPAT slip matches your choice. Your vote is correctly recorded.", { language });
            }
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(vvpatIntervalRef.current);
  }, [vvpatVisible, vvpatWatched]);

  const handleVote = (candidate) => {
    setSelectedCandidate(candidate);
    setPhase("pressed");
    speak(`Button pressed for ${candidate.name}. ${candidate.party}.`, { language });

    // Beep sound effect (using speech)
    setTimeout(() => {
      speak("Long beep.", { language });
      setVvpatVisible(true);
      setPhase("vvpat");
      if (window.vivekSay) window.vivekSay("👁️ Look at the VVPAT glass window on your right! A paper slip will be visible for exactly 7 seconds. Verify it shows the correct symbol!");
    }, 1000);
  };

  const handleDismissVvpat = () => {
    if (vvpatWatched) return;
    clearInterval(vvpatIntervalRef.current);
    addIP(-10, "DISMISS_VVPAT_EARLY");
    setVvpatWatched(true);
    setVvpatTimer(0);
    if (window.vivekSay) window.vivekSay("You dismissed the VVPAT before the 7 seconds were up! Always verify the full slip — it's your only proof that your vote was recorded correctly. -10 IP", "alert");
  };

  const handleReportMismatch = () => {
    awardIPEvent("REPORT_VVPAT_MISMATCH");
    setFlag("reportedVVPATMismatch", true);
    setMismatchHandled(true);
    speak("You have reported the VVPAT mismatch to the Presiding Officer. A Test Vote procedure will be initiated. Well done!", { language });
    if (window.vivekSay) window.vivekSay("🏆 Outstanding! You caught an EVM irregularity. The Presiding Officer will initiate a Test Vote to verify the machine. Your vigilance protects democracy. +20 IP!", "success");
    setTimeout(() => setPhase("complete"), 2500);
  };

  const handleIgnoreMismatch = () => {
    addIP(-15, "IGNORE_VVPAT_MISMATCH");
    setMismatchHandled(true);
    if (window.vivekSay) window.vivekSay("You ignored the VVPAT mismatch! That could mean your vote went to the wrong candidate. Always report any discrepancy to the Presiding Officer immediately. -15 IP", "alert");
    setTimeout(() => setPhase("complete"), 2000);
  };

  const handleInkEasterEgg = () => {
    if (!inkEasterEgg) {
      setInkEasterEgg(true);
      addIP(5, "CHECK_INK_EASTER_EGG");
      if (window.vivekSay) window.vivekSay("🎉 Easter egg found! You checked your ink mark before voting — confirming you're the right person. +5 Bonus IP! Very thorough!", "success");
    }
  };

  const handleComplete = () => {
    updateInventory({ hasVoted: true });
    navigate("/level/5");
  };

  return (
    <div className="game-container">
      <div className="level-header">
        <div className="level-badge">🗳️ Level 4 — The Voting Compartment</div>
        {isMismatch && phase === "vvpat" && vvpatWatched && (
          <div style={{ color: "#EF4444", fontWeight: 700, fontSize: "0.9rem", animation: "float-up 0.3s ease" }}>
            ⚠️ VVPAT MISMATCH DETECTED
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", flex: 1 }}>
        {/* 3D EVM Canvas */}
        <div style={{ position: "relative" }}>
          <Canvas camera={{ position: [0, 0.8, 4.2], fov: 52 }} shadows>
            <VotingBoothScene
              pressedCandidate={selectedCandidate?.id}
              lit={vvpatVisible}
              phase={phase}
              playerGender={playerGender}
              vvpatVisible={vvpatVisible}
              selectedCandidate={selectedCandidate}
            />
          </Canvas>

          {/* VVPAT overlay window */}
          {vvpatVisible && (
            <div style={{
              position: "absolute", top: "50%", right: "60px", transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.9)", borderRadius: "var(--radius-md)", padding: "16px",
              border: "2px solid #22C55E", width: "200px", animation: "float-up 0.3s ease"
            }}>
              <div style={{ fontSize: "0.7rem", color: "#22C55E", fontWeight: 700, marginBottom: "8px", textAlign: "center" }}>
                VVPAT WINDOW
              </div>
              <VVPATSlip candidate={selectedCandidate} isMismatch={isMismatch && !mismatchHandled} />
              {!vvpatWatched && (
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: vvpatTimer <= 3 ? "#EF4444" : "#22C55E" }}>
                    {vvpatTimer}s
                  </div>
                  <button className="btn btn-danger" style={{ fontSize: "0.75rem", padding: "6px 12px", marginTop: "6px" }} onClick={handleDismissVvpat} id="dismiss-vvpat-btn">
                    Skip
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Easter egg - ink check */}
          {phase === "enter" && !inkEasterEgg && (
            <button
              id="check-ink-easter-egg"
              onClick={handleInkEasterEgg}
              style={{
                position: "absolute", bottom: "20px", left: "20px",
                background: "rgba(0,0,0,0.7)", border: "1px solid var(--border-subtle)",
                borderRadius: "999px", padding: "8px 16px", color: "var(--text-muted)",
                cursor: "pointer", fontSize: "0.8rem"
              }}
            >
              🖐️ Check my ink mark
            </button>
          )}

          {inkEasterEgg && (
            <div style={{
              position: "absolute", bottom: "20px", left: "20px",
              background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)",
              borderRadius: "999px", padding: "8px 16px", color: "#86EFAC",
              fontSize: "0.8rem", animation: "float-up 0.3s ease"
            }}>
              ✅ Ink verified! +5 IP 🎉
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border-subtle)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>

          {phase === "enter" && (
            <div style={{ animation: "float-up 0.3s ease" }}>
              <h3 style={{ marginBottom: "8px" }}>The Voting Compartment</h3>
              <p style={{ fontSize: "0.88rem", marginBottom: "16px" }}>
                The EVM is before you. Study the candidates and press your choice. Your vote is completely secret.
              </p>
              <div style={{ background: "rgba(255,153,51,0.08)", border: "1px solid rgba(255,153,51,0.2)", borderRadius: "var(--radius-md)", padding: "12px", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                🔵 <strong style={{ color: "var(--color-saffron)" }}>Vivek says:</strong> I will not guide you on who to vote for. This is your sovereign democratic right. Study the candidates carefully.
              </div>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setPhase("choose")} id="begin-vote-btn">
                🗳️ Begin Voting
              </button>
            </div>
          )}

          {phase === "choose" && (
            <div style={{ animation: "float-up 0.3s ease" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Choose Your Candidate
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {CANDIDATES.map(c => (
                  <button
                    key={c.id}
                    id={`vote-candidate-${c.id}`}
                    className="evm-button"
                    onClick={() => handleVote(c)}
                  >
                    <div className="evm-indicator" />
                    <div style={{ width: "32px", height: "32px", background: c.color, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
                      {c.symbol}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)" }}>{c.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{c.party} · {c.abbr}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "12px", fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
                Press once — the machine will lock after your selection
              </div>
            </div>
          )}

          {phase === "pressed" && (
            <div style={{ textAlign: "center", animation: "float-up 0.3s ease" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{selectedCandidate?.symbol}</div>
              <div style={{ fontWeight: 700 }}>{selectedCandidate?.name}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>{selectedCandidate?.party}</div>
              <div style={{ color: "#60A5FA" }}>🔊 Beep! Machine activated...</div>
            </div>
          )}

          {phase === "vvpat" && (
            <div style={{ animation: "float-up 0.3s ease" }}>
              <h3 style={{ marginBottom: "8px" }}>Check the VVPAT</h3>
              <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "var(--radius-md)", padding: "12px", marginBottom: "16px", fontSize: "0.85rem", color: "#86EFAC" }}>
                👁️ Look at the VVPAT window on the right. A slip will be visible for <strong>7 seconds</strong>. Verify it shows the correct candidate symbol!
              </div>

              {vvpatWatched && (
                <div style={{ animation: "float-up 0.3s ease" }}>
                  {isMismatch && !mismatchHandled ? (
                    <div>
                      <div style={{ background: "rgba(239,68,68,0.15)", border: "2px solid rgba(239,68,68,0.5)", borderRadius: "var(--radius-md)", padding: "14px", marginBottom: "14px" }}>
                        <div style={{ fontWeight: 700, color: "#EF4444", marginBottom: "6px" }}>⚠️ MISMATCH DETECTED!</div>
                        <p style={{ fontSize: "0.85rem", color: "#FCA5A5", margin: 0 }}>
                          The VVPAT slip shows a different symbol than what you pressed. What do you do?
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleReportMismatch} id="report-mismatch-btn">
                          🚨 Report to Officer
                        </button>
                        <button className="btn btn-secondary" onClick={handleIgnoreMismatch} id="ignore-mismatch-btn">
                          Ignore
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "var(--radius-md)", padding: "12px", marginBottom: "14px" }}>
                        <div style={{ fontWeight: 700, color: "#22C55E", marginBottom: "4px" }}>✅ VVPAT Verified!</div>
                        <p style={{ fontSize: "0.85rem", color: "#86EFAC", margin: 0 }}>
                          The slip correctly shows {selectedCandidate?.name} — {selectedCandidate?.party}.
                        </p>
                      </div>
                      <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setPhase("complete")} id="vvpat-proceed-btn">
                        ✅ Vote Cast — Proceed
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {phase === "complete" && (
            <div style={{ textAlign: "center", animation: "float-up 0.3s ease" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🗳️</div>
              <h3 style={{ color: "var(--ip-high)", marginBottom: "8px" }}>Vote Cast!</h3>
              <p style={{ marginBottom: "20px", fontSize: "0.9rem" }}>Your vote has been recorded. Now wait for the results.</p>
              <button className="btn btn-primary btn-large" onClick={handleComplete} id="goto-results-btn">
                📺 Go to Result Day →
              </button>
            </div>
          )}

          {/* Candidate manifesto reference */}
          {phase === "choose" && (
            <div style={{
              marginTop: "auto", background: "var(--bg-card-2)", borderRadius: "var(--radius-md)",
              padding: "12px", fontSize: "0.78rem", color: "var(--text-muted)", border: "1px solid var(--border-subtle)"
            }}>
              💡 Hover over candidates (on desktop) to see their manifesto summary before deciding.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
