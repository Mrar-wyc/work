export const COLS = 9;
export const ROWS = 10;
export const MINE_COUNT = 10;

export type BoardModel = {
  mines: boolean[][];
  adjacent: number[][];
};

function neighbors(r: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc]);
    }
  }
  return out;
}

export function createBoard(excludeR: number, excludeC: number): BoardModel {
  const mines = Array.from({ length: ROWS }, () => Array<boolean>(COLS).fill(false));
  const candidates: [number, number][] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (r === excludeR && c === excludeC) continue;
      candidates.push([r, c]);
    }
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = candidates[i];
    candidates[i] = candidates[j];
    candidates[j] = t;
  }
  const n = Math.min(MINE_COUNT, candidates.length);
  for (let k = 0; k < n; k++) {
    const [r, c] = candidates[k];
    mines[r][c] = true;
  }
  const adjacent = Array.from({ length: ROWS }, () => Array<number>(COLS).fill(0));
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (mines[r][c]) continue;
      let count = 0;
      for (const [nr, nc] of neighbors(r, c)) {
        if (mines[nr][nc]) count++;
      }
      adjacent[r][c] = count;
    }
  }
  return { mines, adjacent };
}

export function emptyBoolGrid(): boolean[][] {
  return Array.from({ length: ROWS }, () => Array<boolean>(COLS).fill(false));
}

export function countFlags(flagged: boolean[][]): number {
  let n = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (flagged[r][c]) n++;
    }
  }
  return n;
}

export function reveal(
  model: BoardModel,
  revealed: boolean[][],
  flagged: boolean[][],
  startR: number,
  startC: number,
): { revealed: boolean[][]; hitMine: boolean } {
  if (flagged[startR][startC]) {
    return { revealed: revealed.map((row) => [...row]), hitMine: false };
  }
  if (revealed[startR][startC]) {
    return { revealed: revealed.map((row) => [...row]), hitMine: false };
  }
  const next = revealed.map((row) => [...row]);
  if (model.mines[startR][startC]) {
    next[startR][startC] = true;
    return { revealed: next, hitMine: true };
  }
  const stack: [number, number][] = [[startR, startC]];
  while (stack.length) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
    if (flagged[r][c]) continue;
    if (next[r][c]) continue;
    if (model.mines[r][c]) continue;
    next[r][c] = true;
    if (model.adjacent[r][c] === 0) {
      for (const [nr, nc] of neighbors(r, c)) {
        if (!next[nr][nc]) stack.push([nr, nc]);
      }
    }
  }
  return { revealed: next, hitMine: false };
}

export function checkWin(model: BoardModel, revealed: boolean[][]): boolean {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!model.mines[r][c] && !revealed[r][c]) return false;
    }
  }
  return true;
}

export function toggleFlag(flagged: boolean[][], r: number, c: number, revealed: boolean[][]): boolean[][] {
  if (revealed[r][c]) return flagged;
  const next = flagged.map((row) => [...row]);
  next[r][c] = !next[r][c];
  return next;
}
