import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { speak, stopSpeaking, NPC_VOICES } from "../../services/tts";
import { Canvas, useFrame } from "@react-three/fiber";
import Human3D from "../../components/Human3D";

// ============================================================
// 3D Booth Interior
// ============================================================
function BoothInterior({ currentOfficer, inkPhase }) {
  const tableRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (tableRef.current) {
      tableRef.current.rotation.y = Math.sin(t * 0.2) * 0.03;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} color="#FFF5E6" />
      <directionalLight position={[3, 6, 4]} intensity={0.8} />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#FFF5E6" />
      <pointLight position={[0, 4, -1]} intensity={currentOfficer === 2 ? 0.8 : 0.3} color={inkPhase ? "#4F46E5" : "#FFF5E6"} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 12]} />
        <meshStandardMaterial color="#E5E7EB" />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 2, -5]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#F3F4F6" />
      </mesh>
      {/* Side walls */}
      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#F9FAFB" />
      </mesh>
      <mesh position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#F9FAFB" />
      </mesh>

      {/* Officer Table */}
      <group position={[0, -0.3, -2]}>
        <mesh>
          <boxGeometry args={[7, 0.1, 1.5]} />
          <meshStandardMaterial color="#92400E" />
        </mesh>
        {[[-3, -0.6, 0], [3, -0.6, 0]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.1, 1.2, 1.5]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
        ))}
      </group>

      {/* 3D Human Officers with Election Commission Khaki Uniform */}
      {[[-2.5, -1, -1.5], [0, -1, -1.5], [2.5, -1, -1.5]].map(([x, y, z], i) => (
        <Human3D
          key={i}
          position={[x, y, z]}
          rotation={[0, 0, 0]}
          gender="male"
          shirtColor={currentOfficer === i ? "#1D4ED8" : "#6B7280"}
          pantsColor="#374151"
          skinTone={i === 0 ? "#C68642" : i === 1 ? "#8D5524" : "#FDBCB4"}
          animation={currentOfficer === i ? "idle" : "sit"}
          scale={0.75}
        />
      ))}

      {/* Active officer glow indicator */}
      <mesh position={[[-2.5, 0, -1.5][0] + currentOfficer * 2.5, 0.8, -1.5]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={2} />
      </mesh>

      {/* ECI banner */}
      <mesh position={[0, 3.5, -4.9]}>
        <planeGeometry args={[4, 0.8]} />
        <meshStandardMaterial color="#FF9933" />
      </mesh>

      <fog attach="fog" args={["#F3F4F6", 8, 20]} />
    </>
  );
}

// ============================================================
// Level 3 — Main Component
// ============================================================
const OFFICERS = [
  {
    id: 0,
    name: "1st Polling Officer",
    role: "Identification",
    icon: "📋",
    color: "#2563EB",
    action: "Verify identity against the Electoral Roll",
  },
  {
    id: 1,
    name: "2nd Polling Officer",
    role: "The Ink Mark",
    icon: "🖊️",
    color: "#7C3AED",
    action: "Apply indelible ink and sign Form 17A",
  },
  {
    id: 2,
    name: "3rd Polling Officer",
    role: "EVM Activation",
    icon: "⚡",
    color: "#059669",
    action: "Activate the Balloting Unit for your vote",
  },
];

export default function Level3() {
  const { playerName, playerGender, language, awardIPEvent, addIP, updateInventory, setFlag, goToLevel } = useGame();
  const navigate = useNavigate();
  const [currentOfficer, setCurrentOfficer] = useState(0);
  const [phase, setPhase] = useState("approach"); // approach → officer0 → ink → sign → officer2 → fraud → complete
  const [inkPhase, setInkPhase] = useState(false);
  const [inkApplied, setInkApplied] = useState(false);
  const [formSigned, setFormSigned] = useState(false);
  const [fraudShown, setFraudShown] = useState(false);
  const [fraudReported, setFraudReported] = useState(false);
  const [signPath, setSignPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const signCanvasRef = useRef(null);
  const fraudTimer = useRef(null);

  useEffect(() => {
    if (!playerName) { navigate("/create"); return; }
    goToLevel(3);
    speak(`Welcome to Level 3, ${playerName}. You've entered the polling booth. Three officers are waiting to process you.`, { language });
    if (window.vivekSay) window.vivekSay("You're inside the polling booth. There are three officers. Each has a specific role. Follow their instructions carefully!");

    setTimeout(() => setPhase("officer0"), 1500);
  }, []);

  // Officer 0 handler
  const handleIDVerification = () => {
    const rollCall = `${playerName}! Serial Number 247! Please confirm your presence.`;
    speak(rollCall, { language, ...NPC_VOICES.OFFICER_1 });
    awardIPEvent("CORRECT_NAME_CONFIRM");
    setTimeout(() => {
      setPhase("ink");
      setCurrentOfficer(1);
      speak("Identity confirmed. Please proceed to Officer 2 for the ink mark.", { language });
      if (window.vivekSay) window.vivekSay("Your name was found on the Electoral Roll at Serial No. 247. The officer has verified your identity. Now move to Officer 2 for the indelible ink!");
    }, 2000);
  };

  // Apply ink animation
  const handleApplyInk = () => {
    setInkPhase(true);
    speak("Applying indelible ink to your left forefinger. This ink will last 14 to 21 days and cannot be removed.", { language, ...NPC_VOICES.OFFICER_2 });
    if (window.vivekSay) window.vivekSay("The indelible ink is applied to your LEFT forefinger. It's manufactured by Mysore Paints and Varnish Ltd. No solvent can remove it. This prevents double voting across all constituencies!");
    setTimeout(() => {
      setInkApplied(true);
      setPhase("sign");
      speak("Ink applied. Now please sign or place your thumb impression on Form 17A.", { language });
    }, 2500);
  };

  // Signature canvas
  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = signCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    setSignPath([[x, y]]);
  };

  const continueDrawing = (e) => {
    if (!isDrawing) return;
    const rect = signCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    setSignPath(prev => [...prev, [x, y]]);

    const ctx = signCanvasRef.current.getContext("2d");
    ctx.strokeStyle = "#1A3A6B";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    if (signPath.length > 1) {
      const last = signPath[signPath.length - 1];
      ctx.beginPath();
      ctx.moveTo(last[0], last[1]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (signPath.length > 5) {
      setFormSigned(true);
    }
  };

  const handleSignComplete = () => {
    awardIPEvent("SIGN_FORM_17A");
    updateInventory({ inkApplied: true, form17aSigned: true });
    speak("Form 17A signed successfully. The register is now updated. Please proceed to Officer 3.", { language });
    setPhase("officer2");
    setCurrentOfficer(2);

    // Fraud encounter after 2 seconds
    setTimeout(() => {
      setFraudShown(true);
      speak("Wait! Officer says: Your forefinger already has ink! Are you trying to vote twice?", { language, ...NPC_VOICES.BRIBE_NPC });
      if (window.vivekSay) window.vivekSay("⚠️ That person is LYING! Check your finger — you just got the ink from Officer 2. This is an impersonation attempt. Report it to the Presiding Officer!", "alert");
    }, 2000);
  };

  const handleReportFraud = () => {
    clearTimeout(fraudTimer.current);
    awardIPEvent("REPORT_FAKE_INK");
    setFraudReported(true);
    setFlag("caughtFakeInkFraud", true);
    speak("Well done! The impersonator has been escorted out. The Presiding Officer has been notified.", { language });
    if (window.vivekSay) window.vivekSay("Excellent! You caught electoral impersonation fraud! Under RPA 1951 Section 60, impersonation carries imprisonment up to 1 year. +20 Integrity Points!", "success");
    setTimeout(() => {
      setFraudShown(false);
      setPhase("activation");
    }, 2000);
  };

  const handleIgnoreFraud = () => {
    addIP(-10, "IGNORE_FAKE_INK");
    setFraudShown(false);
    if (window.vivekSay) window.vivekSay("You should have reported that! That person was attempting to impersonate you at the booth. Always report suspicious activity to the Presiding Officer.", "alert");
    setPhase("activation");
  };

  const handleActivation = () => {
    speak("Ballot button pressed. The Balloting Unit is now active for exactly one vote. Please proceed to the voting compartment.", { language, ...NPC_VOICES.OFFICER_3 });
    if (window.vivekSay) window.vivekSay("The Control Unit is now activated for your single vote. Once you press a button on the EVM, the machine locks until the next voter is processed.");
    setTimeout(() => {
      setPhase("complete");
      setTimeout(() => navigate("/level/4"), 2000);
    }, 2500);
  };

  const emoji = playerGender === "female" ? "👩" : playerGender === "other" ? "🧑" : "👨";

  return (
    <div className="game-container">
      <div className="level-header">
        <div className="level-badge">👮 Level 3 — The Three-Officer Protocol</div>
        <div style={{ display: "flex", gap: "12px" }}>
          {OFFICERS.map((o, i) => (
            <div key={o.id} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "4px 12px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 600,
              background: currentOfficer === i ? `rgba(255,153,51,0.15)` : "var(--bg-glass-light)",
              border: `1px solid ${currentOfficer === i ? "var(--color-saffron)" : "var(--border-subtle)"}`,
              color: currentOfficer === i ? "var(--color-saffron)" : "var(--text-muted)"
            }}>
              {o.icon} {o.role}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "0", flex: 1 }}>
        {/* 3D Canvas */}
        <div style={{ position: "relative" }}>
          <Canvas camera={{ position: [0, 2, 5], fov: 65 }}>
            <BoothInterior currentOfficer={currentOfficer} inkPhase={inkPhase} />
          </Canvas>

          {/* First-person hand with ink (overlay) */}
          {inkApplied && (
            <div style={{
              position: "absolute", bottom: "20px", left: "30px",
              fontSize: "3rem", animation: "float-up 0.5s ease",
              filter: "drop-shadow(0 0 10px rgba(79,70,229,0.8))"
            }}>
              🖐️<span style={{ position: "absolute", top: "-5px", left: "8px", fontSize: "0.8rem", background: "#4F46E5", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>💧</span>
            </div>
          )}
        </div>

        {/* Right Panel: Interaction */}
        <div style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border-subtle)", padding: "24px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>

          {/* Current Officer */}
          <div style={{
            background: "var(--bg-card-2)", borderRadius: "var(--radius-md)", padding: "16px",
            border: `1px solid ${OFFICERS[currentOfficer]?.color}40`
          }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>
              CURRENT
            </div>
            <div style={{ fontWeight: 700, color: OFFICERS[currentOfficer]?.color, fontSize: "1rem" }}>
              {OFFICERS[currentOfficer]?.icon} {OFFICERS[currentOfficer]?.name}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              {OFFICERS[currentOfficer]?.action}
            </div>
          </div>

          {/* Phase-specific interactions */}
          {phase === "approach" && (
            <div style={{ animation: "float-up 0.3s ease" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                You enter the polling booth. Three officers are seated at the table ahead.
              </p>
            </div>
          )}

          {phase === "officer0" && (
            <div style={{ animation: "float-up 0.3s ease" }}>
              <div className="dialogue-box" style={{ marginBottom: "16px" }}>
                <div className="npc-name" style={{ color: "#2563EB" }}>📋 1ST POLLING OFFICER</div>
                <p>"{playerName}! Is that you? Serial Number 247 on the South Kolkata Electoral Roll?"</p>
              </div>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleIDVerification} id="confirm-identity-btn">
                ✋ "Yes, that's me!"
              </button>
            </div>
          )}

          {phase === "ink" && !inkApplied && (
            <div style={{ animation: "float-up 0.3s ease" }}>
              <div className="dialogue-box" style={{ marginBottom: "16px" }}>
                <div className="npc-name" style={{ color: "#7C3AED" }}>🖊️ 2ND POLLING OFFICER</div>
                <p>"Please extend your left forefinger. I will apply the indelible ink."</p>
              </div>
              <div style={{ background: "rgba(79,70,229,0.1)", border: "1px solid rgba(79,70,229,0.3)", borderRadius: "var(--radius-md)", padding: "12px", marginBottom: "16px", fontSize: "0.85rem", color: "#A5B4FC" }}>
                💡 The ink will stay for 14-21 days. It cannot be removed by any solvent.
              </div>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleApplyInk} id="apply-ink-btn">
                🖐️ Extend Left Forefinger
              </button>
            </div>
          )}

          {phase === "sign" && (
            <div style={{ animation: "float-up 0.3s ease" }}>
              <div className="dialogue-box" style={{ marginBottom: "12px" }}>
                <div className="npc-name" style={{ color: "#7C3AED" }}>🖊️ 2ND POLLING OFFICER</div>
                <p>"Please sign Form 17A in the Register of Voters."</p>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 600 }}>FORM 17A — REGISTER OF VOTERS</div>
                <canvas
                  ref={signCanvasRef}
                  width={340}
                  height={100}
                  style={{
                    background: "white", borderRadius: "var(--radius-sm)", cursor: "crosshair",
                    border: "2px dashed #94A3B8", display: "block", touchAction: "none"
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={continueDrawing}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={continueDrawing}
                  onTouchEnd={endDrawing}
                  id="signature-canvas"
                />
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Draw your signature above</div>
              </div>
              {formSigned && (
                <button className="btn btn-success" style={{ width: "100%" }} onClick={handleSignComplete} id="sign-submit-btn">
                  ✅ Submit Signature
                </button>
              )}
            </div>
          )}

          {/* Fraud NPC encounter — fully explained */}
          {fraudShown && !fraudReported && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.4)",
              borderRadius: "var(--radius-md)", padding: "16px", animation: "float-up 0.3s ease"
            }}>
              <div style={{ fontWeight: 700, color: "#EF4444", marginBottom: "8px", fontSize: "0.95rem" }}>
                ⚠️ Suspicious Accusation!
              </div>
              <div className="dialogue-box" style={{ marginBottom: "12px", background: "rgba(239,68,68,0.05)" }}>
                <div className="npc-name" style={{ color: "#EF4444" }}>🧑 UNKNOWN PERSON (stranger in booth)</div>
                <p style={{ fontStyle: "italic" }}>"Officer! This voter's finger already has ink! They must have voted already!"</p>
              </div>

              {/* Clear context explanation */}
              <div style={{
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: "var(--radius-sm)", padding: "12px", marginBottom: "14px", fontSize: "0.84rem"
              }}>
                <div style={{ fontWeight: 700, color: "#93C5FD", marginBottom: "6px" }}>🔍 What's happening?</div>
                <p style={{ color: "#CBD5E1", margin: 0 }}>
                  A stranger is falsely claiming YOUR ink mark (just applied by Officer 2) means you already voted. 
                  This is a classic <strong style={{ color: "#FCA5A5" }}>voter impersonation fraud tactic</strong> — 
                  they want to get you removed from the booth.
                  <br /><br />
                  <strong style={{ color: "#86EFAC" }}>The truth:</strong> You just received this ink from Officer 2 moments ago. 
                  You have NOT voted yet. You must report this person to the <strong>Presiding Officer</strong>.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleReportFraud} id="report-fraud-btn">
                  🚨 Report to Presiding Officer
                </button>
                <button className="btn btn-secondary" onClick={handleIgnoreFraud} id="ignore-fraud-btn">
                  Ignore (−10 IP)
                </button>
              </div>
            </div>
          )}

          {phase === "activation" && (
            <div style={{ animation: "float-up 0.3s ease" }}>
              <div className="dialogue-box" style={{ marginBottom: "16px" }}>
                <div className="npc-name" style={{ color: "#059669" }}>⚡ 3RD POLLING OFFICER</div>
                <p>"I am now pressing the Ballot Button on the Control Unit. The machine is activated for your vote."</p>
              </div>
              <div style={{ background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.3)", borderRadius: "var(--radius-md)", padding: "12px", marginBottom: "16px", fontSize: "0.85rem", color: "#6EE7B7" }}>
                🔊 <em>Long BEEP sound plays...</em> The Balloting Unit is now ready for exactly ONE vote.
              </div>
              <button className="btn btn-success" style={{ width: "100%" }} onClick={handleActivation} id="proceed-to-evm-btn">
                🗳️ Proceed to Voting Compartment
              </button>
            </div>
          )}

          {phase === "complete" && (
            <div style={{ textAlign: "center", animation: "float-up 0.3s ease" }}>
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🗳️</div>
              <h3>Entering the Voting Compartment...</h3>
            </div>
          )}

          {/* Ink status badge */}
          {inkApplied && (
            <div style={{
              marginTop: "auto", padding: "10px 14px", background: "rgba(79,70,229,0.1)",
              border: "1px solid rgba(79,70,229,0.3)", borderRadius: "var(--radius-md)",
              fontSize: "0.82rem", color: "#A5B4FC", display: "flex", gap: "8px", alignItems: "center"
            }}>
              <span>🖐️</span>
              <span>Indelible ink applied to left forefinger. Valid for 14-21 days.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
