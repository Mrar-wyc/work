export const STAGE_W = 300;
export const STAGE_H = 280;
export const PADDLE_W = 56;
export const PADDLE_H = 12;
export const BALL_R = 6;
export const BRICK_W = 44;
export const BRICK_H = 16;
export const BRICK_ROWS = 4;
export const BRICK_COLS = 6;
export const TICK_MS = 16;

export type Brick = { id: number; x: number; y: number; alive: boolean };

export function createBricks(): Brick[] {
  const list: Brick[] = [];
  let id = 0;
  const gap = 4;
  const totalW = BRICK_COLS * BRICK_W + (BRICK_COLS - 1) * gap;
  const startX = (STAGE_W - totalW) / 2;
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      list.push({
        id: id++,
        x: startX + c * (BRICK_W + gap),
        y: 36 + r * (BRICK_H + gap),
        alive: true,
      });
    }
  }
  return list;
}
