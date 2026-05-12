import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { randomDelayMs } from './logic';

type Phase = 'idle' | 'waiting' | 'ready' | 'too_early' | 'done';

export function ExampleGameScreen() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const readyAtRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const startRound = useCallback(() => {
    clearTimer();
    setReactionMs(null);
    setPhase('waiting');
    const delay = randomDelayMs();
    timeoutRef.current = setTimeout(() => {
      readyAtRef.current = Date.now();
      setPhase('ready');
      timeoutRef.current = null;
    }, delay);
  }, [clearTimer]);

  const onMainPress = useCallback(() => {
    if (phase === 'idle' || phase === 'done' || phase === 'too_early') {
      startRound();
      return;
    }
    if (phase === 'waiting') {
      clearTimer();
      setPhase('too_early');
      return;
    }
    if (phase === 'ready') {
      const ms = Date.now() - readyAtRef.current;
      setReactionMs(ms);
      setPhase('done');
    }
  }, [phase, startRound, clearTimer]);

  const hint =
    phase === 'idle'
      ? '点击开始。随机停顿后，一看到绿色目标就尽快再点一次。'
      : phase === 'waiting'
        ? '等待绿色目标出现…'
        : phase === 'ready'
          ? '快点击！'
          : phase === 'too_early'
            ? '点早了。点击再试一次。'
            : phase === 'done'
              ? reactionMs !== null
                ? `你的反应时间：${reactionMs} 毫秒。点击再玩一局。`
                : '点击再玩一局。'
              : '';

  return (
    <Pressable style={styles.pressable} onPress={onMainPress}>
      <View style={styles.inner}>
        <Text style={styles.hint}>{hint}</Text>
        {phase === 'ready' ? (
          <View style={styles.target}>
            <Text style={styles.targetLabel}>点</Text>
          </View>
        ) : (
          <View style={styles.targetPlaceholder} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  hint: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  target: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  targetLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  targetPlaceholder: {
    width: 160,
    height: 160,
  },
});
