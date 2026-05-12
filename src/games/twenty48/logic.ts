export const GRID_SIZE = 4;

export type Grid = number[][];

export function emptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function mergeLine(line: number[]): number[] {
  const filtered = line.filter((x) => x !== 0);
  const out: number[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      out.push(filtered[i] * 2);
      i += 2;
    } else {
      out.push(filtered[i]);
      i += 1;
    }
  }
  while (out.length < GRID_SIZE) out.push(0);
  return out.slice(0, GRID_SIZE);
}

export function gridsEqual(a: Grid, b: Grid): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

export function moveLeft(grid: Grid): Grid {
  return grid.map((row) => mergeLine(row));
}

export function moveRight(grid: Grid): Grid {
  return grid.map((row) => mergeLine([...row].reverse()).reverse());
}

export function moveUp(grid: Grid): Grid {
  const next = emptyGrid();
  for (let c = 0; c < GRID_SIZE; c++) {
    const col: number[] = [];
    for (let r = 0; r < GRID_SIZE; r++) col.push(grid[r][c]);
    const merged = mergeLine(col);
    for (let r = 0; r < GRID_SIZE; r++) next[r][c] = merged[r];
  }
  return next;
}

export function moveDown(grid: Grid): Grid {
  const next = emptyGrid();
  for (let c = 0; c < GRID_SIZE; c++) {
    const col: number[] = [];
    for (let r = GRID_SIZE - 1; r >= 0; r--) col.push(grid[r][c]);
    const merged = mergeLine(col);
    for (let r = 0; r < GRID_SIZE; r++) next[GRID_SIZE - 1 - r][c] = merged[r];
  }
  return next;
}

export function addRandomTile(grid: Grid): Grid {
  const empties: { r: number; c: number }[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empties.push({ r, c });
    }
  }
  if (empties.length === 0) return grid;
  const pick = empties[Math.floor(Math.random() * empties.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const next = grid.map((row) => [...row]);
  next[pick.r][pick.c] = value;
  return next;
}

export function canMove(grid: Grid): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < GRID_SIZE && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < GRID_SIZE && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

export function applyMove(
  grid: Grid,
  dir: 'left' | 'right' | 'up' | 'down',
): { grid: Grid; moved: boolean } {
  let next: Grid;
  switch (dir) {
    case 'left':
      next = moveLeft(grid);
      break;
    case 'right':
      next = moveRight(grid);
      break;
    case 'up':
      next = moveUp(grid);
      break;
    case 'down':
      next = moveDown(grid);
      break;
  }
  return { grid: next, moved: !gridsEqual(grid, next) };
}
