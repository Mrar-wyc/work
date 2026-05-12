import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type Board, type Mark, checkWinner, pickAiMove } from './logic';

const emptyBoard = (): Board => Array<Mark>(9).fill(null);

export function TicTacToeScreen() {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [result, setResult] = useState<Mark | 'draw' | null>(null);

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setResult(null);
  }, []);

  const onCell = useCallback(
    (index: number) => {
      if (result || board[index]) return;
      const next = [...board] as Board;
      next[index] = 'X';
      const afterPlayer = checkWinner(next);
      if (afterPlayer) {
        setBoard(next);
        setResult(afterPlayer);
        return;
      }
      const ai = pickAiMove(next);
      next[ai] = 'O';
      const finalResult = checkWinner(next);
      setBoard(next);
      setResult(finalResult);
    },
    [board, result],
  );

  const statusText =
    result === 'X'
      ? '你赢了！'
      : result === 'O'
        ? '电脑获胜'
        : result === 'draw'
          ? '平局'
          : '你是 X，电脑是 O。轮到你下。';

  return (
    <View style={styles.root}>
      <Text style={styles.title}>井字棋</Text>
      <Text style={styles.status}>{statusText}</Text>
      <View style={styles.grid}>
        {board.map((mark, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]}
            onPress={() => onCell(i)}>
            <Text style={styles.mark}>{mark === 'X' ? 'X' : mark === 'O' ? 'O' : ''}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.reset} onPress={reset}>
        <Text style={styles.resetText}>重新开始</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  status: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  grid: {
    width: 240,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#334155',
  },
  cell: {
    width: 78,
    height: 78,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  cellPressed: {
    opacity: 0.85,
  },
  mark: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0f172a',
  },
  reset: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2f95dc',
  },
  resetText: {
    color: '#fff',
    fontWeight: '600',
  },
});
