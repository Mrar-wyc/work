import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { zh } from '@/src/i18n/zh';
import { SwipeSurface } from '../components/SwipeSurface';
import {
  COLS,
  ROWS,
  type Cell,
  type Dir,
  initialSnake,
  isOpposite,
  keyOf,
  nextHead,
  randomFood,
} from './logic';

const TICK_MS = 180;

export function SnakeScreen() {
  const initialS = initialSnake();
  const [snake, setSnake] = useState<Cell[]>(initialS);
  const [food, setFood] = useState<Cell>(() => {
    const occ = new Set(initialSnake().map(keyOf));
    return randomFood(occ);
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const dirRef = useRef<Dir>('right');
  const pendingDirRef = useRef<Dir>('right');
  const foodRef = useRef(food);
  foodRef.current = food;

  const restart = useCallback(() => {
    const s = initialSnake();
    const occ = new Set(s.map(keyOf));
    const f = randomFood(occ);
    foodRef.current = f;
    setSnake(s);
    setFood(f);
    setScore(0);
    setGameOver(false);
    dirRef.current = 'right';
    pendingDirRef.current = 'right';
  }, []);

  const setDirection = useCallback(
    (d: Dir) => {
      if (gameOver) return;
      if (isOpposite(d, dirRef.current)) return;
      pendingDirRef.current = d;
    },
    [gameOver],
  );

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      const dir = pendingDirRef.current;
      dirRef.current = dir;
      setSnake((prev) => {
        const head = prev[0];
        const nh = nextHead(head, dir);
        if (nh.r < 0 || nh.c < 0 || nh.r >= ROWS || nh.c >= COLS) {
          setGameOver(true);
          return prev;
        }
        const body = prev.slice(0, -1);
        if (body.some((seg) => seg.r === nh.r && seg.c === nh.c)) {
          setGameOver(true);
          return prev;
        }
        const currentFood = foodRef.current;
        const ate = nh.r === currentFood.r && nh.c === currentFood.c;
        const next = [nh, ...prev];
        if (!ate) {
          next.pop();
        } else {
          setScore((s) => s + 1);
          const occ = new Set(next.map(keyOf));
          const nf = randomFood(occ);
          foodRef.current = nf;
          setFood(nf);
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [gameOver]);

  const cell = Math.min(26, Math.floor(300 / COLS));

  return (
    <View style={styles.root}>
      <Text style={styles.title}>贪吃蛇</Text>
      <Text style={styles.score}>得分：{score}</Text>
      <Text style={styles.swipeHint}>{zh.gameHints.snake}</Text>
      {gameOver ? (
        <View style={styles.overBox}>
          <Text style={styles.overText}>游戏结束</Text>
          <Pressable style={styles.restartBtn} onPress={restart}>
            <Text style={styles.restartLabel}>再来一局</Text>
          </Pressable>
        </View>
      ) : null}
      <SwipeSurface
        enabled={!gameOver}
        onSwipe={setDirection}
        style={[styles.board, { width: cell * COLS + 4, height: cell * ROWS + 4 }]}>
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const isHead = snake[0]?.r === r && snake[0]?.c === c;
            const isBody = snake.slice(1).some((s) => s.r === r && s.c === c);
            const isFood = food.r === r && food.c === c;
            let bg = '#e5e7eb';
            if (isFood) bg = '#f97316';
            else if (isHead) bg = '#22c55e';
            else if (isBody) bg = '#86efac';
            return (
              <View
                key={`${r}-${c}`}
                style={[
                  styles.tile,
                  {
                    width: cell - 2,
                    height: cell - 2,
                    margin: 1,
                    backgroundColor: bg,
                  },
                ]}
              />
            );
          }),
        )}
      </SwipeSurface>
      <Pressable style={styles.secondary} onPress={restart}>
        <Text style={styles.secondaryText}>重新开始</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
  },
  swipeHint: {
    fontSize: 13,
    opacity: 0.85,
    textAlign: 'center',
  },
  overBox: {
    alignItems: 'center',
    gap: 8,
  },
  overText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#b91c1c',
  },
  restartBtn: {
    paddingHorizontal: 18,
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
    backgroundColor: '#cbd5e1',
    borderRadius: 6,
    padding: 1,
    alignContent: 'flex-start',
  },
  tile: {
    borderRadius: 3,
  },
  secondary: {
    marginTop: 6,
    padding: 8,
  },
  secondaryText: {
    color: '#2f95dc',
    fontWeight: '600',
  },
});
