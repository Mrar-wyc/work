export type Mark = 'X' | 'O' | null;
export type Board = Mark[];

const LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board: Board): Mark | 'draw' | null {
  for (const [a, b, c] of LINES) {
    const m = board[a];
    if (m && m === board[b] && m === board[c]) return m;
  }
  if (board.every((cell) => cell !== null)) return 'draw';
  return null;
}

function canWinInOne(board: Board, mark: Mark): number | null {
  for (const [a, b, c] of LINES) {
    const cells = [board[a], board[b], board[c]];
    const marks = cells.filter((v) => v === mark).length;
    const empties = [a, b, c].filter((i) => board[i] === null);
    if (marks === 2 && empties.length === 1) return empties[0];
  }
  return null;
}

export function pickAiMove(board: Board): number {
  const win = canWinInOne(board, 'O');
  if (win !== null) return win;
  const block = canWinInOne(board, 'X');
  if (block !== null) return block;
  const empties = board.map((v, i) => (v === null ? i : -1)).filter((i) => i >= 0);
  return empties[Math.floor(Math.random() * empties.length)];
}
