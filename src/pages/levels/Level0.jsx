import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { speak, stopSpeaking } from "../../services/tts";
import { getLevelHint, isGeminiAvailable } from "../../services/gemini";

const STEPS = [
  { id: "form", title: "Fill Form 6", icon: "📝" },
  { id: "dob", title: "Verify Age", icon: "🎂" },
  { id: "constituency", title: "Select Constituency", icon: "🗺️" },
  { id: "photo", title: "Upload Photo", icon: "📷" },
  { id: "submit", title: "Submit Application", icon: "✅" },
  { id: "card", title: "Receive EPIC Card", icon: "🪪" },
];

const CONSTITUENCIES = [
  "South Kolkata", "North Kolkata", "Howrah", "Hooghly",
  "Dum Dum", "Barasat", "Jodhpur Park", "Jadavpur",
];

export default function Level0() {
  const { playerName, playerGender, language, awardIPEvent, addIP, updateInventory, goToLevel, t } = useGame();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ dob: "", constituency: "", name: playerName });
  const [error, setError] = useState("");
  const [epicReady, setEpicReady] = useState(false);
  const [ageAttempts, setAgeAttempts] = useState(0);
  const [constAttempts, setConstAttempts] = useState(0);
  const [hint, setHint] = useState("");

  // Narrate instruction when a new step appears
  const STEP_NARRATION = {
    en: [
      `Welcome ${playerName}! Please fill in your personal details to begin voter registration.`,
      `Now enter your Date of Birth. You must be at least 18 years old to register as a voter.`,
      `Select your Assembly Constituency based on your residential address.`,
      `Upload a recent passport-size photograph for your Voter ID card.`,
      `Review your application details carefully before submitting.`,
      `Your application has been submitted! Collecting your EPIC Voter ID card now.`,
    ],
    hi: [
      `${playerName}, कृपया अपना व्यक्तिगत विवरण भरें।`,
      `अब अपनी जन्म तिथि दर्ज करें। मतदाता बनने के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए।`,
      `अपने पते के अनुसार अपना विधानसभा क्षेत्र चुनें।`,
      `अपनी मतदाता पहचान पत्र के लिए हालिया पासपोर्ट साइज़ फोटो अपलोड करें।`,
      `सबमिट करने से पहले अपना आवेदन ध्यान से जांचें।`,
      `आपका आवेदन जमा हो गया! अब अपना EPIC कार्ड लें।`,
    ],
    bn: [
      `${playerName}, দয়া করে আপনার ব্যক্তিগত তথ্য পূরণ করুন।`,
      `এখন আপনার জন্ম তারিখ লিখুন। ভোটার হতে আপনার বয়স কমপক্ষে ১৮ বছর হতে হবে।`,
      `আপনার ঠিকানা অনুযায়ী আপনার বিধানসভা কেন্দ্র বেছে নিন।`,
      `আপনার ভোটার আইডি কার্ডের জন্য একটি সাম্প্রতিক পাসপোর্ট সাইজ ছবি আপলোড করুন।`,
      `জমা দেওয়ার আগে আপনার আবেদনটি মনোযোগ দিয়ে পর্যালোচনা করুন।`,
      `আপনার আবেদন জমা হয়েছে! এখন আপনার EPIC কার্ড সংগ্রহ করুন।`,
    ],
  };

  useEffect(() => {
    if (!playerName) { navigate("/create"); return; }
    goToLevel(0);
    getLevelHint("/level/0", language).then(h => { if (h) setHint(h); });
    const hintInterval = setInterval(() => {
      getLevelHint("/level/0", language).then(h => { if (h) setHint(h); });
    }, 30000);
    return () => clearInterval(hintInterval);
  }, []);

  // Speak instruction whenever step changes
  useEffect(() => {
    const narrations = STEP_NARRATION[language] || STEP_NARRATION.en;
    const text = narrations[step];
    if (text) {
      stopSpeaking();
      speak(text, { language, rate: 0.78 });
    }
  }, [step]);

  const validateDOB = (dob) => {
    if (!dob) return false;
    const birth = new Date(dob);
    const today = new Date("2026-04-15"); // Election day in game
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) return age - 1 >= 18;
    return age >= 18;
  };

  const handleDOBSubmit = () => { stopSpeaking();
    if (!formData.dob) {
      setError("Please enter your date of birth.");
      speak("Please enter your date of birth to continue.", { language });
      return;
    }
    if (!validateDOB(formData.dob)) {
      const attempts = ageAttempts + 1;
      setAgeAttempts(attempts);
      setError("You must be at least 18 years old to register as a voter (Article 326 of the Constitution).");
      if (window.vivekSay) window.vivekSay("Article 326 of the Constitution mandates only citizens 18 or older can vote.", "alert");
      speak("You must be at least 18 years old. Article 326 of the Constitution requires this.", { language });
      if (attempts === 1) addIP(5, "CORRECT_AGE_AFTER_ERROR");
      return;
    }
    setError("");
    if (ageAttempts === 0) awardIPEvent("CORRECT_AGE_FIRST_TRY");
    // Speak confirmation ONLY after clicking verify
    speak("Age verified! You are eligible to vote. Proceeding to constituency selection.", { language });
    setStep(2);
  };

  const handleConstituencySubmit = () => { stopSpeaking();
    if (!formData.constituency) {
      setError("Please select your constituency.");
      speak("Please select your constituency from the options shown.", { language });
      return;
    }
    if (formData.constituency === "South Kolkata") {
      if (constAttempts === 0) awardIPEvent("CORRECT_CONSTITUENCY");
      else addIP(5, "CONSTITUENCY_WITH_HELP");
      // Confirmation only after correct selection + click
      speak("Correct! South Kolkata constituency confirmed. Proceeding to photo upload.", { language });
      setError("");
      setStep(3);
    } else {
      setConstAttempts(c => c + 1);
      setError("Your address is in South Kolkata. Please select the correct constituency.");
      if (window.vivekSay) window.vivekSay("Your residential address determines your constituency. Based on your pincode, you belong to South Kolkata.", "alert");
      speak("Incorrect. Your address is in South Kolkata. Please select the correct one.", { language });
    }
  };

  const handlePhotoUpload = (e) => { stopSpeaking();
    if (e.target.files?.[0]) {
      speak("Photo uploaded successfully! Now review your application.", { language });
      setStep(4);
    }
  };

  const handleSkipPhoto = () => { stopSpeaking();
    speak("Photo skipped for simulation. Proceeding to review.", { language });
    setStep(4);
  };

  const handleSubmit = () => { stopSpeaking();
    // Confirmation after clicking Submit
    speak("Application submitted successfully! Your Voter ID will be processed within 7 days.", { language });
    setStep(5);
    setTimeout(() => {
      setEpicReady(true);
      speak(`Congratulations ${playerName}! Your EPIC Voter ID card has arrived. You are now a registered voter of India!`, { language });
    }, 3000);
  };

  const handleCollectCard = () => { stopSpeaking();
    updateInventory({ epicCard: true });
    speak("Voter ID collected! Let's head to the polling station.", { language });
    goToLevel(1);
    navigate("/level/1");
  };

  const emoji = playerGender === "female" ? "👩" : playerGender === "other" ? "🧑" : "👨";

  return (
    <div className="game-container">
      {/* Level Header */}
      <div className="level-header">
        <div className="level-badge">📋 Level 0 — Voter Registration</div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>NVSP Portal Simulation</div>
      </div>

      {/* Step progress */}
      <div style={{ padding: "12px 40px", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: "8px", overflow: "auto" }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%", fontSize: "0.7rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: i < step ? "var(--color-green)" : i === step ? "var(--color-saffron)" : "var(--bg-card-2)",
              color: i <= step ? "white" : "var(--text-muted)",
              border: `2px solid ${i === step ? "var(--color-saffron)" : "transparent"}`,
              transition: "var(--transition-mid)"
            }}>{i < step ? "✓" : s.icon}</div>
            <span style={{ fontSize: "0.75rem", color: i === step ? "var(--color-saffron)" : "var(--text-muted)", whiteSpace: "nowrap" }}>{s.title}</span>
            {i < STEPS.length - 1 && <div style={{ width: "20px", height: "1px", background: "var(--border-subtle)", marginLeft: "2px" }} />}
          </div>
        ))}
      </div>

      {/* Inline Hint Bar — embedded in Level 0 page */}
      {hint && (
        <div style={{
          margin: "12px 40px", padding: "10px 16px",
          background: "rgba(15,23,41,0.9)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,153,51,0.15)", borderLeft: "3px solid var(--color-saffron)",
          borderRadius: "0 var(--radius-md) var(--radius-md) 0",
          display: "flex", alignItems: "center", gap: "10px",
          animation: "slide-in-left 0.4s ease"
        }}>
          <div style={{
            width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
            background: isGeminiAvailable ? "radial-gradient(circle, #60A5FA, #1A3A6B)" : "radial-gradient(circle, #6B7280, #374151)",
            border: `1px solid ${isGeminiAvailable ? "var(--color-saffron)" : "var(--border-subtle)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.55rem", color: "white"
          }}>{isGeminiAvailable ? "✦" : "•"}</div>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--color-saffron)", textTransform: "uppercase", letterSpacing: "1.5px", whiteSpace: "nowrap" }}>
            {isGeminiAvailable ? "AI HINT" : "HINT"}
          </span>
          <div style={{ width: "1px", height: "14px", background: "var(--border-subtle)", flexShrink: 0 }} />
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>{hint}</p>
          <button onClick={() => getLevelHint("/level/0", language).then(h => h && setHint(h))}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.75rem", flexShrink: 0 }}
            title="Next hint">↻</button>
        </div>
      )}

      <div className="game-content">
        {/* NVSP Portal */}
        <div style={{ width: "100%", maxWidth: "700px" }}>
          {/* Browser bar simulation */}
          <div style={{ background: "#0A0F1E", borderRadius: "var(--radius-md) var(--radius-md) 0 0", padding: "10px 16px", display: "flex", gap: "8px", alignItems: "center", border: "1px solid var(--border-subtle)", borderBottom: "none" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F56" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27C93F" }} />
            </div>
            <div style={{ flex: 1, background: "var(--bg-card-2)", borderRadius: "6px", padding: "4px 12px", fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center" }}>
              🔒 nvsp.in/form6-registration
            </div>
          </div>

          <div className="glass-card" style={{ borderRadius: "0 0 var(--radius-lg) var(--radius-lg)", padding: "32px" }}>
            {/* NVSP Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", paddingBottom: "20px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "2rem" }}>🗳️</div>
              <div>
                <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>NVSP — National Voters' Service Portal</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Election Commission of India | Form 6 — Application for Inclusion of Name</div>
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", padding: "12px 16px", color: "#FCA5A5", fontSize: "0.88rem", marginBottom: "20px" }}>
                ⚠️ {error}
              </div>
            )}

            {/* Step 0/1: Basic Details */}
            {step === 0 && (
              <div style={{ animation: "float-up 0.3s ease" }}>
                <h3 style={{ marginBottom: "20px" }}>Personal Details</h3>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "6px" }}>Full Name (as per Aadhaar)</label>
                    <input className="input" value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} id="form-name" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "6px" }}>Address</label>
                    <input className="input" defaultValue="42, Park Street, South Kolkata — 700016" readOnly id="form-address" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "6px" }}>Mobile (for OTP)</label>
                    <input className="input" defaultValue="+91 7439103897" readOnly id="form-mobile" />
                  </div>
                  <button className="btn btn-primary" onClick={() => { setStep(1); }} id="step0-next">
                    Save & Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: DOB Verification */}
            {step === 1 && (
              <div style={{ animation: "float-up 0.3s ease" }}>
                <h3 style={{ marginBottom: "8px" }}>Date of Birth Verification</h3>
                <p style={{ marginBottom: "20px", fontSize: "0.9rem" }}>You must be at least 18 years old on the qualifying date (January 1, 2026).</p>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "6px" }}>Date of Birth</label>
                  <input type="date" className="input" max="2026-04-15" value={formData.dob} onChange={e => { setFormData(d => ({ ...d, dob: e.target.value })); setError(""); }} id="form-dob" />
                </div>
                <div style={{ background: "rgba(255,153,51,0.05)", border: "1px solid rgba(255,153,51,0.2)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: "20px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  💡 <strong>Did you know?</strong> Article 326 of the Constitution of India gives every citizen above 18 the right to vote.
                </div>
                <button className="btn btn-primary" onClick={handleDOBSubmit} id="dob-verify-btn">Verify Age →</button>
              </div>
            )}

            {/* Step 2: Constituency */}
            {step === 2 && (
              <div style={{ animation: "float-up 0.3s ease" }}>
                <h3 style={{ marginBottom: "8px" }}>Select Your Constituency</h3>
                <p style={{ marginBottom: "20px", fontSize: "0.9rem" }}>Based on your address, which Assembly Constituency do you belong to?</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                  {CONSTITUENCIES.map(c => (
                    <button key={c} id={`const-${c.replace(" ", "-")}`}
                      onClick={() => setFormData(d => ({ ...d, constituency: c }))}
                      style={{
                        padding: "12px", borderRadius: "var(--radius-md)", textAlign: "left",
                        border: `2px solid ${formData.constituency === c ? "var(--color-saffron)" : "var(--border-subtle)"}`,
                        background: formData.constituency === c ? "rgba(255,153,51,0.1)" : "var(--bg-glass-light)",
                        cursor: "pointer", fontSize: "0.88rem", fontWeight: 600,
                        color: formData.constituency === c ? "var(--color-saffron)" : "var(--text-secondary)",
                        transition: "var(--transition-fast)"
                      }}>{c}</button>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={handleConstituencySubmit} id="const-submit-btn">Confirm Constituency →</button>
              </div>
            )}

            {/* Step 3: Photo Upload */}
            {step === 3 && (
              <div style={{ animation: "float-up 0.3s ease", textAlign: "center" }}>
                <h3 style={{ marginBottom: "8px" }}>Upload Your Photo</h3>
                <p style={{ marginBottom: "24px", fontSize: "0.9rem" }}>Upload a recent passport-size photograph (white background).</p>
                <label htmlFor="photo-upload" style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
                  border: "2px dashed var(--border-subtle)", borderRadius: "var(--radius-lg)",
                  padding: "40px 20px", cursor: "pointer", marginBottom: "20px",
                  transition: "var(--transition-fast)"
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-saffron)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-subtle)"}
                >
                  <span style={{ fontSize: "3rem" }}>📷</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Click to upload or drag & drop</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>JPG, PNG, max 2MB</span>
                  <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                </label>
                <button className="btn btn-secondary" onClick={handleSkipPhoto}>
                  Skip for now (simulation)
                </button>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <div style={{ animation: "float-up 0.3s ease" }}>
                <h3 style={{ marginBottom: "16px" }}>Review Your Application</h3>
                <div style={{ background: "var(--bg-card-2)", borderRadius: "var(--radius-md)", padding: "20px", marginBottom: "20px" }}>
                  {[
                    ["Name", formData.name || playerName],
                    ["Date of Birth", formData.dob || "2007-01-15"],
                    ["Address", "42, Park Street, South Kolkata — 700016"],
                    ["Constituency", formData.constituency || "South Kolkata"],
                    ["Form", "Form 6 — Application for Inclusion"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>{k}</span>
                      <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <input type="checkbox" id="form-agree" defaultChecked style={{ marginTop: "4px" }} />
                  <label htmlFor="form-agree" style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    I declare that the information provided is true to the best of my knowledge. I am an Indian citizen and have not registered as a voter in any other constituency.
                  </label>
                </div>
                <button className="btn btn-primary" onClick={handleSubmit} id="form-submit-btn">🗳️ Submit Application</button>
              </div>
            )}

            {/* Step 5: EPIC Card Arrival */}
            {step === 5 && (
              <div style={{ animation: "float-up 0.3s ease", textAlign: "center" }}>
                {!epicReady ? (
                  <div>
                    <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⏳</div>
                    <h3>Application Submitted!</h3>
                    <p>Processing... Your EPIC card will arrive in 7 days.</p>
                    <div style={{ marginTop: "20px", height: "4px", background: "var(--bg-glass-light)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "100%", background: "var(--color-saffron)", animation: "gradient-move 1.5s ease infinite", backgroundSize: "200% 100%" }} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: "3rem", marginBottom: "16px", animation: "float-up 0.5s ease" }}>🪪</div>
                    <h3 style={{ color: "var(--color-green)", marginBottom: "8px" }}>Your Voter ID Has Arrived!</h3>

                    {/* EPIC Card Visual */}
                    <div style={{
                      background: "linear-gradient(135deg, #1A3A6B, #0F1729)",
                      border: "2px solid var(--color-saffron)", borderRadius: "var(--radius-md)",
                      padding: "20px", margin: "20px auto", maxWidth: "320px", textAlign: "left",
                      boxShadow: "0 0 30px var(--color-saffron-glow)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <div>
                          <div style={{ fontSize: "0.65rem", color: "var(--color-saffron)", letterSpacing: "2px", marginBottom: "2px" }}>ELECTION COMMISSION OF INDIA</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>ELECTORS PHOTO IDENTITY CARD</div>
                        </div>
                        <div style={{ fontSize: "1.5rem" }}>🗳️</div>
                      </div>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{ width: "60px", height: "70px", background: "var(--bg-card-2)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>{emoji}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "1rem" }}>{playerName?.toUpperCase()}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>S/O: VOTER RECORD</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>South Kolkata, West Bengal</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--color-saffron)", fontWeight: 700, marginTop: "4px" }}>WB/24/247/000{playerName?.charCodeAt(0) || "01"}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "var(--radius-md)", padding: "12px", marginBottom: "20px", fontSize: "0.88rem", color: "#86EFAC" }}>
                      +20 Integrity Points · Voter Registration Complete!
                    </div>

                    <button className="btn btn-primary btn-large" onClick={handleCollectCard} id="collect-epic-btn">
                      🚶 Go to the Polling Station →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
