import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { IP_EVENTS, IP_THRESHOLDS, VOTER_PROFILES, TRANSLATIONS } from "../data/gameData";
import { saveGameProgress, loadGameProgress, auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

// ============================================================
// INITIAL STATE
// ============================================================
const INITIAL_STATE = {
  // Player
  playerName: "",
  playerGender: null, // "male" | "female" | "other"
  language: "en",
  userId: null,
  constituency: "South Kolkata",

  // Game progress
  currentLevel: -1, // -1 = landing, 0 = character create, prologue, then 0-5
  levelHistory: [],
  isGameStarted: false,
  isGameComplete: false,

  // Integrity Points
  ip: 50, // Start at 50 (neutral)
  ipHistory: [],
  isDisqualified: false,
  disqualificationReason: null,

  // Inventory (items collected during game)
  inventory: {
    epicCard: false,
    inkApplied: false,
    form17aSigned: false,
    hasVoted: false,
  },

  // Level-specific flags
  flags: {
    declinedBribeBeforeAI: false,
    pickedRareDocument: false,
    caughtFakeInkFraud: false,
    reportedVVPATMismatch: false,
    vvpatMismatchTriggered: false,
  },

  // UI
  vivekMessage: null,
  vivekIsTyping: false,
  showDisqualificationModal: false,

  // Ending
  voterProfile: null,
};

// ============================================================
// REDUCER
// ============================================================
const gameReducer = (state, action) => {
  switch (action.type) {
    // Player setup
    case "SET_PLAYER": {
      return { ...state, playerName: action.payload.name, playerGender: action.payload.gender };
    }
    case "SET_LANGUAGE": {
      return { ...state, language: action.payload };
    }
    case "SET_USER_ID": {
      return { ...state, userId: action.payload };
    }
    case "SET_CONSTITUENCY": {
      return { ...state, constituency: action.payload };
    }

    // Game flow
    case "START_GAME": {
      return { ...state, isGameStarted: true, currentLevel: "prologue" };
    }
    case "SET_LEVEL": {
      return {
        ...state,
        currentLevel: action.payload,
        levelHistory: [...state.levelHistory, action.payload],
      };
    }
    case "COMPLETE_GAME": {
      const profile = getVoterProfile(state.ip);
      return { ...state, isGameComplete: true, voterProfile: profile };
    }

    // Integrity Points
    case "ADD_IP": {
      const { points, reason } = action.payload;
      const newIP = Math.max(0, state.ip + points);
      const newHistory = [...state.ipHistory, { points, reason, total: newIP, level: state.currentLevel }];
      const isDisqualified = newIP < IP_THRESHOLDS.DISQUALIFICATION && points < 0;
      return {
        ...state,
        ip: newIP,
        ipHistory: newHistory,
        isDisqualified: isDisqualified || state.isDisqualified,
        showDisqualificationModal: isDisqualified,
        disqualificationReason: isDisqualified ? reason : state.disqualificationReason,
      };
    }

    // Inventory
    case "UPDATE_INVENTORY": {
      return { ...state, inventory: { ...state.inventory, ...action.payload } };
    }

    // Flags
    case "SET_FLAG": {
      return { ...state, flags: { ...state.flags, [action.payload.key]: action.payload.value } };
    }

    // Vivek
    case "SET_VIVEK_MESSAGE": {
      return { ...state, vivekMessage: action.payload };
    }
    case "SET_VIVEK_TYPING": {
      return { ...state, vivekIsTyping: action.payload };
    }

    // Modals
    case "CLOSE_DISQUALIFICATION_MODAL": {
      return { ...state, showDisqualificationModal: false };
    }
    case "RESET_DISQUALIFICATION": {
      return { ...state, isDisqualified: false, showDisqualificationModal: false, disqualificationReason: null, ip: 20 };
    }

    // Reset
    case "RESET_GAME": {
      return { ...INITIAL_STATE, language: state.language }; // Keep language preference
    }

    default:
      return state;
  }
};

// ============================================================
// HELPERS
// ============================================================
const getVoterProfile = (ip) => {
  if (ip >= 81) return VOTER_PROFILES[2]; // Guardian
  if (ip >= 41) return VOTER_PROFILES[1]; // Conscious
  return VOTER_PROFILES[0]; // Passive
};

// ============================================================
// CONTEXT
// ============================================================
const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // Sync with Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "SET_USER_ID", payload: user.uid });
      } else {
        dispatch({ type: "SET_USER_ID", payload: null });
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-save progress when level changes
  useEffect(() => {
    if (state.userId && state.isGameStarted) {
      saveGameProgress(state.userId, {
        playerName: state.playerName,
        playerGender: state.playerGender,
        language: state.language,
        currentLevel: state.currentLevel,
        ip: state.ip,
        inventory: state.inventory,
        flags: state.flags,
      }).catch(err => console.error("Auto-save failed:", err));
    }
  }, [state.currentLevel, state.ip, state.userId, state.isGameStarted]);

  // ============================================================
  // ACTIONS (memoized for performance)
  // ============================================================
  const setPlayer = useCallback((name, gender) => {
    dispatch({ type: "SET_PLAYER", payload: { name, gender } });
  }, []);

  const setLanguage = useCallback((lang) => {
    dispatch({ type: "SET_LANGUAGE", payload: lang });
  }, []);

  const setUserId = useCallback((uid) => {
    dispatch({ type: "SET_USER_ID", payload: uid });
  }, []);

  const setConstituency = useCallback((c) => {
    dispatch({ type: "SET_CONSTITUENCY", payload: c });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const goToLevel = useCallback((level) => {
    dispatch({ type: "SET_LEVEL", payload: level });
  }, []);

  const addIP = useCallback((points, reason) => {
    dispatch({ type: "ADD_IP", payload: { points, reason } });
  }, []);

  const awardIPEvent = useCallback((eventKey) => {
    const event = IP_EVENTS[eventKey];
    if (!event) return;
    dispatch({ type: "ADD_IP", payload: { points: event.points, reason: eventKey } });
  }, []);

  const updateInventory = useCallback((items) => {
    dispatch({ type: "UPDATE_INVENTORY", payload: items });
  }, []);

  const setFlag = useCallback((key, value) => {
    dispatch({ type: "SET_FLAG", payload: { key, value } });
  }, []);

  const setVivekMessage = useCallback((msg) => {
    dispatch({ type: "SET_VIVEK_MESSAGE", payload: msg });
  }, []);

  const setVivekTyping = useCallback((val) => {
    dispatch({ type: "SET_VIVEK_TYPING", payload: val });
  }, []);

  const closeDisqualificationModal = useCallback(() => {
    dispatch({ type: "CLOSE_DISQUALIFICATION_MODAL" });
  }, []);

  const resetFromDisqualification = useCallback(() => {
    dispatch({ type: "RESET_DISQUALIFICATION" });
  }, []);

  const completeGame = useCallback(() => {
    dispatch({ type: "COMPLETE_GAME" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  // Translation helper
  const t = useCallback((key) => {
    return TRANSLATIONS[state.language]?.[key] || TRANSLATIONS["en"]?.[key] || key;
  }, [state.language]);

  const value = {
    ...state,
    setPlayer,
    setLanguage,
    startGame,
    goToLevel,
    addIP,
    awardIPEvent,
    updateInventory,
    setFlag,
    setVivekMessage,
    setVivekTyping,
    closeDisqualificationModal,
    resetFromDisqualification,
    completeGame,
    resetGame,
    setConstituency,
    setUserId,
    t,
    voterProfile: getVoterProfile(state.ip),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
