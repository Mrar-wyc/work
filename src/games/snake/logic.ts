export const COLS = 12;
export const ROWS = 15;

export type Dir = 'up' | 'down' | 'left' | 'right';

export type Cell = { r: number; c: number };

const opposite: Record<Dir, Dir> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function isOpposite(a: Dir, b: Dir): boolean {
  return opposite[a] === b;
}

export function nextHead(head: Cell, dir: Dir): Cell {
  switch (dir) {
    case 'up':
      return { r: head.r - 1, c: head.c };
    case 'down':
      return { r: head.r + 1, c: head.c };
    case 'left':
      return { r: head.r, c: head.c - 1 };
    case 'right':
      return { r: head.r, c: head.c + 1 };
  }
}

export function keyOf(cell: Cell): string {
  return `${cell.r},${cell.c}`;
}

export function randomFood(occupied: Set<string>): Cell {
  let r = 0;
  let c = 0;
  do {
    r = Math.floor(Math.random() * ROWS);
    c = Math.floor(Math.random() * COLS);
  } while (occupied.has(keyOf({ r, c })));
  return { r, c };
}

export function initialSnake(): Cell[] {
  const midR = Math.floor(ROWS / 2);
  const midC = Math.floor(COLS / 2);
  return [
    { r: midR, c: midC },
    { r: midR, c: midC - 1 },
    { r: midR, c: midC - 2 },
  ];
}
