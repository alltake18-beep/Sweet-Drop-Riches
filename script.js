const ROWS = 9;
const COLS = 5;
const SYMBOL_VERSION = "symbol-rules-31";
const PERF_ENABLED = new URLSearchParams(window.location.search).has("perf");
const SPECIAL_METER_TARGET = 20;
const BET_STEPS = [20, 50, 100, 200, 500];
const CANDIES = ["red", "blue", "green", "orange", "purple"];
const MULTIPLIER_VALUES = [5, 10, 20, 30, 50, 100];
const WIN_TIERS = [
  { ratio: 100, label: "LEGENDARY WIN", art: "legendary", sound: "jackpot", className: "tier-legendary", duration: 2500, quick: 2500, particles: 86, countVolume: 0.055 },
  { ratio: 50, label: "EPIC WIN", art: "epic", sound: "jackpot", className: "tier-epic", duration: 2500, quick: 2500, particles: 72, countVolume: 0.05 },
  { ratio: 30, label: "SUPER MEGA WIN", art: "super-mega", sound: "superWin", className: "tier-super", duration: 2500, quick: 2500, particles: 58, countVolume: 0.045 },
  { ratio: 20, label: "MEGA WIN", art: "mega", sound: "superWin", className: "tier-mega", duration: 2500, quick: 2500, particles: 46, countVolume: 0.04 },
  { ratio: 5, label: "BIG WIN", art: "big", sound: "win", className: "tier-big", duration: 2500, quick: 2500, particles: 34, countVolume: 0.035 },
];

const boardEl = document.getElementById("board");
const slotsEl = document.getElementById("slots");
const fxCanvas = document.getElementById("fxCanvas");
const perfPanel = document.getElementById("perfPanel");
const specialMeterTextEl = document.getElementById("specialMeterText");
const specialMeterFillEl = document.getElementById("specialMeterFill");
const specialMiniSlotEl = document.getElementById("specialMiniSlot");
const miniSlotIconEl = document.getElementById("miniSlotIcon");
const balanceEl = document.getElementById("balance");
const betEl = document.getElementById("bet");
const statusTextEl = document.getElementById("statusText");
const fastButton = document.getElementById("fastButton");
const menuButton = document.getElementById("menuButton");
const closeMenu = document.getElementById("closeMenu");
const menuPanel = document.getElementById("menuPanel");
const soundMenuButton = document.getElementById("soundMenuButton");
const winOverlay = document.getElementById("winOverlay");
const winLabelEl = document.getElementById("winLabel");
const winTitleArtEl = document.getElementById("winTitleArt");
const winMultiplierEl = document.getElementById("winMultiplier");
const winAmountEl = document.getElementById("winAmount");

const state = {
  board: [],
  selected: null,
  clearing: new Set(),
  invalid: null,
  slotFlash: Array(COLS).fill(null),
  filledSlots: new Set(),
  balance: 2732,
  betIndex: 2,
  currentWin: 0,
  lastWin: 0,
  resolving: false,
  fast: false,
  sound: true,
  mode: "normal",
  audioContext: null,
  masterGain: null,
  musicTimer: null,
  musicStep: 0,
  activeTones: 0,
  lastSoundAt: {},
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
  pendingSpecialAwards: 0,
  miniSlotPreview: { kind: "chocolate", type: "purple" },
  miniSlotRolling: false,
  miniSlotWin: false,
  eventPulse: false,
  sniperTarget: null,
};

function formatMoney(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomCandy(exclude = [], options = {}) {
  const pool = CANDIES.filter((type) => !exclude.includes(type));
  return { kind: "candy", type: randomItem(pool.length ? pool : CANDIES) };
}

function weightedMultiplier() {
  const pool =
    state.mode === "high"
      ? [5, 10, 20, 20, 30, 30, 50, 100]
      : [5, 5, 10, 10, 20, 20, 30, 50, 100];
  return { kind: "multiplier", value: randomItem(pool) };
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
  if (value >= 200) return `assets/symbols/multiplier-x200.svg?v=${SYMBOL_VERSION}`;
  if (value >= 100) return `assets/symbols/multiplier-x100.svg?v=${SYMBOL_VERSION}`;
  if (value >= 50) return `assets/symbols/multiplier-x50.svg?v=${SYMBOL_VERSION}`;
  if (value >= 30) return `assets/symbols/multiplier-x30.svg?v=${SYMBOL_VERSION}`;
  if (value >= 20) return `assets/symbols/multiplier-x20.svg?v=${SYMBOL_VERSION}`;
  if (value >= 10) return `assets/symbols/multiplier-x10.svg?v=${SYMBOL_VERSION}`;
  return `assets/symbols/multiplier-x5.svg?v=${SYMBOL_VERSION}`;
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
    "assets/symbols/multiplier-x200.svg?v=" + SYMBOL_VERSION,
    ...WIN_TIERS.map((tier) => winArtAsset(tier.art)),
    specialAsset("chocolate"),
    `assets/ui/event-sniper.svg?v=${SYMBOL_VERSION}`,
    `assets/ui/event-chocolate.svg?v=${SYMBOL_VERSION}`,
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

function randomBoardEvent() {
  const kind = randomItem(["chocolate", "multiplier", "sniper"]);
  if (kind === "chocolate") return { kind, type: randomItem(CANDIES) };
  if (kind === "multiplier") return { kind, value: weightedMultiplier().value };
  return { kind };
}

function eventPreviewAsset(event) {
  if (event.kind === "multiplier") return multiplierAsset(event.value || 10);
  if (event.kind === "sniper") return sniperIconAsset();
  return `assets/ui/event-chocolate.svg?v=${SYMBOL_VERSION}`;
}

function eventName(event) {
  if (event.kind === "multiplier") return `x${event.value} 倍數糖`;
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
  const count = state.mode === "high" ? 7 : 6;
  const placed = new Set();

  while (placed.size < count) {
    const row = Math.floor(Math.random() * (ROWS - 2));
    const col = Math.floor(Math.random() * COLS);
    const key = `${row},${col}`;
    if (placed.has(key)) continue;
    placed.add(key);
    board[row][col] = weightedMultiplier();
  }
}

function buildBoard() {
  let board;
  let attempts = 0;

  do {
    board = makeCandyBoard();
    addMultipliers(board);
    attempts += 1;
  } while ((!hasLegalMove(board) || findMatches(board).cells.size > 0) && attempts < 120);

  if (!hasLegalMove(board) || findMatches(board).cells.size > 0) {
    forcePlayablePattern(board);
  }

  return board;
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
  state.board = buildBoard();
  state.selected = null;
  state.clearing = new Set();
  state.invalid = null;
  state.slotFlash = Array(COLS).fill(null);
  state.filledSlots = new Set();
  state.specialMeter = 0;
  state.pendingSpecialAwards = 0;
  state.miniSlotRolling = false;
  state.miniSlotWin = false;
  state.resolving = false;
  if (!keepScore) {
    state.currentWin = 0;
    state.lastWin = 0;
  }
  setStatus(state.mode === "high" ? "High Roller 盤面已刷新" : "一般盤面已刷新");
  render();
}

function tileLabel(tile) {
  if (!tile) return "空格";
  if (tile.kind === "multiplier") return `x${tile.value} 倍數糖`;
  if (tile.special === "horizontal") return `${tile.type} 橫向糖`;
  if (tile.special === "vertical") return `${tile.type} 直向糖`;
  if (tile.special === "bomb") return `${tile.type} 炸彈糖`;
  if (tile.special === "fish") return "魚糖";
  if (tile.special === "colorbomb") return "巧顆粒糖";
  return `${tile.type} 糖果`;
}

function tileSignature(tile) {
  if (!tile) return "empty";
  if (tile.kind === "multiplier") return `m:${tile.value}`;
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
    return `<img class="symbol-img multiplier-img" src="${multiplierAsset(tile.value)}" alt="">`;
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
      const tile = state.board[row][col];
      const button = boardEl.children[row * COLS + col];
      const key = `${row},${col}`;
      const classes = ["tile"];

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

      if (tile?.kind === "candy") {
        classes.push("candy", `candy-${tile.type}`);
        if (tile.special) classes.push("special-candy", `special-${tile.special}`);
      } else if (tile?.kind === "multiplier") {
        classes.push("multiplier", `value-${tile.value}`, multiplierTierClass(tile.value));
      }

      const signature = tileSignature(tile);
      if (button.dataset.signature !== signature) {
        button.innerHTML = tileMarkup(tile);
        button.dataset.signature = signature;
      }
      button.className = classes.join(" ");
      button.disabled = state.resolving;
      button.setAttribute("aria-label", tileLabel(tile));
    }
  }
}

function renderSlots() {
  slotsEl.innerHTML = "";

  for (let col = 0; col < COLS; col += 1) {
    const slot = document.createElement("div");
    const value = state.slotFlash[col];
    slot.className = "slot";
    if (value) slot.classList.add("flash");
    if (state.filledSlots.has(col)) slot.classList.add("filled");
    if (value >= 50) slot.classList.add("jackpot-slot");
    slot.innerHTML = value ? `<strong>x${value}</strong>` : "<strong></strong>";
    slotsEl.appendChild(slot);
  }
}

function renderHud() {
  document.querySelector(".special-meter-copy span").textContent = "事件收集";
  specialMiniSlotEl.setAttribute("aria-label", "事件預覽");
  specialMeterTextEl.textContent = `${Math.min(state.specialMeter, SPECIAL_METER_TARGET)}/${SPECIAL_METER_TARGET}`;
  specialMeterFillEl.style.width = `${Math.min(100, (state.specialMeter / SPECIAL_METER_TARGET) * 100)}%`;
  miniSlotIconEl.src = specialAsset(state.miniSlotPreview.special, state.miniSlotPreview.type);
  specialMiniSlotEl.classList.toggle("rolling", state.miniSlotRolling);
  specialMiniSlotEl.classList.toggle("win", state.miniSlotWin);
  balanceEl.textContent = formatMoney(state.balance);
  betEl.textContent = currentBet().toLocaleString("en-US");
  fastButton.setAttribute("aria-pressed", String(state.fast));
  soundMenuButton.textContent = state.sound ? "音效開啟" : "音效關閉";
}

function render() {
  measurePerf("render.board", renderBoard);
  measurePerf("render.slots", renderSlots);
  measurePerf("render.hud", renderHud);
  scheduleBoardSizeSync();
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
  const topbar = document.querySelector(".topbar");
  const playArea = document.querySelector(".play-area");
  const boardShell = document.querySelector(".board-shell");
  const boardBar = document.querySelector(".board-bar");
  const dropArrows = document.querySelector(".drop-arrows");
  const statusText = document.querySelector(".status-text");
  const hud = document.querySelector(".hud");

  if (!phone || !playArea || !boardShell || !boardBar || !dropArrows || !statusText || !hud) return;

  const phoneStyles = getComputedStyle(phone);
  const playStyles = getComputedStyle(playArea);
  const shellStyles = getComputedStyle(boardShell);
  const verticalPadding =
    parseFloat(playStyles.paddingTop) +
    parseFloat(playStyles.paddingBottom) +
    parseFloat(shellStyles.paddingTop) +
    parseFloat(shellStyles.paddingBottom) +
    parseFloat(phoneStyles.borderTopWidth) +
    parseFloat(phoneStyles.borderBottomWidth);
  const fixedHeight =
    topbar.getBoundingClientRect().height +
    boardBar.getBoundingClientRect().height +
    dropArrows.getBoundingClientRect().height +
    slotsEl.getBoundingClientRect().height +
    statusText.getBoundingClientRect().height +
    hud.getBoundingClientRect().height +
    verticalPadding +
    10;
  const viewportHeight = window.visualViewport?.height || window.innerHeight || phone.clientHeight;
  const phoneHeight = Math.min(phone.clientHeight || viewportHeight, viewportHeight);
  const maxByHeight = Math.max(220, ((phoneHeight - fixedHeight) * COLS) / ROWS);
  const maxByWidth = Math.max(220, boardShell.clientWidth - parseFloat(shellStyles.paddingLeft) - parseFloat(shellStyles.paddingRight));
  const width = Math.floor(Math.min(maxByWidth, maxByHeight));

  phone.style.setProperty("--board-width", `${width}px`);
  boardEl.style.height = `${Math.round((width * ROWS) / COLS)}px`;
  resizeFxCanvas();
}

function highestMultiplier() {
  let high = 0;
  for (const row of state.board) {
    for (const tile of row) {
      if (tile?.kind === "multiplier") high = Math.max(high, tile.value);
    }
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

function findMatches(board) {
  const cells = new Set();
  const runs = [];

  for (let row = 0; row < ROWS; row += 1) {
    let col = 0;
    while (col < COLS) {
      const tile = board[row][col];
      if (!isMatchableCandy(tile)) {
        col += 1;
        continue;
      }

      let end = col + 1;
      while (end < COLS && isMatchableCandy(board[row][end]) && board[row][end].type === tile.type) {
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
      if (!isMatchableCandy(tile)) {
        row += 1;
        continue;
      }

      let end = row + 1;
      while (end < ROWS && isMatchableCandy(board[end][col]) && board[end][col].type === tile.type) {
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
      if (tile?.kind === "candy" && tile.type === type && (includeSpecial || !tile.special)) cells.add(`${row},${col}`);
    }
  }
  return cells;
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

function hasLegalMove(board) {
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const here = { row, col };
      const checks = [
        { row, col: col + 1 },
        { row: row + 1, col },
      ];

      for (const there of checks) {
        if (there.row >= ROWS || there.col >= COLS) continue;
        if (canTriggerGenericSpecial(board[here.row][here.col], board[there.row][there.col])) return true;
        const test = cloneBoard(board);
        swap(test, here, there);
        if (findMatches(test).cells.size > 0) return true;
      }
    }
  }
  return false;
}

function canTriggerGenericSpecial(a, b) {
  return (
    (a?.kind === "candy" && isGenericSpecial(a.special) && isOrdinaryCandy(b)) ||
    (b?.kind === "candy" && isGenericSpecial(b.special) && isOrdinaryCandy(a))
  );
}

function addSpecialMeter(count) {
  if (count <= 0) return;
  state.specialMeter += count;
  while (state.specialMeter >= SPECIAL_METER_TARGET) {
    state.specialMeter -= SPECIAL_METER_TARGET;
    state.pendingSpecialAwards += 1;
  }
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
  for (let col = 0; col < COLS; col += 1) {
    let write = ROWS - 1;
    for (let row = ROWS - 1; row >= 0; row -= 1) {
      const tile = state.board[row][col];
      if (!tile) continue;
      if (write !== row) tile._fall = write - row;
      state.board[write][col] = tile;
      if (write !== row) state.board[row][col] = null;
      write -= 1;
    }

    for (let row = write; row >= 0; row -= 1) {
      state.board[row][col] = null;
    }
  }
}

function fillEmptyCells() {
  for (let col = 0; col < COLS; col += 1) {
    for (let row = 0; row < ROWS; row += 1) {
      if (!state.board[row][col]) {
        const tile = randomCandy([], { allowFish: true });
        tile._fall = row + 1;
        state.board[row][col] = tile;
      }
    }
  }
}

function clearFallMarks() {
  for (const row of state.board) {
    for (const tile of row) {
      if (tile?._fall) delete tile._fall;
      if (tile?._merged) delete tile._merged;
    }
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
  if (state.balance < currentBet()) {
    setStatus("餘額不足");
    playSound("error");
    return;
  }

  if (!isAdjacent(from, to)) return;

  state.selected = null;
  swap(state.board, from, to);
  let matches = findMatches(state.board);
  const specialPoint = specialSwapPoint(from, to);

  if (matches.cells.size === 0 && specialPoint) {
    matches = { cells: new Set([`${specialPoint.row},${specialPoint.col}`]), runs: [] };
  }

  if (matches.cells.size === 0) {
    swap(state.board, from, to);
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
  state.slotFlash = Array(COLS).fill(null);
  playSound("move");
  await resolveMove(matches, specialPoint || to);
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
  if (!hasLegalMove(state.board)) {
    await ensureLegalMove();
    return;
  }

  const point = { row, col };
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
        clearedCandyCount += 1;
        state.board[row][col] = null;
      }
    }
    clearEnd();
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
    const collected = collectMultipliers();
    collectEnd();
    if (collected.length > 0) {
      state.slotFlash = Array(COLS).fill(null);
      for (const item of collected) {
        state.slotFlash[item.col] = item.value;
        state.filledSlots.add(item.col);
        addWin(currentBet() * item.value);
        spawnSlotEnergy(item.col, item.value);
      }
      setStatus(collected.map((item) => `第${item.col + 1}槽 x${item.value}`).join("  "));
      render();
      spawnParticles(collected.length * 12);
      const highCollect = Math.max(...collected.map((item) => item.value));
      playMultiplierCollectSound(highCollect);
      if (highCollect >= 100) triggerScreenFx("fx-jackpot", 780);
      else if (highCollect >= 20) triggerScreenFx("fx-bump", 420);
      await wait(resolveDelay(highCollect >= 100 ? 760 : highCollect >= 50 ? 640 : 540, 190));
    }

    const collapseEnd = startPerfSpan("move.collapse");
    setPerfPhase("drop");
    collapseColumns();
    collapseEnd();
    const fillEnd = startPerfSpan("move.fill");
    fillEmptyCells();
    fillEnd();
    render();
    playSound("drop");
    await wait(resolveDelay(430, 170));
    clearFallMarks();

    matches = measurePerf("move.findMatches", () => findMatches(state.board));
    cascades += 1;
  }

  await processSpecialAwards();
  const eventMatches = measurePerf("event.findMatches", () => findMatches(state.board));
  if (eventMatches.cells.size > 0) {
    await resolveMove(eventMatches);
    return;
  }
  state.lastWin = state.currentWin;
  await maybeFullDropBonus();
  const showedWinCard = await maybeShowWinCard();
  state.slotFlash = Array(COLS).fill(null);
  state.resolving = false;
  setBoardBusy(false);
  setPerfPhase("idle");
  render();
  await ensureLegalMove();
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

  setPerfPhase("win-card");
  winLabelEl.textContent = tier.label;
  winTitleArtEl.src = winArtAsset(tier.art);
  winTitleArtEl.alt = tier.label;
  winMultiplierEl.textContent = `${Math.floor(ratio)}x`;
  winAmountEl.textContent = "0.00";
  winOverlay.className = `win-overlay ${tier.className}`;
  winOverlay.classList.remove("hidden");
  animateWinAmount(state.currentWin, 2000);
  playWinCountLoop(2000, tier.countVolume || 0.04);
  spawnParticles(tier.particles);
  triggerScreenFx(ratio >= 50 ? "fx-jackpot" : ratio >= 20 ? "fx-blast" : "fx-bump", ratio >= 50 ? 980 : 640);
  playSound(tier.sound || "win");
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
  const started = performance.now();
  let step = 0;
  const timer = window.setInterval(() => {
    const elapsed = performance.now() - started;
    if (elapsed >= duration || winOverlay.classList.contains("hidden")) {
      window.clearInterval(timer);
      playChord([880, 1175, 1568], 0.16, { volume: Math.min(0.08, volume + 0.018) });
      return;
    }
    const progress = elapsed / duration;
    const freq = 620 + progress * 520 + (step % 3) * 55;
    playTone(freq, 0.045, { type: "triangle", volume });
    if (step % 4 === 0) playTone(980 + progress * 620, 0.035, { type: "sine", volume: volume * 0.62 });
    step += 1;
  }, 78);
}

async function maybeFullDropBonus() {
  if (state.filledSlots.size < COLS) return;

  const bonus = currentBet() * 10;
  addWin(bonus);
  setStatus("FULL DROP BONUS");
  render();
  spawnParticles(30);
  playSound("win");
  triggerScreenFx("fx-jackpot", 900);
  await wait(resolveDelay(800, 480));
  state.board = buildBoard();
  state.filledSlots = new Set();
}

async function ensureLegalMove() {
  if (hasLegalMove(state.board)) return;
  const wasResolving = state.resolving;
  state.resolving = true;
  setStatus("無可走步，自動洗牌");
  render();
  await wait(resolveDelay(700, 280));
  reshuffleBoard();
  state.resolving = wasResolving;
  render();
}

function reshuffleBoard() {
  const multipliers = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const tile = state.board[row][col];
      if (tile?.kind === "multiplier") multipliers.push({ col, value: tile.value });
    }
  }

  let attempts = 0;
  do {
    state.board = makeCandyBoard();
    for (const item of multipliers) {
      let row = Math.floor(Math.random() * (ROWS - 2));
      let guard = 0;
      while (state.board[row][item.col]?.kind === "multiplier" && guard < 20) {
        row = Math.floor(Math.random() * (ROWS - 2));
        guard += 1;
      }
      state.board[row][item.col] = { kind: "multiplier", value: item.value };
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
      alpha *= t < 0.16 ? t / 0.16 : 1 - Math.max(0, t - 0.76) / 0.24;
      radius *= 1 + Math.sin(t * Math.PI) * 0.45;
    }

    context.save();
    context.globalAlpha = Math.max(0, alpha);
    context.translate(x * dpr, y * dpr);
    context.rotate((item.rotation || 0) + t * (item.spin || 0));
    context.scale(dpr, dpr);
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
  const target = document.querySelector(".special-meter");
  if (!host || !target) return;

  const hostRect = host.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width * 0.5 - hostRect.left;
  const targetY = targetRect.top + targetRect.height * 0.46 - hostRect.top;

  const maxEnergy = window.innerWidth <= 520 ? 14 : 22;
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
      delay: Math.random() * 110,
      duration: 620 + Math.random() * 120,
      x: startX,
      y: startY,
      tx: targetX - startX,
      ty: targetY - startY,
      arc: 24 + Math.random() * 26,
      radius: 4.5 + Math.random() * 2,
      color: "#ff58d4",
      hot: "#fff37e",
      alpha: 0.96,
    });
  }
  enqueueFx(items);
}

function spawnSlotEnergy(col, value) {
  const host = document.querySelector(".play-area");
  const slot = slotsEl.children[col];
  if (!host || !slot) return;

  const hostRect = host.getBoundingClientRect();
  const targetRect = slot.getBoundingClientRect();
  const startX = hostRect.width * 0.5;
  const startY = hostRect.height * 0.48;
  const targetX = targetRect.left + targetRect.width * 0.5 - hostRect.left;
  const targetY = targetRect.top + targetRect.height * 0.48 - hostRect.top;
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

function keyToPoint(key) {
  const [row, col] = key.split(",").map(Number);
  return { row, col };
}

function ensureAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!state.audioContext) state.audioContext = new AudioContext();
  if (!state.masterGain) {
    state.masterGain = state.audioContext.createGain();
    state.masterGain.gain.value = 0.42;
    state.masterGain.connect(state.audioContext.destination);
  }
  if (state.audioContext.state === "suspended") state.audioContext.resume();
  return state.audioContext;
}

function playTone(freq, duration = 0.08, options = {}) {
  const context = ensureAudio();
  if (!context || !state.masterGain) return;
  const maxTones = window.innerWidth <= 520 ? 10 : 14;
  if (state.activeTones >= maxTones) return;
  state.activeTones += 1;
  const now = context.currentTime + (options.delay || 0);
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = options.type || "triangle";
  osc.frequency.setValueAtTime(freq, now);
  if (options.to) osc.frequency.exponentialRampToValueAtTime(Math.max(40, options.to), now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(options.volume || 0.08, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(state.masterGain);
  osc.start(now);
  osc.stop(now + duration + 0.03);
  window.setTimeout(() => {
    state.activeTones = Math.max(0, state.activeTones - 1);
  }, Math.max(80, (duration + (options.delay || 0) + 0.08) * 1000));
}

function playChord(freqs, duration, options = {}) {
  freqs.forEach((freq, index) => playTone(freq, duration, { ...options, delay: (options.delay || 0) + index * 0.012 }));
}

function startBackgroundMusic() {
  if (!state.sound || state.musicTimer) return;
  const notes = [196, 247, 294, 330, 392, 330, 294, 247, 220, 262, 330, 392, 330, 262, 247, 220];
  state.musicTimer = window.setInterval(() => {
    if (!state.sound || document.hidden) return;
    const base = notes[state.musicStep % notes.length];
    state.musicStep += 1;
    playTone(base, 0.055, { type: "sine", volume: 0.012 });
    if (state.musicStep % 4 === 0) playTone(98, 0.048, { type: "square", volume: 0.01 });
    if (state.musicStep % 8 === 0) playTone(base * 2, 0.04, { type: "triangle", volume: 0.006 });
  }, 620);
}

function stopBackgroundMusic() {
  if (!state.musicTimer) return;
  window.clearInterval(state.musicTimer);
  state.musicTimer = null;
}

function playMultiplierCollectSound(value) {
  if (value >= 100) {
    playSound("jackpot");
  } else if (value >= 50) {
    playSound("superWin");
  } else if (value >= 20) {
    playSound("multiplierHigh");
  } else {
    playSound("slotProgress");
  }
}

function playSound(kind) {
  if (!state.sound) return;
  recordPerf(`sound.${kind}`, 0);
  const throttle = {
    button: 55,
    move: 55,
    match: 90,
    cascade: 120,
    drop: 150,
    slotProgress: 95,
  };
  const now = performance.now();
  const minGap = throttle[kind] || 28;
  if ((state.lastSoundAt[kind] || 0) + minGap > now) return;
  state.lastSoundAt[kind] = now;
  ensureAudio();
  startBackgroundMusic();

  const soundMap = {
    button: () => playChord([420, 630], 0.045, { volume: 0.04 }),
    move: () => playTone(420, 0.065, { to: 720, volume: 0.055 }),
    match: () => playChord([720, 920, 1120], 0.105, { volume: 0.07 }),
    cascade: () => {
      playTone(620, 0.07, { to: 380, type: "square", volume: 0.045 });
      playTone(880, 0.06, { delay: 0.07, volume: 0.045 });
    },
    drop: () => playTone(260, 0.08, { to: 170, type: "sine", volume: 0.045 }),
    specialReady: () => playChord([660, 990, 1320], 0.16, { volume: 0.07 }),
    specialSpawn: () => {
      playTone(780, 0.08, { to: 1320, volume: 0.07 });
      playChord([990, 1485], 0.11, { delay: 0.09, volume: 0.06 });
    },
    specialBlast: () => {
      playTone(140, 0.16, { to: 70, type: "sawtooth", volume: 0.08 });
      playChord([720, 960, 1280], 0.12, { delay: 0.05, volume: 0.07 });
    },
    multiplierMerge: () => playChord([520, 780, 1040], 0.14, { volume: 0.07 }),
    multiplierHigh: () => {
      [620, 780, 980, 1240].forEach((freq, i) => playTone(freq, 0.08, { delay: i * 0.055, volume: 0.065 }));
    },
    slotProgress: () => playChord([520, 690], 0.075, { volume: 0.055 }),
    win: () => [660, 880, 1100, 1320].forEach((freq, i) => playTone(freq, 0.1, { delay: i * 0.075, volume: 0.07 })),
    superWin: () => {
      [520, 660, 880, 1100, 1320, 1760].forEach((freq, i) => playTone(freq, 0.11, { delay: i * 0.065, type: i > 3 ? "square" : "triangle", volume: 0.075 }));
    },
    jackpot: () => {
      [392, 523, 659, 784, 1047, 1319, 1568].forEach((freq, i) => playTone(freq, 0.16, { delay: i * 0.07, type: i > 3 ? "square" : "triangle", volume: 0.085 }));
      playChord([262, 330, 392, 523], 0.42, { delay: 0.48, type: "sawtooth", volume: 0.055 });
    },
    error: () => playTone(150, 0.09, { to: 92, type: "sawtooth", volume: 0.055 }),
  };

  (soundMap[kind] || soundMap.button)();
}

boardEl.addEventListener("pointerdown", (event) => {
  const tile = event.target.closest(".tile");
  if (!tile || state.resolving) return;

  state.pointer = {
    ...pointFromTile(tile),
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
    playSound("button");
  } else {
    stopBackgroundMusic();
  }
  render();
});

function randomSpecialReward() {
  return randomBoardEvent();
}

function chooseCreatedSpecial() {
  return null;
}

function tileLabel(tile) {
  if (!tile) return "空格";
  if (tile.kind === "multiplier") return `x${tile.value} 倍數糖`;
  if (tile.special === "chocolate") return "巧克力糖";
  return `${tile.type} 糖果`;
}

function specialName(special) {
  return special === "chocolate" ? "巧克力糖" : "特殊物件";
}

function specialEffectCells(row, col, tile) {
  if (tile.special === "chocolate") return candyCellsByType(tile._targetType || tile.type, false);
  return new Set();
}

function renderHud() {
  document.querySelector(".special-meter-copy span").textContent = "事件收集";
  specialMiniSlotEl.setAttribute("aria-label", "事件預覽");
  specialMeterTextEl.textContent = `${Math.min(state.specialMeter, SPECIAL_METER_TARGET)}/${SPECIAL_METER_TARGET}`;
  specialMeterFillEl.style.width = `${Math.min(100, (state.specialMeter / SPECIAL_METER_TARGET) * 100)}%`;
  miniSlotIconEl.src = eventPreviewAsset(state.miniSlotPreview);
  specialMiniSlotEl.classList.toggle("rolling", state.miniSlotRolling);
  specialMiniSlotEl.classList.toggle("win", state.miniSlotWin);
  balanceEl.textContent = formatMoney(state.balance);
  betEl.textContent = currentBet().toLocaleString("en-US");
  fastButton.setAttribute("aria-pressed", String(state.fast));
  soundMenuButton.textContent = state.sound ? "音效開啟" : "音效關閉";
}

function findBoardEventCell({ allowMultiplierTarget = false } = {}) {
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

function surroundingPoints(row, col) {
  const points = [];
  for (let r = row - 1; r <= row + 1; r += 1) {
    for (let c = col - 1; c <= col + 1; c += 1) {
      if (r === row && c === col) continue;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
      points.push({ row: r, col: c });
    }
  }
  return points;
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
  playSound("specialReady");
  for (let i = 0; i < steps; i += 1) {
    const point = i === steps - 1 ? finalTarget : randomItem(targets);
    state.sniperTarget = point;
    render();
    markSniperTarget(point);
    await wait(resolveDelay(80 + i * 10, 38));
  }

  const targetTile = state.board[finalTarget.row][finalTarget.col];
  const resultTile = cloneSniperResultTile(targetTile);
  for (const point of surroundingPoints(finalTarget.row, finalTarget.col)) {
    state.board[point.row][point.col] = { ...resultTile, _eventTransform: true };
  }
  setStatus("狙擊槍鎖定");
  setEventPulse(true);
  render();
  markSniperTarget(finalTarget);
  spawnParticles(24);
  triggerScreenFx("fx-bump", 420);
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

    if (event.kind === "sniper") {
      setStatus("狙擊槍");
      await playSniperEvent();
    } else {
      const target = findBoardEventCell();
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

window.addEventListener("resize", () => scheduleBoardSizeSync(true));
window.visualViewport?.addEventListener("resize", () => scheduleBoardSizeSync(true));

window.setInterval(() => {
  if (state.resolving || state.miniSlotRolling || state.miniSlotWin) return;
  state.miniSlotPreview = randomSpecialReward();
  renderHud();
}, 1300);

preloadSymbolAssets();
initPerfMonitor();
startNewBoard();
