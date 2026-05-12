import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { zh } from '@/src/i18n/zh';
import {
  COLS,
  MINE_COUNT,
  ROWS,
  type BoardModel,
  checkWin,
  countFlags,
  createBoard,
  emptyBoolGrid,
  reveal,
  toggleFlag,
} from './logic';

const digitColors = [
  '',
  '#2563eb',
  '#16a34a',
  '#dc2626',
  '#7c3aed',
  '#b45309',
  '#0891b2',
  '#0f172a',
  '#64748b',
];

export function MinesweeperScreen() {
  const modelRef = useRef<BoardModel | null>(null);
  const [model, setModel] = useState<BoardModel | null>(null);
  const [revealed, setRevealed] = useState<boolean[][]>(() => emptyBoolGrid());
  const [flagged, setFlagged] = useState<boolean[][]>(() => emptyBoolGrid());
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const reset = useCallback(() => {
    modelRef.current = null;
    setModel(null);
    setRevealed(emptyBoolGrid());
    setFlagged(emptyBoolGrid());
    setStatus('playing');
  }, []);

  const onReveal = useCallback(
    (r: number, c: number) => {
      if (status !== 'playing') return;
      let board = modelRef.current;
      if (!board) {
        board = createBoard(r, c);
        modelRef.current = board;
        setModel(board);
      }
      const { revealed: nextRev, hitMine } = reveal(board, revealed, flagged, r, c);
      setRevealed(nextRev);
      if (hitMine) {
        setStatus('lost');
        return;
      }
      if (checkWin(board, nextRev)) {
        setStatus('won');
      }
    },
    [revealed, flagged, status],
  );

  const onLongPress = useCallback(
    (r: number, c: number) => {
      if (status !== 'playing' || !modelRef.current) return;
      if (revealed[r][c]) return;
      setFlagged((f) => toggleFlag(f, r, c, revealed));
    },
    [revealed, status],
  );

  const flagsLeft = useMemo(() => MINE_COUNT - countFlags(flagged), [flagged]);

  const cellW = useMemo(() => Math.min(36, Math.floor(320 / COLS)), []);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>扫雷</Text>
      <Text style={styles.meta}>剩余标记：{flagsLeft}</Text>
      {status === 'won' ? <Text style={styles.bannerWin}>你赢了！</Text> : null}
      {status === 'lost' ? <Text style={styles.bannerLose}>踩到雷了！</Text> : null}
      <View style={[styles.grid, { width: cellW * COLS + 4 }]}>
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const isRev = revealed[r][c];
            const isFlag = flagged[r][c];
            const mine = model?.mines[r][c] ?? false;
            const adj = model?.adjacent[r][c] ?? 0;
            const showMine = status === 'lost' && mine;
            const label =
              isRev && !mine && adj > 0 ? String(adj) : isFlag ? '旗' : showMine ? '雷' : '';

            return (
              <Pressable
                key={`${r}-${c}`}
                delayLongPress={380}
                onPress={() => onReveal(r, c)}
                onLongPress={() => onLongPress(r, c)}
                style={({ pressed }) => [
                  styles.cell,
                  {
                    width: cellW,
                    height: cellW,
                    backgroundColor: isRev ? '#e5e7eb' : pressed ? '#d1d5db' : '#cbd5e1',
                  },
                  showMine && styles.cellMine,
                ]}>
                <Text
                  style={[
                    styles.cellText,
                    isRev && adj > 0 ? { color: digitColors[adj] ?? '#111' } : null,
                    isFlag && styles.flagText,
                    showMine && styles.mineText,
                  ]}>
                  {label}
                </Text>
              </Pressable>
            );
          }),
        )}
      </View>
      <Text style={styles.tapHint}>{zh.gameHints.minesweeper}</Text>
      <Pressable style={styles.restart} onPress={reset}>
        <Text style={styles.restartText}>重新开始</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  meta: {
    fontSize: 13,
    opacity: 0.85,
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 13,
    opacity: 0.9,
    textAlign: 'center',
  },
  bannerWin: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
  },
  bannerLose: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#94a3b8',
  },
  cell: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellMine: {
    backgroundColor: '#fecaca',
  },
  cellText: {
    fontSize: 14,
    fontWeight: '700',
  },
  flagText: {
    color: '#b45309',
  },
  mineText: {
    color: '#991b1b',
  },
  restart: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#2f95dc',
  },
  restartText: {
    color: '#fff',
    fontWeight: '600',
  },
});
