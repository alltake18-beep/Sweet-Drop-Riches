#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROWS = 9;
const COLS = 6;
const SLOT_COUNT = 3;
const SLOT_TURN_MAX = 10;
const SPECIAL_METER_THRESHOLDS = [9, 21, 33];
const SPECIAL_METER_MAX = 33;
const CANDIES = ["red", "blue", "green", "orange", "purple"];
const MULTIPLIER_COLS = [0, 2, 4];

const INITIAL_MULTIPLIER_SIZE_WEIGHTS = [
  { size: 1, weight: 90 },
  { size: 2, weight: 10 },
];
const INITIAL_MULTIPLIER_VALUE_WEIGHTS_1X1 = [
  { value: 5, weight: 70 },
  { value: 10, weight: 20 },
  { value: 20, weight: 10 },
];
const INITIAL_MULTIPLIER_VALUE_WEIGHTS_2X2 = [
  { value: 30, weight: 95 },
  { value: 50, weight: 4 },
  { value: 100, weight: 0.8 },
  { value: 200, weight: 0.2 },
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
const COLLECTION_SLOT_ITEM_WEIGHTS = [
  { kind: "candyClear", type: "red", weight: 6 },
  { kind: "candyClear", type: "blue", weight: 6 },
  { kind: "candyClear", type: "green", weight: 6 },
  { kind: "candyClear", type: "orange", weight: 6 },
  { kind: "candyClear", type: "purple", weight: 6 },
  { kind: "multiplier", value: 5, size: 1, weight: 12 },
  { kind: "multiplier", value: 10, size: 1, weight: 8 },
  { kind: "multiplier", value: 20, size: 1, weight: 5 },
  { kind: "multiplier", value: 30, size: 2, weight: 3 },
  { kind: "multiplier", value: 50, size: 2, weight: 1 },
  { kind: "multiplier", value: 100, size: 2, weight: 0.9 },
  { kind: "multiplier", value: 200, size: 2, weight: 0.1 },
  { kind: "flame", weight: 40 },
];
const STAGE_THREE_EVENT_WEIGHTS = [
  { kind: "multiplier", value: 20, size: 1, weight: 35 },
  { kind: "multiplier", value: 30, size: 2, weight: 25 },
  { kind: "multiplier", value: 50, size: 2, weight: 8 },
  { kind: "multiplier", value: 100, size: 2, weight: 1.5 },
  { kind: "multiplier", value: 200, size: 2, weight: 0.5 },
  { kind: "flame", weight: 30 },
];
const FLAME_PATTERN_WEIGHTS = [
  { kind: "col1", weight: 10 },
  { kind: "row1", weight: 10 },
  { kind: "cross1", weight: 30 },
  { kind: "col2", weight: 15 },
  { kind: "row2", weight: 15 },
  { kind: "cross2", weight: 20 },
];
const FULL_DROP_WHEEL_PRIZES = [
  { label: "0.1x", multiplier: 0.1, weight: 30 },
  { label: "0.2x", multiplier: 0.2, weight: 30 },
  { label: "0.5x", multiplier: 0.5, weight: 30 },
  { label: "1x", multiplier: 1, weight: 6 },
  { label: "1.5x", multiplier: 1.5, weight: 2 },
  { label: "2x", multiplier: 2, weight: 1 },
  { label: "5x", multiplier: 5, weight: 0.8 },
  { label: "10x", multiplier: 10, weight: 0.1 },
  { label: "20x", multiplier: 20, weight: 0.08 },
  { label: "30x", multiplier: 30, weight: 0.01 },
  { label: "50x", multiplier: 50, weight: 0.005 },
  { label: "100x", multiplier: 100, weight: 0.005 },
];

const args = parseArgs(process.argv.slice(2));
const config = {
  steps: numberArg(args.steps, 1000),
  bet: numberArg(args.bet, 100),
  startBalance: numberArg(args["start-balance"], 4000),
  cashoutBalance: numberArg(args["cashout-balance"], 10000),
  seed: args.seed ? String(args.seed) : "",
  out: args.out ? String(args.out) : "reports/rtp-summary.md",
};
let random = config.seed ? seededRandom(config.seed) : Math.random;

const stats = makeStats(config);

let state = newState(config.bet, config.startBalance);
while (stats.totalMoves < config.steps) {
  if (state.balance < config.bet) {
    retirePlayer(state, "bust");
    state = newState(config.bet, config.startBalance);
    continue;
  }
  tickCollectedSlotTurns(state);
  const picked = chooseGreedyMove(state);
  if (!picked) {
    stats.noMoveRebuilds += 1;
    rebuildBoard(state);
    continue;
  }
  playMove(state, picked);
  if (state.balance > config.cashoutBalance) {
    retirePlayer(state, "cashout");
    if (stats.totalMoves < config.steps) state = newState(config.bet, config.startBalance);
  } else if (state.balance < config.bet) {
    retirePlayer(state, "bust");
    if (stats.totalMoves < config.steps) state = newState(config.bet, config.startBalance);
  }
}
stats.unfinishedPlayers = stats.totalPlayers - stats.cashoutPlayers - stats.bustPlayers;

const report = buildReport(stats);
console.log(report);
writeReport(config.out, report);

function parseArgs(items) {
  const parsed = {};
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = items[i + 1];
    parsed[key] = next && !next.startsWith("--") ? next : true;
    if (parsed[key] === next) i += 1;
  }
  return parsed;
}

function numberArg(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : fallback;
}

function seededRandom(seedText) {
  let seed = 2166136261;
  for (let i = 0; i < seedText.length; i += 1) {
    seed ^= seedText.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6D2B79F5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeStats(runConfig) {
  const multiplierValues = [5, 10, 20, 30, 50, 100, 200];
  return {
    ...runConfig,
    totalMoves: 0,
    totalPlayers: 0,
    cashoutPlayers: 0,
    bustPlayers: 0,
    unfinishedPlayers: 0,
    totalBet: 0,
    totalWin: 0,
    multiplier: Object.fromEntries(multiplierValues.map((value) => [value, { count: 0, win: 0 }])),
    stages: {
      1: { count: 0 },
      2: { count: 0 },
      3: { count: 0 },
    },
    wheel: Object.fromEntries(FULL_DROP_WHEEL_PRIZES.map((prize) => [
      prize.label,
      { count: 0, base: 0, win: 0, multiplier: prize.multiplier },
    ])),
    wheelTriggers: 0,
    noMoveRebuilds: 0,
  };
}

function newState(bet, startBalance) {
  stats.totalPlayers += 1;
  const state = {
    board: [],
    multipliers: [],
    bet,
    balance: startBalance,
    playerMoves: 0,
    playerWin: 0,
    specialMeter: 0,
    pendingSpecialAwards: [],
    slotValues: Array(SLOT_COUNT).fill(null),
    slotSymbolValues: Array(SLOT_COUNT).fill(null),
    slotTurns: Array(SLOT_COUNT).fill(0),
    filledSlots: new Set(),
  };
  rebuildBoard(state);
  return state;
}

function retirePlayer(state, reason) {
  if (reason === "cashout") stats.cashoutPlayers += 1;
  else stats.bustPlayers += 1;
}

function rebuildBoard(state) {
  let attempts = 0;
  do {
    state.board = makeCandyBoard();
    state.multipliers = addInitialMultipliers(state);
    attempts += 1;
  } while ((!hasLegalMove(state) || findMatches(state).cells.size > 0) && attempts < 120);
  clearMultiplierFootprints(state);
}

function makeCandyBoard() {
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const exclude = [];
      if (col >= 2 && board[row][col - 1]?.type === board[row][col - 2]?.type) exclude.push(board[row][col - 1].type);
      if (row >= 2 && board[row - 1][col]?.type === board[row - 2][col]?.type) exclude.push(board[row - 1][col].type);
      board[row][col] = randomCandy(exclude);
    }
  }
  return board;
}

function addInitialMultipliers(state) {
  const count = random() < 0.75 ? 2 : 3;
  const multipliers = [];
  while (multipliers.length < count) {
    const size = weightedPick(INITIAL_MULTIPLIER_SIZE_WEIGHTS).size;
    const weights = size === 1 ? INITIAL_MULTIPLIER_VALUE_WEIGHTS_1X1 : INITIAL_MULTIPLIER_VALUE_WEIGHTS_2X2;
    const value = weightedPick(weights).value;
    const point = pickMultiplierSpawnCell(state, multipliers, size);
    if (!point) break;
    const multiplier = createMultiplier(state, value, point.row, point.col, size);
    multipliers.push(multiplier);
    clearMultiplierFootprint(state.board, multiplier);
  }
  return multipliers;
}

function createMultiplier(state, value, row, col, size = value >= 30 ? 2 : 1) {
  return {
    id: `m-${stats.totalMoves}-${Math.floor(random() * 1e9)}`,
    value,
    payout: state.bet * value,
    row,
    col,
    size,
  };
}

function randomCandy(exclude = []) {
  const pool = CANDIES.filter((type) => !exclude.includes(type));
  return { kind: "candy", type: randomItem(pool.length ? pool : CANDIES) };
}

function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function randomItem(items) {
  return items[Math.floor(random() * items.length)];
}

function pickMultiplierSpawnCell(state, multipliers, size) {
  const cols = multiplierColsForSize(size);
  const rowWeights = (size === 1 ? MULTIPLIER_ANCHOR_ROW_WEIGHTS_1X1 : MULTIPLIER_ANCHOR_ROW_WEIGHTS_2X2)
    .filter((item) => item.weight > 0 && item.row <= ROWS - size)
    .map((item) => ({ ...item }));
  while (rowWeights.length) {
    const picked = weightedPick(rowWeights);
    const cells = cols
      .map((col) => ({ row: picked.row, col }))
      .filter((cell) => canPlaceMultiplierAt(state, cell.row, cell.col, multipliers, null, size));
    if (cells.length) return randomItem(cells);
    rowWeights.splice(rowWeights.indexOf(picked), 1);
  }
  return null;
}

function multiplierColsForSize(size) {
  return size === 1 ? Array.from({ length: COLS }, (_, col) => col) : MULTIPLIER_COLS;
}

function canPlaceMultiplierAt(state, row, col, multipliers = state.multipliers, ignored = null, size = 1) {
  if (row < 0 || row > ROWS - size || col < 0 || col > COLS - size) return false;
  if (!multiplierColsForSize(size).includes(col)) return false;
  for (let r = row; r < row + size; r += 1) {
    for (let c = col; c < col + size; c += 1) {
      const tile = state.board[r]?.[c];
      if (tile && tile.kind !== "candy") return false;
    }
  }
  return !multipliers.some((multiplier) => {
    if (ignored && multiplier.id === ignored.id) return false;
    return rectanglesOverlap(row, col, size, multiplier.row, multiplier.col, multiplier.size);
  });
}

function canMultiplierOccupyAt(state, row, col, multipliers = state.multipliers, ignored = null, size = 1) {
  if (row < 0 || row > ROWS - size || col < 0 || col > COLS - size) return false;
  for (let r = row; r < row + size; r += 1) {
    for (let c = col; c < col + size; c += 1) {
      if (!isInsideMultiplier(ignored, r, c) && state.board[r]?.[c]) return false;
      const other = multiplierAt(state, r, c, multipliers);
      if (other && (!ignored || other.id !== ignored.id)) return false;
    }
  }
  return true;
}

function isInsideMultiplier(multiplier, row, col) {
  return Boolean(multiplier &&
    row >= multiplier.row &&
    row < multiplier.row + multiplier.size &&
    col >= multiplier.col &&
    col < multiplier.col + multiplier.size);
}

function rectanglesOverlap(rowA, colA, sizeA, rowB, colB, sizeB) {
  return !(colA + sizeA - 1 < colB || colB + sizeB - 1 < colA || rowA + sizeA - 1 < rowB || rowB + sizeB - 1 < rowA);
}

function clearMultiplierFootprint(board, multiplier) {
  for (const cell of multiplierCells(multiplier)) board[cell.row][cell.col] = null;
}

function clearMultiplierFootprints(state) {
  for (const multiplier of state.multipliers) clearMultiplierFootprint(state.board, multiplier);
}

function multiplierCells(multiplier) {
  const cells = [];
  for (let row = multiplier.row; row < multiplier.row + multiplier.size; row += 1) {
    for (let col = multiplier.col; col < multiplier.col + multiplier.size; col += 1) {
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) cells.push({ row, col });
    }
  }
  return cells;
}

function multiplierAt(state, row, col, multipliers = state.multipliers) {
  return multipliers.find((multiplier) =>
    row >= multiplier.row &&
    row < multiplier.row + multiplier.size &&
    col >= multiplier.col &&
    col < multiplier.col + multiplier.size
  ) || null;
}

function findMatches(state) {
  const cells = new Set();
  const runs = [];
  const board = state.board;
  for (let row = 0; row < ROWS; row += 1) {
    let col = 0;
    while (col < COLS) {
      const tile = board[row][col];
      if (multiplierAt(state, row, col) || tile?.kind !== "candy") {
        col += 1;
        continue;
      }
      let end = col + 1;
      while (end < COLS && !multiplierAt(state, row, end) && board[row][end]?.kind === "candy" && board[row][end].type === tile.type) {
        end += 1;
      }
      if (end - col >= 3) {
        const runCells = [];
        for (let x = col; x < end; x += 1) {
          cells.add(`${row},${x}`);
          runCells.push({ row, col: x });
        }
        runs.push({ cells: runCells, length: end - col, orientation: "row" });
      }
      col = end;
    }
  }
  for (let col = 0; col < COLS; col += 1) {
    let row = 0;
    while (row < ROWS) {
      const tile = board[row][col];
      if (multiplierAt(state, row, col) || tile?.kind !== "candy") {
        row += 1;
        continue;
      }
      let end = row + 1;
      while (end < ROWS && !multiplierAt(state, end, col) && board[end][col]?.kind === "candy" && board[end][col].type === tile.type) {
        end += 1;
      }
      if (end - row >= 3) {
        const runCells = [];
        for (let y = row; y < end; y += 1) {
          cells.add(`${y},${col}`);
          runCells.push({ row: y, col });
        }
        runs.push({ cells: runCells, length: end - row, orientation: "col" });
      }
      row = end;
    }
  }
  return { cells, runs };
}

function allLegalMoves(state) {
  const moves = [];
  const dirs = [{ row: 0, col: 1 }, { row: 1, col: 0 }];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (multiplierAt(state, row, col) || state.board[row][col]?.kind !== "candy") continue;
      for (const dir of dirs) {
        const to = { row: row + dir.row, col: col + dir.col };
        if (to.row >= ROWS || to.col >= COLS) continue;
        if (multiplierAt(state, to.row, to.col) || state.board[to.row][to.col]?.kind !== "candy") continue;
        swap(state.board, { row, col }, to);
        const matchCount = findMatches(state).cells.size;
        swap(state.board, { row, col }, to);
        if (matchCount > 0) moves.push({ from: { row, col }, to, matchCount });
      }
    }
  }
  return moves;
}

function hasLegalMove(state) {
  return allLegalMoves(state).length > 0;
}

function chooseGreedyMove(state) {
  const moves = allLegalMoves(state);
  if (!moves.length) return null;
  let best = null;
  for (const move of moves) {
    const score = estimateMoveScore(state, move);
    if (!best || score > best.score) best = { move, score };
  }
  return best.move;
}

function estimateMoveScore(state, move) {
  const test = cloneState(state);
  swap(test.board, move.from, move.to);
  const matches = findMatches(test);
  for (const key of matches.cells) {
    const [row, col] = key.split(",").map(Number);
    test.board[row][col] = null;
  }
  const collected = settleBoardBeforeFill(test, null);
  const payout = collected.reduce((sum, item) => sum + item.payout, 0);
  return payout + matches.cells.size;
}

function cloneState(state) {
  return {
    board: state.board.map((row) => row.map((tile) => tile ? { ...tile } : null)),
    multipliers: state.multipliers.map((multiplier) => ({ ...multiplier })),
    bet: state.bet,
    balance: state.balance,
    playerMoves: state.playerMoves,
    playerWin: state.playerWin,
    specialMeter: state.specialMeter,
    pendingSpecialAwards: [...state.pendingSpecialAwards],
    slotValues: [...state.slotValues],
    slotSymbolValues: [...state.slotSymbolValues],
    slotTurns: [...state.slotTurns],
    filledSlots: new Set(state.filledSlots),
  };
}

function swap(board, a, b) {
  const tmp = board[a.row][a.col];
  board[a.row][a.col] = board[b.row][b.col];
  board[b.row][b.col] = tmp;
}

function playMove(state, move) {
  stats.totalMoves += 1;
  stats.totalBet += state.bet;
  state.balance -= state.bet;
  state.playerMoves += 1;
  const winBefore = stats.totalWin;
  state.specialMeter = 0;
  state.pendingSpecialAwards = [];
  swap(state.board, move.from, move.to);
  resolveMatchesAndEvents(state);
  const win = stats.totalWin - winBefore;
  state.balance += win;
  state.playerWin += win;
}

function resolveMatchesAndEvents(state) {
  let guard = 0;
  let matches = findMatches(state);
  while ((matches.cells.size > 0 || state.pendingSpecialAwards.length > 0) && guard < 80) {
    while (matches.cells.size > 0 && guard < 80) {
      guard += 1;
      let clearedCandyCount = 0;
      for (const key of matches.cells) {
        const [row, col] = key.split(",").map(Number);
        if (state.board[row][col]?.kind === "candy" && !multiplierAt(state, row, col)) {
          clearedCandyCount += 1;
          state.board[row][col] = null;
        }
      }
      addSpecialMeter(state, clearedCandyCount);
      settleBoardBeforeFill(state, stats);
      fillEmptyCells(state);
      matches = findMatches(state);
    }

    while (state.pendingSpecialAwards.length > 0 && guard < 80) {
      guard += 1;
      const stage = state.pendingSpecialAwards.shift();
      stats.stages[stage].count += 1;
      const event = randomBoardEvent(stage);
      applyEvent(state, event, stage);
      settleBoardBeforeFill(state, stats);
      fillEmptyCells(state);
      matches = findMatches(state);
      if (matches.cells.size > 0) break;
    }
  }
  maybeFullDropBonus(state);
}

function addSpecialMeter(state, count) {
  if (count <= 0) return;
  const before = state.specialMeter;
  state.specialMeter = Math.min(SPECIAL_METER_MAX, state.specialMeter + count);
  SPECIAL_METER_THRESHOLDS.forEach((threshold, index) => {
    if (before < threshold && state.specialMeter >= threshold) state.pendingSpecialAwards.push(index + 1);
  });
}

function randomBoardEvent(stage) {
  const item = weightedPick(stage === 3 ? STAGE_THREE_EVENT_WEIGHTS : COLLECTION_SLOT_ITEM_WEIGHTS);
  if (item.kind === "candyClear") return { kind: item.kind, type: item.type };
  if (item.kind === "multiplier") return { kind: item.kind, value: item.value, size: item.size };
  return { kind: item.kind };
}

function applyEvent(state, event, stage) {
  if (event.kind === "multiplier") {
    const point = pickMultiplierSpawnCell(state, state.multipliers, event.size || (event.value >= 30 ? 2 : 1));
    if (!point) return;
    const multiplier = createMultiplier(state, event.value, point.row, point.col, event.size || (event.value >= 30 ? 2 : 1));
    state.multipliers.push(multiplier);
    clearMultiplierFootprint(state.board, multiplier);
    return;
  }
  if (event.kind === "candyClear") {
    const cells = new Set();
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        if (!multiplierAt(state, row, col) && state.board[row][col]?.kind === "candy" && state.board[row][col].type === event.type) {
          cells.add(`${row},${col}`);
        }
      }
    }
    clearCellsAndMeter(state, cells);
    return;
  }
  if (event.kind === "flame") {
    const cells = flamePatternCells(randomFlamePattern());
    const touched = state.multipliers.filter((multiplier) => multiplierCells(multiplier).some((cell) => cells.has(`${cell.row},${cell.col}`)));
    const destroyed = new Set();
    const covered = new Set();
    for (const multiplier of touched) {
      for (const cell of multiplierCells(multiplier)) covered.add(`${cell.row},${cell.col}`);
      if (random() < flameBurnChance(multiplier, stage)) destroyed.add(multiplier.id);
    }
    state.multipliers = state.multipliers.filter((multiplier) => !destroyed.has(multiplier.id));
    const clearable = new Set();
    for (const key of cells) {
      const [row, col] = key.split(",").map(Number);
      if (covered.has(key)) continue;
      if (!multiplierAt(state, row, col) && state.board[row][col]?.kind === "candy") clearable.add(key);
    }
    clearCellsAndMeter(state, clearable);
  }
}

function clearCellsAndMeter(state, cells) {
  let cleared = 0;
  for (const key of cells) {
    const [row, col] = key.split(",").map(Number);
    if (state.board[row][col]?.kind === "candy" && !multiplierAt(state, row, col)) {
      cleared += 1;
      state.board[row][col] = null;
    }
  }
  addSpecialMeter(state, cleared);
}

function flameBurnChance(multiplier, stage) {
  let chance = 0.55;
  if (multiplier.value >= 100) chance = 0.18;
  else if (multiplier.value >= 50) chance = 0.28;
  else if (multiplier.value >= 20) chance = 0.4;
  return stage === 3 ? Math.min(1, chance * 2) : chance;
}

function randomFlamePattern() {
  const picked = weightedPick(FLAME_PATTERN_WEIGHTS);
  if (picked.kind === "col1") return { kind: picked.kind, col: Math.floor(random() * COLS) };
  if (picked.kind === "row1") return { kind: picked.kind, row: Math.floor(random() * ROWS) };
  if (picked.kind === "cross1") return { kind: picked.kind, row: Math.floor(random() * ROWS), col: Math.floor(random() * COLS) };
  if (picked.kind === "col2") return { kind: picked.kind, col: Math.floor(random() * (COLS - 1)) };
  if (picked.kind === "row2") return { kind: picked.kind, row: Math.floor(random() * (ROWS - 1)) };
  return { kind: picked.kind, row: Math.floor(random() * (ROWS - 1)), col: Math.floor(random() * (COLS - 1)) };
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
  } else {
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

function settleBoardBeforeFill(state, runStats) {
  const collected = [];
  let changed = true;
  let guard = 0;
  while (changed && guard < ROWS * 4) {
    const before = boardSignature(state);
    const items = collectMultipliers(state);
    collected.push(...items);
    for (const item of items) {
      collectSlotMultiplier(state, item.col, item.value, item.payout);
      if (runStats) {
        addWin(item.payout);
        runStats.multiplier[item.value].count += 1;
        runStats.multiplier[item.value].win += item.payout;
      }
    }
    if (items.length === 0) collapseColumns(state);
    changed = items.length > 0 || before !== boardSignature(state);
    guard += 1;
  }
  return collected;
}

function collectMultipliers(state) {
  const collected = [];
  let changed = true;
  let guard = 0;
  clearMultiplierFootprints(state);
  while (changed && guard < ROWS * 2) {
    changed = false;
    guard += 1;
    const active = [...state.multipliers].sort((a, b) => b.row - a.row);
    for (const multiplier of active) {
      if (!state.multipliers.some((item) => item.id === multiplier.id)) continue;
      const distance = multiplierDropDistance(state, multiplier);
      if (distance > 0) {
        multiplier.row += distance;
        changed = true;
      }
      if (multiplier.row >= ROWS - multiplier.size) {
        collected.push({ col: Math.max(0, Math.min(SLOT_COUNT - 1, Math.floor(multiplier.col / 2))), value: multiplier.value, payout: multiplier.payout });
        state.multipliers = state.multipliers.filter((item) => item.id !== multiplier.id);
        changed = true;
      }
    }
    collapseColumns(state);
  }
  clearMultiplierFootprints(state);
  return collected;
}

function multiplierDropDistance(state, multiplier) {
  if (multiplier.row >= ROWS - multiplier.size) return 0;
  let distance = 0;
  for (let nextRow = multiplier.row + 1; nextRow <= ROWS - multiplier.size; nextRow += 1) {
    if (!canMultiplierOccupyAt(state, nextRow, multiplier.col, state.multipliers, multiplier, multiplier.size)) break;
    distance += 1;
  }
  return distance;
}

function collapseColumns(state) {
  clearMultiplierFootprints(state);
  for (let col = 0; col < COLS; col += 1) {
    const blockers = state.multipliers
      .filter((multiplier) => multiplier.size > 1 && multiplier.col <= col && col < multiplier.col + multiplier.size)
      .map((multiplier) => ({ top: multiplier.row, bottom: multiplier.row + multiplier.size - 1 }))
      .sort((a, b) => b.bottom - a.bottom);
    let segmentEnd = ROWS - 1;
    for (const blocker of blockers) {
      collapseColumnSegment(state, col, blocker.bottom + 1, segmentEnd);
      segmentEnd = blocker.top - 1;
    }
    collapseColumnSegment(state, col, 0, segmentEnd);
  }
  clearMultiplierFootprints(state);
}

function collapseColumnSegment(state, col, startRow, endRow) {
  if (startRow > endRow) return;
  let write = endRow;
  for (let scan = endRow; scan >= startRow; scan -= 1) {
    const singleMultiplier = state.multipliers.find((multiplier) => multiplier.size === 1 && multiplier.row === scan && multiplier.col === col);
    const tile = singleMultiplier ? null : state.board[scan][col];
    if (!singleMultiplier && !tile) continue;
    if (singleMultiplier) {
      singleMultiplier.row = write;
    } else {
      state.board[write][col] = tile;
      if (write !== scan) state.board[scan][col] = null;
    }
    write -= 1;
  }
  for (let row = write; row >= startRow; row -= 1) state.board[row][col] = null;
}

function fillEmptyCells(state) {
  clearMultiplierFootprints(state);
  for (let col = 0; col < COLS; col += 1) {
    for (let row = 0; row < ROWS; row += 1) {
      if (multiplierAt(state, row, col)) {
        state.board[row][col] = null;
      } else if (!state.board[row][col]) {
        state.board[row][col] = randomCandy();
      }
    }
  }
  clearMultiplierFootprints(state);
}

function boardSignature(state) {
  return `${state.board.map((row) => row.map((tile) => tile?.type || ".").join("")).join("|")}::${state.multipliers.map((m) => `${m.id}:${m.row}:${m.col}`).join("|")}`;
}

function collectSlotMultiplier(state, col, value, payout) {
  state.slotValues[col] = (state.slotValues[col] || 0) + payout;
  state.slotSymbolValues[col] = value;
  state.slotTurns[col] = SLOT_TURN_MAX;
  state.filledSlots.add(col);
}

function tickCollectedSlotTurns(state) {
  for (let col = 0; col < SLOT_COUNT; col += 1) {
    if (!state.filledSlots.has(col)) continue;
    state.slotTurns[col] = Math.max(0, (state.slotTurns[col] || SLOT_TURN_MAX) - 1);
    if (state.slotTurns[col] === 0) {
      state.filledSlots.delete(col);
      state.slotValues[col] = null;
      state.slotSymbolValues[col] = null;
    }
  }
}

function maybeFullDropBonus(state) {
  if (state.filledSlots.size < SLOT_COUNT) return;
  const base = state.slotValues.reduce((sum, value) => sum + Math.round(value || 0), 0);
  if (base <= 0) return;
  const prize = weightedPick(FULL_DROP_WHEEL_PRIZES);
  const award = Math.round(base * prize.multiplier);
  addWin(award);
  stats.wheelTriggers += 1;
  stats.wheel[prize.label].count += 1;
  stats.wheel[prize.label].base += base;
  stats.wheel[prize.label].win += award;
  state.filledSlots = new Set();
  state.slotValues = Array(SLOT_COUNT).fill(null);
  state.slotSymbolValues = Array(SLOT_COUNT).fill(null);
  state.slotTurns = Array(SLOT_COUNT).fill(0);
  rebuildBoard(state);
}

function addWin(amount) {
  stats.totalWin += amount;
}

function fmt(value, digits = 0) {
  return value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function pct(value) {
  return `${fmt(value * 100, 2)}%`;
}

function buildReport(runStats) {
  const lines = [];
  lines.push("# Sweet Drop Riches RTP Summary");
  lines.push("");
  lines.push(`總步數：${fmt(runStats.steps)}`);
  lines.push(`實際完成步數：${fmt(runStats.totalMoves)}`);
  lines.push(`總玩家人數：${fmt(runStats.totalPlayers)}`);
  lines.push(`初始資產：${fmt(runStats.startBalance)}`);
  lines.push(`押注：${fmt(runStats.bet)}`);
  lines.push(`退幣門檻：資產大於 ${fmt(runStats.cashoutBalance)}`);
  lines.push(`總押注：${fmt(runStats.totalBet)}`);
  lines.push(`總贏分：${fmt(runStats.totalWin)}`);
  lines.push(`RTP：${pct(runStats.totalWin / runStats.totalBet)}`);
  lines.push(`退幣率：${pct(runStats.cashoutPlayers / runStats.totalPlayers)}`);
  lines.push(`資產大於 ${fmt(runStats.cashoutBalance)} 離場人數：${fmt(runStats.cashoutPlayers)}`);
  lines.push(`資產不足 ${fmt(runStats.bet)} 離場人數：${fmt(runStats.bustPlayers)}`);
  lines.push(`未結束玩家人數：${fmt(runStats.unfinishedPlayers)}`);
  lines.push("");
  lines.push("## 倍數糖RTP統計");
  for (const value of [5, 10, 20, 30, 50, 100, 200]) {
    const item = runStats.multiplier[value];
    lines.push(`- ${value}x：次數 ${fmt(item.count)} / 贏分 ${fmt(item.win)} / RTP ${pct(item.win / runStats.totalBet)}`);
  }
  lines.push("");
  lines.push("## 收集槽觸發統計");
  for (const stage of [1, 2, 3]) {
    const count = runStats.stages[stage].count;
    const avg = count ? runStats.totalMoves / count : 0;
    lines.push(`- 第${stage}槽平均幾轉出現：${count ? fmt(avg, 2) : "未觸發"}（次數 ${fmt(count)}）`);
  }
  lines.push("");
  lines.push("## 轉輪觸發統計");
  lines.push(`觸發次數：${fmt(runStats.wheelTriggers)}`);
  lines.push(`平均每 100 步觸發：${fmt((runStats.wheelTriggers / runStats.totalMoves) * 100, 2)}`);
  for (const prize of FULL_DROP_WHEEL_PRIZES) {
    const item = runStats.wheel[prize.label];
    const avgMultiplier = item.base ? item.win / item.base : 0;
    lines.push(`- ${prize.label}：次數 ${fmt(item.count)} / 平均倍數 ${fmt(avgMultiplier, 3)}x / 佔總RTP ${pct(item.win / runStats.totalBet)}`);
  }
  if (config.seed) {
    lines.push("");
    lines.push(`Seed：${config.seed}`);
  }
  lines.push("");
  lines.push(`報告檔：${path.resolve(config.out)}`);
  return lines.join("\n");
}

function writeReport(outPath, report) {
  const target = path.resolve(outPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${report}\n`, "utf8");
}
