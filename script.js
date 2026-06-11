const ROWS = 9;
const COLS = 6;
const SLOT_COUNT = 3;
const MULTIPLIER_SIZE = 2;
const MULTIPLIER_SIZES = [1, 2];
const MULTIPLIER_COLS = [0, 2, 4];
const SYMBOL_VERSION = "event-energy-slot-scale";
const SLOT_TURN_MAX = 20;
const PERF_ENABLED = new URLSearchParams(window.location.search).has("perf");
const SPECIAL_METER_TARGET = 9;
const SPECIAL_METER_THRESHOLDS = [9, 21, 40];
const SPECIAL_METER_MAX = SPECIAL_METER_THRESHOLDS[SPECIAL_METER_THRESHOLDS.length - 1];
const AUDIO_MASTER_VOLUME = 0.9;
const AUDIO_SFX_VOLUME = 0.9;
const AUDIO_BGM_VOLUME = 0.48;
const AUDIO_LOWCUT_HZ = 38;
const AUDIO_SFX_PEAK_LIMIT = 0.34;
const AUDIO_BGM_PEAK_LIMIT = 0.072;
const AUDIO_MUSIC_DUCK_ATTACK = 0.045;
const AUDIO_MUSIC_DUCK_RELEASE = 0.42;
const AUDIO_CATEGORY_GAINS = {
  button: 0.68,
  movement: 0.68,
  match: 1.08,
  meter: 1.16,
  eventRoll: 1.24,
  coin: 1.18,
  multiplier: 1.28,
  transition: 1.34,
  payout: 1.42,
  special: 1.22,
  wheel: 1.32,
  nearMiss: 0.9,
  voice: 0.72,
  error: 0.62,
};
const MUSIC_BPM = 128;
const MUSIC_STEP_MS = 60000 / MUSIC_BPM / 2;
const MUSIC_SWING = 0.62;
const MUSIC_LOOP_STEPS = 128;
const BET_STEPS = [50, 100, 200, 300, 500, 1000];
const MOVE_PRESSURE_SOFT_LIMIT = 5;
const MOVE_PRESSURE_HARD_LIMIT = 3;
const RESCUE_FLAME_WEIGHT = 0.76;
const RESCUE_CASCADE_CHANCE_SOFT = 0.42;
const RESCUE_CASCADE_CHANCE_HARD = 0.84;
const CANDIES = ["red", "blue", "green", "orange", "purple"];
const MULTIPLIER_VALUES = [5, 10, 20, 30, 50, 100, 200];
const COLLECTION_SLOT_ITEM_WEIGHTS = [
  { kind: "candyClear", type: "red", weight: 5 },
  { kind: "candyClear", type: "blue", weight: 5 },
  { kind: "candyClear", type: "green", weight: 5 },
  { kind: "candyClear", type: "orange", weight: 5 },
  { kind: "candyClear", type: "purple", weight: 5 },
  { kind: "multiplier", value: 5, size: 1, weight: 20 },
  { kind: "multiplier", value: 10, size: 1, weight: 13.2 },
  { kind: "multiplier", value: 20, size: 1, weight: 2.4 },
  { kind: "multiplier", value: 30, size: 2, weight: 1 },
  { kind: "multiplier", value: 50, size: 2, weight: 0.25 },
  { kind: "multiplier", value: 100, size: 2, weight: 0.08 },
  { kind: "multiplier", value: 200, size: 2, weight: 0.02 },
  { kind: "flame", weight: 37.45 },
];
const STAGE_TWO_EVENT_WEIGHTS = [
  ...COLLECTION_SLOT_ITEM_WEIGHTS,
];
const STAGE_THREE_EVENT_WEIGHTS = [
  { kind: "multiplier", value: 20, size: 1, weight: 27 },
  { kind: "multiplier", value: 30, size: 2, weight: 22 },
  { kind: "multiplier", value: 50, size: 2, weight: 7 },
  { kind: "multiplier", value: 100, size: 2, weight: 1.5 },
  { kind: "multiplier", value: 200, size: 2, weight: 0.5 },
  { kind: "flame", weight: 42 },
];
const FLAME_PATTERN_WEIGHTS = [
  { kind: "col1", weight: 10 },
  { kind: "row1", weight: 10 },
  { kind: "cross1", weight: 30 },
  { kind: "col2", weight: 15 },
  { kind: "row2", weight: 15 },
  { kind: "cross2", weight: 20 },
];
const MULTIPLIER_VALUE_WEIGHTS = [
  { value: 5, weight: 28 },
  { value: 10, weight: 24 },
  { value: 20, weight: 22 },
  { value: 30, weight: 14 },
  { value: 50, weight: 8 },
  { value: 100, weight: 2 },
  { value: 200, weight: 2 },
];
const MULTIPLIER_SIZE_WEIGHTS = [
  { size: 1, weight: 50 },
  { size: 2, weight: 50 },
];
const INITIAL_MULTIPLIER_SIZE_WEIGHTS = [
  { size: 1, weight: 94 },
  { size: 2, weight: 6 },
];
const INITIAL_MULTIPLIER_VALUE_WEIGHTS_1X1 = [
  { value: 5, weight: 76 },
  { value: 10, weight: 20 },
  { value: 20, weight: 4 },
];
const INITIAL_MULTIPLIER_VALUE_WEIGHTS_2X2 = [
  { value: 30, weight: 97.5 },
  { value: 50, weight: 1.8 },
  { value: 100, weight: 0.45 },
  { value: 200, weight: 0.25 },
];
const MULTIPLIER_ANCHOR_ROW_WEIGHTS_1X1 = [
  { row: 0, weight: 20 },
  { row: 1, weight: 25 },
  { row: 2, weight: 25 },
  { row: 3, weight: 20 },
  { row: 4, weight: 4 },
  { row: 5, weight: 3 },
  { row: 6, weight: 2 },
  { row: 7, weight: 1 },
  { row: 8, weight: 0 },
];
const MULTIPLIER_ANCHOR_ROW_WEIGHTS_2X2 = [
  { row: 0, weight: 20 },
  { row: 1, weight: 25 },
  { row: 2, weight: 25 },
  { row: 3, weight: 20 },
  { row: 4, weight: 7 },
  { row: 5, weight: 3 },
  { row: 6, weight: 0 },
  { row: 7, weight: 0 },
];
const WIN_TIERS = [
  { ratio: 100, label: "LEGENDARY WIN", art: "legendary", sound: "jackpot", voice: "voiceLegendaryWin", className: "tier-legendary", duration: 3400, quick: 2800, particles: 96, countVolume: 0.105 },
  { ratio: 50, label: "EPIC WIN", art: "epic", sound: "jackpot", voice: "voiceEpicWin", className: "tier-epic", duration: 3000, quick: 2600, particles: 78, countVolume: 0.092 },
  { ratio: 30, label: "SUPER MEGA WIN", art: "super-mega", sound: "superWin", voice: "voiceSuperMegaWin", className: "tier-super", duration: 2700, quick: 2400, particles: 62, countVolume: 0.082 },
  { ratio: 20, label: "MEGA WIN", art: "mega", sound: "superWin", voice: "voiceMegaWin", className: "tier-mega", duration: 2300, quick: 2100, particles: 48, countVolume: 0.072 },
  { ratio: 5, label: "BIG WIN", art: "big", sound: "win", voice: "voiceBigWin", className: "tier-big", duration: 1850, quick: 1750, particles: 32, countVolume: 0.058 },
];
const EVENT_ROLL_STEPS = 5;
const EVENT_ROLL_TOTAL = 1398;
const EVENT_ROLL_TOTAL_FAST = 489;
const EVENT_ROLL_WEIGHTS = [0.72, 0.86, 1.02, 1.15, 1.25];
const EVENT_ROLL_EXTRA_MAX = 2;
const EVENT_ROLL_EXTRA_MS = 240;
const EVENT_ROLL_EXTRA_FAST_MS = 80;
const FULL_DROP_WHEEL_SPIN_MIN_MS = 5000;
const FULL_DROP_WHEEL_SPIN_MAX_MS = 7000;
const FULL_DROP_WHEEL_TURNS_MIN = 2;
const FULL_DROP_WHEEL_TURNS_MAX = 4;
const FULL_DROP_WHEEL_FALLBACK_POINTER_Y = 7.5;
const CLIMAX_IDLE_SLICE_MS = 1000;
const BGM_DUCK_IMPORTANT_MS = 1400;
const BGM_DUCK_LIGHT = 0.64;
const BGM_DUCK_MEDIUM = 0.42;
const BGM_DUCK_DEEP = 0.25;
const BGM_DUCK_PAYOUT = 0.18;
const DEFAULT_SOUND_PROFILE = { category: "movement", cooldown: 70, maxVoices: 1, attenuation: 0.5, release: 260, gain: 0.54 };
const FULL_DROP_WHEEL_PRIZES = [
  { label: "0.1x", multiplier: 0.1, weight: 26 },
  { label: "0.2x", multiplier: 0.2, weight: 26 },
  { label: "0.5x", multiplier: 0.5, weight: 31 },
  { label: "1x", multiplier: 1, weight: 9 },
  { label: "1.5x", multiplier: 1.5, weight: 3.5 },
  { label: "2x", multiplier: 2, weight: 2.2 },
  { label: "5x", multiplier: 5, weight: 1 },
  { label: "10x", multiplier: 10, weight: 0.45 },
  { label: "20x", multiplier: 20, weight: 0.25 },
  { label: "30x", multiplier: 30, weight: 0.1 },
  { label: "50x", multiplier: 50, weight: 0.05 },
  { label: "100x", multiplier: 100, weight: 0 },
];
const FULL_DROP_WHEEL_LABEL_ORDER = [
  { key: "x100", text: "x100", prizeLabel: "100x" },
  { key: "x0.1", text: "x0.1", prizeLabel: "0.1x" },
  { key: "x10-2", text: "x10", prizeLabel: "10x" },
  { key: "x1", text: "x1", prizeLabel: "1x" },
  { key: "x0.2", text: "x0.2", prizeLabel: "0.2x" },
  { key: "x20", text: "x20", prizeLabel: "20x" },
  { key: "x2", text: "x2", prizeLabel: "2x" },
  { key: "x5", text: "x5", prizeLabel: "5x" },
  { key: "x50", text: "x50", prizeLabel: "50x" },
  { key: "x1.5", text: "x1.5", prizeLabel: "1.5x" },
  { key: "x30", text: "x30", prizeLabel: "30x" },
  { key: "x10", text: "x10", prizeLabel: "10x" },
  { key: "x0.5", text: "x0.5", prizeLabel: "0.5x" },
];
const WHEEL_LABEL_TUNE = {
  cx: 50,
  cy: 50,
  radius: 35.5,
  angleOffset: -88.5,
  rotateOffset: 90,
  fontSize: 28,
  items: {
    x100: { angle: -2, radius: 0, rotate: 0, font: 2 },
    "x0.1": { angle: -1, radius: -4, rotate: 0, font: -7 },
    x5: { angle: 0, radius: -2, rotate: 0, font: -1 },
    "x0.5": { angle: -1, radius: -4, rotate: 0, font: -6 },
    x50: { angle: -0.5, radius: 0, rotate: 0, font: 2 },
    x10: { angle: -1, radius: 0, rotate: 0, font: 0 },
    x30: { angle: -1, radius: 0, rotate: 0, font: 2 },
    "x1.5": { angle: 0, radius: -4, rotate: 0, font: -7 },
    x2: { angle: -1.5, radius: -2, rotate: 0, font: -2 },
    x20: { angle: -2, radius: 0, rotate: 0, font: 0 },
    "x0.2": { angle: -2.5, radius: -4, rotate: 0, font: -7 },
    x1: { angle: -2, radius: -2, rotate: 0, font: -2 },
    "x10-2": { angle: -1.5, radius: 0, rotate: 0, font: 0 },
  },
};
const SOUND_PROFILES = {
  button: { category: "button", cooldown: 78, maxVoices: 1, attenuation: 0.55, release: 150, gain: 0.54 },
  move: { category: "movement", cooldown: 76, maxVoices: 1, attenuation: 0.5, release: 150, gain: 0.5 },
  error: { category: "error", cooldown: 180, maxVoices: 1, attenuation: 0.5, release: 240, gain: 0.54 },
  match: { category: "match", cooldown: 92, maxVoices: 2, attenuation: 0.5, release: 260, gain: 0.9 },
  cascade: { category: "match", cooldown: 112, maxVoices: 2, attenuation: 0.5, release: 280, gain: 0.9 },
  drop: { category: "movement", cooldown: 170, maxVoices: 1, attenuation: 0.6, release: 220, gain: 0.48 },
  meterTick: { category: "meter", cooldown: 95, maxVoices: 1, attenuation: 0.5, release: 260, gain: 0.86 },
  specialReady: { category: "meter", cooldown: 230, maxVoices: 1, attenuation: 0.5, release: 520, gain: 1 },
  specialSpawn: { category: "special", cooldown: 190, maxVoices: 1, attenuation: 0.55, release: 500, gain: 0.9 },
  specialBlast: { category: "special", cooldown: 280, maxVoices: 1, attenuation: 0.6, release: 560, gain: 0.62 },
  candyClearEvent: { category: "special", cooldown: 230, maxVoices: 1, attenuation: 0.55, release: 460, gain: 0.98 },
  flameSweep: { category: "special", cooldown: 210, maxVoices: 1, attenuation: 0.55, release: 340, gain: 0.82 },
  flameBurn: { category: "special", cooldown: 280, maxVoices: 1, attenuation: 0.65, release: 620, gain: 1 },
  flameResist: { category: "special", cooldown: 210, maxVoices: 1, attenuation: 0.55, release: 340, gain: 0.54 },
  multiplierMerge: { category: "multiplier", cooldown: 190, maxVoices: 1, attenuation: 0.5, release: 440, gain: 0.66 },
  multiplierHigh: { category: "multiplier", cooldown: 190, maxVoices: 1, attenuation: 0.55, release: 460, gain: 0.7 },
  multiplierCollect: { category: "coin", cooldown: 130, maxVoices: 2, attenuation: 0.45, release: 340, gain: 0.96 },
  multiplierCollectHigh: { category: "multiplier", cooldown: 165, maxVoices: 2, attenuation: 0.5, release: 460, gain: 1.02 },
  multiplierEpicCollect: { category: "multiplier", cooldown: 210, maxVoices: 1, attenuation: 0.58, release: 620, gain: 1.12 },
  multiplierJackpotCollect: { category: "multiplier", cooldown: 260, maxVoices: 1, attenuation: 0.62, release: 760, gain: 1.22 },
  slotProgress: { category: "eventRoll", cooldown: 150, maxVoices: 1, attenuation: 0.5, release: 260, gain: 1 },
  win: { category: "payout", cooldown: 300, maxVoices: 1, attenuation: 0.6, release: 920, gain: 1.1 },
  superWin: { category: "payout", cooldown: 420, maxVoices: 1, attenuation: 0.65, release: 1250, gain: 1.16 },
  jackpot: { category: "payout", cooldown: 560, maxVoices: 1, attenuation: 0.7, release: 1700, gain: 1 },
  voiceBigWin: { category: "voice", cooldown: 700, maxVoices: 1, attenuation: 0.4, release: 1200, gain: 0.7 },
  voiceMegaWin: { category: "voice", cooldown: 800, maxVoices: 1, attenuation: 0.4, release: 1300, gain: 0.74 },
  voiceSuperMegaWin: { category: "voice", cooldown: 900, maxVoices: 1, attenuation: 0.4, release: 1500, gain: 0.78 },
  voiceEpicWin: { category: "voice", cooldown: 900, maxVoices: 1, attenuation: 0.4, release: 1400, gain: 0.78 },
  voiceLegendaryWin: { category: "voice", cooldown: 1000, maxVoices: 1, attenuation: 0.4, release: 1700, gain: 0.82 },
  wheelSpin: { category: "wheel", cooldown: 58, maxVoices: 2, attenuation: 0.45, release: 90, gain: 0.94 },
  wheelStop: { category: "wheel", cooldown: 360, maxVoices: 1, attenuation: 0.55, release: 850, gain: 1.22 },
  climaxIntro: { category: "transition", cooldown: 900, maxVoices: 1, attenuation: 0.5, release: 1800, gain: 1.1 },
  climaxLift: { category: "transition", cooldown: 900, maxVoices: 1, attenuation: 0.5, release: 1800, gain: 1.14 },
  logoReturn: { category: "transition", cooldown: 500, maxVoices: 1, attenuation: 0.4, release: 760, gain: 0.68 },
};

const boardEl = document.getElementById("board");
const slotsEl = document.getElementById("slots");
const fxCanvas = document.getElementById("fxCanvas");
const perfPanel = document.getElementById("perfPanel");
const specialMeterTextEl = document.getElementById("specialMeterText");
const specialMeterFillEl = document.getElementById("specialMeterFill");
const specialMiniSlotEl = document.getElementById("specialMiniSlot");
const miniSlotIconEl = document.getElementById("miniSlotIcon");
const stageSlotsEl = document.getElementById("stageSlots");
const stageSlotEls = Array.from(document.querySelectorAll(".event-socket"));
const balanceEl = document.getElementById("balance");
const betEl = document.getElementById("bet");
const statusTextEl = document.getElementById("statusText");
const fastButton = document.getElementById("fastButton");
const menuButton = document.getElementById("menuButton");
const closeMenu = document.getElementById("closeMenu");
const menuPanel = document.getElementById("menuPanel");
const soundMenuButton = document.getElementById("soundMenuButton");
const specialOddsButton = document.getElementById("specialOddsButton");
const winOverlay = document.getElementById("winOverlay");
const winLabelEl = document.getElementById("winLabel");
const winTitleArtEl = document.getElementById("winTitleArt");
const winMultiplierEl = document.getElementById("winMultiplier");
const winAmountEl = document.getElementById("winAmount");
const climaxStageEl = document.getElementById("climaxStage");
const climaxWheelRotorEl = document.getElementById("climaxWheelRotor");
const climaxWheelLabelsEl = document.getElementById("climaxWheelLabels");
const climaxWheelHighlightEl = document.getElementById("climaxWheelHighlight");
const climaxCenterLineEl = document.getElementById("climaxCenterLine");

const state = {
  board: [],
  selected: null,
  clearing: new Set(),
  invalid: null,
  slotFlash: Array(SLOT_COUNT).fill(null),
  slotValues: Array(SLOT_COUNT).fill(null),
  slotSymbolValues: Array(SLOT_COUNT).fill(null),
  slotTurns: Array(SLOT_COUNT).fill(0),
  filledSlots: new Set(),
  multipliers: [],
  balance: 10000,
  betIndex: 1,
  currentWin: 0,
  lastWin: 0,
  resolving: false,
  fast: false,
  sound: true,
  specialOdds: false,
  audioContext: null,
  masterGain: null,
  sfxGain: null,
  bgmGain: null,
  mixGain: null,
  bassShelf: null,
  presenceDip: null,
  masterCompressor: null,
  lowCutFilter: null,
  limiter: null,
  musicTimer: null,
  musicStep: 0,
  musicDuckingUntil: 0,
  activeTones: 0,
  lastSoundAt: {},
  soundVoiceState: {},
  soundScope: null,
  climaxIdleFrame: null,
  climaxIdleLastAt: 0,
  climaxIdleLastTickIndex: null,
  fx: {
    context: null,
    dpr: 1,
    items: [],
    frame: null,
  },
  perf: {
    enabled: PERF_ENABLED,
    metrics: {},
    slowFrames: 0,
    longTasks: 0,
    lastFrame: 0,
    fps: 60,
    lastPanelUpdate: 0,
    resolveCount: 0,
    phase: "idle",
    phaseStarted: 0,
  },
  layoutDirty: true,
  layoutFrame: null,
  pointer: null,
  ignoreClick: false,
  specialMeter: 0,
  pendingSpecialAwards: [],
  miniSlotPreview: { kind: "candyClear", type: "purple" },
  stagePreviews: [],
  miniSlotRolling: false,
  rollingStage: null,
  miniSlotWin: false,
  eventPulse: false,
  boardRescueLevel: 0,
  sniperTarget: null,
  flameCells: new Set(),
  flameFinal: false,
  climaxWheelRotation: 0,
  climaxSpinning: false,
  climaxIntroPhase: null,
  pendingClimaxIntro: false,
  climaxLogoReturn: false,
};

function formatMoney(value, decimals = 0) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatBalance(value) {
  return formatMoney(value, 2);
}

function formatScore(value) {
  return formatMoney(Math.round(value || 0), 0);
}

function multiplierPayout(multiplierOrValue) {
  if (typeof multiplierOrValue === "number") return currentBet() * multiplierOrValue;
  return multiplierOrValue?.payout ?? currentBet() * (multiplierOrValue?.value || 0);
}

function multiplierDisplay(multiplierOrValue) {
  return formatScore(multiplierPayout(multiplierOrValue));
}

function recordPerf(name, duration) {
  if (!state.perf.enabled) return;
  const metric = state.perf.metrics[name] || { count: 0, total: 0, max: 0, slow: 0 };
  metric.count += 1;
  metric.total += duration;
  metric.max = Math.max(metric.max, duration);
  if (duration > 16.7) metric.slow += 1;
  state.perf.metrics[name] = metric;
  updatePerfPanel();
}

function measurePerf(name, fn) {
  if (!state.perf.enabled) return fn();
  const started = performance.now();
  const result = fn();
  recordPerf(name, performance.now() - started);
  return result;
}

function startPerfSpan(name) {
  if (!state.perf.enabled) return () => {};
  const started = performance.now();
  return () => recordPerf(name, performance.now() - started);
}

function setPerfPhase(phase) {
  if (!state.perf.enabled) return;
  state.perf.phase = phase;
  state.perf.phaseStarted = performance.now();
}

function setBoardBusy(isBusy) {
  document.querySelector(".phone")?.classList.toggle("board-busy", isBusy);
}

function setEventPulse(active) {
  state.eventPulse = active;
  document.querySelector(".phone")?.classList.toggle("event-pulse", active);
}

function updatePerfPanel(force = false) {
  if (!state.perf.enabled || !perfPanel) return;
  const now = performance.now();
  if (!force && now - state.perf.lastPanelUpdate < 420) return;
  state.perf.lastPanelUpdate = now;
  perfPanel.classList.remove("hidden");

  const rows = Object.entries(state.perf.metrics)
    .map(([name, metric]) => ({
      name,
      avg: metric.total / metric.count,
      max: metric.max,
      slow: metric.slow,
    }))
    .sort((a, b) => b.max - a.max)
    .slice(0, 10)
    .map((item) => `${item.name.padEnd(18)} avg ${item.avg.toFixed(1).padStart(5)}  max ${item.max.toFixed(1).padStart(5)}  slow ${item.slow}`);

  perfPanel.textContent = [
    `PERF MODE  fps ${state.perf.fps.toFixed(0)}  slowFrames ${state.perf.slowFrames}  longTasks ${state.perf.longTasks}`,
    ...rows,
  ].join("\n");
}

function initPerfMonitor() {
  if (!state.perf.enabled) return;
  perfPanel?.classList.remove("hidden");
  console.info("[Sweet Drop Riches] perf mode enabled. Use ?perf=1 to show the panel.");

  const tick = (now) => {
    if (state.perf.lastFrame) {
      const gap = now - state.perf.lastFrame;
      const fps = 1000 / Math.max(gap, 1);
      state.perf.fps = state.perf.fps * 0.88 + fps * 0.12;
      if (gap > 50) {
        state.perf.slowFrames += 1;
        recordPerf("frame.gap", gap);
        recordPerf(`frame.gap.${state.perf.phase || "idle"}`, gap);
      }
    }
    state.perf.lastFrame = now;
    updatePerfPanel();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          state.perf.longTasks += 1;
          recordPerf("browser.longtask", entry.duration);
        }
      });
      observer.observe({ entryTypes: ["longtask"] });
    } catch (error) {
      console.info("[Sweet Drop Riches] Long Task observer unavailable", error);
    }
  }
}

function currentBet() {
  return BET_STEPS[state.betIndex];
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function resolveDelay(slow, quick) {
  return state.fast ? quick : slow;
}

function eventRollDelay(index, fast = state.fast) {
  const total = fast ? EVENT_ROLL_TOTAL_FAST : EVENT_ROLL_TOTAL;
  const weightTotal = EVENT_ROLL_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
  if (index === EVENT_ROLL_STEPS - 1) {
    const used = EVENT_ROLL_WEIGHTS
      .slice(0, index)
      .reduce((sum, weight) => sum + Math.round((total * weight) / weightTotal), 0);
    return total - used;
  }
  return Math.round((total * EVENT_ROLL_WEIGHTS[index]) / weightTotal);
}

function eventRollDelays(extraSteps = 0, fast = state.fast) {
  const total = (fast ? EVENT_ROLL_TOTAL_FAST : EVENT_ROLL_TOTAL)
    + extraSteps * (fast ? EVENT_ROLL_EXTRA_FAST_MS : EVENT_ROLL_EXTRA_MS);
  const weights = Array.from({ length: EVENT_ROLL_STEPS + extraSteps }, (_, index) =>
    EVENT_ROLL_WEIGHTS[Math.min(index, EVENT_ROLL_WEIGHTS.length - 1)] * (1 + Math.max(0, index - EVENT_ROLL_STEPS + 1) * 0.18)
  );
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map((weight, index) => {
    if (index === weights.length - 1) {
      const used = weights
        .slice(0, index)
        .reduce((sum, item) => sum + Math.round((total * item) / weightTotal), 0);
      return total - used;
    }
    return Math.round((total * weight) / weightTotal);
  });
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(randomRange(min, max + 1));
}

function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function randomCandy(exclude = [], options = {}) {
  const pool = CANDIES.filter((type) => !exclude.includes(type));
  return { kind: "candy", type: randomItem(pool.length ? pool : CANDIES) };
}

function weightedMultiplier() {
  return { kind: "multiplier", value: weightedPick(MULTIPLIER_VALUE_WEIGHTS).value };
}

function weightedInitialMultiplier() {
  const size = weightedPick(INITIAL_MULTIPLIER_SIZE_WEIGHTS).size;
  const weights = size === 1 ? INITIAL_MULTIPLIER_VALUE_WEIGHTS_1X1 : INITIAL_MULTIPLIER_VALUE_WEIGHTS_2X2;
  return { kind: "multiplier", size, value: weightedPick(weights).value };
}

function multiplierTierClass(value) {
  if (value >= 200) return "tier-ultimate";
  if (value >= 100) return "tier-legend";
  if (value >= 50) return "tier-mega";
  if (value >= 30) return "tier-hot";
  if (value >= 20) return "tier-plus";
  if (value >= 10) return "tier-blue";
  return "tier-low";
}

function candyAsset(type) {
  return `assets/symbols/candy-${type}.png?v=${SYMBOL_VERSION}`;
}

function multiplierAsset(value) {
  if (value >= 200) return `assets/symbols/multiplier-relic-x200.png?v=${SYMBOL_VERSION}`;
  if (value >= 100) return `assets/symbols/multiplier-relic-x100.png?v=${SYMBOL_VERSION}`;
  if (value >= 50) return `assets/symbols/multiplier-relic-x50.png?v=${SYMBOL_VERSION}`;
  if (value >= 30) return `assets/symbols/multiplier-relic-x30.png?v=${SYMBOL_VERSION}`;
  if (value >= 20) return `assets/symbols/multiplier-relic-x20.png?v=${SYMBOL_VERSION}`;
  if (value >= 10) return `assets/symbols/multiplier-relic-x10.png?v=${SYMBOL_VERSION}`;
  return `assets/symbols/multiplier-relic-x5.png?v=${SYMBOL_VERSION}`;
}

function isGenericSpecial(special) {
  return special === "chocolate";
}

function isMatchableCandy(tile) {
  return tile?.kind === "candy" && !tile.special;
}

function isOrdinaryCandy(tile) {
  return tile?.kind === "candy" && !tile.special;
}

function isVisibleOrdinaryCandy(row, col) {
  return !multiplierAt(row, col) && isOrdinaryCandy(state.board[row]?.[col]);
}

function specialAsset(special, type) {
  if (special === "chocolate") {
    return `assets/symbols/special-chocolate.svg?v=${SYMBOL_VERSION}`;
  }
  if (special === "horizontal" || special === "vertical" || special === "bomb") {
    return `assets/symbols/special-${special}-${type}.png?v=${SYMBOL_VERSION}`;
  }
  return `assets/symbols/special-${special}.png?v=${SYMBOL_VERSION}`;
}

function winArtAsset(name) {
  return `assets/ui/wins/win-${name}.png?v=${SYMBOL_VERSION}`;
}

function allSymbolAssets() {
  const assets = [
    ...CANDIES.map(candyAsset),
    ...MULTIPLIER_VALUES.map(multiplierAsset),
    ...WIN_TIERS.map((tier) => winArtAsset(tier.art)),
    flameIconAsset(),
  ];
  return Array.from(new Set(assets));
}

function preloadSymbolAssets() {
  const done = startPerfSpan("assets.preload");
  const promises = allSymbolAssets().map((src) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    return (image.decode ? image.decode() : new Promise((resolve) => {
      image.onload = resolve;
      image.onerror = resolve;
    })).catch(() => {});
  });
  Promise.allSettled(promises).then(() => {
    done();
    if (state.perf.enabled) console.info("[Sweet Drop Riches] symbol assets preloaded", promises.length);
  });
}

function sniperIconAsset() {
  return `assets/ui/event-sniper.svg?v=${SYMBOL_VERSION}`;
}

function flameIconAsset() {
  return `assets/ui/event-flame.svg?v=${SYMBOL_VERSION}`;
}

function stageEventWeights(stageIndex) {
  if (stageIndex === 2) return STAGE_TWO_EVENT_WEIGHTS;
  if (stageIndex === 3) return STAGE_THREE_EVENT_WEIGHTS;
  return COLLECTION_SLOT_ITEM_WEIGHTS;
}

function currentSpecialStageIndex() {
  if (state.specialMeter >= SPECIAL_METER_THRESHOLDS[1]) return 3;
  if (state.specialMeter >= SPECIAL_METER_THRESHOLDS[0]) return 2;
  return 1;
}

function initialStagePreviews() {
  return SPECIAL_METER_THRESHOLDS.map((_, index) => randomBoardEvent(index + 1));
}

function randomBoardEvent(stageIndex = currentSpecialStageIndex()) {
  if (state.boardRescueLevel >= 2 && hasTwoByTwoMultiplier() && Math.random() < RESCUE_FLAME_WEIGHT) {
    return { kind: "flame" };
  }
  const item = weightedPick(stageEventWeights(stageIndex));
  if (item.kind === "candyClear") return { kind: item.kind, type: item.type };
  if (item.kind === "multiplier") return { kind: item.kind, value: item.value, size: item.size };
  return { kind: item.kind };
}

function eventPreviewAsset(event) {
  if (event.kind === "candyClear") return candyAsset(event.type || "red");
  if (event.kind === "multiplier") return multiplierAsset(event.value || 10);
  if (event.kind === "flame") return flameIconAsset();
  if (event.kind === "sniper") return sniperIconAsset();
  return candyAsset(event.type || "red");
}

function eventName(event) {
  if (event.kind === "candyClear") return `${event.type} 糖果`;
  if (event.kind === "multiplier") return `${multiplierDisplay(event)} 倍數糖`;
  if (event.kind === "flame") return "火焰槍";
  if (event.kind === "sniper") return "狙擊槍";
  return "巧克力糖";
}

function chocolateTile(type = randomItem(CANDIES), reward = false) {
  return {
    kind: "candy",
    type,
    special: "chocolate",
    _reward: reward,
  };
}

function cloneTile(tile) {
  return tile ? { ...tile } : null;
}

function cloneBoard(board) {
  return board.map((row) => row.map(cloneTile));
}

function cloneMultiplier(multiplier) {
  return { ...multiplier };
}

function multiplierSize(multiplier) {
  return MULTIPLIER_SIZES.includes(multiplier?.size) ? multiplier.size : MULTIPLIER_SIZE;
}

function multiplierCells(multiplier) {
  const cells = [];
  const size = multiplierSize(multiplier);
  for (let row = multiplier.row; row < multiplier.row + size; row += 1) {
    for (let col = multiplier.col; col < multiplier.col + size; col += 1) {
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) cells.push({ row, col });
    }
  }
  return cells;
}

function hasTwoByTwoMultiplier() {
  return state.multipliers.some((multiplier) => multiplierSize(multiplier) > 1);
}

function clearMultiplierFootprint(board, multiplier) {
  for (const cell of multiplierCells(multiplier)) {
    board[cell.row][cell.col] = null;
  }
}

function clearMultiplierFootprintsOnBoard(board, multipliers) {
  for (const multiplier of multipliers) {
    clearMultiplierFootprint(board, multiplier);
  }
}

function multiplierCellKeys(multiplier) {
  return multiplierCells(multiplier).map((cell) => `${cell.row},${cell.col}`);
}

function multiplierAt(row, col, multipliers = state.multipliers) {
  return multipliers.find((multiplier) =>
    row >= multiplier.row &&
    row < multiplier.row + multiplierSize(multiplier) &&
    col >= multiplier.col &&
    col < multiplier.col + multiplierSize(multiplier)
  ) || null;
}

function isMultiplierAnchor(row, col, multiplier) {
  return Boolean(multiplier && multiplier.row === row && multiplier.col === col);
}

function slotIndexFromMultiplier(multiplier) {
  return Math.max(0, Math.min(SLOT_COUNT - 1, Math.floor(multiplier.col / MULTIPLIER_SIZE)));
}

function reelIndexFromCol(col) {
  return Math.max(0, Math.min(SLOT_COUNT - 1, Math.floor(col / MULTIPLIER_SIZE)));
}

function multiplierColsForSize(size) {
  return size === 1 ? Array.from({ length: COLS }, (_, col) => col) : MULTIPLIER_COLS;
}

function randomMultiplierSize() {
  return weightedPick(MULTIPLIER_SIZE_WEIGHTS).size;
}

function multiplierSizeForValue(value, flags = {}) {
  return value >= 30 ? 2 : 1;
}

function multiplierAnchorRowWeights(size) {
  return size === 1 ? MULTIPLIER_ANCHOR_ROW_WEIGHTS_1X1 : MULTIPLIER_ANCHOR_ROW_WEIGHTS_2X2;
}

function occupiedMultiplierReels(multipliers = state.multipliers) {
  const reels = new Set();
  for (const multiplier of multipliers) reels.add(slotIndexFromMultiplier(multiplier));
  for (let col = 0; col < SLOT_COUNT; col += 1) {
    if (state.filledSlots.has(col) || state.slotValues[col]) reels.add(col);
  }
  return reels;
}

function multiplierSpawnOptions(size, multipliers = state.multipliers) {
  const allCols = multiplierColsForSize(size);
  const occupied = occupiedMultiplierReels(multipliers);
  const preferred = allCols.filter((col) => !occupied.has(reelIndexFromCol(col)));
  return { rowLimit: ROWS - size, cols: preferred.length ? preferred : allCols };
}

function canPlaceMultiplierAt(row, col, multipliers = state.multipliers, ignore = null, board = state.board, size = MULTIPLIER_SIZE) {
  if (row < 0 || row > ROWS - size || !multiplierColsForSize(size).includes(col) || col < 0 || col > COLS - size) return false;
  for (let r = row; r < row + size; r += 1) {
    for (let c = col; c < col + size; c += 1) {
      const tile = board?.[r]?.[c];
      if (tile && !isOrdinaryCandy(tile)) return false;
    }
  }
  return !multipliers.some((multiplier) => {
    if (ignore && multiplier.id === ignore.id) return false;
    const otherSize = multiplierSize(multiplier);
    return !(
      col + size - 1 < multiplier.col ||
      multiplier.col + otherSize - 1 < col ||
      row + size - 1 < multiplier.row ||
      multiplier.row + otherSize - 1 < row
    );
  });
}

function createMultiplier(value, row, col, flags = {}) {
  const size = multiplierSizeForValue(value, flags);
  const payout = flags.payout ?? currentBet() * value;
  return {
    id: `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    kind: "multiplier",
    value,
    payout,
    row,
    col,
    ...flags,
    size,
  };
}

function makeCandyBoard() {
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const exclude = [];
      if (col >= 2 && board[row][col - 1]?.type === board[row][col - 2]?.type) {
        exclude.push(board[row][col - 1].type);
      }
      if (row >= 2 && board[row - 1][col]?.type === board[row - 2][col]?.type) {
        exclude.push(board[row - 1][col].type);
      }
      board[row][col] = randomCandy(exclude);
    }
  }

  return board;
}

function addMultipliers(board) {
  if (state.specialOdds) return addSpecialOddsMultipliers(board);

  const count = Math.random() < 0.65 ? 2 : 3;
  const multipliers = [];

  while (multipliers.length < count) {
    const picked = weightedInitialMultiplier();
    const value = picked.value;
    const size = picked.size;
    const point = pickMultiplierSpawnCell(board, (cell) => canPlaceMultiplierAt(cell.row, cell.col, multipliers, null, board, size), size);
    if (!point) break;
    const multiplier = createMultiplier(value, point.row, point.col, { size });
    multipliers.push(multiplier);
    clearMultiplierFootprint(board, multiplier);
  }

  return multipliers;
}

function addSpecialOddsMultipliers(board) {
  const anchors = [
    { row: ROWS - 2, col: 0 },
    { row: ROWS - 2, col: 2 },
    { row: ROWS - 2, col: 4 },
  ];
  const multipliers = [];

  for (const point of anchors) {
    const value = weightedPick(INITIAL_MULTIPLIER_VALUE_WEIGHTS_2X2).value;
    const multiplier = createMultiplier(value, point.row, point.col, { size: 2 });
    multipliers.push(multiplier);
    clearMultiplierFootprint(board, multiplier);
  }

  return multipliers;
}

function pickMultiplierSpawnCell(board, predicate = () => true, size = MULTIPLIER_SIZE, multipliers = state.multipliers) {
  const options = multiplierSpawnOptions(size, multipliers);
  const rowOrder = multiplierAnchorRowWeights(size)
    .filter((item) => item.row <= options.rowLimit)
    .map((item) => ({ ...item }));
  while (rowOrder.length) {
    const picked = weightedPick(rowOrder);
    const row = picked.row;
    const cells = [];
    for (const col of options.cols) {
      const cell = { row, col };
      if (predicate(cell, board[row][col])) cells.push(cell);
    }
    if (cells.length) return randomItem(cells);
    rowOrder.splice(rowOrder.indexOf(picked), 1);
  }
  return null;
}

function buildBoard() {
  let board;
  let multipliers = [];
  let attempts = 0;

  do {
    board = makeCandyBoard();
    multipliers = addMultipliers(board);
    attempts += 1;
  } while ((!hasLegalMove(board, multipliers) || findMatches(board, multipliers).cells.size > 0) && attempts < 120);

  if (!hasLegalMove(board, multipliers) || findMatches(board, multipliers).cells.size > 0) {
    forcePlayablePattern(board);
  }

  clearMultiplierFootprintsOnBoard(board, multipliers);
  return { board, multipliers };
}

function forcePlayablePattern(board) {
  const pattern = [
    ["red", "blue", "red"],
    ["green", "red", "green"],
    ["blue", "green", "blue"],
  ];

  for (let row = 0; row < pattern.length; row += 1) {
    for (let col = 0; col < pattern[row].length; col += 1) {
      board[row][col] = { kind: "candy", type: pattern[row][col] };
    }
  }
}

function startNewBoard(keepScore = false) {
  const next = buildBoard();
  state.board = next.board;
  state.multipliers = next.multipliers;
  state.selected = null;
  state.clearing = new Set();
  state.invalid = null;
  state.slotFlash = Array(SLOT_COUNT).fill(null);
  state.slotValues = Array(SLOT_COUNT).fill(null);
  state.slotSymbolValues = Array(SLOT_COUNT).fill(null);
  state.slotTurns = Array(SLOT_COUNT).fill(0);
  state.filledSlots = new Set();
  state.specialMeter = 0;
  state.pendingSpecialAwards = [];
  state.stagePreviews = initialStagePreviews();
  state.miniSlotRolling = false;
  state.rollingStage = null;
  state.miniSlotWin = false;
  state.resolving = false;
  state.climaxIntroPhase = null;
  state.pendingClimaxIntro = false;
  state.climaxLogoReturn = false;
  if (!keepScore) {
    state.currentWin = 0;
    state.lastWin = 0;
  }
  setStatus("一般盤面已刷新");
  render();
}

function tileLabel(tile) {
  if (!tile) return "空格";
  if (tile.kind === "multiplier") return `${multiplierDisplay(tile)} 倍數糖`;
  if (tile.special === "horizontal") return `${tile.type} 橫向糖`;
  if (tile.special === "vertical") return `${tile.type} 直向糖`;
  if (tile.special === "bomb") return `${tile.type} 炸彈糖`;
  if (tile.special === "fish") return "魚糖";
  if (tile.special === "colorbomb") return "巧顆粒糖";
  return `${tile.type} 糖果`;
}

function tileSignature(tile) {
  if (!tile) return "empty";
  if (tile.kind === "multiplier") return `m:${tile.value}:${multiplierPayout(tile)}`;
  return `c:${tile.type}:${tile.special || "normal"}`;
}

function tileMarkup(tile) {
  if (!tile) return "";
  if (tile.kind === "candy") {
    const asset = tile.special ? specialAsset(tile.special, tile.type) : candyAsset(tile.type);
    const imageClass = tile.special ? "special-img" : "candy-img";
    return `<img class="symbol-img ${imageClass}" src="${asset}" alt="">`;
  }
  if (tile.kind === "multiplier") {
    return `
      <div class="multiplier-symbol" aria-hidden="true">
        <span class="multiplier-halo"></span>
        <img class="multiplier-art" src="${multiplierAsset(tile.value)}" alt="">
        <span class="multiplier-mark score-length-${Math.min(6, multiplierDisplay(tile).replace(/[^0-9]/g, "").length)}">${multiplierDisplay(tile)}</span>
        <span class="multiplier-glint"></span>
      </div>
    `;
  }
  return "";
}

function ensureBoardButtons() {
  const expected = ROWS * COLS;
  if (boardEl.children.length === expected) return;
  boardEl.innerHTML = "";
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tile";
      button.dataset.row = row;
      button.dataset.col = col;
      boardEl.appendChild(button);
    }
  }
}

function renderBoard() {
  ensureBoardButtons();

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const coveredMultiplier = multiplierAt(row, col);
      const anchorMultiplier = isMultiplierAnchor(row, col, coveredMultiplier) ? coveredMultiplier : null;
      const tile = anchorMultiplier || state.board[row][col];
      const button = boardEl.children[row * COLS + col];
      const key = `${row},${col}`;
      const classes = ["tile"];

      button.style.setProperty("grid-column", `${col + 1}`);
      button.style.setProperty("grid-row", `${row + 1}`);
      button.style.removeProperty("z-index");

      if (state.selected?.row === row && state.selected?.col === col) {
        classes.push("selected");
      }
      if (state.clearing.has(key)) {
        classes.push("clearing");
      }
      if (tile?._fall) {
        classes.push("falling");
        button.style.setProperty("--fall-y", `-${tile._fall * 118}%`);
        button.style.setProperty("--fall-delay", `${Math.min(140, col * 22 + tile._fall * 12)}ms`);
      } else {
        button.style.removeProperty("--fall-y");
        button.style.removeProperty("--fall-delay");
      }
      if (tile?._merged) {
        classes.push("merged");
      }
      if (tile?._reward) {
        classes.push("reward-drop");
      }
      if (tile?._eventTransform) {
        classes.push("event-transform");
      }
      if (tile?._spawn) {
        classes.push("special-spawn");
      }
      if (state.invalid === key) {
        classes.push("invalid");
      }
      const flameOnCell =
        state.flameCells?.has(key) ||
        (coveredMultiplier && multiplierCells(coveredMultiplier).some((cell) => state.flameCells?.has(`${cell.row},${cell.col}`)));
      if (flameOnCell) {
        classes.push(state.flameFinal ? "flame-final" : "flame-warning");
      }

      if (coveredMultiplier && !anchorMultiplier) {
        classes.push("multiplier-covered");
      } else if (tile?.kind === "candy") {
        classes.push("candy", `candy-${tile.type}`);
        if (tile.special) classes.push("special-candy", `special-${tile.special}`);
      } else if (tile?.kind === "multiplier") {
        classes.push("multiplier", "multiplier-anchor", `value-${tile.value}`, multiplierTierClass(tile.value));
        classes.push(`multiplier-size-${multiplierSize(tile)}`);
        if (tile.col === 0) classes.push("edge-left");
        if (tile.col + multiplierSize(tile) >= COLS) classes.push("edge-right");
        if (tile.row + multiplierSize(tile) >= ROWS) classes.push("edge-bottom");
        if (tile._flameResist) classes.push("flame-resisted");
        button.style.setProperty("grid-column", `${tile.col + 1} / span ${multiplierSize(tile)}`);
        button.style.setProperty("grid-row", `${tile.row + 1} / span ${multiplierSize(tile)}`);
        button.style.setProperty("z-index", tile._reward || tile._eventTransform ? "24" : "8");
      }

      const signature = coveredMultiplier && !anchorMultiplier ? `covered:${coveredMultiplier.id}` : tileSignature(tile);
      if (button.dataset.signature !== signature) {
        button.innerHTML = coveredMultiplier && !anchorMultiplier ? "" : tileMarkup(tile);
        button.dataset.signature = signature;
      }
      button.className = classes.join(" ");
      button.disabled = state.resolving || Boolean(coveredMultiplier && multiplierSize(coveredMultiplier) !== 1);
      button.setAttribute("aria-label", tileLabel(coveredMultiplier || tile));
    }
  }
}

function renderSlots() {
  slotsEl.innerHTML = "";
  let hasFlash = false;

  for (let col = 0; col < SLOT_COUNT; col += 1) {
    const slot = document.createElement("div");
    const value = state.slotValues[col] || state.slotFlash[col];
    const scoreLength = formatScore(value).replace(/[^0-9]/g, "").length;
    const turns = Math.max(0, Math.min(SLOT_TURN_MAX, state.slotTurns[col] || 0));
    slot.className = "slot";
    if (state.slotFlash[col]) {
      hasFlash = true;
      slot.classList.add("flash");
    }
    if (state.filledSlots.has(col)) slot.classList.add("filled");
    if ((state.slotSymbolValues[col] || 0) >= 50) slot.classList.add("jackpot-slot");
    if (value) slot.classList.add(`score-length-${Math.min(6, scoreLength)}`);
    slot.style.setProperty("--slot-turns", String(turns));
    slot.innerHTML = `
      ${slotCountdownMarkup(turns, col)}
      ${
        value
          ? `<div class="slot-symbol">
              <img src="${multiplierAsset(state.slotSymbolValues[col] || 5)}" alt="">
              <strong>${formatScore(value)}</strong>
            </div>`
          : `<div class="slot-guide-arrow" aria-hidden="true"></div>`
      }
    `;
    slotsEl.appendChild(slot);
  }

  if (hasFlash) state.slotFlash = Array(SLOT_COUNT).fill(null);
}

function isMultiplierClimaxActive() {
  return state.filledSlots.size > 0 || state.climaxSpinning || Boolean(state.climaxIntroPhase);
}

function wheelLabelIndexByKey(key) {
  return FULL_DROP_WHEEL_LABEL_ORDER.findIndex((item) => item.key === key);
}

function wheelLabelIndexByPrize(label) {
  const index = FULL_DROP_WHEEL_LABEL_ORDER.findIndex((item) => item.prizeLabel === label);
  return index >= 0 ? index : 0;
}

function wheelPrizeByLabel(label) {
  return FULL_DROP_WHEEL_PRIZES.find((item) => item.label === label);
}

function isWheelHighNearMiss(prizeIndex, prize) {
  if (!prize || prize.multiplier >= 5) return false;
  const count = FULL_DROP_WHEEL_LABEL_ORDER.length;
  return [-1, 1].some((offset) => {
    const neighbor = FULL_DROP_WHEEL_LABEL_ORDER[(prizeIndex + offset + count) % count];
    return (wheelPrizeByLabel(neighbor?.prizeLabel)?.multiplier || 0) >= 5;
  });
}

function wheelLabelSliceAngle() {
  return 360 / FULL_DROP_WHEEL_LABEL_ORDER.length;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function climaxMaskPoints(phoneEl) {
  const raw = getComputedStyle(phoneEl).getPropertyValue("--climax-mask-path").trim();
  const points = [];
  const pattern = /(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/g;
  let match = pattern.exec(raw);
  while (match) {
    points.push({ x: parseFloat(match[1]), y: parseFloat(match[2]) });
    match = pattern.exec(raw);
  }
  return points;
}

function climaxPointerYPercent(phoneEl, linePercent) {
  const points = climaxMaskPoints(phoneEl);
  if (points.length < 3) return FULL_DROP_WHEEL_FALLBACK_POINTER_Y;

  const ys = [];
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    const minX = Math.min(point.x, next.x);
    const maxX = Math.max(point.x, next.x);
    if (linePercent < minX || linePercent > maxX) return;
    if (point.x === next.x) {
      if (Math.abs(linePercent - point.x) < 0.001) ys.push(point.y, next.y);
      return;
    }
    const t = (linePercent - point.x) / (next.x - point.x);
    if (t >= 0 && t <= 1) ys.push(point.y + (next.y - point.y) * t);
  });

  if (!ys.length) return FULL_DROP_WHEEL_FALLBACK_POINTER_Y;
  return Math.max(0, Math.min(100, Math.min(...ys) + 1.4));
}

function climaxPointerAngle() {
  const phoneEl = document.querySelector(".phone");
  const phoneRect = phoneEl?.getBoundingClientRect();
  const wheelRect = climaxWheelRotorEl?.getBoundingClientRect();
  if (!phoneEl || !phoneRect || !wheelRect) return 0;

  const linePercent = parseFloat(getComputedStyle(phoneEl).getPropertyValue("--climax-center-line-x")) || 50;
  const pointerY = climaxPointerYPercent(phoneEl, linePercent);
  const px = phoneRect.left + phoneRect.width * (linePercent / 100);
  const py = phoneRect.top + phoneRect.height * (pointerY / 100);
  const wx = wheelRect.left + wheelRect.width * 0.5;
  const wy = wheelRect.top + wheelRect.height * 0.5;
  return normalizeAngle((Math.atan2(py - wy, px - wx) * 180) / Math.PI + 90);
}

function wheelEdgeLandingOffset(sliceAngle, multiplier) {
  const isMajor = multiplier >= 20;
  const edgePadding = sliceAngle * (isMajor ? 0.16 : 0.12);
  const edgeBand = sliceAngle * (isMajor ? 0.14 : 0.18);
  const side = Math.random() < 0.5 ? -1 : 1;
  return side * (sliceAngle * 0.5 - edgePadding - Math.random() * edgeBand);
}

function wheelLandingAngle(prizeIndex, sliceAngle, multiplier) {
  return normalizeAngle(prizeIndex * sliceAngle + sliceAngle * 0.5 + wheelEdgeLandingOffset(sliceAngle, multiplier));
}

function wheelRotationDeltaToLand(landingAngle, pointerAngle, turns) {
  const desiredRotation = normalizeAngle(pointerAngle - landingAngle);
  const currentRotation = normalizeAngle(state.climaxWheelRotation || 0);
  return 360 * turns + normalizeAngle(desiredRotation - currentRotation);
}

function currentClimaxHighlightIndex(sliceAngle = wheelLabelSliceAngle()) {
  return Math.floor(normalizeAngle(climaxPointerAngle() - state.climaxWheelRotation) / sliceAngle) % FULL_DROP_WHEEL_LABEL_ORDER.length;
}

function stopClimaxIdleSpin() {
  if (state.climaxIdleFrame) cancelAnimationFrame(state.climaxIdleFrame);
  state.climaxIdleFrame = null;
  state.climaxIdleLastAt = 0;
  state.climaxIdleLastTickIndex = null;
}

function startClimaxIdleSpin() {
  if (state.climaxIdleFrame || state.climaxSpinning || !isMultiplierClimaxActive()) return;
  const sliceAngle = wheelLabelSliceAngle();
  const degreesPerMs = sliceAngle / CLIMAX_IDLE_SLICE_MS;
  const pointerAngle = climaxPointerAngle();

  const tick = (now) => {
    if (!isMultiplierClimaxActive() || state.climaxSpinning || document.hidden) {
      stopClimaxIdleSpin();
      return;
    }
    if (!state.climaxIdleLastAt) state.climaxIdleLastAt = now;
    const delta = Math.min(34, now - state.climaxIdleLastAt);
    state.climaxIdleLastAt = now;
    state.climaxWheelRotation += delta * degreesPerMs;
    if (climaxWheelRotorEl) {
      climaxWheelRotorEl.style.setProperty("--wheel-rotation", `${state.climaxWheelRotation || 0}deg`);
    }
    if (climaxWheelHighlightEl) {
      const index = Math.floor(normalizeAngle(pointerAngle - state.climaxWheelRotation) / sliceAngle) % FULL_DROP_WHEEL_LABEL_ORDER.length;
      climaxWheelHighlightEl.style.setProperty("--highlight-angle", `${index * sliceAngle + sliceAngle * 0.5}deg`);
      if (state.climaxIntroPhase === "wheel" && index !== state.climaxIdleLastTickIndex) {
        playSound("wheelSpin");
      }
      state.climaxIdleLastTickIndex = index;
    }
    state.climaxIdleFrame = requestAnimationFrame(tick);
  };

  state.climaxIdleFrame = requestAnimationFrame(tick);
}

function createWheelSpinProfile() {
  const duration = randomInt(FULL_DROP_WHEEL_SPIN_MIN_MS, FULL_DROP_WHEEL_SPIN_MAX_MS);
  const turns = randomInt(FULL_DROP_WHEEL_TURNS_MIN, FULL_DROP_WHEEL_TURNS_MAX);
  return {
    duration,
    turns,
    accelPower: randomRange(2.1, 2.8),
    decelPower: randomRange(2.4, 3.4),
  };
}

function wheelSpinProgress(t, profile) {
  const start = t ** profile.accelPower;
  const end = (1 - t) ** profile.decelPower;
  return clamp(start / (start + end), 0, 1);
}

function animateClimaxWheel(finalRotation, profile) {
  return new Promise((resolve) => {
    stopClimaxIdleSpin();
    const started = performance.now();
    const startRotation = state.climaxWheelRotation || 0;
    const sliceAngle = wheelLabelSliceAngle();
    let lastHighlightIndex = currentClimaxHighlightIndex(sliceAngle);
    let lastTickAt = 0;
    const previousTransition = climaxWheelRotorEl?.style.transition || "";
    if (climaxWheelRotorEl) climaxWheelRotorEl.style.transition = "none";

    const tick = (now) => {
      const progress = clamp((now - started) / profile.duration, 0, 1);
      state.climaxWheelRotation = startRotation + finalRotation * wheelSpinProgress(progress, profile);
      renderClimaxStage();

      const highlightIndex = currentClimaxHighlightIndex(sliceAngle);
      if (highlightIndex !== lastHighlightIndex && now - lastTickAt > 42) {
        playSound("wheelSpin");
        lastHighlightIndex = highlightIndex;
        lastTickAt = now;
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
        return;
      }

      state.climaxWheelRotation = startRotation + finalRotation;
      renderClimaxStage();
      if (climaxWheelRotorEl) climaxWheelRotorEl.style.transition = previousTransition;
      resolve();
    };

    requestAnimationFrame(tick);
  });
}

function renderClimaxStage() {
  if (!climaxStageEl) return;
  const active = isMultiplierClimaxActive();
  climaxStageEl.setAttribute("aria-hidden", String(!active));
  if (!active || state.climaxSpinning) stopClimaxIdleSpin();
  if (climaxWheelRotorEl) {
    climaxWheelRotorEl.style.setProperty("--wheel-rotation", `${state.climaxWheelRotation || 0}deg`);
  }
  if (climaxWheelLabelsEl && !climaxWheelLabelsEl.childElementCount) {
    const sliceAngle = wheelLabelSliceAngle();
    climaxWheelLabelsEl.innerHTML = FULL_DROP_WHEEL_LABEL_ORDER.map(({ key, text }, index) => {
      const angle = WHEEL_LABEL_TUNE.angleOffset + index * sliceAngle + sliceAngle * 0.5;
      const item = WHEEL_LABEL_TUNE.items[key] || {};
      const finalAngle = angle + (item.angle || 0);
      const finalRadius = WHEEL_LABEL_TUNE.radius + (item.radius || 0);
      const radians = (finalAngle * Math.PI) / 180;
      const x = WHEEL_LABEL_TUNE.cx + Math.cos(radians) * finalRadius;
      const y = WHEEL_LABEL_TUNE.cy + Math.sin(radians) * finalRadius;
      const rotate = finalAngle + WHEEL_LABEL_TUNE.rotateOffset + (item.rotate || 0);
      const fontSize = WHEEL_LABEL_TUNE.fontSize + (item.font || 0);
      const digits = text.replace(/[^0-9]/g, "").length;
      return `<button type="button" class="climax-wheel-label score-length-${Math.min(4, digits)}" data-label="${key}" style="--label-x:${x}%; --label-y:${y}%; --label-rotate:${rotate}deg; --label-font:${fontSize}px">${text}</button>`;
    }).join("");
  }
  if (climaxWheelHighlightEl) {
    const sliceAngle = wheelLabelSliceAngle();
    const index = currentClimaxHighlightIndex(sliceAngle);
    climaxWheelHighlightEl.style.setProperty("--highlight-angle", `${index * sliceAngle + sliceAngle * 0.5}deg`);
  }
  if (active && !state.climaxSpinning) startClimaxIdleSpin();
}

function render() {
  measurePerf("render.board", renderBoard);
  measurePerf("render.slots", renderSlots);
  measurePerf("render.hud", renderHud);
  measurePerf("render.climax", renderClimaxStage);
  scheduleBoardSizeSync();
}

function slotRingPoint(angleDeg, rx = 82, ry = 43, cx = 92, cy = 49) {
  const angle = (angleDeg * Math.PI) / 180;
  return {
    x: cx + rx * Math.cos(angle),
    y: cy + ry * Math.sin(angle),
  };
}

function slotRingPath(startAngle, sweepAngle) {
  const start = slotRingPoint(startAngle);
  const end = slotRingPoint(startAngle + sweepAngle);
  const largeArc = sweepAngle > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A 82 43 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

function slotCountdownMarkup(turns, col) {
  const maskId = `slot-ring-mask-${col}`;
  const filterId = `slot-ring-glow-${col}`;
  const segmentAngle = 360 / SLOT_TURN_MAX;
  const segmentGap = Math.min(6, segmentAngle * 0.34);
  const segmentSweep = Math.max(6, segmentAngle - segmentGap);
  const segments = Array.from({ length: SLOT_TURN_MAX }, (_, index) => {
    const start = -90 + index * segmentAngle + segmentGap / 2;
    const path = slotRingPath(start, segmentSweep);
    const stateClass = index < turns ? "on" : "off";
    return `<path class="ring-segment ${stateClass}" d="${path}" pathLength="1"></path>`;
  }).join("");

  return `
    <svg class="slot-countdown" viewBox="0 0 184 98" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="${filterId}" x="-18%" y="-24%" width="136%" height="148%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.35" result="blur"></feGaussianBlur>
          <feMerge>
            <feMergeNode in="blur"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
        <mask id="${maskId}">
          <rect width="184" height="98" fill="black"></rect>
          <ellipse cx="92" cy="49" rx="86" ry="45" fill="none" stroke="white" stroke-width="15" stroke-linecap="round"></ellipse>
        </mask>
      </defs>
      <g class="ring-track" mask="url(#${maskId})">
        ${segments}
      </g>
      <g class="ring-glow" mask="url(#${maskId})" filter="url(#${filterId})">
        ${segments}
      </g>
    </svg>
  `;
}

function scheduleBoardSizeSync(force = false) {
  if (!force && !state.layoutDirty) return;
  state.layoutDirty = true;
  if (state.layoutFrame) return;
  state.layoutFrame = requestAnimationFrame(() => {
    state.layoutFrame = null;
    if (!state.layoutDirty) return;
    state.layoutDirty = false;
    measurePerf("layout.sync", syncBoardSize);
  });
}

function syncBoardSize() {
  const phone = document.querySelector(".phone");
  if (!phone) return;

  boardEl.style.removeProperty("height");
  const boardRect = boardEl.getBoundingClientRect();
  if (boardRect.width > 0) {
    phone.style.setProperty("--board-width", `${Math.round(boardRect.width)}px`);
  }
  resizeFxCanvas();
}

function highestMultiplier() {
  let high = 0;
  for (const tile of state.multipliers) {
    high = Math.max(high, tile.value);
  }
  return high;
}

function setStatus(text) {
  statusTextEl.textContent = text;
}

function isAdjacent(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

function swap(board, a, b) {
  const next = board[a.row][a.col];
  board[a.row][a.col] = board[b.row][b.col];
  board[b.row][b.col] = next;
}

function canInteractWithPoint(point) {
  const multiplier = multiplierAt(point.row, point.col);
  return !multiplier || multiplierSize(multiplier) === 1;
}

function hasEnoughBalanceForMove() {
  return state.balance >= currentBet();
}

function showInsufficientBalance() {
  state.selected = null;
  setStatus("餘額不足");
  triggerScreenFx("fx-pop", 260);
  playSound("error");
  render();
}

function tickCollectedSlotTurns() {
  for (let col = 0; col < SLOT_COUNT; col += 1) {
    if (!state.filledSlots.has(col)) continue;
    state.slotTurns[col] = Math.max(0, (state.slotTurns[col] || SLOT_TURN_MAX) - 1);
    if (state.slotTurns[col] === 0) clearCollectedSlot(col);
  }
}

function clearCollectedSlot(col) {
  state.filledSlots.delete(col);
  state.slotValues[col] = null;
  state.slotSymbolValues[col] = null;
  state.slotFlash[col] = null;
  state.slotTurns[col] = 0;
}

function collectSlotMultiplier(col, value, payout = currentBet() * value) {
  const currentValue = state.slotValues[col] || 0;
  const nextValue = currentValue + payout;
  state.slotValues[col] = nextValue;
  state.slotSymbolValues[col] = value;
  state.slotFlash[col] = nextValue;
  state.slotTurns[col] = SLOT_TURN_MAX;
  state.filledSlots.add(col);
}

function multiplierSwapContext(from, to) {
  const fromMultiplier = multiplierAt(from.row, from.col);
  const toMultiplier = multiplierAt(to.row, to.col);
  if (!fromMultiplier && !toMultiplier) return null;
  if (fromMultiplier && toMultiplier) return null;

  const multiplier = fromMultiplier || toMultiplier;
  if (multiplierSize(multiplier) !== 1) return null;

  const multiplierPoint = fromMultiplier ? from : to;
  const candyPoint = fromMultiplier ? to : from;
  if (!isOrdinaryCandy(state.board[candyPoint.row][candyPoint.col])) return null;
  return { multiplier, multiplierPoint, candyPoint };
}

function moveMultiplierForSwap(context) {
  const candy = state.board[context.candyPoint.row][context.candyPoint.col];
  context.multiplier.row = context.candyPoint.row;
  context.multiplier.col = context.candyPoint.col;
  state.board[context.candyPoint.row][context.candyPoint.col] = null;
  state.board[context.multiplierPoint.row][context.multiplierPoint.col] = candy;
}

function revertMultiplierSwap(context) {
  const candy = state.board[context.multiplierPoint.row][context.multiplierPoint.col];
  context.multiplier.row = context.multiplierPoint.row;
  context.multiplier.col = context.multiplierPoint.col;
  state.board[context.multiplierPoint.row][context.multiplierPoint.col] = null;
  state.board[context.candyPoint.row][context.candyPoint.col] = candy;
}

function findMatches(board, multipliers = board === state.board ? state.multipliers : []) {
  const cells = new Set();
  const runs = [];

  for (let row = 0; row < ROWS; row += 1) {
    let col = 0;
    while (col < COLS) {
      const tile = board[row][col];
      if (multiplierAt(row, col, multipliers) || !isMatchableCandy(tile)) {
        col += 1;
        continue;
      }

      let end = col + 1;
      while (
        end < COLS &&
        !multiplierAt(row, end, multipliers) &&
        isMatchableCandy(board[row][end]) &&
        board[row][end].type === tile.type
      ) {
        end += 1;
      }

      const length = end - col;
      if (length >= 3) {
        const runCells = [];
        for (let x = col; x < end; x += 1) {
          const key = `${row},${x}`;
          cells.add(key);
          runCells.push({ row, col: x });
        }
        runs.push({ length, cells: runCells, orientation: "row" });
      }
      col = end;
    }
  }

  for (let col = 0; col < COLS; col += 1) {
    let row = 0;
    while (row < ROWS) {
      const tile = board[row][col];
      if (multiplierAt(row, col, multipliers) || !isMatchableCandy(tile)) {
        row += 1;
        continue;
      }

      let end = row + 1;
      while (
        end < ROWS &&
        !multiplierAt(end, col, multipliers) &&
        isMatchableCandy(board[end][col]) &&
        board[end][col].type === tile.type
      ) {
        end += 1;
      }

      const length = end - row;
      if (length >= 3) {
        const runCells = [];
        for (let y = row; y < end; y += 1) {
          const key = `${y},${col}`;
          cells.add(key);
          runCells.push({ row: y, col });
        }
        runs.push({ length, cells: runCells, orientation: "col" });
      }
      row = end;
    }
  }

  return { cells, runs };
}

function scoreRuns(runs) {
  return 0;
}

function specialName(special) {
  return {
    horizontal: "橫向糖",
    vertical: "直向糖",
    colorbomb: "巧顆粒糖",
    bomb: "炸彈糖",
    fish: "魚糖",
  }[special] || "特殊糖";
}

function chooseCreatedSpecial(matches, preferred) {
  const rowRuns = matches.runs.filter((run) => run.orientation === "row");
  const colRuns = matches.runs.filter((run) => run.orientation === "col");

  for (const rowRun of rowRuns) {
    for (const colRun of colRuns) {
      const overlap = rowRun.cells.find((cell) =>
        colRun.cells.some((other) => other.row === cell.row && other.col === cell.col),
      );
      if (overlap) {
        return { ...overlap, type: state.board[overlap.row][overlap.col]?.type || "red", special: "bomb" };
      }
    }
  }

  const runs = matches.runs.filter((run) => run.length >= 4);
  if (!runs.length) return null;

  const fiveRun = runs.find((run) => run.length >= 5);
  if (fiveRun) {
    const cell = pickSpawnCell(fiveRun.cells, preferred);
    return { ...cell, type: state.board[cell.row][cell.col]?.type || "red", special: "colorbomb" };
  }

  const fourRun = runs.find((run) => run.length === 4);
  if (fourRun) {
    const cell = pickSpawnCell(fourRun.cells, preferred);
    return {
      ...cell,
      type: state.board[cell.row][cell.col]?.type || "red",
      special: fourRun.orientation === "row" ? "vertical" : "horizontal",
    };
  }

  return null;
}

function pickSpawnCell(cells, preferred) {
  if (preferred && cells.some((cell) => cell.row === preferred.row && cell.col === preferred.col)) return preferred;
  return cells[Math.floor(cells.length / 2)];
}

function expandSpecialEffects(initialCells) {
  const cells = new Set(initialCells);
  const processed = new Set();
  let changed = true;

  while (changed) {
    changed = false;
    for (const key of Array.from(cells)) {
      if (processed.has(key)) continue;
      processed.add(key);
      const [row, col] = key.split(",").map(Number);
      const tile = state.board[row][col];
      if (tile?.kind !== "candy" || !tile.special) continue;

      for (const extra of specialEffectCells(row, col, tile)) {
        if (!cells.has(extra)) {
          cells.add(extra);
          changed = true;
        }
      }
    }
  }

  return cells;
}

function specialEffectCells(row, col, tile) {
  if (tile.special === "horizontal") return candyCellsInLine("row", row);
  if (tile.special === "vertical") return candyCellsInLine("col", col);
  if (tile.special === "bomb") return candyCellsInArea(row, col, 1);
  if (tile.special === "colorbomb") return candyCellsByType(tile._targetType || tile.type, false);
  if (tile.special === "fish") {
    if (tile._targetType) return candyCellsByType(tile._targetType, false);
    const target = findFishTarget();
    return target ? candyCellsByType(state.board[target.row][target.col].type, false) : new Set();
  }
  return new Set();
}

function candyCellsInLine(axis, index) {
  const cells = new Set();
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if ((axis === "row" && row !== index) || (axis === "col" && col !== index)) continue;
      if (multiplierAt(row, col)) continue;
      if (state.board[row][col]?.kind === "candy") cells.add(`${row},${col}`);
    }
  }
  return cells;
}

function candyCellsInArea(centerRow, centerCol, radius) {
  const cells = new Set();
  for (let row = centerRow - radius; row <= centerRow + radius; row += 1) {
    for (let col = centerCol - radius; col <= centerCol + radius; col += 1) {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) continue;
      if (multiplierAt(row, col)) continue;
      if (state.board[row][col]?.kind === "candy") cells.add(`${row},${col}`);
    }
  }
  return cells;
}

function candyCellsByType(type, includeSpecial = true) {
  const cells = new Set();
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const tile = state.board[row][col];
      if (multiplierAt(row, col)) continue;
      if (tile?.kind === "candy" && tile.type === type && (includeSpecial || !tile.special)) cells.add(`${row},${col}`);
    }
  }
  return cells;
}

function visibleCandyTypes() {
  const types = new Set();
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (isVisibleOrdinaryCandy(row, col)) types.add(state.board[row][col].type);
    }
  }
  return Array.from(types);
}

function randomVisibleCandyType(fallback = randomItem(CANDIES)) {
  const types = visibleCandyTypes();
  return types.length ? randomItem(types) : fallback;
}

function findFishTarget() {
  for (let row = ROWS - 2; row >= 0; row -= 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (state.board[row][col]?.kind !== "multiplier") continue;
      for (let below = row + 1; below < ROWS; below += 1) {
        if (isOrdinaryCandy(state.board[below][col])) return { row: below, col };
      }
    }
  }

  const candies = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (isOrdinaryCandy(state.board[row][col])) candies.push({ row, col });
    }
  }
  return candies.length ? randomItem(candies) : null;
}

function hasLegalMove(board, multipliers = board === state.board ? state.multipliers : []) {
  return countLegalMoves(board, multipliers, 1) > 0;
}

function countLegalMoves(board, multipliers = board === state.board ? state.multipliers : [], limit = Infinity) {
  let count = 0;
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const here = { row, col };
      const checks = [
        { row, col: col + 1 },
        { row: row + 1, col },
      ];

      for (const there of checks) {
        if (there.row >= ROWS || there.col >= COLS) continue;
        if (wouldSwapCreateMatch(board, multipliers, here, there)) {
          count += 1;
          if (count >= limit) return count;
        }
      }
    }
  }
  return count;
}

function wouldSwapCreateMatch(board, multipliers, a, b) {
  const aMultiplier = multiplierAt(a.row, a.col, multipliers);
  const bMultiplier = multiplierAt(b.row, b.col, multipliers);
  if (aMultiplier && bMultiplier) return false;

  if (aMultiplier || bMultiplier) {
    const multiplier = aMultiplier || bMultiplier;
    if (multiplierSize(multiplier) !== 1) return false;
    const multiplierPoint = aMultiplier ? a : b;
    const candyPoint = aMultiplier ? b : a;
    if (!isOrdinaryCandy(board[candyPoint.row]?.[candyPoint.col])) return false;

    const testBoard = cloneBoard(board);
    const testMultipliers = multipliers.map(cloneMultiplier);
    const testMultiplier = testMultipliers.find((item) => item.id === multiplier.id);
    if (!testMultiplier) return false;
    const candy = testBoard[candyPoint.row][candyPoint.col];
    testMultiplier.row = candyPoint.row;
    testMultiplier.col = candyPoint.col;
    testBoard[candyPoint.row][candyPoint.col] = null;
    testBoard[multiplierPoint.row][multiplierPoint.col] = candy;
    return findMatches(testBoard, testMultipliers).cells.size > 0;
  }

  const aTile = board[a.row]?.[a.col];
  const bTile = board[b.row]?.[b.col];
  if (!aTile || !bTile) return false;
  if (canTriggerGenericSpecial(aTile, bTile)) return true;

  const test = cloneBoard(board);
  swap(test, a, b);
  return findMatches(test, multipliers).cells.size > 0;
}

function movePressureLevel(moveCount) {
  if (moveCount <= MOVE_PRESSURE_HARD_LIMIT) return 2;
  if (moveCount <= MOVE_PRESSURE_SOFT_LIMIT) return 1;
  return 0;
}

function canTriggerGenericSpecial(a, b) {
  return (
    (a?.kind === "candy" && isGenericSpecial(a.special) && isOrdinaryCandy(b)) ||
    (b?.kind === "candy" && isGenericSpecial(b.special) && isOrdinaryCandy(a))
  );
}

function addSpecialMeter(count) {
  if (count <= 0) return;
  const before = state.specialMeter;
  state.specialMeter = Math.min(SPECIAL_METER_MAX, state.specialMeter + count);
  let crossedThreshold = false;
  if (state.specialMeter > before) {
    duckBackgroundMusic(220, BGM_DUCK_LIGHT);
    playMeterGainPerformance(count, before, state.specialMeter);
    playSound("meterTick");
  }
  for (let index = 0; index < SPECIAL_METER_THRESHOLDS.length; index += 1) {
    const threshold = SPECIAL_METER_THRESHOLDS[index];
    if (before < threshold && state.specialMeter >= threshold) {
      crossedThreshold = true;
      playMeterThresholdPerformance(index + 1);
      state.pendingSpecialAwards.push(index + 1);
    }
  }
  if (!crossedThreshold) {
    const nextIndex = SPECIAL_METER_THRESHOLDS.findIndex((threshold) => threshold > state.specialMeter);
    const nextThreshold = SPECIAL_METER_THRESHOLDS[nextIndex];
    if (nextThreshold && nextThreshold - state.specialMeter <= Math.max(1, Math.min(3, count + 1))) {
      const nextPreview = state.stagePreviews?.[nextIndex];
      playNearMissPerformance(nextPreview?.kind === "flame" ? "flame" : "meter");
    }
  }
}

function resetSpecialMeterForAction() {
  state.specialMeter = 0;
  state.pendingSpecialAwards = [];
  state.stagePreviews = initialStagePreviews();
  state.miniSlotRolling = false;
  state.rollingStage = null;
  state.miniSlotWin = false;
}

function wouldCreateMatchAt(row, col, tile) {
  if (!isMatchableCandy(tile)) return false;
  const test = cloneBoard(state.board);
  test[row][col] = { ...tile };
  return findMatches(test).cells.has(`${row},${col}`);
}

function findSpecialAwardCell(reward) {
  const rewardTile = specialRewardTile(reward);
  const safeCells = [];
  const fallbackCells = [];

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const tile = state.board[row][col];
      if (!isOrdinaryCandy(tile)) continue;
      const point = { row, col };
      fallbackCells.push(point);
      if (!wouldCreateMatchAt(row, col, rewardTile)) safeCells.push(point);
    }
  }

  return randomItem(safeCells.length ? safeCells : fallbackCells);
}

async function processSpecialAwards() {
  while (state.pendingSpecialAwards > 0) {
    state.pendingSpecialAwards -= 1;
    const reward = randomSpecialReward();
    state.miniSlotRolling = true;
    specialMiniSlotEl.classList.remove("win");

    const steps = state.fast ? 5 : 9;
    for (let i = 0; i < steps; i += 1) {
      state.miniSlotPreview = randomSpecialReward();
      render();
      await wait(resolveDelay(120, 55));
    }

    state.miniSlotRolling = false;
    state.miniSlotWin = true;
    state.miniSlotPreview = reward;
    render();
    playSound("specialReady");
    await wait(resolveDelay(520, 220));

    const target = findSpecialAwardCell(reward);
    if (target) {
      state.board[target.row][target.col] = specialRewardTile(reward);
      setStatus(`抽中${specialName(reward.special)}`);
      render();
      spawnParticles(18);
      playSound("specialSpawn");
      await wait(resolveDelay(520, 220));
      const tile = state.board[target.row][target.col];
      if (tile) delete tile._reward;
    }

    state.miniSlotWin = false;
    render();
  }
}

function collectMultipliers() {
  const collected = [];
  let changed = true;
  let mergedThisCollection = false;

  while (changed) {
    collapseColumns();
    const merged = mergeAdjacentMultipliers();
    if (merged) mergedThisCollection = true;
    collapseColumns();
    changed = false;
    for (let col = 0; col < COLS; col += 1) {
      const bottom = state.board[ROWS - 1][col];
      if (bottom?.kind === "multiplier") {
        collected.push({ col, value: bottom.value });
        state.board[ROWS - 1][col] = null;
        changed = true;
      }
    }
  }

  if (mergedThisCollection) {
    setStatus("倍數球合併");
    playSound("multiplierMerge");
    triggerScreenFx("fx-bump", 360);
  }

  return collected;
}

function mergeAdjacentMultipliers() {
  let mergedAny = false;
  let changed = true;

  while (changed) {
    changed = false;
    for (let col = 0; col < COLS; col += 1) {
      for (let row = ROWS - 1; row > 0; row -= 1) {
        const lower = state.board[row][col];
        const upper = state.board[row - 1][col];
        if (lower?.kind !== "multiplier" || upper?.kind !== "multiplier") continue;

        lower.value += upper.value;
        lower._merged = true;
        lower._fall = Math.max(lower._fall || 0, 1);
        state.board[row - 1][col] = null;
        changed = true;
        mergedAny = true;
        break;
      }
      if (changed) break;
    }
    if (changed) collapseColumns();
  }

  return mergedAny;
}

function collapseColumns() {
  clearMultiplierFootprints();

  for (let col = 0; col < COLS; col += 1) {
    const blockers = state.multipliers
      .filter((multiplier) =>
        multiplierSize(multiplier) > 1 &&
        multiplier.col <= col &&
        col < multiplier.col + multiplierSize(multiplier) &&
        shouldMultiplierBlockColumn(multiplier, col)
      )
      .map((multiplier) => ({ top: multiplier.row, bottom: multiplier.row + multiplierSize(multiplier) - 1 }))
      .sort((a, b) => b.bottom - a.bottom);
    let segmentEnd = ROWS - 1;

    for (const blocker of blockers) {
      collapseColumnSegment(col, blocker.bottom + 1, segmentEnd);
      for (let row = blocker.top; row <= blocker.bottom; row += 1) state.board[row][col] = null;
      segmentEnd = blocker.top - 1;
    }
    collapseColumnSegment(col, 0, segmentEnd);
  }

  clearMultiplierFootprints();
}

function collapseColumnSegment(col, startRow, endRow) {
  if (startRow > endRow) return;
  let write = endRow;
  for (let scan = endRow; scan >= startRow; scan -= 1) {
    const singleMultiplier = singleCellMultiplierAt(scan, col);
    const tile = singleMultiplier ? null : state.board[scan][col];
    if (!singleMultiplier && !tile) continue;

    if (singleMultiplier) {
      if (write !== scan) {
        singleMultiplier._fall = Math.max(singleMultiplier._fall || 0, write - scan);
        singleMultiplier.row = write;
      }
      state.board[scan][col] = null;
    } else {
      if (write !== scan) tile._fall = write - scan;
      state.board[write][col] = tile;
      if (write !== scan) state.board[scan][col] = null;
    }
    write -= 1;
  }
  for (let row = write; row >= startRow; row -= 1) state.board[row][col] = null;
}

function singleCellMultiplierAt(row, col) {
  return state.multipliers.find((multiplier) => multiplierSize(multiplier) === 1 && multiplier.row === row && multiplier.col === col) || null;
}

function shouldMultiplierBlockColumn(multiplier, col) {
  return multiplierBlocksColumn(multiplier, col);
}

function multiplierBlocksColumn(multiplier, col, seen = new Set()) {
  if (!multiplier || seen.has(multiplier.id)) return true;
  seen.add(multiplier.id);
  const size = multiplierSize(multiplier);
  if (multiplierDropDistance(multiplier) > 0) return true;
  const belowRow = multiplier.row + size;
  if (belowRow >= ROWS) return true;
  if (state.board[belowRow][col]) return true;
  const belowMultiplier = multiplierAtExcept(belowRow, col, multiplier);
  if (!belowMultiplier) return false;
  return multiplierBlocksColumn(belowMultiplier, col, seen);
}

function wouldCreateMatchOnBoard(board, multipliers, row, col, tile) {
  if (!isMatchableCandy(tile)) return false;
  const test = cloneBoard(board);
  test[row][col] = { ...tile };
  return findMatches(test, multipliers).cells.has(`${row},${col}`);
}

function rescueCandyForCell(row, col) {
  if (state.boardRescueLevel <= 0) return randomCandy([], { allowFish: true });
  const chance = state.boardRescueLevel >= 2 ? 0.72 : 0.42;
  if (Math.random() > chance) return randomCandy([], { allowFish: true });
  const candidates = CANDIES.filter((type) =>
    wouldCreateMatchOnBoard(state.board, state.multipliers, row, col, { kind: "candy", type })
  );
  return candidates.length ? { kind: "candy", type: randomItem(candidates) } : randomCandy([], { allowFish: true });
}

function seedImmediateCascadeMatch() {
  const options = [];
  const collect = (cells) => {
    if (cells.some(({ row, col }) => multiplierAt(row, col))) return;
    if (cells.some(({ row, col }) => state.board[row]?.[col]?.kind !== "candy")) return;
    const falling = cells.some(({ row, col }) => state.board[row][col]?._fall);
    options.push({ cells, falling });
  };

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col <= COLS - 3; col += 1) {
      collect([{ row, col }, { row, col: col + 1 }, { row, col: col + 2 }]);
    }
  }
  for (let row = 0; row <= ROWS - 3; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      collect([{ row, col }, { row: row + 1, col }, { row: row + 2, col }]);
    }
  }

  const pool = options.filter((option) => option.falling);
  const picked = randomItem(pool.length ? pool : options);
  if (!picked) return false;
  const type = randomItem(CANDIES);
  for (const { row, col } of picked.cells) {
    state.board[row][col] = { kind: "candy", type, _fall: state.board[row][col]._fall || 1 };
  }
  return true;
}

function maybeSeedRescueCascade(cascadeIndex) {
  if (state.boardRescueLevel <= 0) return false;
  if (findMatches(state.board).cells.size > 0) return false;
  const chance = state.boardRescueLevel >= 2 && cascadeIndex < 3 ? RESCUE_CASCADE_CHANCE_HARD : RESCUE_CASCADE_CHANCE_SOFT;
  if (Math.random() > chance) return false;
  return seedImmediateCascadeMatch();
}

function ensurePlayableBoard() {
  if (findMatches(state.board).cells.size > 0) return false;
  if (hasLegalMove(state.board)) return false;
  return seedPlayableMovePattern();
}

function seedPlayableMovePattern() {
  const options = [];
  for (let row = 0; row <= ROWS - 3; row += 1) {
    for (let col = 0; col <= COLS - 3; col += 1) {
      const cells = [
        { row, col },
        { row, col: col + 1 },
        { row, col: col + 2 },
        { row: row + 1, col },
        { row: row + 1, col: col + 1 },
        { row: row + 1, col: col + 2 },
        { row: row + 2, col },
        { row: row + 2, col: col + 1 },
        { row: row + 2, col: col + 2 },
      ];
      if (cells.some((cell) => multiplierAt(cell.row, cell.col))) continue;
      options.push({ row, col });
    }
  }

  while (options.length) {
    const option = randomItem(options);
    options.splice(options.indexOf(option), 1);
    const [a, b, c] = CANDIES.slice().sort(() => Math.random() - 0.5);
    const test = cloneBoard(state.board);
    const pattern = [
      [a, b, a],
      [c, a, c],
      [b, c, b],
    ];
    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 3; x += 1) {
        test[option.row + y][option.col + x] = { kind: "candy", type: pattern[y][x] };
      }
    }
    if (findMatches(test, state.multipliers).cells.size > 0 || !hasLegalMove(test, state.multipliers)) continue;
    state.board = test;
    clearMultiplierFootprints();
    return true;
  }
  forcePlayablePattern(state.board);
  clearMultiplierFootprints();
  return true;
}

function fillEmptyCells() {
  clearMultiplierFootprints();

  for (let col = 0; col < COLS; col += 1) {
    for (let row = 0; row < ROWS; row += 1) {
      if (multiplierAt(row, col)) {
        state.board[row][col] = null;
        continue;
      }
      if (!state.board[row][col]) {
        const tile = rescueCandyForCell(row, col);
        tile._fall = row + 1;
        state.board[row][col] = tile;
      }
    }
  }

  clearMultiplierFootprints();
  ensurePlayableBoard();
}

function clearFallMarks() {
  for (const row of state.board) {
    for (const tile of row) {
      if (tile?._fall) delete tile._fall;
      if (tile?._merged) delete tile._merged;
    }
  }
  for (const multiplier of state.multipliers) {
    if (multiplier._fall) delete multiplier._fall;
    if (multiplier._merged) delete multiplier._merged;
    if (multiplier._reward) delete multiplier._reward;
    if (multiplier._eventTransform) delete multiplier._eventTransform;
  }
}

function addWin(amount) {
  if (amount <= 0) return;
  state.currentWin += amount;
  state.balance += amount;
}

function pointFromTile(tile) {
  return {
    row: Number(tile.dataset.row),
    col: Number(tile.dataset.col),
  };
}

function pointFromSwipe(start, dx, dy) {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return null;

  const next = { row: start.row, col: start.col };
  if (Math.abs(dx) > Math.abs(dy)) {
    next.col += dx > 0 ? 1 : -1;
  } else {
    next.row += dy > 0 ? 1 : -1;
  }

  if (next.row < 0 || next.row >= ROWS || next.col < 0 || next.col >= COLS) return null;
  return next;
}

function tileSelector(point) {
  return `.tile[data-row="${point.row}"][data-col="${point.col}"]`;
}

function clearDragVisuals() {
  boardEl.querySelectorAll(".dragging, .drag-target").forEach((tile) => {
    tile.classList.remove("dragging", "drag-target");
    tile.style.removeProperty("--drag-x");
    tile.style.removeProperty("--drag-y");
  });
}

function updateDragVisual(event) {
  if (!state.pointer) return;

  const source = boardEl.querySelector(tileSelector(state.pointer));
  if (!source) return;

  const rect = source.getBoundingClientRect();
  const maxMove = rect.width + 5;
  let dx = event.clientX - state.pointer.x;
  let dy = event.clientY - state.pointer.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    dx = Math.max(-maxMove, Math.min(maxMove, dx));
    dy = 0;
  } else {
    dy = Math.max(-maxMove, Math.min(maxMove, dy));
    dx = 0;
  }

  source.classList.add("dragging");
  source.style.setProperty("--drag-x", `${dx}px`);
  source.style.setProperty("--drag-y", `${dy}px`);

  boardEl.querySelectorAll(".drag-target").forEach((tile) => tile.classList.remove("drag-target"));
  const targetPoint = pointFromSwipe(state.pointer, dx, dy);
  if (targetPoint) {
    boardEl.querySelector(tileSelector(targetPoint))?.classList.add("drag-target");
  }
}

async function attemptSwap(from, to) {
  if (state.resolving) return;
  if (!hasLegalMove(state.board)) {
    await ensureLegalMove();
    return;
  }
  if (!hasEnoughBalanceForMove()) {
    showInsufficientBalance();
    return;
  }

  if (!isAdjacent(from, to)) return;
  const moveCountBefore = countLegalMoves(state.board, state.multipliers, MOVE_PRESSURE_SOFT_LIMIT + 1);
  const multiplierSwap = multiplierSwapContext(from, to);
  const fromMultiplier = multiplierAt(from.row, from.col);
  const toMultiplier = multiplierAt(to.row, to.col);
  if ([fromMultiplier, toMultiplier].some((multiplier) => multiplier && multiplierSize(multiplier) > 1)) return;
  if ((fromMultiplier || toMultiplier) && !multiplierSwap) return;

  state.selected = null;
  if (multiplierSwap) moveMultiplierForSwap(multiplierSwap);
  else swap(state.board, from, to);
  let matches = findMatches(state.board);
  const specialPoint = specialSwapPoint(from, to);

  if (matches.cells.size === 0 && specialPoint) {
    matches = { cells: new Set([`${specialPoint.row},${specialPoint.col}`]), runs: [] };
  }

  if (matches.cells.size === 0) {
    if (multiplierSwap) revertMultiplierSwap(multiplierSwap);
    else swap(state.board, from, to);
    state.invalid = `${to.row},${to.col}`;
    render();
    setStatus("沒有消除");
    playSound("error");
    await wait(260);
    state.invalid = null;
    render();
    return;
  }

  state.balance -= currentBet();
  state.currentWin = 0;
  state.slotFlash = Array(SLOT_COUNT).fill(null);
  tickCollectedSlotTurns();
  state.boardRescueLevel = movePressureLevel(moveCountBefore);
  playSound("move");
  await resolveMove(matches, specialPoint || (multiplierSwap ? multiplierSwap.multiplierPoint : to));
  resetSpecialMeterForAction();
  render();
}

function specialSwapPoint(from, to) {
  const fromTile = state.board[to.row][to.col];
  const toTile = state.board[from.row][from.col];
  if (fromTile?.kind === "candy" && isGenericSpecial(fromTile.special)) {
    if (isOrdinaryCandy(toTile)) {
      fromTile._targetType = toTile.type;
      return to;
    }
    return null;
  }
  if (toTile?.kind === "candy" && isGenericSpecial(toTile.special)) {
    if (isOrdinaryCandy(fromTile)) {
      toTile._targetType = fromTile.type;
      return from;
    }
    return null;
  }
  return null;
}

async function handleTileClick(row, col) {
  if (state.resolving) return;
  if (!hasEnoughBalanceForMove()) {
    showInsufficientBalance();
    return;
  }
  if (!hasLegalMove(state.board)) {
    await ensureLegalMove();
    return;
  }

  const point = { row, col };
  if (!canInteractWithPoint(point)) return;
  if (!state.selected) {
    state.selected = point;
    render();
    return;
  }

  if (state.selected.row === row && state.selected.col === col) {
    state.selected = null;
    render();
    return;
  }

  if (!isAdjacent(state.selected, point)) {
    state.selected = point;
    render();
    return;
  }

  await attemptSwap(state.selected, point);
}

async function resolveMove(initialMatches, preferredSpawn = null) {
  state.resolving = true;
  setBoardBusy(true);
  setPerfPhase("resolve");
  let matches = initialMatches;
  let cascades = 0;
  render();

  while (matches.cells.size > 0) {
    const matchEnd = startPerfSpan("move.match.expand");
    const clearScore = scoreRuns(matches.runs);
    addWin(clearScore);
    const createdSpecial = chooseCreatedSpecial(matches, preferredSpawn);
    const expandedCells = expandSpecialEffects(matches.cells);
    const hasSpecialBlast = Array.from(expandedCells).some((key) => {
      const [row, col] = key.split(",").map(Number);
      return Boolean(state.board[row][col]?.special);
    });
    matchEnd();
    state.clearing = expandedCells;
    setPerfPhase(hasSpecialBlast ? "special-clear" : "clear");
    setStatus(cascades === 0 ? "消除收集" : `連鎖 ${cascades + 1}`);
    render();
    playMatchClearPerformance(expandedCells.size, cascades, hasSpecialBlast);
    playSound(hasSpecialBlast ? "specialBlast" : cascades === 0 ? "match" : "cascade");
    if (hasSpecialBlast) triggerScreenFx("fx-blast", 460);
    spawnClearBursts(expandedCells, hasSpecialBlast);
    spawnCollectEnergy(expandedCells);
    await wait(resolveDelay(hasSpecialBlast ? 430 : 380, 150));

    let clearedCandyCount = 0;
    const clearEnd = startPerfSpan("move.clear.data");
    for (const key of expandedCells) {
      const [row, col] = key.split(",").map(Number);
      if (createdSpecial && key === `${createdSpecial.row},${createdSpecial.col}`) continue;
      if (state.board[row][col]?.kind === "candy") {
        if (isVisibleOrdinaryCandy(row, col)) clearedCandyCount += 1;
        state.board[row][col] = null;
      }
    }
    clearEnd();
    state.lastClearedCells = new Set(expandedCells);
    addSpecialMeter(clearedCandyCount);
    if (createdSpecial) {
      setPerfPhase("special-spawn");
      state.board[createdSpecial.row][createdSpecial.col] = {
        kind: "candy",
        type: createdSpecial.type,
        special: createdSpecial.special,
        _spawn: true,
      };
      setStatus(`${specialName(createdSpecial.special)} 生成`);
      render();
      spawnParticles(12);
      playSound("specialSpawn");
      triggerScreenFx("fx-pop", 300);
      await wait(resolveDelay(340, 140));
      delete state.board[createdSpecial.row][createdSpecial.col]._spawn;
    }
    state.clearing = new Set();

    const collectEnd = startPerfSpan("move.collect.mult");
    setPerfPhase("collect");
    const collected = settleBoardBeforeFill();
    state.lastClearedCells = null;
    collectEnd();
    await presentCollectedMultipliers(collected);

    const collapseEnd = startPerfSpan("move.collapse");
    setPerfPhase("drop");
    collapseEnd();
    const fillEnd = startPerfSpan("move.fill");
    fillEmptyCells();
    maybeSeedRescueCascade(cascades);
    fillEnd();
    render();
    playSound("drop");
    await wait(resolveDelay(430, 170));
    clearFallMarks();

    matches = measurePerf("move.findMatches", () => findMatches(state.board));
    cascades += 1;
  }

  const resolvedByAwards = await processSpecialAwards();
  if (resolvedByAwards) return;
  const eventMatches = measurePerf("event.findMatches", () => findMatches(state.board));
  if (eventMatches.cells.size > 0) {
    await resolveMove(eventMatches);
    return;
  }
  state.lastWin = state.currentWin;
  await maybeFullDropBonus();
  const showedWinCard = await maybeShowWinCard();
  state.slotFlash = Array(SLOT_COUNT).fill(null);
  state.resolving = false;
  setBoardBusy(false);
  setPerfPhase("idle");
  render();
  await ensureLegalMove();
  state.boardRescueLevel = 0;
  setStatus(showedWinCard ? "大獎入帳" : "繼續追高倍糖果");
  if (state.perf.enabled) {
    state.perf.resolveCount += 1;
    updatePerfPanel(true);
    console.table(
      Object.entries(state.perf.metrics)
        .map(([name, metric]) => ({
          name,
          avg: +(metric.total / metric.count).toFixed(2),
          max: +metric.max.toFixed(2),
          count: metric.count,
          slow: metric.slow,
        }))
        .sort((a, b) => b.max - a.max)
        .slice(0, 16)
    );
  }
}

async function maybeShowWinCard() {
  const ratio = state.currentWin / currentBet();
  const tier = WIN_TIERS.find((item) => ratio >= item.ratio);
  if (!tier) return false;

  duckBackgroundMusic(tier.duration + 620, BGM_DUCK_PAYOUT);
  setPerfPhase("win-card");
  winLabelEl.textContent = tier.label;
  winTitleArtEl.src = winArtAsset(tier.art);
  winTitleArtEl.alt = tier.label;
  winMultiplierEl.textContent = `${Math.floor(ratio)}x`;
  winAmountEl.textContent = "0";
  winOverlay.className = `win-overlay ${tier.className}`;
  winOverlay.classList.remove("hidden");
  const countDuration = Math.max(1450, tier.duration - 340);
  animateWinAmount(state.currentWin, countDuration);
  playWinCountLoop(countDuration, tier.countVolume || 0.04);
  spawnParticles(tier.particles);
  triggerScreenFx(ratio >= 50 ? "fx-jackpot" : ratio >= 20 ? "fx-blast" : "fx-bump", ratio >= 50 ? 980 : 640);
  playWinCardPerformance(tier);
  await wait(resolveDelay(tier.duration, tier.quick));
  winOverlay.classList.add("hidden");
  setPerfPhase("resolve");
  return true;
}

function animateWinAmount(target, duration) {
  const started = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - started) / duration);
    const eased = 1 - (1 - t) ** 3;
    winAmountEl.textContent = formatMoney(target * eased);
    if (t < 1 && !winOverlay.classList.contains("hidden")) {
      requestAnimationFrame(tick);
    } else {
      winAmountEl.textContent = formatMoney(target);
    }
  };
  requestAnimationFrame(tick);
}

function playWinCountLoop(duration, volume = 0.04) {
  if (!state.sound) return;
  duckBackgroundMusic(duration + 520, BGM_DUCK_PAYOUT);
  const started = performance.now();
  let step = 0;
  const timer = window.setInterval(() => {
    const elapsed = performance.now() - started;
    if (elapsed >= duration || winOverlay.classList.contains("hidden")) {
      window.clearInterval(timer);
      withSoundScope("payout", 1.22, () => {
        playCommercialHit(hz("Bb", 1), { low: 0.08, body: 0.04, noise: 0.022, noiseFreq: 1500 });
        playCoinSpray({ delay: 0.04, count: 8, spacing: 0.026, volume: volume * 0.72 });
      });
      playBrassStab("resolve", { delay: 0.14, volume: 0.036, duration: 0.1 });
      return;
    }
    const progress = elapsed / duration;
    const coinMotif = [hz("Bb", 5), hz("Db", 6), hz("F", 6), hz("Ab", 6)];
    const freq = coinMotif[step % coinMotif.length] * (1 + progress * 0.025);
    playTone(freq, 0.024, {
      type: step % 4 === 3 ? "square" : "triangle",
      volume: volume * 0.5,
      filter: { type: "highpass", from: 1150, q: 0.82 },
    });
    if (step % 2 === 0) {
      playNoise(0.012, { frequency: 5600 + Math.random() * 1700, filterType: "highpass", volume: volume * 0.12 });
    }
    if (step % 4 === 0) playTone(hz("Bb", 2), 0.04, { to: hz("F", 2), type: "sine", volume: volume * 0.34 });
    step += 1;
  }, 58);
}

async function maybeFullDropBonus() {
  if (state.filledSlots.size < SLOT_COUNT) return;

  await playFullDropWheel();

  state.filledSlots = new Set();
  state.slotValues = Array(SLOT_COUNT).fill(null);
  state.slotSymbolValues = Array(SLOT_COUNT).fill(null);
  state.slotFlash = Array(SLOT_COUNT).fill(null);
  state.slotTurns = Array(SLOT_COUNT).fill(0);
  state.pendingClimaxIntro = false;
  state.climaxIntroPhase = null;
  state.climaxLogoReturn = true;
  render();
  duckBackgroundMusic(900, BGM_DUCK_LIGHT);
  playSound("logoReturn");
  await wait(960);
  state.climaxLogoReturn = false;
  render();
}

async function playFullDropWheel() {
  const slotTotals = state.slotValues.map((value) => Math.round(value || 0));
  const baseTotal = slotTotals.reduce((sum, value) => sum + value, 0);
  if (baseTotal <= 0) return;

  const prize = weightedPick(FULL_DROP_WHEEL_PRIZES);
  const prizeIndex = wheelLabelIndexByPrize(prize.label);
  const sliceAngle = wheelLabelSliceAngle();
  const award = Math.round(baseTotal * prize.multiplier);

  render();
  const spinProfile = createWheelSpinProfile();
  duckBackgroundMusic(spinProfile.duration + 2600, BGM_DUCK_DEEP);
  const landingAngle = wheelLandingAngle(prizeIndex, sliceAngle, prize.multiplier);
  const finalRotation = wheelRotationDeltaToLand(landingAngle, climaxPointerAngle(), spinProfile.turns);
  slotTotals.forEach((value, index) => spawnSlotClimaxEnergy(index, value, 12 + index * 85));
  playWheelStartPerformance();
  playSound("slotProgress");
  await wait(980);

  state.climaxSpinning = true;
  render();
  await animateClimaxWheel(finalRotation, spinProfile);

  duckBackgroundMusic(1300, BGM_DUCK_DEEP);
  playWheelStopPerformance(prize.multiplier);
  playSound("wheelStop");
  if (isWheelHighNearMiss(prizeIndex, prize)) playNearMissPerformance("wheel");
  addWin(award);
  state.climaxSpinning = false;
  triggerScreenFx(prize.multiplier >= 5 ? "fx-jackpot" : prize.multiplier >= 1 ? "fx-blast" : "fx-bump", 820);
  render();
  await wait(1500);
}

async function ensureLegalMove() {
  if (hasLegalMove(state.board)) return;
  const wasResolving = state.resolving;
  state.resolving = true;
  ensurePlayableBoard();
  state.resolving = wasResolving;
  render();
}

function reshuffleBoard() {
  const multipliers = [];
  for (const multiplier of state.multipliers) {
    multipliers.push({ value: multiplier.value, size: multiplierSize(multiplier), payout: multiplierPayout(multiplier) });
  }

  let attempts = 0;
  do {
    state.board = makeCandyBoard();
    state.multipliers = [];
    for (const item of multipliers) {
      const multiplier = multiplierSpawnPoint(item.value, { size: item.size, payout: item.payout });
      if (multiplier) {
        state.multipliers.push(multiplier);
        clearMultiplierFootprint(state.board, multiplier);
      }
    }
    attempts += 1;
  } while ((!hasLegalMove(state.board) || findMatches(state.board).cells.size > 0) && attempts < 80);

  if (!hasLegalMove(state.board) || findMatches(state.board).cells.size > 0) {
    forcePlayablePattern(state.board);
  }

  setStatus("盤面已洗牌");
}

function spawnParticles(count) {
  const colors = ["#ffdf5f", "#ff58c8", "#35c8ff", "#83ff58", "#ff8138", "#ffffff"];
  const host = document.querySelector(".play-area");
  if (!host || document.hidden) return;

  const hostRect = host.getBoundingClientRect();
  const limit = window.innerWidth <= 520 ? 20 : 34;
  const actualCount = Math.min(count, limit);
  const now = performance.now();
  const items = Array.from({ length: actualCount }, () => ({
    kind: "burst",
    start: now,
    delay: Math.random() * 70,
    duration: 620 + Math.random() * 180,
    x: hostRect.width * (0.36 + Math.random() * 0.28),
    y: hostRect.height * (0.44 + Math.random() * 0.24),
    angle: Math.random() * Math.PI * 2,
    distance: 46 + Math.random() * 116,
    radius: 3.5 + Math.random() * 5,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 5,
    color: randomItem(colors),
    hot: "#fff8a5",
    alpha: 0.95,
  }));
  enqueueFx(items);
}

function spawnClearBursts(cells, intense = false) {
  const host = document.querySelector(".play-area");
  if (!host || document.hidden) return;

  const hostRect = host.getBoundingClientRect();
  const maxCells = window.innerWidth <= 520 ? 18 : 28;
  const points = Array.from(cells).slice(0, maxCells);
  const now = performance.now();
  const colors = ["#ffdf5f", "#ff58c8", "#35c8ff", "#83ff58", "#ff8138", "#ffffff"];
  const items = [];

  for (const key of points) {
    const tile = boardEl.querySelector(tileSelector(keyToPoint(key)));
    if (!tile) continue;
    const rect = tile.getBoundingClientRect();
    const x = rect.left + rect.width * 0.5 - hostRect.left;
    const y = rect.top + rect.height * 0.5 - hostRect.top;
    const sparks = intense ? 5 : 3;
    for (let i = 0; i < sparks; i += 1) {
      items.push({
        kind: "burst",
        start: now,
        delay: Math.random() * 60,
        duration: intense ? 520 + Math.random() * 160 : 420 + Math.random() * 120,
        x,
        y,
        angle: Math.random() * Math.PI * 2,
        distance: (intense ? 32 : 22) + Math.random() * (intense ? 64 : 42),
        radius: (intense ? 4.5 : 3.2) + Math.random() * 3,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 5,
        color: randomItem(colors),
        hot: "#fff8a5",
        alpha: intense ? 1 : 0.88,
      });
    }
  }

  enqueueFx(items);
}

function triggerScreenFx(className, duration = 420) {
  const phone = document.querySelector(".phone");
  if (!phone) return;
  phone.classList.remove("fx-bump", "fx-pop", "fx-blast", "fx-jackpot");
  void phone.offsetWidth;
  phone.classList.add(className);
  window.setTimeout(() => phone.classList.remove(className), duration);
}

function resizeFxCanvas() {
  if (!fxCanvas) return;
  const rect = fxCanvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));
  if (fxCanvas.width !== width || fxCanvas.height !== height) {
    fxCanvas.width = width;
    fxCanvas.height = height;
  }
  state.fx.dpr = dpr;
  state.fx.context = fxCanvas.getContext("2d");
}

function enqueueFx(items) {
  if (!fxCanvas || document.hidden) return;
  resizeFxCanvas();
  state.fx.items.push(...items);
  if (state.fx.items.length > 90) {
    state.fx.items.splice(0, state.fx.items.length - 90);
  }
  if (!state.fx.frame) {
    state.fx.frame = requestAnimationFrame(drawFx);
  }
}

function drawFx(now) {
  const context = state.fx.context;
  if (!context || !fxCanvas) {
    state.fx.frame = null;
    return;
  }
  const perfEnd = startPerfSpan("fx.draw");

  const dpr = state.fx.dpr || 1;
  context.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  state.fx.items = state.fx.items.filter((item) => {
    const elapsed = now - item.start - item.delay;
    if (elapsed < 0) return true;
    const t = Math.min(1, elapsed / item.duration);
    const ease = 1 - (1 - t) ** 3;
    let x = item.x + (item.tx || 0) * ease;
    let y = item.y + (item.ty || 0) * ease;
    let alpha = item.alpha ?? 1;
    let radius = item.radius || 6;

    if (item.kind === "burst") {
      x += Math.cos(item.angle) * item.distance * ease;
      y += Math.sin(item.angle) * item.distance * ease;
      alpha *= 1 - t;
      radius *= 1 + t * 0.4;
    } else {
      const arc = Math.sin(t * Math.PI) * (item.arc || 0);
      y -= arc;
      alpha *= t < 0.16 ? t / 0.16 : 1 - Math.max(0, t - 0.88) / 0.12;
      radius *= 1 + Math.sin(t * Math.PI) * 0.45;
    }

    context.save();
    context.globalAlpha = Math.max(0, alpha);
    context.translate(x * dpr, y * dpr);
    context.rotate((item.rotation || 0) + t * (item.spin || 0));
    context.scale(dpr, dpr);
    if (item.streak) {
      context.save();
      context.rotate(Math.atan2(item.ty || 0, item.tx || 0));
      context.lineWidth = item.streakWidth || 3;
      context.lineCap = "round";
      const trail = item.streakLength || 24;
      const streak = context.createLinearGradient(-trail, 0, 0, 0);
      streak.addColorStop(0, "rgba(255,255,255,0)");
      streak.addColorStop(0.44, item.color || "#ff59d6");
      streak.addColorStop(1, item.hot || "#fff27a");
      context.strokeStyle = streak;
      context.beginPath();
      context.moveTo(-trail, 0);
      context.lineTo(0, 0);
      context.stroke();
      context.restore();
    }
    const gradient = context.createRadialGradient(-radius * 0.25, -radius * 0.25, 1, 0, 0, radius * 2.2);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.28, item.hot || "#fff27a");
    gradient.addColorStop(0.68, item.color || "#ff59d6");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();

    return t < 1;
  });

  if (state.fx.items.length > 0) {
    state.fx.frame = requestAnimationFrame(drawFx);
  } else {
    state.fx.frame = null;
  }
  perfEnd();
}

function spawnCollectEnergy(cells) {
  const host = document.querySelector(".play-area");
  const target = document.querySelector(".special-meter-track");
  if (!host || !target) return;

  const hostRect = host.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width * 0.5 - hostRect.left;
  const targetY = targetRect.top + targetRect.height * 0.68 - hostRect.top;

  const maxEnergy = window.innerWidth <= 520 ? 20 : 30;
  const points = Array.from(cells).slice(0, maxEnergy);
  const now = performance.now();
  const items = [];
  for (const key of points) {
    const tile = boardEl.querySelector(tileSelector(keyToPoint(key)));
    if (!tile) continue;
    const rect = tile.getBoundingClientRect();
    const startX = rect.left + rect.width * 0.5 - hostRect.left;
    const startY = rect.top + rect.height * 0.5 - hostRect.top;
    items.push({
      kind: "fly",
      start: now,
      delay: Math.random() * 150,
      duration: 860 + Math.random() * 180,
      x: startX,
      y: startY,
      tx: targetX - startX,
      ty: targetY - startY,
      arc: 42 + Math.random() * 34,
      radius: 6.2 + Math.random() * 2.4,
      color: Math.random() > 0.5 ? "#35f4ff" : "#ff58d4",
      hot: "#fff7a8",
      alpha: 1,
      streak: true,
      streakLength: 30 + Math.random() * 18,
      streakWidth: 3.2,
    });
  }
  enqueueFx(items);
}

function spawnSlotEnergy(col, value) {
  const host = document.querySelector(".play-area");
  const target = document.querySelector(".special-meter");
  if (!host || !target) return;

  const hostRect = host.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const startX = hostRect.width * 0.5;
  const startY = hostRect.height * 0.48;
  const targetX = targetRect.left + targetRect.width * 0.5 - hostRect.left;
  const targetY = targetRect.top + targetRect.height * 0.46 - hostRect.top;
  const count = value >= 100 ? 12 : value >= 50 ? 9 : value >= 20 ? 6 : 4;
  const now = performance.now();
  const items = [];

  for (let i = 0; i < count; i += 1) {
    const x = startX + Math.random() * 54 - 27;
    const y = startY + Math.random() * 42 - 21;
    items.push({
      kind: "fly",
      start: now,
      delay: i * 28,
      duration: value >= 50 ? 760 : 660,
      x,
      y,
      tx: targetX - x,
      ty: targetY - y,
      arc: value >= 50 ? 50 : 32,
      radius: value >= 50 ? 7 : 5,
      color: value >= 50 ? "#ff40df" : "#ffd958",
      hot: value >= 50 ? "#ffffff" : "#fff8a6",
      alpha: value >= 50 ? 1 : 0.92,
    });
  }
  enqueueFx(items);
}

function spawnSlotClimaxEnergy(col, value, baseDelay = 0) {
  const host = document.querySelector(".phone");
  const source = slotsEl?.children[col];
  if (!host || !climaxStageEl || !source) return;

  const hostRect = host.getBoundingClientRect();
  const sourceRect = source.getBoundingClientRect();
  const targetRect = climaxStageEl.getBoundingClientRect();
  const startX = sourceRect.left + sourceRect.width * 0.5 - hostRect.left;
  const startY = sourceRect.top + sourceRect.height * 0.5 - hostRect.top;
  const targetRatioX = [0.36, 0.5, 0.64][Math.max(0, Math.min(2, col))];
  const endX = targetRect.left + targetRect.width * targetRatioX - hostRect.left;
  const endY = targetRect.top + targetRect.height * 0.68 - hostRect.top;
  const count = Math.max(9, Math.min(24, Math.round((value || 0) / currentBet() * 3) + 8));

  for (let index = 0; index < count; index += 1) {
    const spark = document.createElement("i");
    spark.className = "slot-climax-energy";
    spark.style.setProperty("--sx", `${startX + Math.random() * 28 - 14}px`);
    spark.style.setProperty("--sy", `${startY + Math.random() * 20 - 10}px`);
    spark.style.setProperty("--tx", `${endX + Math.random() * 16 - 8}px`);
    spark.style.setProperty("--ty", `${endY + Math.random() * 10 - 5}px`);
    spark.style.setProperty("--delay", `${baseDelay + index * 22}ms`);
    spark.style.setProperty("--arc", `${80 + Math.random() * 42}px`);
    host.appendChild(spark);
    window.setTimeout(() => spark.remove(), 1240 + baseDelay + index * 22);
  }
}

function keyToPoint(key) {
  const [row, col] = key.split(",").map(Number);
  return { row, col };
}

function ensureAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!state.audioContext) state.audioContext = new AudioContext();
  if (!state.masterGain) {
    state.mixGain = state.audioContext.createGain();
    state.mixGain.gain.value = 0.92;

    state.lowCutFilter = state.audioContext.createBiquadFilter();
    state.lowCutFilter.type = "highpass";
    state.lowCutFilter.frequency.value = AUDIO_LOWCUT_HZ;
    state.lowCutFilter.Q.value = 0.64;

    state.bassShelf = state.audioContext.createBiquadFilter();
    state.bassShelf.type = "lowshelf";
    state.bassShelf.frequency.value = 128;
    state.bassShelf.gain.value = 3.2;

    state.presenceDip = state.audioContext.createBiquadFilter();
    state.presenceDip.type = "peaking";
    state.presenceDip.frequency.value = 3600;
    state.presenceDip.Q.value = 0.82;
    state.presenceDip.gain.value = -1.8;

    state.masterCompressor = state.audioContext.createDynamicsCompressor();
    state.masterCompressor.threshold.value = -18;
    state.masterCompressor.knee.value = 10;
    state.masterCompressor.ratio.value = 4;
    state.masterCompressor.attack.value = 0.012;
    state.masterCompressor.release.value = 0.18;

    state.limiter = state.audioContext.createDynamicsCompressor();
    state.limiter.threshold.value = -3.2;
    state.limiter.knee.value = 0;
    state.limiter.ratio.value = 20;
    state.limiter.attack.value = 0.002;
    state.limiter.release.value = 0.08;

    state.sfxGain = state.audioContext.createGain();
    state.sfxGain.gain.value = AUDIO_SFX_VOLUME;

    state.bgmGain = state.audioContext.createGain();
    state.bgmGain.gain.value = AUDIO_BGM_VOLUME;

    state.masterGain = state.audioContext.createGain();
    state.masterGain.gain.value = AUDIO_MASTER_VOLUME;

    state.sfxGain.connect(state.mixGain);
    state.bgmGain.connect(state.mixGain);
    state.mixGain.connect(state.lowCutFilter);
    state.lowCutFilter.connect(state.bassShelf);
    state.bassShelf.connect(state.presenceDip);
    state.presenceDip.connect(state.masterCompressor);
    state.masterCompressor.connect(state.limiter);
    state.limiter.connect(state.masterGain);
    state.masterGain.connect(state.audioContext.destination);
  }
  if (state.audioContext.state === "suspended") state.audioContext.resume();
  return state.audioContext;
}

function normalizeToneVolume(volume, group, category) {
  const categoryGain = group === "sfx" ? (AUDIO_CATEGORY_GAINS[category] || 0.65) : 1;
  const peakLimit = group === "bgm" ? AUDIO_BGM_PEAK_LIMIT : AUDIO_SFX_PEAK_LIMIT;
  return Math.min(peakLimit, Math.max(0, (volume || 0.08) * categoryGain));
}

function currentMusicDuckFactor(now = performance.now()) {
  if (!state.musicDuckWindows) state.musicDuckWindows = [];
  state.musicDuckWindows = state.musicDuckWindows.filter((item) => item.until > now);
  if (!state.musicDuckWindows.length) return 1;
  return Math.min(...state.musicDuckWindows.map((item) => item.depth));
}

function playTone(freq, duration = 0.08, options = {}) {
  const context = ensureAudio();
  if (!context || !state.masterGain || !state.sfxGain || !state.bgmGain) return;
  const maxTones = window.innerWidth <= 520 ? 28 : 44;
  if (state.activeTones >= maxTones) return;
  state.activeTones += 1;
  const now = context.currentTime + (options.delay || 0);
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = options.type || "triangle";
  osc.frequency.setValueAtTime(freq, now);
  if (options.to) osc.frequency.exponentialRampToValueAtTime(Math.max(40, options.to), now + duration);
  const group = options.music ? "bgm" : "sfx";
  const scopeGain = options.music ? 1 : (options.soundGain ?? state.soundScope?.gain ?? 1);
  const category = options.category || state.soundScope?.category || "movement";
  const requestedVolume = (options.volume || 0.08) * scopeGain;
  const volume = normalizeToneVolume(requestedVolume, group, category);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  if (options.filter) {
    const filter = context.createBiquadFilter();
    filter.type = options.filter.type || "lowpass";
    filter.frequency.setValueAtTime(options.filter.from || options.filter.frequency || 1200, now);
    if (options.filter.to) filter.frequency.exponentialRampToValueAtTime(Math.max(40, options.filter.to), now + duration);
    filter.Q.value = options.filter.q || 1;
    osc.connect(filter);
    filter.connect(gain);
  } else {
    osc.connect(gain);
  }
  gain.connect(options.music ? state.bgmGain : state.sfxGain);
  osc.start(now);
  osc.stop(now + duration + 0.03);
  window.setTimeout(() => {
    state.activeTones = Math.max(0, state.activeTones - 1);
  }, Math.max(80, (duration + (options.delay || 0) + 0.08) * 1000));
}

function playChord(freqs, duration, options = {}) {
  freqs.forEach((freq, index) => playTone(freq, duration, { ...options, delay: (options.delay || 0) + index * 0.012 }));
}

function playNoise(duration = 0.06, options = {}) {
  const context = ensureAudio();
  if (!context || !state.sfxGain || !state.bgmGain) return;
  const bufferSize = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const now = context.currentTime + (options.delay || 0);
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  filter.type = options.filterType || "bandpass";
  filter.frequency.setValueAtTime(options.frequency || 2200, now);
  filter.Q.value = options.q || 0.8;
  const group = options.music ? "bgm" : "sfx";
  const category = options.category || state.soundScope?.category || "movement";
  const scopeGain = options.music ? 1 : (options.soundGain ?? state.soundScope?.gain ?? 1);
  const requestedVolume = (options.volume || 0.04) * scopeGain;
  const volume = normalizeToneVolume(requestedVolume, group, category);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(options.music ? state.bgmGain : state.sfxGain);
  source.start(now);
  source.stop(now + duration + 0.02);
}

function isSlotHypeActive() {
  return state.filledSlots.size > 0 || state.climaxIntroPhase || state.climaxSpinning;
}

function hz(note, octave) {
  const semitones = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
  };
  const midi = (octave + 1) * 12 + semitones[note];
  return 440 * 2 ** ((midi - 69) / 12);
}

const MUSIC_CHORDS = [
  [hz("Bb", 3), hz("Db", 4), hz("F", 4), hz("Ab", 4), hz("C", 5)],
  [hz("Gb", 3), hz("Bb", 3), hz("Db", 4), hz("F", 4), hz("C", 5)],
  [hz("Ab", 3), hz("Db", 4), hz("Eb", 4), hz("Gb", 4), hz("Bb", 4)],
  [hz("F", 3), hz("A", 3), hz("Eb", 4), hz("Ab", 4), hz("Db", 5)],
  [hz("Eb", 3), hz("Gb", 3), hz("Bb", 3), hz("Db", 4), hz("F", 4)],
  [hz("Db", 3), hz("F", 3), hz("Ab", 3), hz("C", 4), hz("Eb", 4)],
];
const MUSIC_BASS = [
  [hz("Bb", 1), hz("Bb", 1), hz("Db", 2), hz("F", 2), hz("Ab", 1), hz("F", 2), hz("Db", 2), hz("Ab", 1)],
  [hz("Gb", 1), hz("Db", 2), hz("Gb", 1), hz("Bb", 1), hz("Db", 2), hz("F", 2), hz("Db", 2), hz("Bb", 1)],
  [hz("Ab", 1), hz("Eb", 2), hz("Ab", 1), hz("Bb", 1), hz("Db", 2), hz("Eb", 2), hz("Gb", 1), hz("Eb", 2)],
  [hz("F", 1), hz("C", 2), hz("F", 1), hz("Ab", 1), hz("A", 1), hz("Eb", 2), hz("Db", 2), hz("C", 2)],
  [hz("Eb", 1), hz("Bb", 1), hz("Db", 2), hz("Eb", 2), hz("Gb", 1), hz("Bb", 1), hz("Db", 2), hz("F", 2)],
  [hz("Db", 1), hz("Ab", 1), hz("C", 2), hz("Db", 2), hz("F", 2), hz("Eb", 2), hz("C", 2), hz("Ab", 1)],
];
const MUSIC_HOOK = [
  hz("F", 4), hz("Ab", 4), hz("Bb", 4), hz("C", 5),
  hz("Db", 5), hz("C", 5), hz("Ab", 4), hz("F", 4),
  hz("Eb", 4), hz("F", 4), hz("Gb", 4), hz("Ab", 4),
  hz("Bb", 4), hz("Db", 5), hz("C", 5), hz("Ab", 4),
];
const SFX_CHORDS = {
  tonic: [hz("Bb", 3), hz("Db", 4), hz("F", 4), hz("Ab", 4)],
  bright: [hz("Db", 4), hz("F", 4), hz("Bb", 4), hz("C", 5)],
  dominant: [hz("Eb", 3), hz("G", 3), hz("Db", 4), hz("F", 4)],
  shadow: [hz("Ab", 3), hz("B", 3), hz("Eb", 4), hz("Gb", 4)],
  resolve: [hz("Db", 4), hz("F", 4), hz("Ab", 4), hz("Bb", 4)],
};

function playMusicKick(accent = 1) {
  playTone(76, 0.13, { to: 42, type: "sine", volume: 0.082 * accent, music: true });
  playNoise(0.022, { frequency: 115, filterType: "lowpass", q: 0.7, volume: 0.018 * accent, music: true });
}

function playMusicSnare(accent = 1) {
  playNoise(0.082, { frequency: 1550, filterType: "bandpass", q: 0.85, volume: 0.032 * accent, music: true });
  playNoise(0.025, { frequency: 6200, filterType: "highpass", q: 0.7, volume: 0.008 * accent, music: true });
  playTone(182, 0.052, { to: 138, type: "triangle", volume: 0.021 * accent, music: true });
}

function playMusicHat(step) {
  const isOff = step % 2 === 1;
  playNoise(isOff ? 0.05 : 0.026, {
    frequency: isOff ? 6500 : 5200,
    filterType: "highpass",
    q: 0.65,
    volume: isOff ? 0.014 : 0.008,
    music: true,
  });
}

function playRhodesVoicing(chord, bar, step) {
  const top = bar % 4 === 1 ? 1.012 : bar % 4 === 3 ? 0.996 : 1;
  chord.slice(0, 5).forEach((freq, index) => {
    playTone(freq * top, 0.34, {
      delay: index * 0.018,
      type: "triangle",
      volume: index === chord.length - 1 ? 0.022 : 0.016,
      filter: { type: "lowpass", from: 1500, to: 820, q: 0.72 },
      music: true,
    });
    playTone(freq * 2 * top, 0.16, {
      delay: 0.012 + index * 0.014,
      type: "sine",
      volume: 0.005,
      music: true,
    });
  });
  if (step === 6) {
    playTone(chord[2] * 1.5, 0.12, { type: "triangle", volume: 0.012, filter: { type: "lowpass", from: 1400, to: 680, q: 1 }, music: true });
  }
}

function playWahGuitar(chord, step) {
  const tone = chord[(step + 1) % chord.length] * 2;
  playTone(tone, 0.075, {
    type: "sawtooth",
    volume: 0.011,
    filter: { type: "bandpass", from: 560, to: 1760, q: 4.8 },
    music: true,
  });
}

function playMusicBrassStab(chord, delay = 0) {
  [chord[1] * 2, chord[2] * 2, chord[3] * 2].forEach((freq, index) => {
    playTone(freq, 0.11, {
      delay: delay + index * 0.01,
      type: "sawtooth",
      volume: 0.011,
      filter: { type: "bandpass", from: 760, to: 1800, q: 2.4 },
      music: true,
    });
  });
}

function playNormalMusicBeat(beat) {
  const step = beat % MUSIC_LOOP_STEPS;
  const bar = Math.floor(step / 8);
  const eighth = step % 8;
  const chord = MUSIC_CHORDS[bar % MUSIC_CHORDS.length];
  const bass = MUSIC_BASS[bar % MUSIC_BASS.length][eighth];

  playMusicHat(eighth);
  if (eighth === 0 || eighth === 3 || eighth === 5) playMusicKick(eighth === 0 ? 1.04 : 0.64);
  if (eighth === 2 || eighth === 6) playMusicSnare(eighth === 2 ? 0.86 : 0.64);
  if ([0, 2, 3, 5, 7].includes(eighth)) {
    playTone(bass, eighth === 0 ? 0.2 : 0.13, {
      type: "sawtooth",
      volume: eighth === 0 ? 0.052 : 0.036,
      filter: { type: "lowpass", from: 680, to: 280, q: 1.05 },
      music: true,
    });
    playTone(bass * 2, 0.055, {
      delay: 0.008,
      type: "triangle",
      volume: eighth === 0 ? 0.012 : 0.007,
      filter: { type: "lowpass", from: 900, to: 460, q: 0.8 },
      music: true,
    });
  }
  if (eighth === 0 || eighth === 4 || (bar % 2 === 1 && eighth === 6)) playRhodesVoicing(chord, bar, eighth);
  if (eighth === 1 || eighth === 3 || eighth === 5 || eighth === 7) playWahGuitar(chord, eighth);
  if ((bar % 6 === 5 && eighth === 6) || (bar % 8 === 7 && eighth === 2)) playMusicBrassStab(chord, 0.018);

  const hookWindow = bar % 6 === 0 || bar % 6 === 3 || bar % 12 === 11;
  if (hookWindow && [1, 2, 4, 6].includes(eighth)) {
    const hookIndex = ((bar % 8) * 3 + [1, 2, 4, 6].indexOf(eighth)) % MUSIC_HOOK.length;
    playTone(MUSIC_HOOK[hookIndex], 0.17, {
      type: bar % 8 >= 4 ? "square" : "triangle",
      volume: 0.02,
      filter: { type: "lowpass", from: 2100, to: 1150, q: 1.35 },
      music: true,
    });
  }
}

function playHypeMusicBeat(beat) {
  const step = beat % MUSIC_LOOP_STEPS;
  const bar = Math.floor(step / 8);
  const eighth = step % 8;
  const chord = MUSIC_CHORDS[bar % MUSIC_CHORDS.length];
  const bass = MUSIC_BASS[bar % MUSIC_BASS.length][eighth];

  playMusicHat(eighth);
  if ([0, 3, 5].includes(eighth)) playMusicKick(eighth === 0 ? 1.16 : 0.72);
  if (eighth === 2 || eighth === 6) playMusicSnare(eighth === 2 ? 0.98 : 0.78);
  if ([0, 2, 3, 4, 7].includes(eighth)) {
    playTone(bass, eighth === 0 ? 0.18 : 0.105, {
      type: "sawtooth",
      volume: eighth === 0 ? 0.056 : 0.04,
      filter: { type: "lowpass", from: 760, to: 290, q: 1.2 },
      music: true,
    });
  }
  if (eighth === 0 || eighth === 4) playRhodesVoicing(chord, bar, eighth);
  if (eighth === 1 || eighth === 3 || eighth === 5 || eighth === 7) {
    playWahGuitar(chord, eighth);
    if (eighth === 7) {
      playTone(chord[3] * 2, 0.08, {
        type: "square",
        volume: 0.016,
        filter: { type: "lowpass", from: 2400, to: 1300, q: 1.3 },
        music: true,
      });
    }
  }
  if (eighth === 0 || eighth === 4 || (bar % 4 === 3 && eighth === 6)) {
    playMusicBrassStab(chord, eighth === 4 ? 0.02 : 0.03);
  }
}

function startBackgroundMusic() {
  if (!state.sound || state.musicTimer) return;
  const context = ensureAudio();
  if (!context) return;
  const tick = () => {
    if (!state.sound) {
      state.musicTimer = null;
      return;
    }
    if (document.hidden) {
      state.musicTimer = window.setTimeout(tick, 500);
      return;
    }
    const beat = state.musicStep;
    state.musicStep = (state.musicStep + 1) % MUSIC_LOOP_STEPS;
    if (isSlotHypeActive()) playHypeMusicBeat(beat);
    else playNormalMusicBeat(beat);
    const swingDelay = beat % 2 === 0
      ? MUSIC_STEP_MS * 2 * MUSIC_SWING
      : MUSIC_STEP_MS * 2 * (1 - MUSIC_SWING);
    state.musicTimer = window.setTimeout(tick, swingDelay);
  };
  tick();
}

function stopBackgroundMusic() {
  if (!state.musicTimer) return;
  window.clearTimeout(state.musicTimer);
  state.musicTimer = null;
}

function armBackgroundMusic() {
  if (!state.sound) return;
  startBackgroundMusic();
}

function duckBackgroundMusic(duration = BGM_DUCK_IMPORTANT_MS, depth = BGM_DUCK_MEDIUM) {
  const until = performance.now() + duration;
  state.musicDuckingUntil = Math.max(state.musicDuckingUntil || 0, until);
  if (!state.musicDuckWindows) state.musicDuckWindows = [];
  state.musicDuckWindows.push({ until, depth });
  const context = ensureAudio();
  if (!context || !state.bgmGain) return;
  const activeDepth = currentMusicDuckFactor();
  const activeUntil = Math.max(until, ...state.musicDuckWindows.map((item) => item.until));
  const holdSeconds = Math.max(0.08, (activeUntil - performance.now()) / 1000);
  const now = context.currentTime;
  const current = Math.max(0.0001, state.bgmGain.gain.value || AUDIO_BGM_VOLUME);
  state.bgmGain.gain.cancelScheduledValues(now);
  state.bgmGain.gain.setValueAtTime(current, now);
  state.bgmGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, AUDIO_BGM_VOLUME * activeDepth), now + AUDIO_MUSIC_DUCK_ATTACK);
  state.bgmGain.gain.setValueAtTime(Math.max(0.0001, AUDIO_BGM_VOLUME * activeDepth), now + holdSeconds);
  state.bgmGain.gain.exponentialRampToValueAtTime(AUDIO_BGM_VOLUME, now + holdSeconds + AUDIO_MUSIC_DUCK_RELEASE);
}

function withSoundScope(category, gain, fn) {
  const previous = state.soundScope;
  state.soundScope = { category, gain };
  try {
    fn();
  } finally {
    state.soundScope = previous;
  }
}

function playCommercialHit(root = hz("Bb", 1), options = {}) {
  const delay = options.delay || 0;
  const size = options.size || 1;
  playTone(root, 0.16, {
    delay,
    to: Math.max(36, root * 0.5),
    type: "sine",
    volume: (options.low || 0.075) * size,
  });
  playTone(root * 2, 0.085, {
    delay: delay + 0.012,
    to: root * 1.38,
    type: "triangle",
    volume: (options.body || 0.032) * size,
    filter: { type: "bandpass", from: 360, to: 980, q: 1.8 },
  });
  playNoise(0.055, {
    delay: delay + 0.006,
    frequency: options.noiseFreq || 1800,
    filterType: "bandpass",
    q: 1.4,
    volume: (options.noise || 0.016) * size,
  });
}

function playCasinoShine(base = hz("F", 5), options = {}) {
  const count = options.count || 3;
  const spacing = options.spacing || 0.035;
  const volume = options.volume || 0.035;
  for (let i = 0; i < count; i += 1) {
    playTone(base * 2 ** (i / 7), 0.045, {
      delay: (options.delay || 0) + i * spacing,
      type: i % 2 ? "sine" : "triangle",
      volume: volume * (1 - i * 0.08),
      filter: { type: "highpass", from: 980, q: 0.74 },
    });
  }
  playNoise(0.035, {
    delay: (options.delay || 0) + count * spacing * 0.55,
    frequency: options.noiseFreq || 6200,
    filterType: "highpass",
    q: 0.7,
    volume: volume * 0.26,
  });
}

function playCoinSpray(options = {}) {
  const count = options.count || 8;
  const volume = options.volume || 0.04;
  for (let i = 0; i < count; i += 1) {
    const delay = (options.delay || 0) + i * (options.spacing || 0.045);
    const freq = (options.base || hz("Bb", 5)) * 2 ** ((i % 5) / 12);
    playTone(freq, 0.026, {
      delay,
      type: "square",
      volume: volume * (0.85 + Math.random() * 0.18),
      filter: { type: "highpass", from: 1200, q: 0.86 },
    });
    if (i % 2 === 0) {
      playNoise(0.016, {
        delay: delay + 0.006,
        frequency: 5600 + Math.random() * 1800,
        filterType: "highpass",
        volume: volume * 0.22,
      });
    }
  }
}

function playSuspenseInhale(options = {}) {
  withSoundScope("nearMiss", options.gain || 1, () => {
    playRiser(options.start || hz("Bb", 1), options.end || hz("F", 3), options.duration || 0.48, {
      volume: options.volume || 0.026,
      q: 2.1,
      noiseFreq: 1900,
    });
    playTone(hz("Bb", 1), 0.16, { delay: 0.08, to: hz("Ab", 1), type: "sine", volume: 0.028 });
    playNoise(0.09, { delay: 0.16, frequency: 1200, filterType: "bandpass", q: 1.1, volume: 0.012 });
  });
}

function playNearMissPerformance(kind = "meter") {
  duckBackgroundMusic(680, BGM_DUCK_LIGHT);
  const endNote = kind === "wheel" ? hz("Db", 4) : kind === "slot" ? hz("F", 3) : hz("Bb", 3);
  playSuspenseInhale({ end: endNote, duration: kind === "wheel" ? 0.62 : 0.46, volume: kind === "wheel" ? 0.032 : 0.024 });
  withSoundScope("nearMiss", kind === "wheel" ? 1.08 : 0.9, () => {
    playTone(hz("Bb", 1), 0.11, { delay: 0.18, to: hz("F", 1), type: "sine", volume: 0.03 });
    playTone(endNote, 0.07, { delay: 0.42, type: "triangle", volume: 0.026, filter: { type: "bandpass", from: 520, to: 1500, q: 2.4 } });
    playNoise(0.04, { delay: 0.5, frequency: 3600, filterType: "highpass", volume: 0.008 });
  });
}

function playEventRollStepSound(stage, index, total) {
  withSoundScope("eventRoll", stage >= 3 ? 1.28 : 1.08, () => {
    const progress = total <= 1 ? 1 : index / (total - 1);
    const base = hz(stage >= 3 ? "F" : "Db", 4) * (1 + progress * 0.18);
    playTone(base, 0.038, { type: "square", volume: 0.056, filter: { type: "bandpass", from: 1100, to: 2600, q: 4.8 } });
    playNoise(0.022, { delay: 0.006, frequency: 5200 + progress * 1800, filterType: "highpass", volume: 0.018 });
    if (index === 0 || index === total - 1) playCommercialHit(hz("Bb", 1), { delay: 0.014, size: 0.72, low: 0.056, body: 0.022, noise: 0.012 });
  });
}

function playEventRollStartPerformance(stage) {
  duckBackgroundMusic(stage >= 3 ? 920 : 720, BGM_DUCK_MEDIUM);
  withSoundScope("eventRoll", stage >= 3 ? 1.35 : 1.14, () => {
    playCommercialHit(hz("Bb", 1), { size: stage >= 3 ? 1 : 0.82, low: 0.072, body: 0.034, noise: 0.018 });
    playRiser(hz("Bb", 2), stage >= 3 ? hz("F", 5) : hz("Db", 5), 0.32, { delay: 0.03, volume: 0.052, q: 3.2, noiseFreq: 3800 });
    playCasinoShine(hz("F", 5), { delay: 0.12, count: 3, volume: 0.032 });
  });
}

function playEventRollLockPerformance(stage, event) {
  duckBackgroundMusic(stage >= 3 ? 820 : 620, stage >= 3 ? BGM_DUCK_DEEP : BGM_DUCK_MEDIUM);
  withSoundScope("eventRoll", stage >= 3 ? 1.42 : 1.22, () => {
    playCommercialHit(hz("Bb", 1), { size: stage >= 3 ? 1.14 : 0.95, low: 0.078, body: 0.042, noise: 0.024, noiseFreq: 1300 });
    playTone(event?.kind === "flame" ? hz("F", 5) : hz("Db", 5), 0.08, { delay: 0.08, type: "square", volume: 0.064, filter: { type: "bandpass", from: 1200, to: 2600, q: 3.6 } });
    playCasinoShine(stage >= 3 ? hz("Bb", 5) : hz("F", 5), { delay: 0.17, count: stage >= 3 ? 5 : 3, volume: stage >= 3 ? 0.052 : 0.04 });
  });
}

function playMatchClearPerformance(cellCount, cascade = 0, hasSpecialBlast = false) {
  const bigClear = cellCount >= 8 || hasSpecialBlast;
  withSoundScope(hasSpecialBlast ? "special" : "match", bigClear ? 1.18 : 1.02, () => {
    const base = cascade > 0 ? hz("Db", 5) : hz("Bb", 4);
    playCommercialHit(hz("Bb", 2), { size: bigClear ? 0.72 : 0.46, low: 0.04, body: 0.02, noise: 0.012, noiseFreq: 2100 });
    playTone(base, 0.048, { type: "square", volume: 0.046, filter: { type: "bandpass", from: 900, to: 2400, q: 3.6 } });
    playCasinoShine(hz("F", 5), { delay: 0.042, count: Math.min(5, Math.max(2, Math.round(cellCount / 3))), spacing: 0.028, volume: 0.034 });
    if (bigClear) {
      playBrassStab(hasSpecialBlast ? "dominant" : "bright", { delay: 0.13, volume: 0.044, duration: 0.09, voices: 3 });
    }
  });
}

function playMeterGainPerformance(count, before, after) {
  const progress = SPECIAL_METER_MAX ? after / SPECIAL_METER_MAX : 0;
  withSoundScope("meter", 0.96 + Math.min(0.24, count * 0.018), () => {
    playTone(hz("Db", 5) * (1 + progress * 0.08), 0.042, { type: "triangle", volume: 0.036, filter: { type: "highpass", from: 900, q: 0.8 } });
    playNoise(0.018, { delay: 0.018, frequency: 4400 + progress * 1800, filterType: "highpass", volume: 0.012 });
    playCasinoShine(hz("Ab", 5) * (1 + progress * 0.05), { delay: 0.046, count: 2, spacing: 0.035, volume: 0.026 });
    if (count >= 5) playBassThump(hz("Bb", 2), { delay: 0.035, duration: 0.07, volume: 0.028, toRatio: 0.72 });
  });
}

function playMeterThresholdPerformance(stage) {
  duckBackgroundMusic(760, BGM_DUCK_MEDIUM);
  withSoundScope("meter", stage >= 3 ? 1.36 : 1.16, () => {
    playRiser(hz("Bb", 3), stage >= 3 ? hz("F", 6) : hz("Db", 6), 0.28, { volume: 0.058, q: 3.2, noiseFreq: 5200 });
    playCommercialHit(hz("Bb", 1), { delay: 0.2, size: stage >= 3 ? 1.04 : 0.82, low: 0.07, body: 0.04, noise: 0.022, noiseFreq: 1600 });
    playCasinoShine(stage >= 3 ? hz("Bb", 5) : hz("F", 5), { delay: 0.24, count: stage >= 3 ? 6 : 4, spacing: 0.038, volume: stage >= 3 ? 0.058 : 0.046 });
    playBrassStab(stage >= 3 ? "tonic" : "bright", { delay: 0.36, volume: stage >= 3 ? 0.058 : 0.044, duration: 0.12, voices: 3 });
  });
}

function playFlameSweepPerformance(index, total) {
  withSoundScope("special", 1.05, () => {
    const progress = total <= 1 ? 1 : index / (total - 1);
    playFlameWhoosh({
      start: hz("F", 2) * (1 + progress * 0.18),
      end: hz("Bb", 4) * (1 + progress * 0.12),
      duration: 0.16,
      volume: 0.038,
      crackle: index % 2 === 0 ? 3 : 2,
      noiseFreq: 3000,
    });
    if (index === 0 || index >= total - 2) playBassThump(hz("Bb", 1), { delay: 0.03, duration: 0.1, volume: 0.04, toRatio: 0.58 });
  });
}

function playFlameBurnPerformance() {
  withSoundScope("special", 1.3, () => {
    playRiser(hz("Bb", 1), hz("F", 5), 0.24, { volume: 0.07, q: 3.2, noiseFreq: 3600 });
    playMachineRumble({ delay: 0.02, duration: 0.52, root: hz("Bb", 1), to: hz("F", 1), volume: 0.066, noiseFreq: 520 });
    playFireCrackle({ delay: 0.08, count: 9, spacing: 0.035, volume: 0.034, frequency: 2200 });
    playCommercialHit(hz("F", 1), { delay: 0.18, size: 1.3, low: 0.095, body: 0.045, noise: 0.034, noiseFreq: 820 });
  });
}

function playMultiplierCollectPerformance(collected, shouldPlayClimaxIntro = false) {
  if (!state.sound || collected.length === 0) return;
  const highValue = Math.max(...collected.map((item) => item.value));
  const isFull = state.filledSlots.size >= SLOT_COUNT;
  const tierGain = shouldPlayClimaxIntro || isFull ? 1.35 : collected.length >= 2 ? 1.18 : 1;
  withSoundScope("multiplier", tierGain, () => {
    playTone(hz("F", 4), 0.08, { type: "sawtooth", volume: 0.052, filter: { type: "bandpass", from: 720, to: 1900, q: 4.4 } });
    playCasinoShine(hz("Db", 5), { delay: 0.04, count: Math.min(7, collected.length + 3), spacing: 0.043, volume: 0.056 });
    collected.forEach((item, index) => {
      const delay = 0.11 + index * 0.11;
      playCommercialHit(hz("Bb", 1), { delay, size: 0.82, low: 0.052, body: 0.024, noise: 0.014, noiseFreq: 1500 });
      playTone(hz("Bb", 5) * (1 + index * 0.06), 0.045, { delay: delay + 0.025, type: "square", volume: 0.062, filter: { type: "highpass", from: 1100, q: 0.9 } });
      playNoise(0.024, { delay: delay + 0.02, frequency: 6200, filterType: "highpass", volume: 0.022 });
    });
    if (collected.length >= 2 || highValue >= 50) {
      playRiser(hz("Bb", 2), hz("Db", 6), 0.32, { delay: 0.14, volume: 0.058, q: 3, noiseFreq: 4800 });
      playBrassStab("bright", { delay: 0.42, volume: 0.06, duration: 0.13, voices: 4 });
    }
    if (isFull || shouldPlayClimaxIntro) {
      playHydraulicClank({ delay: 0.52, root: hz("F", 1), low: 0.082, noise: 0.036, stab: 0.04, chord: "tonic" });
      playMachineRumble({ delay: 0.58, duration: 0.5, root: hz("Bb", 1), to: hz("Db", 2), volume: 0.052, noiseFreq: 740 });
    }
  });
}

function playClimaxIntroPerformance(phase) {
  withSoundScope("transition", phase === "lift" ? 1.34 : 1.24, () => {
    if (phase === "logo") {
      playMachineRumble({ duration: 1.2, root: hz("Bb", 1), to: hz("F", 1), volume: 0.075, from: 520, lowTo: 120, noiseFreq: 520 });
      playTone(hz("Bb", 2), 0.38, { delay: 0.08, to: hz("F", 2), type: "sawtooth", volume: 0.058, filter: { type: "bandpass", from: 420, to: 1250, q: 3.4 } });
      playHydraulicClank({ delay: 0.48, root: hz("F", 1), low: 0.075, noise: 0.034, stab: 0.038, chord: "shadow" });
      playNoise(0.12, { delay: 0.9, frequency: 4800, filterType: "highpass", volume: 0.028 });
      return;
    }
    playRiser(hz("Bb", 1), hz("Bb", 3), 1.05, { volume: 0.078, q: 2.5, noiseFreq: 1700 });
    playMachineRumble({ delay: 0.04, duration: 1.08, root: hz("F", 1), to: hz("Db", 2), volume: 0.056, noiseFreq: 760 });
    playHydraulicClank({ delay: 0.38, root: hz("Bb", 1), low: 0.066, noise: 0.032, stab: 0.034, chord: "shadow" });
    playHydraulicClank({ delay: 1.02, root: hz("F", 1), low: 0.08, noise: 0.04, stab: 0.044, chord: "tonic" });
  });
}

function playWheelStartPerformance() {
  withSoundScope("wheel", 1.24, () => {
    playMachineRumble({ duration: 0.9, root: hz("Bb", 1), to: hz("F", 1), volume: 0.065, noiseFreq: 620 });
    playRiser(hz("F", 2), hz("Db", 5), 0.58, { delay: 0.08, volume: 0.052, q: 3, noiseFreq: 3400 });
    playCommercialHit(hz("Bb", 1), { delay: 0.54, size: 1.05, low: 0.082, body: 0.038, noise: 0.024, noiseFreq: 980 });
    playHydraulicClank({ delay: 0.6, root: hz("Bb", 1), low: 0.052, noise: 0.022, stab: 0.028, chord: "dominant" });
  });
}

function playWheelStopPerformance(multiplier) {
  withSoundScope("wheel", multiplier >= 5 ? 1.48 : 1.22, () => {
    playCommercialHit(hz("Bb", 1), { size: multiplier >= 5 ? 1.42 : 1.1, low: 0.104, body: 0.052, noise: 0.03, noiseFreq: 950 });
    playNoise(0.05, { delay: 0.045, frequency: 7600, filterType: "highpass", volume: 0.026 });
    playBrassStab(multiplier >= 5 ? "tonic" : "resolve", { delay: 0.1, volume: multiplier >= 5 ? 0.076 : 0.062, duration: 0.18, voices: 4 });
    if (multiplier >= 1) playCasinoShine(hz("Bb", 4), { delay: 0.18, count: multiplier >= 5 ? 7 : 4, spacing: 0.04, volume: multiplier >= 5 ? 0.064 : 0.046 });
  });
}

function playWinCardPerformance(tier) {
  withSoundScope("payout", tier.ratio >= 50 ? 1.45 : tier.ratio >= 20 ? 1.28 : 1.1, () => {
    playCommercialHit(hz("Bb", 1), { size: tier.ratio >= 50 ? 1.55 : 1.2, low: 0.11, body: 0.052, noise: 0.032, noiseFreq: 1300 });
    playRiser(hz("Bb", 2), tier.ratio >= 50 ? hz("F", 6) : hz("Db", 6), 0.34, { delay: 0.02, volume: 0.068, q: 3.3, noiseFreq: 5200 });
    playCoinSpray({ delay: 0.08, count: tier.ratio >= 50 ? 12 : 8, spacing: 0.034, volume: tier.ratio >= 50 ? 0.052 : 0.044 });
  });
  playSound(tier.voice || "voiceBigWin");
  window.setTimeout(() => playSound(tier.sound || "win"), 120);
}

function playMultiplierCollectSound(value, collectedCount = 1, filledSlotCount = state.filledSlots.size) {
  const isFull = filledSlotCount >= SLOT_COUNT;
  if (isFull || value >= 100) {
    playSound("multiplierJackpotCollect");
  } else if (collectedCount >= 2 || value >= 50) {
    playSound("multiplierEpicCollect");
  } else if (value >= 20) {
    playSound("multiplierCollectHigh");
  } else {
    playSound("multiplierCollect");
  }
}

function playRiser(start = 220, end = 1320, duration = 0.42, options = {}) {
  playTone(start, duration, {
    to: end,
    type: options.type || "sawtooth",
    volume: options.volume || 0.045,
    delay: options.delay || 0,
    filter: { type: "bandpass", from: start * 1.4, to: end * 0.9, q: options.q || 2.4 },
  });
  playNoise(duration * 0.8, {
    delay: (options.delay || 0) + duration * 0.15,
    frequency: options.noiseFreq || 4200,
    filterType: "highpass",
    volume: (options.volume || 0.045) * 0.22,
  });
}

function playImpact(root = 98, options = {}) {
  const delay = options.delay || 0;
  playTone(root, 0.22, { delay, to: Math.max(40, root * 0.48), type: "sine", volume: options.low || 0.075 });
  playTone(root * 2, 0.13, { delay: delay + 0.018, to: root * 1.18, type: "square", volume: options.mid || 0.04 });
  playNoise(0.1, { delay: delay + 0.012, frequency: options.noiseFreq || 1600, filterType: "bandpass", volume: options.noise || 0.022 });
}

function playSparkleRun(base = 784, count = 5, options = {}) {
  for (let i = 0; i < count; i += 1) {
    playTone(base * 2 ** (i / 12), 0.055, {
      delay: (options.delay || 0) + i * (options.spacing || 0.055),
      type: i > 2 ? "square" : "triangle",
      volume: options.volume || 0.055,
      filter: { type: "highpass", from: 520, q: 0.8 },
    });
  }
}

function playSfxChord(name = "tonic", duration = 0.12, options = {}) {
  const chord = SFX_CHORDS[name] || SFX_CHORDS.tonic;
  const transpose = options.transpose || 1;
  const tones = chord.slice(0, options.voices || 3).map((freq) => freq * transpose);
  playChord(tones, duration, {
    delay: options.delay || 0,
    type: options.type || "triangle",
    volume: options.volume || 0.055,
    filter: options.filter || { type: "lowpass", from: 2200, to: 1300, q: 0.9 },
  });
}

function playBrassStab(name = "dominant", options = {}) {
  playSfxChord(name, options.duration || 0.11, {
    delay: options.delay || 0,
    transpose: options.transpose || 2,
    voices: options.voices || 3,
    type: "sawtooth",
    volume: options.volume || 0.04,
    filter: { type: "bandpass", from: options.from || 760, to: options.to || 1900, q: options.q || 2.2 },
  });
}

function playBassThump(root = hz("Bb", 1), options = {}) {
  const delay = options.delay || 0;
  playTone(root, options.duration || 0.14, {
    delay,
    to: Math.max(40, root * (options.toRatio || 0.56)),
    type: "sine",
    volume: options.volume || 0.058,
  });
}

function playWahFlick(freq = hz("F", 4), options = {}) {
  playTone(freq, options.duration || 0.06, {
    delay: options.delay || 0,
    to: freq * (options.toRatio || 1.08),
    type: "sawtooth",
    volume: options.volume || 0.028,
    filter: { type: "bandpass", from: options.from || 620, to: options.to || 1700, q: options.q || 4.2 },
  });
}

function playMachineRumble(options = {}) {
  const delay = options.delay || 0;
  const duration = options.duration || 0.72;
  playTone(options.root || hz("Bb", 1), duration, {
    delay,
    to: options.to || hz("F", 1),
    type: "sawtooth",
    volume: options.volume || 0.052,
    filter: { type: "lowpass", from: options.from || 520, to: options.lowTo || 180, q: 1.2 },
  });
  playNoise(duration * 0.8, {
    delay: delay + duration * 0.08,
    frequency: options.noiseFreq || 620,
    filterType: "bandpass",
    volume: (options.volume || 0.052) * 0.38,
  });
}

function playFireCrackle(options = {}) {
  const count = options.count || 5;
  for (let i = 0; i < count; i += 1) {
    playNoise(0.026 + Math.random() * 0.025, {
      delay: (options.delay || 0) + i * (options.spacing || 0.045),
      frequency: (options.frequency || 2300) + Math.random() * 2200,
      filterType: "bandpass",
      q: 4.2,
      volume: options.volume || 0.018,
    });
  }
}

function playFlameWhoosh(options = {}) {
  playRiser(options.start || hz("Bb", 2), options.end || hz("F", 5), options.duration || 0.28, {
    delay: options.delay || 0,
    volume: options.volume || 0.042,
    q: 2.8,
    noiseFreq: options.noiseFreq || 2600,
  });
  playFireCrackle({
    delay: (options.delay || 0) + 0.06,
    count: options.crackle || 4,
    spacing: 0.038,
    volume: (options.volume || 0.042) * 0.42,
  });
}

function playHydraulicClank(options = {}) {
  const delay = options.delay || 0;
  playBassThump(options.root || hz("Bb", 1), { delay, duration: 0.16, volume: options.low || 0.058, toRatio: 0.48 });
  playNoise(0.08, { delay: delay + 0.018, frequency: options.noiseFreq || 980, filterType: "bandpass", q: 3.2, volume: options.noise || 0.024 });
  playBrassStab(options.chord || "shadow", { delay: delay + 0.045, volume: options.stab || 0.024, duration: 0.08, transpose: 1 });
}

function playVoiceFallback(pattern, options = {}) {
  playMachineRumble({
    duration: options.duration || 0.52,
    root: hz("Bb", 1),
    to: hz("Ab", 1),
    volume: options.rumble || 0.028,
    noiseFreq: 540,
  });
  pattern.forEach((freq, index) => {
    const delay = 0.04 + index * (options.spacing || 0.095);
    playTone(freq, options.noteDuration || 0.085, {
      delay,
      to: freq * 0.94,
      type: "sawtooth",
      volume: options.volume || 0.04,
      filter: { type: "bandpass", from: 420, to: 1450, q: 3.4 },
    });
    playTone(freq * 1.5, options.noteDuration || 0.085, {
      delay: delay + 0.012,
      to: freq * 1.38,
      type: "triangle",
      volume: (options.volume || 0.04) * 0.46,
      filter: { type: "bandpass", from: 760, to: 2100, q: 2.8 },
    });
  });
}

function speakAnnouncer(text, options = {}) {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return false;
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices?.() || [];
  const preferred = voices.find((voice) => /english|en-/i.test(`${voice.lang} ${voice.name}`) && /male|guy|david|mark|daniel|george/i.test(voice.name))
    || voices.find((voice) => /english|en-/i.test(`${voice.lang} ${voice.name}`));
  if (preferred) utterance.voice = preferred;
  utterance.lang = preferred?.lang || "en-US";
  utterance.rate = options.rate || 1.08;
  utterance.pitch = options.pitch || 0.86;
  utterance.volume = options.volume || 0.46;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

function playAnnouncerVoice(text, options = {}) {
  playBrassStab(options.chord || "shadow", {
    volume: options.stabVolume || 0.024,
    duration: 0.08,
    transpose: options.stabTranspose || 1,
  });
  playVoiceFallback(options.pattern || [hz("Bb", 2), hz("Db", 3), hz("F", 3)], options);
  const spoke = speakAnnouncer(text, options);
  if (spoke) {
    playNoise(0.12, {
      delay: 0.04,
      frequency: 1600,
      filterType: "bandpass",
      volume: 0.008,
    });
  }
}

function reserveSoundVoice(kind, profile, now) {
  const voice = state.soundVoiceState[kind] || { active: 0, lastAt: 0 };
  const elapsed = now - voice.lastAt;
  if (elapsed < profile.cooldown) return null;
  if (voice.active >= profile.maxVoices) return null;
  const attenuation = 1 / (1 + voice.active * (profile.attenuation || 0.4));
  voice.active += 1;
  voice.lastAt = now;
  state.soundVoiceState[kind] = voice;
  window.setTimeout(() => {
    voice.active = Math.max(0, voice.active - 1);
  }, profile.release || 360);
  return attenuation;
}

function playSound(kind) {
  if (!state.sound) return;
  recordPerf(`sound.${kind}`, 0);
  const now = performance.now();
  const profile = SOUND_PROFILES[kind] || DEFAULT_SOUND_PROFILE;
  const attenuation = reserveSoundVoice(kind, profile, now);
  if (attenuation === null) return;
  state.lastSoundAt[kind] = now;
  ensureAudio();
  startBackgroundMusic();
  state.soundScope = {
    category: profile.category,
    gain: (profile.gain || 1) * attenuation,
  };

  const soundMap = {
    button: () => {
      playWahFlick(hz("F", 5), { duration: 0.034, volume: 0.026, from: 900, to: 2100, q: 3.8 });
      playTone(hz("Bb", 4), 0.026, { delay: 0.018, to: hz("C", 5), type: "sine", volume: 0.015 });
    },
    move: () => {
      playWahFlick(hz("Db", 4), { duration: 0.046, volume: 0.03, from: 560, to: 1400, q: 3.6 });
      playNoise(0.022, { delay: 0.012, frequency: 3600, filterType: "highpass", volume: 0.008 });
    },
    match: () => {
      playSfxChord("bright", 0.09, { volume: 0.044, voices: 3, filter: { type: "lowpass", from: 2300, to: 1500, q: 0.8 } });
      playTone(hz("Bb", 5), 0.042, { delay: 0.054, type: "triangle", volume: 0.032, filter: { type: "highpass", from: 720, q: 0.8 } });
    },
    cascade: () => {
      playBassThump(hz("Bb", 2), { duration: 0.1, volume: 0.03, toRatio: 0.72 });
      playSfxChord("tonic", 0.085, { delay: 0.045, volume: 0.036, voices: 3 });
    },
    drop: () => {
      playBassThump(hz("F", 2), { duration: 0.085, volume: 0.032, toRatio: 0.64 });
      playNoise(0.03, { delay: 0.012, frequency: 980, filterType: "bandpass", volume: 0.01 });
    },
    meterTick: () => {
      playTone(hz("Db", 5), 0.045, { type: "triangle", volume: 0.025, filter: { type: "highpass", from: 900, q: 0.8 } });
      playTone(hz("Ab", 5), 0.038, { delay: 0.04, type: "sine", volume: 0.018 });
      playNoise(0.016, { delay: 0.024, frequency: 4200, filterType: "highpass", volume: 0.006 });
    },
    specialReady: () => {
      playBrassStab("dominant", { volume: 0.038, duration: 0.095 });
      playTone(hz("C", 5), 0.08, { delay: 0.09, type: "triangle", volume: 0.032, filter: { type: "lowpass", from: 2500, to: 1400, q: 0.8 } });
    },
    specialSpawn: () => {
      playRiser(hz("F", 4), hz("Db", 6), 0.16, { volume: 0.04, q: 3 });
      playBrassStab("bright", { delay: 0.11, volume: 0.044, duration: 0.12, to: 2200 });
    },
    specialBlast: () => {
      playImpact(hz("Bb", 1), { low: 0.086, mid: 0.038, noise: 0.024, noiseFreq: 1200 });
      playBrassStab("dominant", { delay: 0.05, volume: 0.05, duration: 0.14, q: 2.4 });
    },
    candyClearEvent: () => {
      playSfxChord("bright", 0.09, { volume: 0.04, voices: 3 });
      playSparkleRun(hz("Ab", 5), 3, { delay: 0.058, spacing: 0.044, volume: 0.032 });
    },
    flameSweep: () => {
      playFlameWhoosh({ start: hz("F", 2), end: hz("Bb", 4), duration: 0.15, volume: 0.026, crackle: 2, noiseFreq: 2800 });
      playTone(hz("Bb", 1), 0.1, { delay: 0.012, to: hz("F", 1), type: "sawtooth", volume: 0.017, filter: { type: "lowpass", from: 400, to: 190, q: 1.1 } });
    },
    flameBurn: () => {
      playFlameWhoosh({ start: hz("Bb", 1), end: hz("Db", 5), duration: 0.3, volume: 0.054, crackle: 6, noiseFreq: 3200 });
      playImpact(hz("F", 1), { delay: 0.1, low: 0.09, mid: 0.038, noise: 0.03, noiseFreq: 760 });
      playMachineRumble({ delay: 0.035, duration: 0.32, root: hz("Bb", 1), to: hz("F", 1), volume: 0.036, noiseFreq: 620 });
    },
    flameResist: () => {
      playHydraulicClank({ root: hz("Ab", 1), low: 0.036, noise: 0.018, chord: "dominant" });
      playFireCrackle({ delay: 0.06, count: 3, spacing: 0.032, volume: 0.012, frequency: 1800 });
    },
    multiplierMerge: () => {
      playBassThump(hz("Bb", 1), { volume: 0.052 });
      playSfxChord("tonic", 0.12, { delay: 0.045, volume: 0.052, voices: 3 });
    },
    multiplierHigh: () => {
      playSparkleRun(hz("F", 5), 4, { spacing: 0.05, volume: 0.05 });
      playBrassStab("bright", { delay: 0.15, volume: 0.034, duration: 0.1 });
    },
    multiplierCollect: () => {
      playWahFlick(hz("Bb", 4), { duration: 0.066, volume: 0.044, from: 700, to: 1900 });
      playSfxChord("tonic", 0.075, { delay: 0.058, volume: 0.034, transpose: 2, voices: 2 });
    },
    multiplierCollectHigh: () => {
      playBassThump(hz("Bb", 1), { volume: 0.042, duration: 0.11 });
      playSparkleRun(hz("Db", 5), 4, { delay: 0.035, spacing: 0.052, volume: 0.052 });
    },
    multiplierEpicCollect: () => {
      playImpact(hz("Bb", 1), { low: 0.062, mid: 0.03, noise: 0.018, noiseFreq: 1600 });
      playSparkleRun(hz("F", 4), 5, { delay: 0.052, spacing: 0.052, volume: 0.056 });
      playBrassStab("bright", { delay: 0.24, volume: 0.036, duration: 0.12 });
    },
    multiplierJackpotCollect: () => {
      playImpact(hz("F", 1), { low: 0.085, mid: 0.042, noise: 0.026, noiseFreq: 1250 });
      playSparkleRun(hz("Bb", 4), 6, { delay: 0.045, spacing: 0.052, volume: 0.064 });
      playBrassStab("tonic", { delay: 0.34, volume: 0.045, duration: 0.15, voices: 4 });
    },
    slotProgress: () => {
      playMachineRumble({ duration: 0.28, root: hz("Bb", 1), to: hz("Db", 2), volume: 0.034, noiseFreq: 760 });
      playSparkleRun(hz("F", 4), 3, { delay: 0.08, spacing: 0.06, volume: 0.034 });
    },
    win: () => {
      playSparkleRun(hz("F", 4), 4, { spacing: 0.07, volume: 0.05 });
      playSfxChord("resolve", 0.14, { delay: 0.18, volume: 0.044, voices: 3 });
    },
    superWin: () => {
      playRiser(hz("Bb", 2), hz("Db", 6), 0.34, { volume: 0.052, q: 3.1, noiseFreq: 4600 });
      playImpact(hz("Bb", 1), { delay: 0.28, low: 0.07, mid: 0.036, noise: 0.02, noiseFreq: 1500 });
      playBrassStab("resolve", { delay: 0.36, volume: 0.05, duration: 0.18, voices: 4 });
    },
    jackpot: () => {
      playRiser(hz("F", 2), hz("F", 6), 0.46, { volume: 0.06, q: 3.4, noiseFreq: 5600 });
      playImpact(hz("F", 1), { delay: 0.4, low: 0.095, mid: 0.045, noise: 0.028, noiseFreq: 1100 });
      playSparkleRun(hz("Bb", 4), 7, { delay: 0.12, spacing: 0.055, volume: 0.066 });
      playBrassStab("tonic", { delay: 0.56, volume: 0.056, duration: 0.24, voices: 4 });
    },
    voiceBigWin: () => {
      playAnnouncerVoice("Big win", {
        chord: "tonic",
        pattern: [hz("Bb", 2), hz("Db", 3), hz("F", 3)],
        rate: 1.16,
        pitch: 0.9,
        volume: 0.28,
        duration: 0.44,
        noteDuration: 0.075,
        spacing: 0.088,
        stabVolume: 0.018,
      });
    },
    voiceMegaWin: () => {
      playAnnouncerVoice("Mega win", {
        chord: "dominant",
        pattern: [hz("Db", 3), hz("F", 3), hz("Ab", 3), hz("Bb", 3)],
        rate: 1.12,
        pitch: 0.88,
        volume: 0.31,
        duration: 0.56,
        noteDuration: 0.082,
        spacing: 0.086,
        stabVolume: 0.02,
      });
    },
    voiceSuperMegaWin: () => {
      playAnnouncerVoice("Super mega win", {
        chord: "bright",
        pattern: [hz("Bb", 2), hz("Db", 3), hz("F", 3), hz("Ab", 3), hz("Bb", 3)],
        rate: 1.08,
        pitch: 0.86,
        volume: 0.34,
        duration: 0.72,
        noteDuration: 0.086,
        spacing: 0.088,
        stabVolume: 0.022,
      });
    },
    voiceEpicWin: () => {
      playAnnouncerVoice("Epic win", {
        chord: "shadow",
        pattern: [hz("F", 2), hz("Bb", 2), hz("Db", 3), hz("F", 3), hz("Ab", 3)],
        rate: 1.1,
        pitch: 0.88,
        volume: 0.34,
        duration: 0.64,
        noteDuration: 0.085,
        spacing: 0.086,
        stabVolume: 0.024,
      });
    },
    voiceLegendaryWin: () => {
      playAnnouncerVoice("Legendary win", {
        chord: "tonic",
        pattern: [hz("Bb", 1), hz("F", 2), hz("Bb", 2), hz("Db", 3), hz("F", 3), hz("Bb", 3)],
        rate: 1.04,
        pitch: 0.84,
        volume: 0.37,
        duration: 0.84,
        noteDuration: 0.09,
        spacing: 0.09,
        rumble: 0.03,
        stabVolume: 0.026,
      });
    },
    wheelSpin: () => {
      playWahFlick(hz("Bb", 4), { duration: 0.03, volume: 0.03, from: 1100, to: 2100, q: 5.4 });
      playNoise(0.012, { delay: 0.006, frequency: 5200, filterType: "highpass", volume: 0.006 });
    },
    wheelStop: () => {
      playImpact(hz("Bb", 1), { low: 0.09, mid: 0.04, noise: 0.024, noiseFreq: 1100 });
      playNoise(0.04, { delay: 0.055, frequency: 6800, filterType: "highpass", volume: 0.012 });
      playBrassStab("resolve", { delay: 0.1, volume: 0.052, duration: 0.17, voices: 4 });
    },
    climaxIntro: () => {
      playMachineRumble({ duration: 1.36, root: hz("Bb", 1), to: hz("F", 1), volume: 0.06, from: 460, lowTo: 120, noiseFreq: 500 });
      playTone(hz("Bb", 3), 0.42, { delay: 0.08, to: hz("F", 3), type: "square", volume: 0.024, filter: { type: "bandpass", from: 520, to: 1200, q: 3.4 } });
      playHydraulicClank({ delay: 0.46, root: hz("F", 1), low: 0.052, noise: 0.022, chord: "shadow" });
      playBrassStab("dominant", { delay: 1.08, volume: 0.038, duration: 0.12, transpose: 1 });
    },
    climaxLift: () => {
      playRiser(hz("Bb", 1), hz("Bb", 3), 1.2, { volume: 0.058, q: 2.3, noiseFreq: 1500 });
      playMachineRumble({ delay: 0.05, duration: 1.1, root: hz("F", 1), to: hz("Db", 2), volume: 0.034, noiseFreq: 820 });
      playHydraulicClank({ delay: 0.42, root: hz("Bb", 1), low: 0.046, noise: 0.02, chord: "shadow" });
      playHydraulicClank({ delay: 1.1, root: hz("F", 1), low: 0.056, noise: 0.026, chord: "tonic" });
      playBrassStab("tonic", { delay: 1.24, volume: 0.046, duration: 0.16, transpose: 1 });
    },
    logoReturn: () => {
      playSfxChord("resolve", 0.11, { volume: 0.036, transpose: 2, voices: 3 });
      playBassThump(hz("Bb", 1), { delay: 0.14, duration: 0.1, volume: 0.036, toRatio: 0.7 });
    },
    error: () => {
      playTone(hz("F", 2), 0.085, { to: hz("Db", 2), type: "sawtooth", volume: 0.04, filter: { type: "lowpass", from: 800, to: 360, q: 1 } });
      playNoise(0.04, { delay: 0.018, frequency: 760, filterType: "bandpass", volume: 0.01 });
    },
  };

  try {
    (soundMap[kind] || soundMap.button)();
  } finally {
    state.soundScope = null;
  }
}

boardEl.addEventListener("pointerdown", (event) => {
  armBackgroundMusic();
  const tile = event.target.closest(".tile");
  if (!tile || state.resolving) return;
  const point = pointFromTile(tile);
  const multiplier = multiplierAt(point.row, point.col);
  if (multiplier && multiplierSize(multiplier) > 1) return;
  if (!hasEnoughBalanceForMove()) {
    showInsufficientBalance();
    event.preventDefault();
    return;
  }

  state.pointer = {
    ...point,
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
  };

  clearDragVisuals();
  event.preventDefault();
  tile.setPointerCapture?.(event.pointerId);
});

boardEl.addEventListener("pointermove", (event) => {
  if (!state.pointer || state.pointer.id !== event.pointerId) return;
  event.preventDefault();
  updateDragVisual(event);
});

boardEl.addEventListener("pointerup", async (event) => {
  if (!state.pointer || state.pointer.id !== event.pointerId) return;

  const start = state.pointer;
  const next = pointFromSwipe(start, event.clientX - start.x, event.clientY - start.y);
  state.pointer = null;
  clearDragVisuals();

  state.ignoreClick = true;
  window.setTimeout(() => {
    state.ignoreClick = false;
  }, 350);

  if (!next) {
    await handleTileClick(start.row, start.col);
    return;
  }

  await attemptSwap(start, next);
});

boardEl.addEventListener("pointercancel", () => {
  state.pointer = null;
  clearDragVisuals();
});

boardEl.addEventListener("click", (event) => {
  if (state.ignoreClick) return;
  const tile = event.target.closest(".tile");
  if (!tile) return;
  handleTileClick(Number(tile.dataset.row), Number(tile.dataset.col));
});

document.getElementById("betDown").addEventListener("click", () => {
  if (state.resolving) return;
  playSound("button");
  state.betIndex = Math.max(0, state.betIndex - 1);
  render();
});

document.getElementById("betUp").addEventListener("click", () => {
  if (state.resolving) return;
  playSound("button");
  state.betIndex = Math.min(BET_STEPS.length - 1, state.betIndex + 1);
  render();
});

fastButton.addEventListener("click", () => {
  playSound("button");
  state.fast = !state.fast;
  render();
});

menuButton.addEventListener("click", () => {
  playSound("button");
  menuPanel.classList.toggle("hidden");
});

closeMenu.addEventListener("click", () => {
  playSound("button");
  menuPanel.classList.add("hidden");
});

soundMenuButton.addEventListener("click", () => {
  state.sound = !state.sound;
  if (state.sound) {
    armBackgroundMusic();
    playSound("button");
  } else {
    stopBackgroundMusic();
  }
  render();
});

specialOddsButton.addEventListener("click", () => {
  if (state.resolving) return;
  state.specialOdds = !state.specialOdds;
  playSound("button");
  startNewBoard(true);
  menuPanel.classList.add("hidden");
});

window.setTimeout(() => armBackgroundMusic(), 420);
window.addEventListener("pointerdown", armBackgroundMusic, { once: true });
window.addEventListener("keydown", armBackgroundMusic, { once: true });

function randomSpecialReward() {
  return randomBoardEvent();
}

function chooseCreatedSpecial() {
  return null;
}

function tileLabel(tile) {
  if (!tile) return "空格";
  if (tile.kind === "multiplier") return `${multiplierDisplay(tile)} 倍數糖`;
  if (tile.special === "chocolate") return "巧克力糖";
  return `${tile.type} 糖果`;
}

function specialName(special) {
  return special === "chocolate" ? "巧克力糖" : "特殊物件";
}

function specialEffectCells(row, col, tile) {
  if (tile.special === "chocolate") {
    tile._targetType = tile._targetType || randomVisibleCandyType(tile.type);
    return candyCellsByType(tile._targetType, false);
  }
  return new Set();
}

function renderHud() {
  document.querySelector(".special-meter-copy span").textContent = "事件收集";
  specialMeterTextEl.textContent = `${Math.min(state.specialMeter, SPECIAL_METER_MAX)}/${SPECIAL_METER_MAX}`;
  specialMeterFillEl.style.width = `${Math.min(100, (state.specialMeter / SPECIAL_METER_MAX) * 100)}%`;
  const phoneEl = document.querySelector(".phone");
  phoneEl?.classList.toggle("low-balance", !hasEnoughBalanceForMove());
  phoneEl?.classList.toggle("slot-hype", isSlotHypeActive());
  phoneEl?.classList.toggle("multiplier-climax", isMultiplierClimaxActive());
  phoneEl?.classList.toggle("flame-active", Boolean(state.flameCells?.size));
  phoneEl?.classList.toggle("climax-spinning", state.climaxSpinning);
  phoneEl?.classList.toggle("climax-intro-logo", state.climaxIntroPhase === "logo");
  phoneEl?.classList.toggle("climax-intro-wheel", state.climaxIntroPhase === "wheel");
  phoneEl?.classList.toggle("climax-logo-return", state.climaxLogoReturn);
  if (!state.stagePreviews.length) state.stagePreviews = initialStagePreviews();
  const currentStage = currentSpecialStageIndex();
  const focusedStage = state.rollingStage && (state.miniSlotRolling || state.miniSlotWin);
  stageSlotsEl?.classList.toggle("is-rolling", Boolean(focusedStage));
  stageSlotEls.forEach((slot, index) => {
    const stage = index + 1;
    const preview = state.stagePreviews[index] || randomBoardEvent(stage);
    const img = slot.querySelector("img");
    if (img) img.src = eventPreviewAsset(preview);
    slot.classList.toggle("active", stage === currentStage && state.specialMeter < SPECIAL_METER_MAX);
    slot.classList.toggle("complete", state.specialMeter >= SPECIAL_METER_THRESHOLDS[index]);
    slot.classList.toggle("rolling", state.miniSlotRolling && (!state.rollingStage || state.rollingStage === stage));
    slot.classList.toggle("win", state.miniSlotWin && state.rollingStage === stage);
    slot.classList.toggle("dimmed", Boolean(focusedStage && state.rollingStage !== stage));
    slot.classList.toggle("multiplier-preview", preview.kind === "multiplier");
    slot.dataset.value = preview.kind === "multiplier" ? multiplierDisplay(preview) : "";
  });
  state.miniSlotPreview = state.stagePreviews[0] || state.miniSlotPreview;
  miniSlotIconEl.src = eventPreviewAsset(state.miniSlotPreview);
  balanceEl.textContent = formatBalance(state.balance);
  betEl.textContent = currentBet().toLocaleString("en-US");
  fastButton.setAttribute("aria-pressed", String(state.fast));
  soundMenuButton.textContent = state.sound ? "音效開啟" : "音效關閉";
  specialOddsButton.textContent = state.specialOdds ? "特殊機率開啟" : "特殊機率關閉";
}

function triggerStageRollStep(stage) {
  const slot = stageSlotEls[stage - 1];
  const img = slot?.querySelector("img");
  if (!img) return;
  img.classList.remove("roll-step");
  void img.offsetWidth;
  img.classList.add("roll-step");
}

function findBoardEventCell({ allowMultiplierTarget = false, useMultiplierRows = false } = {}) {
  if (useMultiplierRows) {
    return pickMultiplierSpawnCell(state.board, (cell, tile) => isOrdinaryCandy(tile));
  }

  const cells = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const tile = state.board[row][col];
      if (isOrdinaryCandy(tile) || (allowMultiplierTarget && tile?.kind === "multiplier")) {
        cells.push({ row, col });
      }
    }
  }
  return cells.length ? randomItem(cells) : null;
}

function surroundingPoints(row, col, radius = 1) {
  const points = [];
  for (let r = row - radius; r <= row + radius; r += 1) {
    for (let c = col - radius; c <= col + radius; c += 1) {
      if (r === row && c === col) continue;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
      points.push({ row: r, col: c });
    }
  }
  return points;
}

function sniperStepDelays(steps) {
  const normalTotal = steps * 80 + ((steps - 1) * steps * 10) / 2;
  const quickTotal = steps * 38;
  const total = state.fast ? quickTotal : normalTotal;
  const weights = Array.from({ length: steps }, (_, index) => 0.42 + (index / Math.max(1, steps - 1)) ** 1.9 * 1.68);
  const weightTotal = weights.reduce((sum, value) => sum + value, 0);
  return weights.map((weight) => (weight / weightTotal) * total);
}

function flameStepDelays(steps) {
  const baseSteps = state.fast ? 8 : 14;
  const extraSteps = Math.max(0, steps - baseSteps);
  const total = (state.fast ? 520 : 1900) + extraSteps * (state.fast ? 70 : 210);
  const weights = Array.from({ length: steps }, (_, index) => {
    const progress = index / Math.max(1, steps - 1);
    return 0.16 + progress ** 3.2 * 2.9;
  });
  const weightTotal = weights.reduce((sum, value) => sum + value, 0);
  return weights.map((weight) => (weight / weightTotal) * total);
}

function cloneSniperResultTile(tile) {
  if (tile?.kind === "multiplier") {
    return { kind: "multiplier", value: tile.value, _reward: true };
  }
  return { kind: "candy", type: tile?.type || randomItem(CANDIES), _reward: true };
}

function markSniperTarget(point) {
  boardEl.querySelectorAll(".sniper-target").forEach((tile) => tile.classList.remove("sniper-target"));
  if (!point) return;
  boardEl.querySelector(tileSelector(point))?.classList.add("sniper-target");
}

async function playSniperEvent() {
  const targets = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const tile = state.board[row][col];
      if (isOrdinaryCandy(tile) || tile?.kind === "multiplier") targets.push({ row, col });
    }
  }
  if (!targets.length) return false;

  const finalTarget = randomItem(targets);
  const steps = state.fast ? 8 : 15;
  const stepDelays = sniperStepDelays(steps);
  playSound("specialReady");
  for (let i = 0; i < steps; i += 1) {
    const point = i === steps - 1 ? finalTarget : randomItem(targets);
    state.sniperTarget = point;
    render();
    markSniperTarget(point);
    await wait(stepDelays[i]);
  }

  const targetTile = state.board[finalTarget.row][finalTarget.col];
  const resultTile = cloneSniperResultTile(targetTile);
  const radius = Math.random() < 0.28 ? 2 : 1;
  const transformedPoints = surroundingPoints(finalTarget.row, finalTarget.col, radius);
  for (const point of transformedPoints) {
    state.board[point.row][point.col] = { ...resultTile, _eventTransform: true };
  }
  setStatus("狙擊槍鎖定");
  setEventPulse(true);
  setStatus(radius === 2 ? "狙擊槍 24 格" : "狙擊槍 8 格");
  render();
  markSniperTarget(finalTarget);
  spawnParticles(radius === 2 ? 44 : 24);
  triggerScreenFx(radius === 2 ? "fx-blast" : "fx-bump", radius === 2 ? 560 : 420);
  playSound(targetTile?.kind === "multiplier" ? "multiplierHigh" : "specialBlast");
  await wait(resolveDelay(620, 220));

  state.sniperTarget = null;
  markSniperTarget(null);
  for (const row of state.board) {
    for (const tile of row) {
      if (tile?._reward) delete tile._reward;
      if (tile?._eventTransform) delete tile._eventTransform;
    }
  }
  setEventPulse(false);
  return true;
}

async function processSpecialAwards() {
  while (state.pendingSpecialAwards > 0) {
    state.pendingSpecialAwards -= 1;
    const event = randomBoardEvent();
    state.miniSlotRolling = true;
    specialMiniSlotEl.classList.remove("win");

    const steps = state.fast ? 5 : 9;
    for (let i = 0; i < steps; i += 1) {
      state.miniSlotPreview = randomBoardEvent();
      render();
      await wait(resolveDelay(120, 55));
    }

    state.miniSlotRolling = false;
    state.miniSlotWin = true;
    state.miniSlotPreview = event;
    setEventPulse(true);
    render();
    playSound("specialReady");
    await wait(resolveDelay(460, 180));

    if (event.kind === "flame") {
      setStatus("火焰槍");
      await playFlameEvent();
    } else {
      const target = findBoardEventCell({ useMultiplierRows: event.kind === "multiplier" });
      if (target) {
        if (event.kind === "multiplier") {
          state.board[target.row][target.col] = { kind: "multiplier", value: event.value, _reward: true };
        } else {
          state.board[target.row][target.col] = chocolateTile(event.type, true);
        }
        setStatus(`抽中${eventName(event)}`);
        render();
        spawnParticles(event.kind === "multiplier" && event.value >= 50 ? 28 : 18);
        triggerScreenFx(event.kind === "multiplier" && event.value >= 50 ? "fx-bump" : "fx-pop", 360);
        playSound(event.kind === "multiplier" ? "multiplierHigh" : "specialSpawn");
        await wait(resolveDelay(520, 200));
        const tile = state.board[target.row][target.col];
        if (tile) delete tile._reward;
      }
    }

    state.miniSlotWin = false;
    setEventPulse(false);
    render();
  }
}

function boardGravitySignature() {
  const cells = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      cells.push(tileSignature(state.board[row][col]));
    }
  }
  const multipliers = state.multipliers
    .map((multiplier) => `${multiplier.id}:${multiplier.row}:${multiplier.col}:${multiplier.value}:${multiplierSize(multiplier)}:${multiplierPayout(multiplier)}`)
    .sort()
    .join("|");
  return `${cells.join(",")}::${multipliers}`;
}

function collectMultipliers() {
  const collected = [];
  let changed = true;
  let guard = 0;

  clearMultiplierFootprints();

  while (changed && guard < ROWS * 2) {
    const before = boardGravitySignature();
    changed = false;
    guard += 1;

    const activeMultipliers = [...state.multipliers].sort((a, b) => b.row - a.row);
    for (const multiplier of activeMultipliers) {
      if (!state.multipliers.some((item) => item.id === multiplier.id)) continue;

      if (multiplierSize(multiplier) > 1) {
        const distance = multiplierDropDistance(multiplier);
        if (distance > 0) {
          multiplier.row += distance;
          multiplier._fall = Math.max(multiplier._fall || 0, distance);
          changed = true;
        }
      }

      if (multiplier.row >= ROWS - multiplierSize(multiplier)) {
        collected.push({ col: slotIndexFromMultiplier(multiplier), value: multiplier.value, payout: multiplierPayout(multiplier) });
        state.multipliers = state.multipliers.filter((item) => item.id !== multiplier.id);
        clearMultiplierFootprints();
        changed = true;
      }
    }

    collapseColumns();
    changed = changed || before !== boardGravitySignature();
  }

  clearMultiplierFootprints();
  return collected;
}

function collectAndPayMultipliers() {
  const hadCollectedSlots = state.filledSlots.size > 0;
  const collected = collectMultipliers();
  if (collected.length > 0) {
    state.slotFlash = Array(SLOT_COUNT).fill(null);
    for (const item of collected) {
      collectSlotMultiplier(item.col, item.value, item.payout);
      addWin(item.payout);
    }
    if (!hadCollectedSlots && state.filledSlots.size > 0) {
      state.pendingClimaxIntro = true;
    }
  }
  return collected;
}

function settleBoardBeforeFill() {
  const collected = [];
  let changed = true;
  let guard = 0;

  while (changed && guard < ROWS * 4) {
    const before = boardGravitySignature();
    const items = collectAndPayMultipliers();
    collected.push(...items);
    if (items.length === 0) collapseColumns();
    changed = items.length > 0 || before !== boardGravitySignature();
    guard += 1;
  }

  return collected;
}

async function presentCollectedMultipliers(collected) {
  if (collected.length === 0) return;
  const shouldPlayClimaxIntro = state.pendingClimaxIntro;
  const isFullCollect = state.filledSlots.size >= SLOT_COUNT;
  duckBackgroundMusic(
    shouldPlayClimaxIntro ? 4300 : isFullCollect ? 2100 : collected.length >= 2 ? 1650 : 1200,
    shouldPlayClimaxIntro ? BGM_DUCK_DEEP : isFullCollect ? BGM_DUCK_DEEP : collected.length >= 2 ? BGM_DUCK_MEDIUM : BGM_DUCK_LIGHT
  );
  setStatus(collected.map((item) => `SLOT ${item.col + 1} ${formatScore(item.payout)}`).join("  "));
  if (shouldPlayClimaxIntro) {
    state.pendingClimaxIntro = false;
    state.climaxLogoReturn = false;
    state.climaxIntroPhase = "logo";
  }
  render();
  spawnParticles(collected.length * 12);
  collected.forEach((item, index) => spawnSlotClimaxEnergy(item.col, item.payout, index * 80));
  const highCollect = Math.max(...collected.map((item) => item.value));
  playMultiplierCollectPerformance(collected, shouldPlayClimaxIntro);
  playMultiplierCollectSound(highCollect, collected.length, state.filledSlots.size);
  if (highCollect >= 100) triggerScreenFx("fx-jackpot", 780);
  else if (highCollect >= 20) triggerScreenFx("fx-bump", 420);
  if (!isFullCollect && !shouldPlayClimaxIntro && state.filledSlots.size === SLOT_COUNT - 1) {
    playNearMissPerformance("slot");
  }
  if (shouldPlayClimaxIntro) {
    await playClimaxIntroSequence();
    return;
  }
  await wait(resolveDelay(highCollect >= 100 ? 760 : highCollect >= 50 ? 640 : 540, 190));
}

async function playClimaxIntroSequence() {
  duckBackgroundMusic(4300, BGM_DUCK_DEEP);
  playClimaxIntroPerformance("logo");
  playSound("climaxIntro");
  await wait(1800);

  state.climaxIntroPhase = "wheel";
  render();
  playClimaxIntroPerformance("lift");
  playSound("climaxLift");
  await wait(1800);

  state.climaxIntroPhase = null;
  render();
}

function multiplierDropDistance(multiplier) {
  const size = multiplierSize(multiplier);
  if (multiplier.row >= ROWS - size) return 0;
  let distance = 0;
  for (let nextRow = multiplier.row + 1; nextRow <= ROWS - size; nextRow += 1) {
    if (!canMultiplierOccupyAt(multiplier, nextRow, multiplier.col)) break;
    distance += 1;
  }
  return distance;
}

function isInsideMultiplier(multiplier, row, col) {
  const size = multiplierSize(multiplier);
  return (
    row >= multiplier.row &&
    row < multiplier.row + size &&
    col >= multiplier.col &&
    col < multiplier.col + size
  );
}

function canMultiplierOccupyAt(multiplier, row, col) {
  const size = multiplierSize(multiplier);
  if (row < 0 || row > ROWS - size || col < 0 || col > COLS - size) return false;
  for (let r = row; r < row + size; r += 1) {
    for (let c = col; c < col + size; c += 1) {
      if (!isInsideMultiplier(multiplier, r, c) && state.board[r][c]) return false;
      if (multiplierAtExcept(r, c, multiplier)) return false;
    }
  }
  return true;
}

function multiplierAtExcept(row, col, ignoredMultiplier) {
  return state.multipliers.find((multiplier) => {
    if (multiplier.id === ignoredMultiplier.id) return false;
    const size = multiplierSize(multiplier);
    return (
      row >= multiplier.row &&
      row < multiplier.row + size &&
      col >= multiplier.col &&
      col < multiplier.col + size
    );
  });
}

function clearMultiplierFootprints() {
  clearMultiplierFootprintsOnBoard(state.board, state.multipliers);
}

function mergeAdjacentMultipliers() {
  return false;
}

function flameBurnChance(multiplierOrValue, stage = currentSpecialStageIndex()) {
  const value = typeof multiplierOrValue === "number" ? multiplierOrValue : multiplierOrValue?.value;
  const size = typeof multiplierOrValue === "number" ? 1 : multiplierSize(multiplierOrValue);
  let chance = 0.55;
  if (state.boardRescueLevel >= 2 && size > 1) chance = 0.9;
  else if (value >= 100) chance = 0.18;
  else if (value >= 50) chance = 0.28;
  else if (value >= 20) chance = 0.4;
  return stage === 3 ? Math.min(1, chance * 2) : chance;
}

function pointKey(point) {
  return `${point.row},${point.col}`;
}

function flamePatternCells(pattern) {
  const cells = new Set();
  const add = (row, col) => {
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) cells.add(`${row},${col}`);
  };

  if (pattern.kind === "col1") {
    for (let row = 0; row < ROWS; row += 1) add(row, pattern.col);
  } else if (pattern.kind === "row1") {
    for (let col = 0; col < COLS; col += 1) add(pattern.row, col);
  } else if (pattern.kind === "cross1") {
    for (let row = 0; row < ROWS; row += 1) add(row, pattern.col);
    for (let col = 0; col < COLS; col += 1) add(pattern.row, col);
  } else if (pattern.kind === "col2") {
    for (let row = 0; row < ROWS; row += 1) {
      add(row, pattern.col);
      add(row, pattern.col + 1);
    }
  } else if (pattern.kind === "row2") {
    for (let col = 0; col < COLS; col += 1) {
      add(pattern.row, col);
      add(pattern.row + 1, col);
    }
  } else if (pattern.kind === "cross2") {
    for (let row = 0; row < ROWS; row += 1) {
      add(row, pattern.col);
      add(row, pattern.col + 1);
    }
    for (let col = 0; col < COLS; col += 1) {
      add(pattern.row, col);
      add(pattern.row + 1, col);
    }
  }

  return cells;
}

function randomFlamePattern() {
  const picked = weightedPick(FLAME_PATTERN_WEIGHTS);
  if (picked.kind === "col1") return { kind: picked.kind, col: Math.floor(Math.random() * COLS) };
  if (picked.kind === "row1") return { kind: picked.kind, row: Math.floor(Math.random() * ROWS) };
  if (picked.kind === "cross1") {
    return { kind: picked.kind, row: Math.floor(Math.random() * ROWS), col: Math.floor(Math.random() * COLS) };
  }
  if (picked.kind === "col2") return { kind: picked.kind, col: Math.floor(Math.random() * (COLS - 1)) };
  if (picked.kind === "row2") return { kind: picked.kind, row: Math.floor(Math.random() * (ROWS - 1)) };
  return {
    kind: picked.kind,
    row: Math.floor(Math.random() * (ROWS - 1)),
    col: Math.floor(Math.random() * (COLS - 1)),
  };
}

function rescueFlamePattern() {
  if (state.boardRescueLevel < 2) return null;
  const targets = state.multipliers.filter((multiplier) => multiplierSize(multiplier) > 1);
  if (!targets.length) return null;

  const patterns = [];
  for (let col = 0; col < COLS; col += 1) patterns.push({ kind: "col1", col });
  for (let row = 0; row < ROWS; row += 1) patterns.push({ kind: "row1", row });
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) patterns.push({ kind: "cross1", row, col });
  }
  for (let col = 0; col < COLS - 1; col += 1) patterns.push({ kind: "col2", col });
  for (let row = 0; row < ROWS - 1; row += 1) patterns.push({ kind: "row2", row });
  for (let row = 0; row < ROWS - 1; row += 1) {
    for (let col = 0; col < COLS - 1; col += 1) patterns.push({ kind: "cross2", row, col });
  }

  const scored = patterns.map((pattern) => {
    const cells = flamePatternCells(pattern);
    const multiplierHits = targets.filter((multiplier) =>
      multiplierCells(multiplier).some((cell) => cells.has(pointKey(cell)))
    ).length;
    if (!multiplierHits) return null;
    let candyHits = 0;
    for (const key of cells) {
      const { row, col } = keyToPoint(key);
      if (isVisibleOrdinaryCandy(row, col)) candyHits += 1;
    }
    return { pattern, score: multiplierHits * 100 + candyHits };
  }).filter(Boolean);

  if (!scored.length) return null;
  const bestScore = Math.max(...scored.map((item) => item.score));
  return randomItem(scored.filter((item) => item.score === bestScore)).pattern;
}

function nextFlamePattern(finalStep = false) {
  return (finalStep && rescueFlamePattern()) || randomFlamePattern();
}

function flameTouchedMultipliers(flameCells) {
  const touched = new Map();
  for (const multiplier of state.multipliers) {
    if (multiplierCells(multiplier).some((cell) => flameCells.has(pointKey(cell)))) {
      touched.set(multiplier.id, multiplier);
    }
  }
  return Array.from(touched.values());
}

function clearFlameMarks() {
  state.flameCells = new Set();
  state.flameFinal = false;
  for (const multiplier of state.multipliers) {
    if (multiplier._flameResist) delete multiplier._flameResist;
  }
}

async function playFlameEvent(stage = currentSpecialStageIndex()) {
  const extraSteps = randomInt(1, 2);
  const steps = (state.fast ? 8 : 14) + extraSteps;
  const stepDelays = flameStepDelays(steps);
  let finalCells = new Set();
  duckBackgroundMusic(stepDelays.reduce((sum, delay) => sum + delay, 0) + 1500, BGM_DUCK_DEEP);
  playSound("specialReady");

  for (let i = 0; i < steps; i += 1) {
    finalCells = flamePatternCells(nextFlamePattern(i === steps - 1));
    state.flameCells = finalCells;
    state.flameFinal = false;
    render();
    if (i === 0 || i === steps - 1 || i % 3 === 0) {
      playFlameSweepPerformance(i, steps);
      playSound("flameSweep");
    }
    await wait(stepDelays[i]);
  }

  state.flameCells = finalCells;
  state.flameFinal = true;
  setEventPulse(true);
  render();
  triggerScreenFx("fx-blast", 360);
  playFlameBurnPerformance();
  playSound("flameBurn");
  await wait(resolveDelay(260, 120));

  const clearedCells = new Set();
  const resisted = [];
  const destroyedIds = new Set();
  const coveredMultiplierCells = new Set();
  const touchedMultipliers = flameTouchedMultipliers(finalCells);

  for (const multiplier of touchedMultipliers) {
    for (const cell of multiplierCells(multiplier)) {
      coveredMultiplierCells.add(pointKey(cell));
    }
    if (Math.random() < flameBurnChance(multiplier, stage)) {
      destroyedIds.add(multiplier.id);
      for (const cell of multiplierCells(multiplier)) {
        clearedCells.add(pointKey(cell));
      }
    } else {
      resisted.push(multiplier);
    }
  }

  state.multipliers = state.multipliers.filter((multiplier) => !destroyedIds.has(multiplier.id));

  for (const key of finalCells) {
    const { row, col } = keyToPoint(key);
    if (coveredMultiplierCells.has(key)) continue;
    if (multiplierAt(row, col)) continue;
    if (state.board[row][col]?.kind === "candy") {
      clearedCells.add(key);
    }
  }

  state.clearing = new Set(clearedCells);
  render();
  spawnParticles(Math.min(48, Math.max(18, clearedCells.size * 2 + destroyedIds.size * 8)));
  if (destroyedIds.size) triggerScreenFx("fx-blast", 520);
  await wait(resolveDelay(420, 160));

  if (resisted.length) {
    for (const multiplier of resisted) multiplier._flameResist = true;
    render();
    playSound("flameResist");
    await wait(resolveDelay(360, 150));
  }

  state.flameCells = new Set();
  state.flameFinal = false;
  render();
  await wait(resolveDelay(150, 70));

  for (const key of clearedCells) {
    const { row, col } = keyToPoint(key);
    state.board[row][col] = null;
  }
  state.lastClearedCells = new Set(clearedCells);
  const collected = settleBoardBeforeFill();
  state.lastClearedCells = null;
  state.clearing = new Set();

  await presentCollectedMultipliers(collected);

  fillEmptyCells();
  maybeSeedRescueCascade(0);
  render();
  playSound("drop");
  await wait(resolveDelay(430, 170));

  clearFlameMarks();
  clearFallMarks();
  setEventPulse(false);
  render();
  return clearedCells.size > 0 || resisted.length > 0;
}

function multiplierSpawnPoint(value = 10, flags = {}) {
  const size = multiplierSizeForValue(value, flags);
  const point = pickMultiplierSpawnCell(state.board, (cell) => canPlaceMultiplierAt(cell.row, cell.col, state.multipliers, null, state.board, size), size);
  return point ? createMultiplier(value, point.row, point.col, { ...flags, size }) : null;
}

async function resolveEventCascadeIfNeeded() {
  const matches = measurePerf("event.cascade.findMatches", () => findMatches(state.board));
  if (matches.cells.size === 0) return false;
  state.miniSlotWin = false;
  setEventPulse(false);
  render();
  await resolveMove(matches);
  return true;
}

async function playCandyClearEvent(type) {
  const clearedCells = candyCellsByType(type, false);
  if (!clearedCells.size) return false;

  state.clearing = new Set(clearedCells);
  setEventPulse(true);
  setStatus(`CLEAR ${type.toUpperCase()}`);
  render();
  spawnClearBursts(clearedCells, true);
  spawnCollectEnergy(clearedCells);
  spawnParticles(Math.min(42, Math.max(18, clearedCells.size * 2)));
  playSound("candyClearEvent");
  triggerScreenFx("fx-blast", 460);
  await wait(resolveDelay(430, 160));

  let clearedCandyCount = 0;
  for (const key of clearedCells) {
    const { row, col } = keyToPoint(key);
    if (isVisibleOrdinaryCandy(row, col)) clearedCandyCount += 1;
    state.board[row][col] = null;
  }

  addSpecialMeter(clearedCandyCount);
  state.lastClearedCells = new Set(clearedCells);
  const collected = settleBoardBeforeFill();
  state.lastClearedCells = null;
  state.clearing = new Set();

  await presentCollectedMultipliers(collected);

  fillEmptyCells();
  render();
  playSound("drop");
  await wait(resolveDelay(430, 170));

  clearFallMarks();
  setEventPulse(false);
  render();
  return true;
}

function findBoardEventCell({ allowMultiplierTarget = false, useMultiplierRows = false } = {}) {
  if (useMultiplierRows) {
    const multiplier = multiplierSpawnPoint(10);
    return multiplier ? { row: multiplier.row, col: multiplier.col } : null;
  }

  const cells = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const tile = state.board[row][col];
      const multiplier = multiplierAt(row, col);
      if (isOrdinaryCandy(tile) && !multiplier) cells.push({ row, col });
      if (allowMultiplierTarget && multiplier) cells.push({ row, col });
    }
  }
  return cells.length ? randomItem(cells) : null;
}

function sniperLockPoint(point) {
  const multiplier = multiplierAt(point.row, point.col);
  return multiplier ? { row: multiplier.row, col: multiplier.col, multiplier } : { ...point, multiplier: null };
}

function markSniperTarget(point) {
  boardEl.querySelectorAll(".sniper-target").forEach((tile) => tile.classList.remove("sniper-target"));
  if (!point) return;
  const lock = sniperLockPoint(point);
  boardEl.querySelector(tileSelector(lock))?.classList.add("sniper-target");
}

function transformSniperCandyLine(target, sourceTile) {
  const horizontal = Math.random() < 0.5;
  const points = [];
  const touchedMultipliers = new Map();
  for (let i = 0; i < (horizontal ? COLS : ROWS); i += 1) {
    const row = horizontal ? target.row : i;
    const col = horizontal ? i : target.col;
    const multiplier = multiplierAt(row, col);
    if (multiplier) {
      touchedMultipliers.set(multiplier.id, multiplier);
      continue;
    }
    if (isOrdinaryCandy(state.board[row][col])) points.push({ row, col });
  }

  let shattered = 0;
  for (const multiplier of touchedMultipliers.values()) {
    const chance = multiplier.value >= 100 ? 0.15 : multiplier.value >= 50 ? 0.25 : multiplier.value >= 20 ? 0.35 : 0.45;
    if (Math.random() >= chance) {
      multiplier._eventTransform = true;
      continue;
    }
    shattered += 1;
    for (const cell of multiplierCells(multiplier)) {
      points.push(cell);
    }
    state.multipliers = state.multipliers.filter((item) => item.id !== multiplier.id);
  }

  for (const point of points) {
    state.board[point.row][point.col] = { kind: "candy", type: sourceTile.type, _eventTransform: true };
  }
  return points.length + shattered;
}

function transformSniperMultiplierCross(multiplier) {
  const candidates = [];
  const size = multiplierSize(multiplier);
  for (const col of multiplierColsForSize(size)) candidates.push({ row: multiplier.row, col });
  for (let row = multiplier.row % size; row <= ROWS - size; row += size) {
    candidates.push({ row, col: multiplier.col });
  }

  let count = 0;
  const seen = new Set();
  for (const point of candidates) {
    const key = `${point.row},${point.col}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (point.row === multiplier.row && point.col === multiplier.col) continue;
    if (!canPlaceMultiplierAt(point.row, point.col, state.multipliers, null, state.board, size)) continue;
    state.multipliers.push(createMultiplier(multiplier.value, point.row, point.col, {
      size,
      payout: multiplierPayout(multiplier),
      _eventTransform: true,
      _reward: true,
    }));
    count += 1;
  }
  return count;
}

async function playSniperEvent() {
  const targets = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const multiplier = multiplierAt(row, col);
      if (multiplier || isOrdinaryCandy(state.board[row][col])) targets.push({ row, col });
    }
  }
  if (!targets.length) return false;

  const finalTarget = randomItem(targets);
  const finalLock = sniperLockPoint(finalTarget);
  const steps = state.fast ? 8 : 15;
  const stepDelays = sniperStepDelays(steps);
  playSound("specialReady");
  for (let i = 0; i < steps; i += 1) {
    const point = i === steps - 1 ? finalTarget : randomItem(targets);
    state.sniperTarget = sniperLockPoint(point);
    render();
    markSniperTarget(point);
    await wait(stepDelays[i]);
  }

  const targetMultiplier = finalLock.multiplier;
  const targetTile = targetMultiplier || state.board[finalTarget.row][finalTarget.col];
  const changed = targetMultiplier
    ? transformSniperMultiplierCross(targetMultiplier)
    : transformSniperCandyLine(finalTarget, targetTile);

  setStatus(targetMultiplier ? "SNIPER CROSS" : "SNIPER LINE");
  setEventPulse(true);
  render();
  markSniperTarget(finalTarget);
  spawnParticles(targetMultiplier ? 44 : 24);
  triggerScreenFx(targetMultiplier ? "fx-blast" : "fx-bump", targetMultiplier ? 560 : 420);
  playSound(targetMultiplier ? "multiplierHigh" : "specialBlast");
  await wait(resolveDelay(changed ? 620 : 420, 220));

  state.sniperTarget = null;
  markSniperTarget(null);
  clearFallMarks();
  for (const row of state.board) {
    for (const tile of row) {
      if (tile?._reward) delete tile._reward;
      if (tile?._eventTransform) delete tile._eventTransform;
    }
  }
  setEventPulse(false);
  return true;
}

async function processSpecialAwards() {
  while (state.pendingSpecialAwards > 0) {
    state.pendingSpecialAwards -= 1;
    const event = randomBoardEvent();
    state.miniSlotRolling = true;
    specialMiniSlotEl.classList.remove("win");

    const steps = state.fast ? 5 : 9;
    for (let i = 0; i < steps; i += 1) {
      state.miniSlotPreview = randomBoardEvent();
      render();
      await wait(resolveDelay(120, 55));
    }

    state.miniSlotRolling = false;
    state.miniSlotWin = true;
    state.miniSlotPreview = event;
    setEventPulse(true);
    render();
    playSound("specialReady");
    await wait(resolveDelay(460, 180));

    if (event.kind === "sniper") {
      setStatus("??瑽?");
      await playSniperEvent();
    } else if (event.kind === "multiplier") {
      const multiplier = multiplierSpawnPoint(event.value, { _reward: true });
      if (multiplier) {
        state.multipliers.push(multiplier);
        clearMultiplierFootprint(state.board, multiplier);
        setStatus(`?賭葉${eventName(event)}`);
        render();
        spawnParticles(event.value >= 50 ? 28 : 18);
        triggerScreenFx(event.value >= 50 ? "fx-bump" : "fx-pop", 360);
        playSound("multiplierHigh");
        await wait(resolveDelay(520, 200));
        delete multiplier._reward;
      }
    } else if (event.kind === "candyClear") {
      await playCandyClearEvent(event.type || randomVisibleCandyType());
      if (false) {
        setStatus(`?賭葉${eventName(event)}`);
        render();
        spawnParticles(18);
        triggerScreenFx("fx-pop", 360);
        playSound("specialSpawn");
        await wait(resolveDelay(520, 200));
        const tile = state.board[target.row][target.col];
        if (tile) delete tile._reward;
      }
    }

    state.miniSlotWin = false;
    setEventPulse(false);
    render();
  }
}

function reshuffleBoard() {
  const values = state.multipliers.map((multiplier) => ({
    value: multiplier.value,
    size: multiplierSize(multiplier),
    payout: multiplierPayout(multiplier),
  }));
  let attempts = 0;
  do {
    state.board = makeCandyBoard();
    state.multipliers = [];
    for (const item of values) {
      const multiplier = multiplierSpawnPoint(item.value, { size: item.size, payout: item.payout });
      if (multiplier) {
        state.multipliers.push(multiplier);
        clearMultiplierFootprint(state.board, multiplier);
      }
    }
    attempts += 1;
  } while ((!hasLegalMove(state.board) || findMatches(state.board).cells.size > 0) && attempts < 80);

  if (!hasLegalMove(state.board) || findMatches(state.board).cells.size > 0) {
    forcePlayablePattern(state.board);
  }

  setStatus("?日撌脫???");
}

async function processSpecialAwards() {
  while (state.pendingSpecialAwards > 0) {
    state.pendingSpecialAwards -= 1;
    const event = randomBoardEvent();
    state.miniSlotRolling = true;
    specialMiniSlotEl.classList.remove("win");

    const steps = state.fast ? 5 : 9;
    for (let i = 0; i < steps; i += 1) {
      state.miniSlotPreview = randomBoardEvent();
      render();
      await wait(resolveDelay(120, 55));
    }

    state.miniSlotRolling = false;
    state.miniSlotWin = true;
    state.miniSlotPreview = event;
    setEventPulse(true);
    render();
    playSound("specialReady");
    await wait(resolveDelay(460, 180));

    if (event.kind === "flame") {
      setStatus("火焰槍");
      await playFlameEvent();
    } else if (event.kind === "multiplier") {
      const multiplier = multiplierSpawnPoint(event.value, { _reward: true });
      if (multiplier) {
        state.multipliers.push(multiplier);
        clearMultiplierFootprint(state.board, multiplier);
        setStatus(`收集${eventName(event)}`);
        render();
        spawnParticles(event.value >= 50 ? 28 : 18);
        triggerScreenFx(event.value >= 50 ? "fx-bump" : "fx-pop", 360);
        playSound("multiplierHigh");
        await wait(resolveDelay(520, 200));
        delete multiplier._reward;
      }
    } else if (event.kind === "candyClear") {
      await playCandyClearEvent(event.type || randomVisibleCandyType());
    }

    if (await resolveEventCascadeIfNeeded()) return true;

    state.miniSlotWin = false;
    setEventPulse(false);
    render();
  }
  return false;
}

async function processSpecialAwards() {
  while (state.pendingSpecialAwards.length > 0) {
    if (!state.stagePreviews.length) state.stagePreviews = initialStagePreviews();
    const stage = state.pendingSpecialAwards.shift();
    const event = randomBoardEvent(stage);
    state.miniSlotRolling = true;
    state.rollingStage = stage;
    state.miniSlotWin = false;

    const rollDelays = eventRollDelays(randomInt(1, EVENT_ROLL_EXTRA_MAX));
    duckBackgroundMusic(rollDelays.reduce((sum, delay) => sum + delay, 0) + 1200, BGM_DUCK_MEDIUM);
    playEventRollStartPerformance(stage);
    for (let i = 0; i < rollDelays.length; i += 1) {
      state.stagePreviews[stage - 1] = randomBoardEvent(stage);
      render();
      triggerStageRollStep(stage);
      playEventRollStepSound(stage, i, rollDelays.length);
      playSound("wheelSpin");
      await wait(rollDelays[i]);
    }

    state.stagePreviews[stage - 1] = event;
    state.miniSlotPreview = event;
    state.miniSlotRolling = false;
    state.miniSlotWin = true;
    setEventPulse(true);
    render();
    playEventRollLockPerformance(stage, event);
    playSound("specialReady");
    await wait(resolveDelay(stage === 3 ? 620 : 460, 180));

    if (event.kind === "flame") {
      setStatus("火焰");
      await playFlameEvent(stage);
    } else if (event.kind === "multiplier") {
      const multiplier = multiplierSpawnPoint(event.value, { _reward: true, size: event.size });
      if (multiplier) {
        state.multipliers.push(multiplier);
        clearMultiplierFootprint(state.board, multiplier);
        setStatus(`收集${eventName(event)}`);
        render();
        spawnParticles(stage === 3 || event.value >= 50 ? 34 : 18);
        triggerScreenFx(stage === 3 || event.value >= 50 ? "fx-bump" : "fx-pop", 420);
        playSound(event.value >= 50 ? "multiplierHigh" : "specialSpawn");
        await wait(resolveDelay(stage === 3 ? 640 : 520, 200));
        delete multiplier._reward;
      }
    } else if (event.kind === "candyClear") {
      await playCandyClearEvent(event.type || randomVisibleCandyType());
    }

    if (await resolveEventCascadeIfNeeded()) return true;

    state.miniSlotWin = false;
    state.rollingStage = null;
    setEventPulse(false);
    render();
  }
  return false;
}

window.addEventListener("resize", () => scheduleBoardSizeSync(true));
window.visualViewport?.addEventListener("resize", () => scheduleBoardSizeSync(true));

window.setInterval(() => {
  if (state.resolving || state.miniSlotRolling || state.miniSlotWin) return;
  state.stagePreviews = state.stagePreviews.map((_, index) => randomBoardEvent(index + 1));
  state.miniSlotPreview = state.stagePreviews[0] || randomSpecialReward();
  renderHud();
}, 1300);

function initClimaxTunePanel() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("tune")) return;

  const phone = document.querySelector(".phone");
  if (!phone) return;
  phone.classList.add("tune-climax");

  const controls = [
    ["wheel left", "--climax-wheel-left", -200, 300, 0.5, "%"],
    ["wheel top", "--climax-wheel-top", -200, 500, 0.5, "%"],
    ["wheel size", "--climax-wheel-size", 25, 500, 1, "%"],
    ["center line", "--climax-center-line-x", -50, 150, 0.5, "%"],
  ];
  const labelTune = JSON.parse(JSON.stringify(WHEEL_LABEL_TUNE));
  let selectedLabel = FULL_DROP_WHEEL_LABEL_ORDER[0].key;

  const panel = document.createElement("div");
  panel.className = "climax-tune-panel";
  panel.innerHTML = `
    <strong>Climax Tune</strong>
    <div class="climax-tune-controls"></div>
    <strong>Label Tune</strong>
    <div class="climax-label-tune"></div>
    <div class="climax-tune-actions">
      <button type="button" data-action="copy">Copy CSS</button>
      <button type="button" data-action="toggle-points">Hide Points</button>
      <button type="button" data-action="spin">Spin</button>
    </div>
    <textarea class="climax-tune-output" spellcheck="false"></textarea>
  `;
  document.body.appendChild(panel);

  const controlsEl = panel.querySelector(".climax-tune-controls");
  const labelTuneEl = panel.querySelector(".climax-label-tune");
  const output = panel.querySelector(".climax-tune-output");
  const handleLayer = document.createElement("div");
  handleLayer.className = "climax-mask-handle-layer";
  document.body.appendChild(handleLayer);
  let draggingPoint = false;

  function numericValue(name) {
    const raw = getComputedStyle(phone).getPropertyValue(name).trim();
    return parseFloat(raw) || 0;
  }

  function defaultMaskPoints() {
    return [
      { x: 9, y: 2 },
      { x: 50, y: 1 },
      { x: 91, y: 2 },
      { x: 98, y: 5 },
      { x: 98, y: 12 },
      { x: 92, y: 16 },
      { x: 88, y: 17 },
      { x: 50, y: 17.5 },
      { x: 12, y: 17 },
      { x: 8, y: 16 },
      { x: 2, y: 12 },
      { x: 2, y: 5 },
    ];
  }

  function readMaskPoints() {
    const raw = getComputedStyle(phone).getPropertyValue("--climax-mask-path").trim();
    const points = [];
    const pattern = /(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/g;
    let match = pattern.exec(raw);
    while (match) {
      points.push({ x: parseFloat(match[1]), y: parseFloat(match[2]) });
      match = pattern.exec(raw);
    }
    return points.length === 12 ? points : defaultMaskPoints();
  }

  const maskPoints = readMaskPoints();

  function rotateSelectedLabelToTop() {
    const index = wheelLabelIndexByKey(selectedLabel);
    if (index < 0) return;
    const sliceAngle = wheelLabelSliceAngle();
    const item = labelTune.items[selectedLabel] || {};
    const labelAngle = labelTune.angleOffset + index * sliceAngle + sliceAngle * 0.5 + (item.angle || 0);
    state.climaxWheelRotation = -labelAngle;
    renderClimaxStage();
  }

  function maskPath() {
    return `polygon(${maskPoints.map((point) => `${+point.x.toFixed(2)}% ${+point.y.toFixed(2)}%`).join(", ")})`;
  }

  function applyMaskPath() {
    phone.style.setProperty("--climax-mask-path", maskPath());
  }

  function cssText() {
    const lines = controls.map(([, name,, , , unit]) => {
      const value = phone.style.getPropertyValue(name) || getComputedStyle(phone).getPropertyValue(name).trim();
      return `  ${name}: ${value || `0${unit}`};`;
    });
    lines.push(`  --climax-mask-path: ${maskPath()};`);
    return `.phone {\n${lines.join("\n")}\n}\n\nWHEEL_LABEL_TUNE = ${JSON.stringify(labelTune, null, 2)};`;
  }

  function refreshOutput() {
    output.value = cssText();
  }

  function applyLabelTune() {
    const sliceAngle = wheelLabelSliceAngle();
    document.querySelectorAll(".climax-wheel-label").forEach((el) => {
      const label = el.dataset.label;
      const index = wheelLabelIndexByKey(label);
      if (index < 0) return;
      const item = labelTune.items[label] || {};
      const angle = labelTune.angleOffset + index * sliceAngle + sliceAngle * 0.5 + (item.angle || 0);
      const radius = labelTune.radius + (item.radius || 0);
      const radians = (angle * Math.PI) / 180;
      const x = labelTune.cx + Math.cos(radians) * radius;
      const y = labelTune.cy + Math.sin(radians) * radius;
      el.style.setProperty("--label-x", `${x}%`);
      el.style.setProperty("--label-y", `${y}%`);
      el.style.setProperty("--label-rotate", `${angle + labelTune.rotateOffset + (item.rotate || 0)}deg`);
      el.style.setProperty("--label-font", `${labelTune.fontSize + (item.font || 0)}px`);
      el.classList.toggle("is-selected", label === selectedLabel);
    });
    refreshOutput();
  }

  function applyLabelTuneAndKeepTop() {
    rotateSelectedLabelToTop();
    applyLabelTune();
  }

  function tuneRow(parent, label, value, onMinus, onPlus) {
    const row = document.createElement("div");
    row.className = "climax-tune-row";
    row.innerHTML = `
      <span>${label}</span>
      <div class="climax-tune-control">
        <button type="button" data-action="minus">-</button>
        <button type="button" data-action="plus">+</button>
      </div>
      <span class="climax-tune-value">${value}</span>
    `;
    const valueEl = row.querySelector(".climax-tune-value");
    const update = (next) => {
      valueEl.textContent = next;
      applyLabelTuneAndKeepTop();
    };
    row.querySelector('[data-action="minus"]').addEventListener("click", () => update(onMinus()));
    row.querySelector('[data-action="plus"]').addEventListener("click", () => update(onPlus()));
    parent.appendChild(row);
  }

  function renderLabelTuneControls() {
    labelTuneEl.innerHTML = "";
    const selectRow = document.createElement("label");
    selectRow.className = "climax-tune-row";
    selectRow.innerHTML = `
      <span>selected</span>
      <select class="climax-label-select">${FULL_DROP_WHEEL_LABEL_ORDER.map(({ key }) => `<option value="${key}">${key}</option>`).join("")}</select>
      <span></span>
    `;
    const select = selectRow.querySelector("select");
    select.value = selectedLabel;
    select.addEventListener("change", () => {
      selectedLabel = select.value;
      rotateSelectedLabelToTop();
      renderLabelTuneControls();
      applyLabelTune();
    });
    labelTuneEl.appendChild(selectRow);

    tuneRow(labelTuneEl, "center x", labelTune.cx.toFixed(1), () => (labelTune.cx -= 0.5).toFixed(1), () => (labelTune.cx += 0.5).toFixed(1));
    tuneRow(labelTuneEl, "center y", labelTune.cy.toFixed(1), () => (labelTune.cy -= 0.5).toFixed(1), () => (labelTune.cy += 0.5).toFixed(1));
    tuneRow(labelTuneEl, "radius", labelTune.radius.toFixed(1), () => (labelTune.radius -= 0.5).toFixed(1), () => (labelTune.radius += 0.5).toFixed(1));
    tuneRow(labelTuneEl, "angle all", labelTune.angleOffset.toFixed(1), () => (labelTune.angleOffset -= 0.5).toFixed(1), () => (labelTune.angleOffset += 0.5).toFixed(1));
    tuneRow(labelTuneEl, "rotate all", labelTune.rotateOffset.toFixed(1), () => (labelTune.rotateOffset -= 1).toFixed(1), () => (labelTune.rotateOffset += 1).toFixed(1));
    tuneRow(labelTuneEl, "font all", labelTune.fontSize.toFixed(0), () => (labelTune.fontSize -= 1).toFixed(0), () => (labelTune.fontSize += 1).toFixed(0));

    if (!labelTune.items[selectedLabel]) labelTune.items[selectedLabel] = {};
    const item = labelTune.items[selectedLabel];
    item.angle ||= 0;
    item.radius ||= 0;
    item.rotate ||= 0;
    item.font ||= 0;
    tuneRow(labelTuneEl, "item angle", item.angle.toFixed(1), () => (item.angle -= 0.5).toFixed(1), () => (item.angle += 0.5).toFixed(1));
    tuneRow(labelTuneEl, "item radius", item.radius.toFixed(1), () => (item.radius -= 0.5).toFixed(1), () => (item.radius += 0.5).toFixed(1));
    tuneRow(labelTuneEl, "item rotate", item.rotate.toFixed(1), () => (item.rotate -= 1).toFixed(1), () => (item.rotate += 1).toFixed(1));
    tuneRow(labelTuneEl, "item font", item.font.toFixed(0), () => (item.font -= 1).toFixed(0), () => (item.font += 1).toFixed(0));
  }

  for (const [label, name, min, max, step, unit] of controls) {
    const row = document.createElement("label");
    row.className = "climax-tune-row";
    row.dataset.control = name;
    const value = numericValue(name);
    const hasStepper = name === "--climax-wheel-left" || name === "--climax-wheel-top" || name === "--climax-wheel-size" || name === "--climax-center-line-x";
    row.innerHTML = `
      <span>${label}</span>
      <div class="climax-tune-control">
        ${hasStepper ? `<button type="button" data-step="-1" aria-label="${label} minus">-</button>` : ""}
        <input type="range" min="${min}" max="${max}" step="${step}" value="${value}">
        ${hasStepper ? `<button type="button" data-step="1" aria-label="${label} plus">+</button>` : ""}
      </div>
      <span class="climax-tune-value">${value}${unit}</span>
    `;
    const input = row.querySelector("input");
    const valueEl = row.querySelector(".climax-tune-value");
    const setControlValue = (raw) => {
      const numeric = Math.max(min, Math.min(max, raw));
      input.value = String(numeric);
      const next = `${numeric}${unit}`;
      phone.style.setProperty(name, next);
      valueEl.textContent = next;
      renderClimaxStage();
      refreshOutput();
    };
    input.addEventListener("input", () => {
      setControlValue(Number(input.value));
    });
    row.querySelectorAll("[data-step]").forEach((button) => {
      button.addEventListener("click", () => setControlValue(Number(input.value) + Number(button.dataset.step)));
    });
    controlsEl.appendChild(row);
  }

  function syncControlReadout(name, value) {
    const row = Array.from(controlsEl.querySelectorAll(".climax-tune-row")).find((item) => item.dataset.control === name);
    if (!row) return;
    const input = row.querySelector("input");
    const valueEl = row.querySelector(".climax-tune-value");
    const numeric = parseFloat(value);
    if (input && Number.isFinite(numeric)) input.value = String(numeric);
    if (valueEl) valueEl.textContent = value;
  }

  function placeHandleLayer() {
    const rect = climaxStageEl.getBoundingClientRect();
    handleLayer.style.left = `${rect.left}px`;
    handleLayer.style.top = `${rect.top}px`;
    handleLayer.style.width = `${rect.width}px`;
    handleLayer.style.height = `${rect.height}px`;
    handleLayer.querySelectorAll(".climax-mask-handle").forEach((handle, index) => {
      const point = maskPoints[index];
      handle.style.left = `${point.x}%`;
      handle.style.top = `${point.y}%`;
    });
  }

  maskPoints.forEach((point, index) => {
    const handle = document.createElement("button");
    handle.type = "button";
    const kind = index <= 2 ? " is-top" : index >= 6 && index <= 8 ? " is-bottom" : " is-side";
    handle.className = `climax-mask-handle${kind}`;
    handle.title = `mask point ${index + 1}`;
    handle.setAttribute("aria-label", `mask point ${index + 1}`);
    handle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      handle.setPointerCapture(event.pointerId);
      const move = (moveEvent) => {
        const rect = climaxStageEl.getBoundingClientRect();
        point.x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
        point.y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
        applyMaskPath();
        placeHandleLayer();
        refreshOutput();
      };
      const up = () => {
        draggingPoint = false;
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
        handle.removeEventListener("pointercancel", up);
      };
      draggingPoint = true;
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
      handle.addEventListener("pointercancel", up);
    });
    handleLayer.appendChild(handle);
  });

  renderClimaxStage();
  document.querySelectorAll(".climax-wheel-label").forEach((labelEl) => {
    labelEl.addEventListener("click", (event) => {
      event.stopPropagation();
      selectedLabel = labelEl.dataset.label || selectedLabel;
      rotateSelectedLabelToTop();
      renderLabelTuneControls();
      applyLabelTune();
    });
  });

  climaxCenterLineEl?.addEventListener("pointerdown", (event) => {
    if (!params.has("tune")) return;
    event.preventDefault();
    event.stopPropagation();
    climaxCenterLineEl.setPointerCapture(event.pointerId);
    const move = (moveEvent) => {
      const rect = phone.getBoundingClientRect();
      const percent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const value = `${+percent.toFixed(1)}%`;
      phone.style.setProperty("--climax-center-line-x", value);
      syncControlReadout("--climax-center-line-x", value);
      renderClimaxStage();
      refreshOutput();
    };
    const up = () => {
      climaxCenterLineEl.removeEventListener("pointermove", move);
      climaxCenterLineEl.removeEventListener("pointerup", up);
      climaxCenterLineEl.removeEventListener("pointercancel", up);
    };
    climaxCenterLineEl.addEventListener("pointermove", move);
    climaxCenterLineEl.addEventListener("pointerup", up);
    climaxCenterLineEl.addEventListener("pointercancel", up);
  });

  climaxStageEl.addEventListener("pointerdown", (event) => {
    if (!params.has("tune") || draggingPoint || event.target.closest(".climax-mask-handle") || event.target.closest(".climax-center-line") || event.target.closest(".climax-tune-panel")) return;
    event.preventDefault();
    climaxStageEl.setPointerCapture(event.pointerId);
    const rect = climaxStageEl.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startPoints = maskPoints.map((point) => ({ ...point }));
    const move = (moveEvent) => {
      const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
      const dy = ((moveEvent.clientY - startY) / rect.height) * 100;
      maskPoints.forEach((point, index) => {
        point.x = startPoints[index].x + dx;
        point.y = startPoints[index].y + dy;
      });
      applyMaskPath();
      placeHandleLayer();
      refreshOutput();
    };
    const up = () => {
      climaxStageEl.removeEventListener("pointermove", move);
      climaxStageEl.removeEventListener("pointerup", up);
      climaxStageEl.removeEventListener("pointercancel", up);
    };
    climaxStageEl.addEventListener("pointermove", move);
    climaxStageEl.addEventListener("pointerup", up);
    climaxStageEl.addEventListener("pointercancel", up);
  });

  panel.querySelector('[data-action="copy"]').addEventListener("click", async () => {
    refreshOutput();
    output.select();
    try {
      await navigator.clipboard.writeText(output.value);
    } catch {
      document.execCommand("copy");
    }
  });

  panel.querySelector('[data-action="toggle-points"]').addEventListener("click", (event) => {
    handleLayer.classList.toggle("is-hidden");
    event.currentTarget.textContent = handleLayer.classList.contains("is-hidden") ? "Show Points" : "Hide Points";
  });

  panel.querySelector('[data-action="spin"]').addEventListener("click", () => {
    state.climaxWheelRotation += 720;
    renderClimaxStage();
  });

  refreshOutput();
  applyMaskPath();
  renderLabelTuneControls();
  rotateSelectedLabelToTop();
  applyLabelTune();
  placeHandleLayer();
  window.addEventListener("resize", placeHandleLayer);
  window.visualViewport?.addEventListener("resize", placeHandleLayer);
  renderHud();
}

preloadSymbolAssets();
initPerfMonitor();
initClimaxTunePanel();
startNewBoard();
