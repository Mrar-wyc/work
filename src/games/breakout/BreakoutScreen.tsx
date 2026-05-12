import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  BALL_R,
  BRICK_H,
  BRICK_W,
  PADDLE_H,
  PADDLE_W,
  STAGE_H,
  STAGE_W,
  TICK_MS,
  type Brick,
  createBricks,
} from './logic';

type Ball = { x: number; y: number; vx: number; vy: number };

export function BreakoutScreen() {
  const [paddleX, setPaddleX] = useState(STAGE_W / 2);
  const paddleXRef = useRef(STAGE_W / 2);
  paddleXRef.current = paddleX;

  const [ball, setBall] = useState<Ball>(() => ({
    x: STAGE_W / 2,
    y: STAGE_H - 52,
    vx: 2.4,
    vy: -2.6,
  }));
  const [bricks, setBricks] = useState<Brick[]>(() => createBricks());
  const [lost, setLost] = useState(false);
  const [cleared, setCleared] = useState(false);

  const ballRef = useRef(ball);
  const bricksRef = useRef(bricks);
  ballRef.current = ball;
  bricksRef.current = bricks;

  const dragStart = useRef(STAGE_W / 2);

  const paddleResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          dragStart.current = paddleXRef.current;
        },
        onPanResponderMove: (_, g) => {
          const half = PADDLE_W / 2;
          const nx = Math.min(STAGE_W - half, Math.max(half, dragStart.current + g.dx));
          setPaddleX(nx);
        },
      }),
    [],
  );

  useEffect(() => {
    if (lost || cleared) return;
    const id = setInterval(() => {
      let { x, y, vx, vy } = ballRef.current;
      x += vx;
      y += vy;

      if (x < BALL_R) {
        x = BALL_R;
        vx = Math.abs(vx);
      } else if (x > STAGE_W - BALL_R) {
        x = STAGE_W - BALL_R;
        vx = -Math.abs(vx);
      }
      if (y < BALL_R) {
        y = BALL_R;
        vy = Math.abs(vy);
      }

      const paddleY = STAGE_H - 30;
      const px = paddleXRef.current;
      if (
        vy > 0 &&
        y + BALL_R >= paddleY &&
        y + BALL_R <= paddleY + PADDLE_H + 6 &&
        x >= px - PADDLE_W / 2 - BALL_R &&
        x <= px + PADDLE_W / 2 + BALL_R
      ) {
        y = paddleY - BALL_R;
        vy = -Math.abs(vy);
        const offset = (x - px) / (PADDLE_W / 2);
        vx += offset * 1.8;
        vx = Math.max(-4.2, Math.min(4.2, vx));
      }

      let brickBounce = false;
      const nextBricks = bricksRef.current.map((br) => {
        if (!br.alive || brickBounce) return br;
        const hit =
          x + BALL_R >= br.x &&
          x - BALL_R <= br.x + BRICK_W &&
          y + BALL_R >= br.y &&
          y - BALL_R <= br.y + BRICK_H;
        if (hit) {
          brickBounce = true;
          return { ...br, alive: false };
        }
        return br;
      });
      if (brickBounce) {
        vy = -vy;
      }

      bricksRef.current = nextBricks;
      setBricks(nextBricks);

      if (nextBricks.every((b) => !b.alive)) {
        setCleared(true);
      }

      const nextBall = { x, y, vx, vy };
      ballRef.current = nextBall;
      setBall(nextBall);

      if (y > STAGE_H + 16) {
        setLost(true);
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [lost, cleared]);

  const restart = useCallback(() => {
    setLost(false);
    setCleared(false);
    const px = STAGE_W / 2;
    paddleXRef.current = px;
    setPaddleX(px);
    const b = {
      x: STAGE_W / 2,
      y: STAGE_H - 52,
      vx: 2.4,
      vy: -2.6,
    };
    ballRef.current = b;
    setBall(b);
    const br = createBricks();
    bricksRef.current = br;
    setBricks(br);
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>打砖块</Text>
      <Text style={styles.hint}>拖动底部挡板接球，清空砖块即胜。</Text>
      {cleared ? (
        <View style={styles.banner}>
          <Text style={styles.win}>砖块全部清空！</Text>
          <Pressable style={styles.primaryBtn} onPress={restart}>
            <Text style={styles.primaryLabel}>再来一局</Text>
          </Pressable>
        </View>
      ) : null}
      {lost ? (
        <View style={styles.banner}>
          <Text style={styles.lose}>球落了，游戏结束</Text>
          <Pressable style={styles.primaryBtn} onPress={restart}>
            <Text style={styles.primaryLabel}>重新开始</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={[styles.stage, { width: STAGE_W, height: STAGE_H }]}>
        {bricks.map(
          (b) =>
            b.alive ? (
              <View
                key={b.id}
                style={[
                  styles.brick,
                  { left: b.x, top: b.y, width: BRICK_W, height: BRICK_H },
                ]}
              />
            ) : null,
        )}
        <View
          style={[
            styles.ball,
            {
              left: ball.x - BALL_R,
              top: ball.y - BALL_R,
              width: BALL_R * 2,
              height: BALL_R * 2,
              borderRadius: BALL_R,
            },
          ]}
        />
        <View
          {...paddleResponder.panHandlers}
          style={[styles.paddleTrack, { top: STAGE_H - 40, width: STAGE_W }]}>
          <View
            style={[
              styles.paddle,
              {
                left: paddleX - PADDLE_W / 2,
                width: PADDLE_W,
                height: PADDLE_H,
              },
            ]}
          />
        </View>
      </View>
      {!lost && !cleared ? (
        <Pressable style={styles.secondary} onPress={restart}>
          <Text style={styles.secondaryText}>重新开始</Text>
        </Pressable>
      ) : null}
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
  hint: {
    fontSize: 13,
    opacity: 0.85,
    textAlign: 'center',
  },
  banner: {
    alignItems: 'center',
    gap: 8,
  },
  win: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15803d',
  },
  lose: {
    fontSize: 16,
    fontWeight: '700',
    color: '#b91c1c',
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
  stage: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  brick: {
    position: 'absolute',
    backgroundColor: '#94a3b8',
    borderRadius: 4,
  },
  ball: {
    position: 'absolute',
    backgroundColor: '#f8fafc',
  },
  paddleTrack: {
    position: 'absolute',
    height: 44,
    justifyContent: 'flex-start',
  },
  paddle: {
    position: 'absolute',
    top: 8,
    backgroundColor: '#38bdf8',
    borderRadius: 4,
  },
  secondary: {
    paddingVertical: 8,
  },
  secondaryText: {
    color: '#2f95dc',
    fontWeight: '600',
    fontSize: 15,
  },
});
