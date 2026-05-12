export const MIN_WAIT_MS = 900;
export const MAX_WAIT_MS = 3200;

export function randomDelayMs(): number {
  return MIN_WAIT_MS + Math.floor(Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS));
}
