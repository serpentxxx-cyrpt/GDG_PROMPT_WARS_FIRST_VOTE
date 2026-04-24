import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { speak, speakNow, stopSpeaking, NPC_VOICES } from "../../services/tts";
import { NPC_DIALOGUE } from "../../data/gameData";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Human3D from "../../components/Human3D";

// ============================================================
// 3D Street Scene — with Human3D characters
// ============================================================
function StreetScene({ phase, playerGender }) {
  const playerRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (playerRef.current && phase === "walk") {
      playerRef.current.position.x = Math.sin(t * 0.5) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#FFF5E6" castShadow />
      <pointLight position={[-3, 4, 2]} intensity={0.6} color="#FF9933" />
      <pointLight position={[3, 3, 3]} intensity={0.3} color="#60A5FA" />

      {/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[14, 24]} />
        <meshStandardMaterial color="#1A1A2E" roughness={0.95} />
      </mesh>

      {/* Road lane markings */}
      {[-4, -2, 0, 2, 4, 6].map(z => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, z]}>
          <planeGeometry args={[0.18, 1.4]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
      ))}

      {/* Pavement left */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, -0.96, 0]}>
        <planeGeometry args={[4, 24]} />
        <meshStandardMaterial color="#2D3748" roughness={0.9} />
      </mesh>
      {/* Pavement right */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, -0.96, 0]}>
        <planeGeometry args={[4, 24]} />
        <meshStandardMaterial color="#2D3748" roughness={0.9} />
      </mesh>

      {/* Buildings */}
      {[[-5.5, 0, 0, 2.8, 5, 2.5, "#1A3A6B"], [-5.5, 0, -5, 2.5, 7, 2.5, "#0F1729"],
        [5.5, 0, 0, 2.5, 4.5, 2.5, "#1E2D4E"], [5.5, 0, -5, 3, 6, 2.5, "#162039"]
      ].map(([x, y, z, w, h, d, color], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, h / 2, 0]}>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
          {/* Windows */}
          {[0.4, 1.2, 2.0].map(wy => (
            <mesh key={wy} position={[0, wy, d / 2 + 0.01]}>
              <planeGeometry args={[0.5, 0.4]} />
              <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Polling Station */}
      <group position={[0, 0, -8]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[5, 4, 2.5]} />
          <meshStandardMaterial color="#1A3A6B" roughness={0.8} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 3.6, 0]}>
          <boxGeometry args={[5.5, 0.35, 3]} />
          <meshStandardMaterial color="#FF9933" />
        </mesh>
        {/* Door */}
        <mesh position={[0, 0.8, 1.26]}>
          <boxGeometry args={[0.9, 2.0, 0.05]} />
          <meshStandardMaterial color="#92400E" roughness={0.8} />
        </mesh>
        {/* ECI banner */}
        <mesh position={[0, 3.0, 1.27]}>
          <planeGeometry args={[3, 0.5]} />
          <meshStandardMaterial color="#138808" />
        </mesh>
        {/* Banner flag stripes */}
        <mesh position={[-0.5, 3.0, 1.28]}>
          <planeGeometry args={[1, 0.48]} />
          <meshStandardMaterial color="#FF9933" />
        </mesh>
        <mesh position={[0.5, 3.0, 1.28]}>
          <planeGeometry args={[1, 0.48]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.1} />
        </mesh>
      </group>

      {/* Trees */}
      {[[-3, 0, 3], [3, 0, 3], [-3, 0, -2], [3, 0, -2]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 1.4, 7]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.45, 9, 9]} />
            <meshStandardMaterial color="#166534" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* PLAYER CHARACTER */}
      <group ref={playerRef}>
        <Human3D
          gender={playerGender}
          position={[0, -0.98, 2]}
          rotation={[0, Math.PI, 0]}
          animation={phase === "walk" ? "walk" : "idle"}
          shirtColor="#2563EB"
          skinTone="#D4956A"
        />
      </group>

      {/* NPC 1 - Bribe Party Worker (red shirt) */}
      {phase === "bribe" && (
        <Human3D
          gender="male"
          position={[-1.8, -0.98, 0.8]}
          rotation={[0, Math.PI * 0.25, 0]}
          animation="idle"
          shirtColor="#DC2626"
          skinTone="#C68642"
          pantsColor="#374151"
        />
      )}

      {/* NPC 2 - Bus Driver / Neighbour */}
      {(phase === "transport" || phase === "pressure") && (
        <Human3D
          gender={phase === "pressure" ? "female" : "male"}
          position={[1.8, -0.98, 0.6]}
          rotation={[0, -Math.PI * 0.25, 0]}
          animation="idle"
          shirtColor={phase === "transport" ? "#059669" : "#7C3AED"}
          skinTone="#D2946B"
          pantsColor="#374151"
        />
      )}

      {/* Polling Officer at door (salute pose) */}
      <Human3D
        gender="male"
        position={[-0.7, -0.98, -5.8]}
        rotation={[0, Math.PI * 0.1, 0]}
        animation="salute"
        shirtColor="#FFFFFF"
        skinTone="#C68642"
        pantsColor="#1E3A5F"
      />

      <fog attach="fog" args={["#080C14", 12, 28]} />
    </>
  );
}


// ============================================================
// LEVEL 1 — Main Component
// ============================================================
const ENCOUNTERS = [
  {
    id: "bribe",
    npcKey: "bribeOffer",
    npc: { en: "Party Worker", hi: "पार्टी कार्यकर्ता", bn: "দলীয় কর্মী" },
    icon: "🎭",
    color: "#DC2626",
    law: "Section 171B, IPC",
    ai_intervention: {
      en: "🚨 Stop! Section 171B IPC classifies this as electoral bribery. Accepting gifts or money from political parties can lead to imprisonment up to 1 year. Your vote is your power!",
      hi: "🚨 रुकिए! IPC धारा 171B के तहत यह चुनावी रिश्वत है। राजनीतिक दलों से पैसे या उपहार लेना 1 साल की जेल का कारण बन सकता है!",
      bn: "🚨 থামুন! IPC ধারা 171B অনুযায়ী এটি নির্বাচনী ঘুষ। দল থেকে টাকা বা উপহার নিলে ১ বছর পর্যন্ত কারাদণ্ড হতে পারে!",
    },
    choice_accept: { en: "Accept ₹500", hi: "₹500 लें", bn: "₹500 নিন" },
    choice_decline: { en: "Decline", hi: "अस्वीकार करें", bn: "প্রত্যাখ্যান করুন" },
    decline_message: { en: "Well done! Resisting bribery is the hallmark of an empowered citizen.", hi: "शाबाश! रिश्वत का विरोध करना एक सशक्त नागरिक की पहचान है।", bn: "বাহ! ঘুষ প্রতিরোধ করা একজন ক্ষমতায়িত নাগরিকের বৈশিষ্ট্য।" },
  },
  {
    id: "transport",
    npcKey: "transportOffer",
    npc: { en: "Bus Driver", hi: "बस चालक", bn: "বাস চালক" },
    icon: "🚌",
    color: "#059669",
    law: "Section 171C, IPC",
    ai_intervention: {
      en: "⚠️ Section 171C IPC prohibits accepting free transport from a political party on election day. Walk to the booth independently to preserve your integrity.",
      hi: "⚠️ IPC धारा 171C: चुनाव दिन पार्टी का वाहन लेना गैरकानूनी है। अपनी इच्छा से बूथ तक जाएं।",
      bn: "⚠️ IPC ধারা 171C: ভোটের দিন দলের পরিবহন নেওয়া বেআইনি। স্বাধীনভাবে বুথে যান।",
    },
    choice_accept: { en: "Take the free bus", hi: "मुफ्त बस लें", bn: "বিনামূল্যে বাস নিন" },
    choice_decline: { en: "Walk myself", hi: "खुद चलूंगा", bn: "নিজে হাঁটব" },
    decline_message: { en: "Smart! Walking independently preserves your electoral integrity.", hi: "चतुर! स्वतंत्र रूप से चलना आपकी निष्ठा को बनाए रखता है।", bn: "চমৎকার! স্বাধীনভাবে হাঁটা আপনার নির্বাচনী সততা বজায় রাখে।" },
  },
  {
    id: "pressure",
    npcKey: "peerPressure",
    npc: { en: "Neighbour", hi: "पड़ोसी", bn: "প্রতিবেশী" },
    icon: "🧑‍🤝‍🧑",
    color: "#7C3AED",
    law: "Ballot Secrecy — RPA 1951",
    ai_intervention: {
      en: "Your vote is a secret ballot. Under RPA 1951, no one can compel you to vote for any candidate. Your choice in the booth is completely private.",
      hi: "आपका मतदान गुप्त मतपत्र है। RPA 1951 के तहत कोई भी आपको किसी उम्मीदवार के लिए वोट देने के लिए मजबूर नहीं कर सकता।",
      bn: "আপনার ভোট গোপন ব্যালট। RPA 1951 অনুযায়ী কেউ আপনাকে কোনো প্রার্থীকে ভোট দিতে বাধ্য করতে পারবে না।",
    },
    choice_accept: { en: "Agree to vote for them", hi: "उनके लिए वोट करने पर राजी", bn: "তাকে ভোট দিতে রাজি" },
    choice_decline: { en: "Refuse", hi: "मना करें", bn: "অস্বীকার করুন" },
    decline_message: { en: "Excellent! Your vote is your sovereign right. No one can coerce you.", hi: "उत्कृष्ट! आपका वोट आपका संप्रभु अधिकार है।", bn: "চমৎকার! আপনার ভোট আপনার সার্বভৌম অধিকার।" },
  },
];

export default function Level1() {
  const { playerName, playerGender, language, awardIPEvent, addIP, setFlag, flags, goToLevel } = useGame();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("walk"); // walk → bribe → transport → pressure → complete
  const [encounterIndex, setEncounterIndex] = useState(0);
  const [showDialogue, setShowDialogue] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiTriggered, setAITriggered] = useState(false);
  const [hasDeclinedBeforeAI, setHasDeclinedBeforeAI] = useState(false);
  const [result, setResult] = useState(null); // "accept" | "decline"
  const [showResult, setShowResult] = useState(false);
  const aiTimerRef = useRef(null);
  const npcSpokenRef = useRef(-1); // tracks which encounter index NPC has spoken for

  useEffect(() => {
    if (!playerName) { navigate("/create"); return; }
    goToLevel(1);
    stopSpeaking();
    const intro = { en: `${playerName}, you're walking toward the polling station. Stay alert!`, hi: `${playerName}, आप मतदान केंद्र की ओर जा रहे हैं। सतर्क रहें!`, bn: `${playerName}, আপনি ভোটকেন্দ্রের দিকে যাচ্ছেন। সতর্ক থাকুন!` };
    // Wait for intro to finish, then show first encounter
    speak(intro[language] || intro.en, { language }).then(() => {
      setPhase("bribe");
      setShowDialogue(true);
      // Speak NPC bribe offer after intro finishes
      const npcLine = ENCOUNTERS[0].npcKey;
      const npcText = NPC_DIALOGUE[npcLine]?.[language] || NPC_DIALOGUE[npcLine]?.en || "";
      if (npcText) speak(npcText, { language, ...NPC_VOICES.BRIBE_NPC });
    });
  }, []);

  const currentEncounter = ENCOUNTERS[encounterIndex];

  // Speak NPC line once per NEW encounter, then schedule AI warning
  useEffect(() => {
    if (!showDialogue || !currentEncounter) return;
    clearTimeout(aiTimerRef.current);

    // Guard: only speak NPC line once per encounter
    if (npcSpokenRef.current !== encounterIndex) {
      npcSpokenRef.current = encounterIndex;
      if (encounterIndex > 0) {
        // For encounters after the first (first is spoken in intro chain)
        const npcText = NPC_DIALOGUE[currentEncounter.npcKey]?.[language]
          || NPC_DIALOGUE[currentEncounter.npcKey]?.en || "";
        if (npcText) { stopSpeaking(); speak(npcText, { language, ...NPC_VOICES.BRIBE_NPC }); }
      }

      // AI intervention fires 4.5s after dialogue opens
      aiTimerRef.current = setTimeout(() => {
        setShowAI(true);
        setAITriggered(true);
        const aiText = currentEncounter.ai_intervention[language] || currentEncounter.ai_intervention.en;
        stopSpeaking();
        speak(aiText.replace(/[\u{1F6A8}\u26A0\uFE0F]/gu, ""), { language, ...NPC_VOICES.VIVEK });
        if (window.vivekSay) window.vivekSay(aiText, "alert");
      }, 4500);
    }

    return () => clearTimeout(aiTimerRef.current);
  }, [encounterIndex, showDialogue]);

  const handleDecline = () => {
    clearTimeout(aiTimerRef.current);
    stopSpeaking();
    const beforeAI = !aiTriggered;
    setHasDeclinedBeforeAI(beforeAI);
    setResult("decline");
    setShowResult(true);

    if (currentEncounter.id === "bribe") {
      if (beforeAI) {
        addIP(25, "DECLINE_BRIBE_BEFORE_AI");
        setFlag("declinedBribeBeforeAI", true);
      } else {
        awardIPEvent("DECLINE_BRIBE_AFTER_AI");
      }
    } else if (currentEncounter.id === "transport") {
      awardIPEvent("DECLINE_TRANSPORT");
    } else if (currentEncounter.id === "pressure") {
      awardIPEvent("DECLINE_PEER_PRESSURE");
    }

    // Speak result message, then move on after it finishes
    const msg = currentEncounter.decline_message[language] || currentEncounter.decline_message.en;
    speak(msg, { language, ...NPC_VOICES.VIVEK }).then(() => {
      setShowResult(false);
      setShowDialogue(false);
      setShowAI(false);
      setAITriggered(false);
      goToNextEncounter();
    });
  };

  const handleAccept = () => {
    clearTimeout(aiTimerRef.current);
    stopSpeaking();
    setResult("accept");
    setShowResult(true);

    let penaltyMsg = "";
    if (currentEncounter.id === "bribe") {
      addIP(-50, "ACCEPT_BRIBE");
      penaltyMsg = { en: "You accepted a bribe. This is a criminal offense under Section 171B IPC. Integrity Points deducted!", hi: "आपने रिश्वत स्वीकार की। यह IPC धारा 171B के तहत अपराध है। ईमानदारी अंक काटे गए!", bn: "আপনি ঘুষ নিয়েছেন। এটি IPC ধারা 171B-র অধীনে অপরাধ। ইন্টিগ্রিটি পয়েন্ট কাটা হয়েছে!" };
    } else if (currentEncounter.id === "transport") {
      awardIPEvent("ACCEPT_TRANSPORT");
      penaltyMsg = { en: "Accepting party transport is illegal under Section 171C. Now you know for next time.", hi: "पार्टी परिवहन लेना धारा 171C के तहत अवैध है।", bn: "দলীয় পরিবহন নেওয়া ধারা 171C অনুসারে বেআইনি।" };
      if (window.vivekSay) window.vivekSay(penaltyMsg.en, "alert");
    }

    const msgText = (penaltyMsg[language] || penaltyMsg.en || "");
    // Speak penalty, then move on after it finishes
    speak(msgText, { language, ...NPC_VOICES.VIVEK }).then(() => {
      setShowResult(false);
      setShowDialogue(false);
      setShowAI(false);
      setAITriggered(false);
      goToNextEncounter();
    });
  };

  const goToNextEncounter = () => {
    if (encounterIndex < ENCOUNTERS.length - 1) {
      // Short pause then show next encounter
      setTimeout(() => {
        setEncounterIndex(i => i + 1);
        setShowDialogue(true);
        setPhase(ENCOUNTERS[encounterIndex + 1]?.id || "complete");
      }, 800);
    } else {
      setPhase("complete");
      const outroText = {
        en: "Well done! You've passed the campaign gauntlet. Now, let's enter the polling station.",
        hi: "शाबाश! आपने प्रचार अभियान पार किया। अब मतदान केंद्र में प्रवेश करते हैं।",
        bn: "চমৎকার! আপনি প্রচার অভিযান পার করেছেন। এখন ভোটকেন্দ্রে প্রবেশ করি।"
      };
      speak(outroText[language] || outroText.en, { language }).then(() => {
        navigate("/level/2");
      });
    }
  };

  return (
    <div className="game-container">
      <div className="level-header">
        <div className="level-badge">🚶 Level 1 — The Campaign Gauntlet</div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Resist influence. Reach the booth.</div>
      </div>

      {/* 3D Canvas */}
      <div style={{ height: "calc(100vh - 200px)", position: "relative" }}>
        <Canvas camera={{ position: [0, 2.2, 6.5], fov: 55 }} shadows>
          <StreetScene phase={phase} playerGender={playerGender} />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 6} />
        </Canvas>

        {/* HUD Overlay */}
        <div style={{ position: "absolute", top: "20px", left: "20px" }}>
          <div style={{
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
            borderRadius: "var(--radius-md)", padding: "10px 16px",
            border: "1px solid var(--border-subtle)", fontSize: "0.85rem", color: "var(--text-muted)"
          }}>
            🏛️ Polling Station — 200m ahead
          </div>
        </div>

        {/* Encounter dialogue — positioned TOP-CENTER above the NPC */}
        {showDialogue && currentEncounter && (
          <div style={{
            position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: "540px", padding: "0 20px",
            animation: "float-up 0.3s ease", zIndex: 10
          }}>
            <div className="dialogue-box">
              <div className="npc-name" style={{ color: currentEncounter.color }}>
                {currentEncounter.icon} {(currentEncounter.npc[language] || currentEncounter.npc.en).toUpperCase()}
              </div>
              <p style={{ color: "var(--text-primary)", marginBottom: "16px", fontStyle: "italic" }}>
                &ldquo;{NPC_DIALOGUE[currentEncounter.npcKey]?.[language] || NPC_DIALOGUE[currentEncounter.npcKey]?.en}&rdquo;
              </p>
              {!showResult && (
                <div style={{ display: "flex", gap: "12px" }}>
                  <button className="btn btn-success" onClick={handleDecline} id={`decline-${currentEncounter.id}`} style={{ flex: 1 }}>
                    ✋ {currentEncounter.choice_decline[language] || currentEncounter.choice_decline.en}
                  </button>
                  <button className="btn btn-danger" onClick={handleAccept} id={`accept-${currentEncounter.id}`} style={{ flex: 1 }}>
                    {currentEncounter.choice_accept[language] || currentEncounter.choice_accept.en}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Intervention */}
        {showAI && !showResult && (
          <div style={{
            position: "absolute", bottom: "0", left: "0", right: "0",
            background: "linear-gradient(to top, rgba(26,58,107,0.98), transparent)",
            padding: "20px 20px 20px", animation: "float-up 0.4s ease"
          }}>
            <div style={{ maxWidth: "560px", margin: "0 auto", display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                background: "radial-gradient(circle, #60A5FA, #1A3A6B)",
                border: "2px solid var(--color-saffron)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem"
              }}>🔵</div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--color-saffron)", fontWeight: 700, marginBottom: "4px" }}>
                  {language === "hi" ? "विवेक — लोकतांत्रिक विवेक" : language === "bn" ? "বিবেক — গণতান্ত্রিক চেতনা" : "VIVEK — DEMOCRATIC CONSCIENCE"}
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
                  {currentEncounter.ai_intervention[language] || currentEncounter.ai_intervention.en}
                </p>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px" }}>
                  ⚖️ {currentEncounter.law}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result feedback */}
        {showResult && (
          <div style={{
            position: "absolute", inset: 0,
            background: result === "decline" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fade-in 0.3s ease"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "8px" }}>{result === "decline" ? "✅" : "❌"}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: result === "decline" ? "var(--ip-high)" : "var(--ip-low)" }}>
                {result === "decline" ? (hasDeclinedBeforeAI ? "+25 IP ⚡ Quick Reflex!" : "+20 IP") : "-50 IP"}
              </div>
            </div>
          </div>
        )}

        {/* Complete */}
        {phase === "complete" && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fade-in 0.3s ease"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🏛️</div>
              <h2 style={{ marginBottom: "8px" }}>Gauntlet Cleared!</h2>
              <p>Heading to the polling station entrance...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
