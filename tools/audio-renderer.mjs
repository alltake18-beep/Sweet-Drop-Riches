import fs from "node:fs";
import path from "node:path";

const sampleRate = 44100;
const outDir = path.resolve("assets/audio");
fs.mkdirSync(outDir, { recursive: true });

const NOTE = {
  C: 0, Db: 1, D: 2, Eb: 3, E: 4, F: 5, Gb: 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11,
};

function hz(note, octave) {
  const midi = (octave + 1) * 12 + NOTE[note];
  return 440 * 2 ** ((midi - 69) / 12);
}

function make(seconds) {
  const length = Math.ceil(seconds * sampleRate);
  return {
    left: new Float32Array(length),
    right: new Float32Array(length),
  };
}

function env(t, dur, attack = 0.01, release = 0.12, curve = 1.8) {
  if (t < 0 || t > dur) return 0;
  if (t < attack) return t / attack;
  const relStart = Math.max(attack, dur - release);
  if (t > relStart) return Math.max(0, (dur - t) / Math.max(0.001, dur - relStart)) ** curve;
  return 1;
}

function addSample(buf, i, value, pan = 0) {
  if (i < 0 || i >= buf.left.length) return;
  const l = Math.cos((pan + 1) * Math.PI / 4);
  const r = Math.sin((pan + 1) * Math.PI / 4);
  buf.left[i] += value * l;
  buf.right[i] += value * r;
}

function addTone(buf, start, dur, freq, opts = {}) {
  const begin = Math.floor(start * sampleRate);
  const count = Math.floor(dur * sampleRate);
  const vol = opts.vol ?? 0.2;
  const pan = opts.pan ?? 0;
  const attack = opts.attack ?? 0.008;
  const release = opts.release ?? Math.min(0.12, dur * 0.45);
  const type = opts.type || "sine";
  const to = opts.to || freq;
  const vibrato = opts.vibrato || 0;
  for (let n = 0; n < count; n += 1) {
    const t = n / sampleRate;
    const p = count <= 1 ? 0 : n / (count - 1);
    const f = freq * (to / freq) ** p;
    const vib = vibrato ? 1 + Math.sin(2 * Math.PI * 5.4 * t) * vibrato : 1;
    const phase = 2 * Math.PI * f * vib * t;
    let s = Math.sin(phase);
    if (type === "triangle") s = (2 / Math.PI) * Math.asin(Math.sin(phase));
    if (type === "square") s = Math.sign(Math.sin(phase)) * 0.7;
    if (type === "saw") {
      s = 0;
      for (let h = 1; h <= 8; h += 1) s += Math.sin(phase * h) / h;
      s *= 0.35;
    }
    if (type === "rhodes") {
      s = Math.sin(phase) * 0.68
        + Math.sin(phase * 2.01) * 0.18
        + Math.sin(phase * 3.97) * 0.08
        + Math.sin(phase * 6.02) * 0.035;
    }
    addSample(buf, begin + n, s * vol * env(t, dur, attack, release, opts.curve ?? 1.7), pan);
  }
}

function addNoise(buf, start, dur, opts = {}) {
  const begin = Math.floor(start * sampleRate);
  const count = Math.floor(dur * sampleRate);
  const vol = opts.vol ?? 0.08;
  const pan = opts.pan ?? 0;
  let last = 0;
  for (let n = 0; n < count; n += 1) {
    const t = n / sampleRate;
    const raw = Math.random() * 2 - 1;
    const high = raw - last * 0.92;
    last = raw;
    const low = last = last * 0.84 + raw * 0.16;
    const s = opts.color === "low" ? low : opts.color === "high" ? high : raw * 0.65 + high * 0.35;
    addSample(buf, begin + n, s * vol * env(t, dur, opts.attack ?? 0.004, opts.release ?? dur * 0.8, opts.curve ?? 1.4), pan);
  }
}

function hit(buf, start, opts = {}) {
  const root = opts.root || hz("Bb", 1);
  const size = opts.size ?? 1;
  addTone(buf, start, 0.18, root, { to: root * 0.48, vol: 0.42 * size, type: "sine", release: 0.16 });
  addTone(buf, start + 0.012, 0.1, root * 2, { to: root * 1.4, vol: 0.18 * size, type: "triangle", pan: opts.pan || 0 });
  addNoise(buf, start + 0.006, 0.08, { vol: 0.12 * size, color: "high", pan: opts.pan || 0 });
}

function shine(buf, start, opts = {}) {
  const base = opts.base || hz("F", 5);
  const count = opts.count || 4;
  for (let i = 0; i < count; i += 1) {
    addTone(buf, start + i * (opts.spacing || 0.038), 0.07, base * 2 ** (i / 7), {
      vol: (opts.vol || 0.12) * (1 - i * 0.08),
      type: i % 2 ? "sine" : "triangle",
      pan: -0.25 + i * 0.15,
    });
  }
  addNoise(buf, start + 0.045, 0.08, { vol: (opts.vol || 0.12) * 0.22, color: "high" });
}

function coinSpray(buf, start, opts = {}) {
  const count = opts.count || 8;
  for (let i = 0; i < count; i += 1) {
    const t = start + i * (opts.spacing || 0.04);
    addTone(buf, t, 0.045, (opts.base || hz("Bb", 5)) * 2 ** ((i % 5) / 12), {
      vol: opts.vol || 0.12,
      type: "square",
      pan: -0.5 + Math.random(),
      release: 0.035,
    });
    if (i % 2 === 0) addNoise(buf, t + 0.005, 0.022, { vol: (opts.vol || 0.12) * 0.2, color: "high" });
  }
}

function voiceBark(buf, start, syllables, opts = {}) {
  const base = opts.base || hz("Bb", 2);
  const vol = opts.vol || 0.12;
  const spacing = opts.spacing || 0.18;
  const vowels = {
    big: [620, 1650, 2550],
    win: [520, 1350, 2300],
    mega: [720, 1750, 2650],
    super: [560, 1500, 2450],
    epic: [680, 1850, 2750],
    legend: [500, 1250, 2250],
    ary: [760, 1900, 2850],
  };
  syllables.forEach((syllable, index) => {
    const t = start + index * spacing;
    const dur = syllable.length > 4 ? 0.18 : 0.14;
    const pitch = base * 2 ** (index * 0.9 / 12);
    addNoise(buf, t, 0.035, { vol: vol * 0.38, color: "high", attack: 0.001, release: 0.025, pan: -0.12 });
    addTone(buf, t, dur, pitch, { to: pitch * 0.92, vol: vol * 0.52, type: "saw", attack: 0.006, release: 0.08, pan: -0.05, vibrato: 0.006 });
    for (const [formantIndex, formant] of (vowels[syllable] || vowels.win).entries()) {
      addTone(buf, t + 0.012 + formantIndex * 0.004, dur * 0.9, formant, {
        vol: vol * (0.28 / (formantIndex + 1)),
        type: "sine",
        attack: 0.012,
        release: 0.07,
        pan: 0.05,
        vibrato: 0.002,
      });
    }
  });
}

function riser(buf, start, dur, from, to, opts = {}) {
  addTone(buf, start, dur, from, { to, vol: opts.vol || 0.14, type: opts.type || "saw", attack: 0.02, release: 0.08, pan: opts.pan || 0 });
  addNoise(buf, start + dur * 0.15, dur * 0.7, { vol: (opts.vol || 0.14) * 0.25, color: "high" });
}

function rumble(buf, start, dur, opts = {}) {
  addTone(buf, start, dur, opts.root || hz("Bb", 1), { to: opts.to || hz("F", 1), vol: opts.vol || 0.22, type: "saw", attack: 0.035, release: 0.22 });
  addNoise(buf, start, dur, { vol: (opts.vol || 0.22) * 0.18, color: "low" });
}

function softLimit(buf, target = 0.92) {
  let peak = 0;
  for (let i = 0; i < buf.left.length; i += 1) {
    buf.left[i] = Math.tanh(buf.left[i] * 1.18) / Math.tanh(1.18);
    buf.right[i] = Math.tanh(buf.right[i] * 1.18) / Math.tanh(1.18);
    peak = Math.max(peak, Math.abs(buf.left[i]), Math.abs(buf.right[i]));
  }
  const gain = peak > 0 ? target / peak : 1;
  for (let i = 0; i < buf.left.length; i += 1) {
    buf.left[i] *= gain;
    buf.right[i] *= gain;
  }
}

function writeWav(name, buf, peak = 0.92) {
  softLimit(buf, peak);
  const frames = buf.left.length;
  const bytes = 44 + frames * 4;
  const out = Buffer.alloc(bytes);
  out.write("RIFF", 0);
  out.writeUInt32LE(bytes - 8, 4);
  out.write("WAVE", 8);
  out.write("fmt ", 12);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(2, 22);
  out.writeUInt32LE(sampleRate, 24);
  out.writeUInt32LE(sampleRate * 4, 28);
  out.writeUInt16LE(4, 32);
  out.writeUInt16LE(16, 34);
  out.write("data", 36);
  out.writeUInt32LE(frames * 4, 40);
  for (let i = 0; i < frames; i += 1) {
    out.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(buf.left[i] * 32767))), 44 + i * 4);
    out.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(buf.right[i] * 32767))), 46 + i * 4);
  }
  fs.writeFileSync(path.join(outDir, name), out);
}

function makeBgm() {
  const bpm = 128;
  const beat = 60 / bpm;
  const bars = 16;
  const buf = make(bars * 4 * beat);
  const chords = [
    ["Bb", 3, ["Bb", "Db", "F", "Ab", "C"]],
    ["Gb", 3, ["Gb", "Bb", "Db", "F", "C"]],
    ["Ab", 3, ["Ab", "Db", "Eb", "Gb", "Bb"]],
    ["F", 3, ["F", "A", "Eb", "Ab", "Db"]],
  ];
  const bassNotes = ["Bb", "Bb", "Db", "F", "Ab", "F", "Db", "Ab"];
  const hook = [hz("F", 4), hz("Ab", 4), hz("Bb", 4), hz("C", 5), hz("Db", 5), hz("C", 5), hz("Ab", 4), hz("F", 4)];
  for (let bar = 0; bar < bars; bar += 1) {
    const base = bar * 4 * beat;
    const chord = chords[bar % chords.length];
    for (let e = 0; e < 8; e += 1) {
      const t = base + e * beat * 0.5 + (e % 2 ? beat * 0.08 : 0);
      if ([0, 3, 5].includes(e)) hit(buf, t, { root: hz("Bb", 1), size: e === 0 ? 0.45 : 0.28 });
      if ([2, 6].includes(e)) {
        addNoise(buf, t, 0.09, { vol: 0.09, color: "high" });
        addTone(buf, t, 0.06, 180, { to: 130, vol: 0.065, type: "triangle" });
      }
      addNoise(buf, t, e % 2 ? 0.04 : 0.024, { vol: e % 2 ? 0.025 : 0.016, color: "high", pan: e % 2 ? 0.22 : -0.18 });
      if ([0, 2, 3, 5, 7].includes(e)) {
        const n = bassNotes[(bar + e) % bassNotes.length];
        addTone(buf, t, e === 0 ? 0.22 : 0.13, hz(n, 1), { vol: e === 0 ? 0.19 : 0.13, type: "saw", release: 0.08 });
        addTone(buf, t + 0.01, 0.08, hz(n, 2), { vol: 0.035, type: "triangle" });
      }
      if ([1, 3, 5, 7].includes(e)) {
        const note = chord[2][(e + bar) % chord[2].length];
        addTone(buf, t, 0.075, hz(note, 4), { vol: 0.04, type: "saw", pan: 0.3, release: 0.045 });
      }
      if ((bar % 4 === 0 || bar % 4 === 3) && [1, 2, 4, 6].includes(e)) {
        addTone(buf, t + 0.01, 0.16, hook[(bar + e) % hook.length], { vol: 0.055, type: "rhodes", pan: -0.18, vibrato: 0.002, release: 0.08 });
      }
    }
    if (bar % 2 === 0 || bar % 2 === 1) {
      chord[2].forEach((n, i) => {
        addTone(buf, base + (i * 0.012), 0.42, hz(n, i < 2 ? 3 : 4), { vol: i === 4 ? 0.055 : 0.042, type: "rhodes", pan: -0.22, release: 0.28 });
        addTone(buf, base + beat * 2 + (i * 0.012), 0.34, hz(n, i < 2 ? 3 : 4), { vol: i === 4 ? 0.045 : 0.035, type: "rhodes", pan: -0.18, release: 0.22 });
      });
    }
  }
  writeWav("bgm-normal.wav", buf, 0.88);
}

function makeOneShots() {
  const shots = {
    "button.wav": () => { const b = make(0.18); addTone(b, 0, 0.055, hz("F", 5), { to: hz("Bb", 5), vol: 0.12, type: "triangle" }); shine(b, 0.04, { count: 2, vol: 0.035 }); return b; },
    "swap.wav": () => { const b = make(0.2); addTone(b, 0, 0.07, hz("Db", 4), { to: hz("F", 4), vol: 0.12, type: "saw" }); addNoise(b, 0.025, 0.04, { vol: 0.035, color: "high" }); return b; },
    "drop.wav": () => { const b = make(0.26); hit(b, 0.02, { root: hz("F", 2), size: 0.45 }); addNoise(b, 0.04, 0.08, { vol: 0.035, color: "low" }); return b; },
    "error.wav": () => { const b = make(0.22); addTone(b, 0, 0.11, hz("F", 2), { to: hz("Db", 2), vol: 0.16, type: "saw" }); return b; },
    "match.wav": () => { const b = make(0.42); hit(b, 0, { root: hz("Bb", 2), size: 0.6 }); shine(b, 0.045, { count: 4, vol: 0.07 }); return b; },
    "cascade.wav": () => { const b = make(0.46); hit(b, 0, { root: hz("Db", 2), size: 0.7 }); shine(b, 0.045, { base: hz("Ab", 5), count: 5, vol: 0.075 }); return b; },
    "meter-gain.wav": () => { const b = make(0.38); riser(b, 0, 0.16, hz("Db", 4), hz("Ab", 5), { vol: 0.07, type: "triangle" }); shine(b, 0.12, { count: 3, vol: 0.06 }); return b; },
    "meter-ready.wav": () => { const b = make(0.72); riser(b, 0, 0.32, hz("Bb", 3), hz("F", 6), { vol: 0.12 }); hit(b, 0.28, { size: 0.85 }); shine(b, 0.34, { count: 6, vol: 0.07 }); return b; },
    "event-roll-start.wav": () => { const b = make(0.74); hit(b, 0, { size: 0.8 }); riser(b, 0.05, 0.34, hz("Bb", 2), hz("Db", 5), { vol: 0.11 }); shine(b, 0.26, { count: 3, vol: 0.05 }); return b; },
    "event-roll-tick.wav": () => { const b = make(0.13); addTone(b, 0, 0.04, hz("Db", 5), { vol: 0.12, type: "square" }); addNoise(b, 0.005, 0.025, { vol: 0.035, color: "high" }); return b; },
    "event-roll-lock.wav": () => { const b = make(0.48); hit(b, 0, { size: 0.9 }); shine(b, 0.11, { count: 4, vol: 0.06 }); return b; },
    "flame-scan.wav": () => { const b = make(0.5); riser(b, 0, 0.28, hz("F", 2), hz("Bb", 4), { vol: 0.12 }); addNoise(b, 0.06, 0.32, { vol: 0.065, color: "high" }); return b; },
    "flame-burn.wav": () => { const b = make(0.9); rumble(b, 0, 0.65, { vol: 0.22 }); riser(b, 0, 0.3, hz("Bb", 1), hz("F", 5), { vol: 0.13 }); hit(b, 0.24, { root: hz("F", 1), size: 1.25 }); addNoise(b, 0.1, 0.52, { vol: 0.12, color: "high" }); return b; },
    "flame-resist.wav": () => { const b = make(0.36); hit(b, 0, { root: hz("Ab", 1), size: 0.55 }); addNoise(b, 0.04, 0.16, { vol: 0.06, color: "high" }); return b; },
    "multiplier-collect.wav": () => { const b = make(0.55); riser(b, 0, 0.18, hz("Bb", 3), hz("Db", 5), { vol: 0.08 }); coinSpray(b, 0.12, { count: 5, vol: 0.08 }); hit(b, 0.2, { size: 0.65 }); return b; },
    "multiplier-high.wav": () => { const b = make(0.72); riser(b, 0, 0.28, hz("Bb", 2), hz("F", 6), { vol: 0.11 }); hit(b, 0.22, { size: 0.82 }); coinSpray(b, 0.28, { count: 8, vol: 0.09 }); return b; },
    "slot-full.wav": () => { const b = make(0.9); rumble(b, 0, 0.6, { vol: 0.16 }); hit(b, 0.1, { size: 1 }); riser(b, 0.16, 0.46, hz("Bb", 2), hz("F", 5), { vol: 0.1 }); shine(b, 0.48, { count: 6, vol: 0.08 }); return b; },
    "climax-intro.wav": () => { const b = make(1.45); rumble(b, 0, 1.25, { vol: 0.18 }); hit(b, 0.46, { size: 1.05 }); riser(b, 0.72, 0.45, hz("Bb", 1), hz("Db", 4), { vol: 0.11 }); return b; },
    "climax-lift.wav": () => { const b = make(1.45); rumble(b, 0, 1.0, { vol: 0.15 }); riser(b, 0, 1.0, hz("F", 1), hz("Bb", 3), { vol: 0.12 }); hit(b, 1.02, { size: 1.1 }); shine(b, 1.08, { count: 5, vol: 0.06 }); return b; },
    "logo-return.wav": () => { const b = make(0.42); hit(b, 0, { size: 0.55 }); shine(b, 0.08, { count: 3, vol: 0.04 }); return b; },
    "wheel-start.wav": () => { const b = make(1.0); rumble(b, 0, 0.9, { vol: 0.18 }); riser(b, 0.08, 0.58, hz("F", 2), hz("Db", 5), { vol: 0.1 }); hit(b, 0.55, { size: 1 }); return b; },
    "wheel-tick.wav": () => { const b = make(0.11); addTone(b, 0, 0.032, hz("Bb", 4), { vol: 0.12, type: "square" }); addNoise(b, 0.005, 0.02, { vol: 0.03, color: "high" }); return b; },
    "wheel-stop.wav": () => { const b = make(0.7); hit(b, 0, { size: 1.1 }); shine(b, 0.12, { count: 4, vol: 0.06 }); return b; },
    "wheel-high-stop.wav": () => { const b = make(0.95); hit(b, 0, { size: 1.35 }); riser(b, 0.05, 0.3, hz("Bb", 2), hz("F", 6), { vol: 0.12 }); shine(b, 0.2, { count: 8, vol: 0.08 }); coinSpray(b, 0.32, { count: 8, vol: 0.07 }); return b; },
    "win-big.wav": () => { const b = make(1.05); hit(b, 0, { size: 1.15 }); riser(b, 0.02, 0.34, hz("Bb", 2), hz("Db", 6), { vol: 0.12 }); voiceBark(b, 0.16, ["big", "win"], { vol: 0.13, base: hz("Bb", 2) }); coinSpray(b, 0.34, { count: 10, vol: 0.09 }); return b; },
    "win-super.wav": () => { const b = make(1.25); hit(b, 0, { size: 1.3 }); riser(b, 0.02, 0.42, hz("Bb", 2), hz("F", 6), { vol: 0.14 }); voiceBark(b, 0.14, ["mega", "win"], { vol: 0.145, base: hz("Db", 2), spacing: 0.22 }); coinSpray(b, 0.34, { count: 16, vol: 0.1 }); shine(b, 0.56, { count: 7, vol: 0.08 }); return b; },
    "win-jackpot.wav": () => { const b = make(1.5); hit(b, 0, { size: 1.5 }); riser(b, 0.0, 0.5, hz("F", 2), hz("F", 6), { vol: 0.16 }); voiceBark(b, 0.12, ["epic", "win"], { vol: 0.16, base: hz("F", 2), spacing: 0.24 }); coinSpray(b, 0.32, { count: 24, vol: 0.11, spacing: 0.032 }); shine(b, 0.66, { count: 8, vol: 0.09 }); return b; },
    "payout-loop.wav": () => { const b = make(1.2); coinSpray(b, 0, { count: 26, vol: 0.07, spacing: 0.043 }); addTone(b, 0, 1.2, hz("Bb", 2), { to: hz("F", 2), vol: 0.06, type: "sine", attack: 0.02, release: 0.2 }); return b; },
    "payout-snap.wav": () => { const b = make(0.55); hit(b, 0, { size: 1.25 }); coinSpray(b, 0.04, { count: 8, vol: 0.09, spacing: 0.026 }); shine(b, 0.14, { count: 5, vol: 0.06 }); return b; },
    "near-miss.wav": () => { const b = make(0.9); riser(b, 0, 0.52, hz("Bb", 1), hz("F", 3), { vol: 0.055, type: "saw" }); addTone(b, 0.12, 0.15, hz("Bb", 1), { to: hz("Ab", 1), vol: 0.08, type: "sine" }); addNoise(b, 0.2, 0.18, { vol: 0.028, color: "low" }); addTone(b, 0.52, 0.08, hz("Db", 4), { vol: 0.055, type: "triangle" }); return b; },
    "special-spawn.wav": () => { const b = make(0.52); riser(b, 0, 0.22, hz("F", 4), hz("Db", 6), { vol: 0.09 }); hit(b, 0.18, { size: 0.75 }); shine(b, 0.23, { count: 4, vol: 0.06 }); return b; },
    "special-blast.wav": () => { const b = make(0.65); hit(b, 0, { size: 1.05 }); riser(b, 0, 0.18, hz("Bb", 2), hz("F", 5), { vol: 0.1 }); shine(b, 0.2, { count: 5, vol: 0.06 }); return b; },
  };
  for (const [file, fn] of Object.entries(shots)) writeWav(file, fn());
}

makeBgm();
makeOneShots();
console.log(`Rendered audio assets to ${outDir}`);
