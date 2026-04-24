// ============================================================
// AUDIO MANAGER — Background Music via Web Audio API
// Generates ambient election/civic-themed music procedurally.
// No audio files needed. Persists mute state in localStorage.
// ============================================================

let audioCtx = null;
let masterGain = null;
let isPlaying = false;
let isMuted = false;
let scheduledNodes = [];

// ── Initialize AudioContext ──────────────────────────────────
const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = isMuted ? 0 : 0.18;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
};

// ── Tone generator ───────────────────────────────────────────
const playTone = (freq, startTime, duration, type = 'sine', gain = 0.12) => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(gain, startTime + 0.08);
  g.gain.setValueAtTime(gain, startTime + duration - 0.15);
  g.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(g);
  g.connect(masterGain);
  osc.start(startTime);
  osc.stop(startTime + duration);

  scheduledNodes.push(osc);
  return osc;
};

// ── Ambient pad ──────────────────────────────────────────────
// Plays a soft sustained chord (civic/patriotic feel)
const scheduleAmbientPad = (startTime) => {
  // Indian-flavored chord: Sa Pa (root + fifth) + soft tritone colour
  const chord = [261.63, 329.63, 392.00, 523.25]; // C4 E4 G4 C5
  chord.forEach((freq, i) => {
    playTone(freq, startTime + i * 0.04, 6.0, 'sine', 0.04);
  });
};

// ── Gentle percussion (tabla feel) ──────────────────────────
const schedulePercussion = (startTime) => {
  const pattern = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5]; // 8 beats
  pattern.forEach((beat) => {
    const ctx = getCtx();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.value = beat % 2 === 0 ? 0.08 : 0.04; // Accent on downbeats
    src.connect(g);
    g.connect(masterGain);
    src.start(startTime + beat);
    scheduledNodes.push(src);
  });
};

// ── Melody — simple Indian-ish pentatonic phrases ────────────
const PENTATONIC = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C
const scheduleM = (startTime) => {
  const phrase = [0, 2, 4, 5, 4, 2, 0, 1]; // indices into PENTATONIC
  const durations = [0.4, 0.4, 0.4, 0.8, 0.4, 0.4, 0.4, 0.8];
  let t = startTime;
  phrase.forEach((idx, i) => {
    playTone(PENTATONIC[idx], t, durations[i], 'triangle', 0.06);
    t += durations[i];
  });
};

// ── Main loop — schedule 8-second segments rolling ──────────
let loopHandle = null;
const SEGMENT = 8; // seconds per loop segment

const scheduleSegment = (startTime) => {
  scheduleAmbientPad(startTime);
  schedulePercussion(startTime);
  scheduleM(startTime + 0.5);
};

const startLoop = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  scheduleSegment(now);
  scheduleSegment(now + SEGMENT);

  loopHandle = setInterval(() => {
    const t = ctx.currentTime + SEGMENT;
    scheduleSegment(t);
    // Prune old nodes
    scheduledNodes = scheduledNodes.filter(n => {
      try { return true; } catch { return false; }
    });
  }, SEGMENT * 1000);
};

// ── Public API ───────────────────────────────────────────────

export const startMusic = () => {
  if (isPlaying) return;
  isMuted = localStorage.getItem('tfv_music_muted') === 'true';
  isPlaying = true;
  startLoop();
};

export const stopMusic = () => {
  isPlaying = false;
  clearInterval(loopHandle);
  scheduledNodes.forEach(n => { try { n.stop(); } catch {} });
  scheduledNodes = [];
};

export const setMusicMuted = (muted) => {
  isMuted = muted;
  localStorage.setItem('tfv_music_muted', String(muted));
  if (masterGain) {
    masterGain.gain.cancelScheduledValues(0);
    masterGain.gain.linearRampToValueAtTime(
      muted ? 0 : 0.18,
      (audioCtx?.currentTime || 0) + 0.3
    );
  }
};

export const getMusicMuted = () => isMuted;

export const setMusicVolume = (vol) => {
  // vol: 0.0 → 1.0
  localStorage.setItem('tfv_music_vol', String(vol));
  if (masterGain && !isMuted) {
    masterGain.gain.linearRampToValueAtTime(
      vol * 0.25,
      (audioCtx?.currentTime || 0) + 0.3
    );
  }
};
