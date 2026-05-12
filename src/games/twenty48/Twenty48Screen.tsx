import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { zh } from '@/src/i18n/zh';
import { SwipeSurface } from '../components/SwipeSurface';
import {
  GRID_SIZE,
  addRandomTile,
  applyMove,
  canMove,
  emptyGrid,
  type Grid,
} from './logic';

function startGrid(): Grid {
  let g = emptyGrid();
  g = addRandomTile(g);
  g = addRandomTile(g);
  return g;
}

export function Twenty48Screen() {
  const [grid, setGrid] = useState<Grid>(startGrid);
  const [gameOver, setGameOver] = useState(false);

  const cellSize = useMemo(() => 68, []);

  useEffect(() => {
    if (!canMove(grid)) {
      setGameOver(true);
    }
  }, [grid]);

  const onMove = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    setGrid((prev) => {
      const { grid: next, moved } = applyMove(prev, dir);
      if (!moved) return prev;
      return addRandomTile(next);
    });
  }, []);

  const restart = useCallback(() => {
    setGameOver(false);
    setGrid(startGrid());
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>2048</Text>
      <Text style={styles.hint}>合并相同数字，凑出 2048。</Text>
      <Text style={styles.hintSwipe}>{zh.gameHints.twenty48}</Text>
      {gameOver ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>游戏结束，无法再移动。</Text>
          <Pressable style={styles.restartBtn} onPress={restart}>
            <Text style={styles.restartLabel}>再来一局</Text>
          </Pressable>
        </View>
      ) : null}
      <SwipeSurface
        enabled={!gameOver}
        onSwipe={onMove}
        style={[styles.board, { width: cellSize * GRID_SIZE + 8, height: cellSize * GRID_SIZE + 8 }]}>
        {grid.map((row, r) =>
          row.map((val, c) => (
            <View
              key={`${r}-${c}`}
              style={[
                styles.cell,
                {
                  width: cellSize - 6,
                  height: cellSize - 6,
                  margin: 3,
                  backgroundColor: val === 0 ? '#cdc1b4' : tileColor(val),
                },
              ]}>
              {val > 0 ? (
                <Text
                  style={[
                    styles.cellText,
                    val >= 8 && styles.cellTextLight,
                    val >= 128 && styles.cellTextSm,
                  ]}>
                  {val}
                </Text>
              ) : null}
            </View>
          )),
        )}
      </SwipeSurface>
      <Pressable style={styles.secondaryBtn} onPress={restart}>
        <Text style={styles.secondaryLabel}>重新开始</Text>
      </Pressable>
    </View>
  );
}

function tileColor(n: number): string {
  const map: Record<number, string> = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
  };
  return map[n] ?? '#3c3a32';
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  hint: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  hintSwipe: {
    fontSize: 13,
    opacity: 0.75,
    textAlign: 'center',
  },
  banner: {
    alignItems: 'center',
    gap: 8,
  },
  bannerText: {
    fontSize: 15,
    fontWeight: '600',
  },
  restartBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2f95dc',
  },
  restartLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#bbada0',
    borderRadius: 8,
    padding: 2,
    alignContent: 'center',
    justifyContent: 'center',
  },
  cell: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#776e65',
  },
  cellTextLight: {
    color: '#f9f6f2',
  },
  cellTextSm: {
    fontSize: 18,
  },
  secondaryBtn: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryLabel: {
    fontSize: 15,
    color: '#2f95dc',
    fontWeight: '600',
  },
});
