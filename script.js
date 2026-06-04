const ROWS = 9;
const COLS = 5;
const SYMBOL_VERSION = "symbol-rules-20";
const SPECIAL_METER_TARGET = 20;
const BET_STEPS = [20, 50, 100, 200, 500];
const CANDIES = ["red", "blue", "green", "orange", "yellow", "purple"];
const MULTIPLIER_VALUES = [5, 10, 20, 30, 50, 100];
const WIN_TIERS = [
  { ratio: 50, label: "EPIC WIN", sound: "jackpot" },
  { ratio: 30, label: "SUPER WIN" },
  { ratio: 20, label: "MEGA WIN" },
  { ratio: 10, label: "BIG WIN" },
  { ratio: 5, label: "NICE" },
];

const boardEl = document.getElementById("board");
const slotsEl = document.getElementById("slots");
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
  pointer: null,
  ignoreClick: false,
  specialMeter: 0,
  pendingSpecialAwards: 0,
  miniSlotPreview: { special: "colorbomb", type: "purple" },
  miniSlotRolling: false,
  miniSlotWin: false,
};

function formatMoney(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
  const tile = { kind: "candy", type: randomItem(pool.length ? pool : CANDIES) };
  if (options.allowFish && Math.random() < 0.025) tile.special = "fish";
  return tile;
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
  return special === "fish" || special === "colorbomb";
}

function isMatchableCandy(tile) {
  return tile?.kind === "candy" && !isGenericSpecial(tile.special);
}

function isOrdinaryCandy(tile) {
  return tile?.kind === "candy" && !tile.special;
}

function specialAsset(special, type) {
  if (special === "horizontal" || special === "vertical" || special === "bomb") {
    return `assets/symbols/special-${special}-${type}.png?v=${SYMBOL_VERSION}`;
  }
  return `assets/symbols/special-${special}.png?v=${SYMBOL_VERSION}`;
}

function randomSpecialReward() {
  const special = randomItem(["horizontal", "vertical", "bomb", "fish", "colorbomb"]);
  return {
    special,
    type: special === "fish" || special === "colorbomb" ? randomItem(CANDIES) : randomItem(CANDIES),
  };
}

function specialRewardTile(reward) {
  return {
    kind: "candy",
    type: reward.type,
    special: reward.special,
    _reward: true,
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

function renderBoard() {
  boardEl.innerHTML = "";

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const tile = state.board[row][col];
      const button = document.createElement("button");
      const key = `${row},${col}`;

      button.type = "button";
      button.className = "tile";
      button.dataset.row = row;
      button.dataset.col = col;
      button.disabled = state.resolving;
      button.setAttribute("aria-label", tileLabel(tile));

      if (state.selected?.row === row && state.selected?.col === col) {
        button.classList.add("selected");
      }
  if (state.clearing.has(key)) {
        button.classList.add("clearing");
      }
      if (tile?._fall) {
        button.classList.add("falling");
        button.style.setProperty("--fall-y", `-${tile._fall * 118}%`);
      }
      if (tile?._merged) {
        button.classList.add("merged");
      }
      if (tile?._reward) {
        button.classList.add("reward-drop");
      }
      if (tile?._spawn) {
        button.classList.add("special-spawn");
      }
      if (state.invalid === key) {
        button.classList.add("invalid");
      }

      if (tile?.kind === "candy") {
        button.classList.add("candy", `candy-${tile.type}`);
        if (tile.special) button.classList.add("special-candy", `special-${tile.special}`);
        const asset = tile.special ? specialAsset(tile.special, tile.type) : candyAsset(tile.type);
        const imageClass = tile.special ? "special-img" : "candy-img";
        button.innerHTML = state.clearing.has(key)
          ? `<img class="symbol-img ${imageClass}" src="${asset}" alt=""><span class="clear-burst"></span><span class="clear-sparks"></span>`
          : `<img class="symbol-img ${imageClass}" src="${asset}" alt="">`;
      } else if (tile?.kind === "multiplier") {
        button.classList.add("multiplier", `value-${tile.value}`, multiplierTierClass(tile.value));
        button.innerHTML = `<img class="symbol-img multiplier-img" src="${multiplierAsset(tile.value)}" alt="">`;
      }

      boardEl.appendChild(button);
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
  renderBoard();
  renderSlots();
  renderHud();
  syncBoardSize();
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
  let matches = initialMatches;
  let cascades = 0;
  render();

  while (matches.cells.size > 0) {
    const clearScore = scoreRuns(matches.runs);
    addWin(clearScore);
    const createdSpecial = chooseCreatedSpecial(matches, preferredSpawn);
    const expandedCells = expandSpecialEffects(matches.cells);
    const hasSpecialBlast = Array.from(expandedCells).some((key) => {
      const [row, col] = key.split(",").map(Number);
      return Boolean(state.board[row][col]?.special);
    });
    state.clearing = expandedCells;
    setStatus(cascades === 0 ? "消除收集" : `連鎖 ${cascades + 1}`);
    render();
    playSound(hasSpecialBlast ? "specialBlast" : cascades === 0 ? "match" : "cascade");
    spawnCollectEnergy(expandedCells);
    await wait(resolveDelay(330, 120));

    let clearedCandyCount = 0;
    for (const key of expandedCells) {
      const [row, col] = key.split(",").map(Number);
      if (createdSpecial && key === `${createdSpecial.row},${createdSpecial.col}`) continue;
      if (state.board[row][col]?.kind === "candy") {
        clearedCandyCount += 1;
        state.board[row][col] = null;
      }
    }
    addSpecialMeter(clearedCandyCount);
    if (createdSpecial) {
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
      await wait(resolveDelay(260, 100));
      delete state.board[createdSpecial.row][createdSpecial.col]._spawn;
    }
    state.clearing = new Set();

    const collected = collectMultipliers();
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
      playMultiplierCollectSound(Math.max(...collected.map((item) => item.value)));
      await wait(resolveDelay(520, 170));
    }

    collapseColumns();
    fillEmptyCells();
    render();
    playSound("drop");
    await wait(resolveDelay(430, 170));
    clearFallMarks();

    matches = findMatches(state.board);
    cascades += 1;
  }

  await processSpecialAwards();
  state.lastWin = state.currentWin;
  await maybeFullDropBonus();
  const showedWinCard = await maybeShowWinCard();
  state.slotFlash = Array(COLS).fill(null);
  state.resolving = false;
  render();
  await ensureLegalMove();
  setStatus(showedWinCard ? "大獎入帳" : "繼續追高倍糖果");
}

async function maybeShowWinCard() {
  const ratio = state.currentWin / currentBet();
  const tier = WIN_TIERS.find((item) => ratio >= item.ratio);
  if (!tier) return false;

  winLabelEl.textContent = tier.label;
  winMultiplierEl.textContent = `${Math.floor(ratio)}x`;
  winAmountEl.textContent = formatMoney(state.currentWin);
  winOverlay.classList.remove("hidden");
  spawnParticles(28);
  playSound(tier.sound || (ratio >= 30 ? "superWin" : "win"));
  await wait(resolveDelay(1080, 620));
  winOverlay.classList.add("hidden");
  return true;
}

async function maybeFullDropBonus() {
  if (state.filledSlots.size < COLS) return;

  const bonus = currentBet() * 10;
  addWin(bonus);
  setStatus("FULL DROP BONUS");
  render();
  spawnParticles(30);
  playSound("win");
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

  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.setProperty("--x", `${35 + Math.random() * 30}%`);
    particle.style.setProperty("--y", `${44 + Math.random() * 26}%`);
    particle.style.setProperty("--dx", `${Math.random() * 220 - 110}px`);
    particle.style.setProperty("--dy", `${Math.random() * -190 - 40}px`);
    particle.style.setProperty("--r", `${Math.random() * 180}deg`);
    particle.style.setProperty("--color", randomItem(colors));
    host.appendChild(particle);
    window.setTimeout(() => particle.remove(), 950);
  }
}

function spawnCollectEnergy(cells) {
  const host = document.querySelector(".play-area");
  const target = document.querySelector(".special-meter");
  if (!host || !target) return;

  const hostRect = host.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width * 0.5 - hostRect.left;
  const targetY = targetRect.top + targetRect.height * 0.46 - hostRect.top;

  for (const key of cells) {
    const tile = boardEl.querySelector(tileSelector(keyToPoint(key)));
    if (!tile) continue;
    const rect = tile.getBoundingClientRect();
    const startX = rect.left + rect.width * 0.5 - hostRect.left;
    const startY = rect.top + rect.height * 0.5 - hostRect.top;
    const mote = document.createElement("span");
    mote.className = "collect-energy";
    mote.style.setProperty("--x", `${startX}px`);
    mote.style.setProperty("--y", `${startY}px`);
    mote.style.setProperty("--tx", `${targetX - startX}px`);
    mote.style.setProperty("--ty", `${targetY - startY}px`);
    mote.style.setProperty("--delay", `${Math.random() * 90}ms`);
    host.appendChild(mote);
    window.setTimeout(() => mote.remove(), 820);
  }
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

  for (let i = 0; i < count; i += 1) {
    const mote = document.createElement("span");
    mote.className = value >= 50 ? "slot-energy jackpot-energy" : "slot-energy";
    mote.style.setProperty("--x", `${startX + Math.random() * 54 - 27}px`);
    mote.style.setProperty("--y", `${startY + Math.random() * 42 - 21}px`);
    mote.style.setProperty("--tx", `${targetX - startX}px`);
    mote.style.setProperty("--ty", `${targetY - startY}px`);
    mote.style.setProperty("--delay", `${i * 28}ms`);
    host.appendChild(mote);
    window.setTimeout(() => mote.remove(), 920);
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
}

function playChord(freqs, duration, options = {}) {
  freqs.forEach((freq, index) => playTone(freq, duration, { ...options, delay: (options.delay || 0) + index * 0.012 }));
}

function startBackgroundMusic() {
  if (!state.sound || state.musicTimer) return;
  const notes = [196, 247, 294, 330, 294, 247, 220, 262];
  state.musicTimer = window.setInterval(() => {
    if (!state.sound || document.hidden) return;
    const base = notes[state.musicStep % notes.length];
    state.musicStep += 1;
    playTone(base, 0.055, { type: "sine", volume: 0.018 });
    if (state.musicStep % 4 === 0) playTone(98, 0.045, { type: "square", volume: 0.012 });
  }, 430);
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

window.addEventListener("resize", syncBoardSize);
window.visualViewport?.addEventListener("resize", syncBoardSize);

window.setInterval(() => {
  if (state.resolving || state.miniSlotRolling || state.miniSlotWin) return;
  state.miniSlotPreview = randomSpecialReward();
  renderHud();
}, 1300);

startNewBoard();
