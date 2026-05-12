/** 4×4 grid, 8 pairs (values 0–7). */
export const GRID_SIZE = 4;

export function shuffleDeck(): number[] {
  const pairs = Array.from({ length: 8 }, (_, i) => i);
  const deck = [...pairs, ...pairs];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
