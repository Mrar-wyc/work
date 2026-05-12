import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GRID_SIZE, shuffleDeck } from './logic';

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function MemoryScreen() {
  const [deck, setDeck] = useState(() => shuffleDeck());
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [faceUp, setFaceUp] = useState<Set<number>>(() => new Set());
  const [moves, setMoves] = useState(0);
  const firstRef = useRef<number | null>(null);
  const lockRef = useRef(false);

  const won = useMemo(() => matched.size === deck.length, [matched.size, deck.length]);

  const resetAll = useCallback(() => {
    lockRef.current = false;
    firstRef.current = null;
    setDeck(shuffleDeck());
    setMatched(new Set());
    setFaceUp(new Set());
    setMoves(0);
  }, []);

  const onCardPress = useCallback(
    (index: number) => {
      if (won || lockRef.current || matched.has(index) || faceUp.has(index)) return;

      const nextFace = new Set(faceUp);
      nextFace.add(index);
      setFaceUp(nextFace);

      if (firstRef.current === null) {
        firstRef.current = index;
        return;
      }

      const first = firstRef.current;
      firstRef.current = null;
      lockRef.current = true;
      setMoves((m) => m + 1);

      if (deck[first] === deck[index]) {
        setMatched((m) => new Set(m).add(first).add(index));
        setFaceUp(new Set());
        lockRef.current = false;
        return;
      }

      setTimeout(() => {
        setFaceUp(new Set());
        lockRef.current = false;
      }, 550);
    },
    [deck, faceUp, matched, won],
  );

  const cell = Math.min(52, Math.floor(300 / GRID_SIZE));

  return (
    <View style={styles.root}>
      <Text style={styles.title}>记忆翻牌</Text>
      <Text style={styles.meta}>
        步数：{moves}
        {won ? ' · 全部配对！' : ''}
      </Text>
      <View style={[styles.grid, { width: cell * GRID_SIZE + 8 }]}>
        {deck.map((pairId, i) => {
          const show = matched.has(i) || faceUp.has(i);
          return (
            <Pressable
              key={i}
              style={({ pressed }) => [
                styles.card,
                {
                  width: cell - 4,
                  height: cell - 4,
                  margin: 2,
                  backgroundColor: matched.has(i)
                    ? '#bbf7d0'
                    : show
                      ? '#bfdbfe'
                      : pressed
                        ? '#94a3b8'
                        : '#cbd5e1',
                },
              ]}
              onPress={() => onCardPress(i)}>
              <Text style={styles.cardText}>{show ? LABELS[pairId] : '?'}</Text>
            </Pressable>
          );
        })}
      </View>
      {won ? (
        <View style={styles.banner}>
          <Text style={styles.winText}>恭喜过关！</Text>
          <Pressable style={styles.primaryBtn} onPress={resetAll}>
            <Text style={styles.primaryLabel}>再来一局</Text>
          </Pressable>
        </View>
      ) : null}
      <Pressable style={styles.secondary} onPress={resetAll}>
        <Text style={styles.secondaryText}>重新开始</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  meta: {
    fontSize: 15,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
  },
  banner: {
    alignItems: 'center',
    gap: 8,
  },
  winText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#15803d',
  },
  primaryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2f95dc',
  },
  primaryLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  secondary: {
    padding: 10,
  },
  secondaryText: {
    color: '#2f95dc',
    fontWeight: '600',
    fontSize: 15,
  },
});
