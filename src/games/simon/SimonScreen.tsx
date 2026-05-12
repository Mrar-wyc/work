import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const COLORS = ['#dc2626', '#16a34a', '#2563eb', '#ca8a04'];
const NAMES = ['红', '绿', '蓝', '黄'];

function randomTone() {
  return Math.floor(Math.random() * 4);
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export function SimonScreen() {
  const [sequence, setSequence] = useState<number[]>(() => [randomTone()]);
  const [phase, setPhase] = useState<'show' | 'input' | 'gameover'>('show');
  const [highlight, setHighlight] = useState<number | null>(null);
  const [playerIdx, setPlayerIdx] = useState(0);

  const seqRef = useRef(sequence);
  seqRef.current = sequence;

  useEffect(() => {
    let cancelled = false;
    async function runShow() {
      setPhase('show');
      const seq = seqRef.current;
      for (let i = 0; i < seq.length; i++) {
        if (cancelled) return;
        await sleep(320);
        if (cancelled) return;
        setHighlight(seq[i]);
        await sleep(520);
        if (cancelled) return;
        setHighlight(null);
        await sleep(100);
      }
      if (!cancelled) {
        setPhase('input');
        setPlayerIdx(0);
      }
    }
    runShow();
    return () => {
      cancelled = true;
    };
  }, [sequence]);

  const onPadPress = useCallback(
    (idx: number) => {
      if (phase !== 'input') return;
      const expected = sequence[playerIdx];
      if (idx !== expected) {
        setPhase('gameover');
        return;
      }
      const nextIdx = playerIdx + 1;
      if (nextIdx >= sequence.length) {
        setSequence((prev) => [...prev, randomTone()]);
        return;
      }
      setPlayerIdx(nextIdx);
    },
    [phase, playerIdx, sequence],
  );

  const restart = useCallback(() => {
    const s = [randomTone()];
    seqRef.current = s;
    setSequence(s);
    setPlayerIdx(0);
    setPhase('show');
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>西蒙说</Text>
      <Text style={styles.meta}>
        回合 {sequence.length} · {phase === 'show' ? '请看提示…' : phase === 'input' ? '按顺序点击' : '游戏结束'}
      </Text>
      <View style={styles.pad}>
        {[0, 1, 2, 3].map((i) => (
          <Pressable
            key={i}
            style={[
              styles.btn,
              {
                backgroundColor: COLORS[i],
                opacity: highlight === i ? 1 : 0.65,
                borderWidth: highlight === i ? 3 : 0,
                borderColor: '#fff',
              },
            ]}
            onPress={() => onPadPress(i)}>
            <Text style={styles.btnLabel}>{NAMES[i]}</Text>
          </Pressable>
        ))}
      </View>
      {phase === 'gameover' ? (
        <View style={styles.overBox}>
          <Text style={styles.overText}>顺序错了，再试一次</Text>
          <Pressable style={styles.primaryBtn} onPress={restart}>
            <Text style={styles.primaryLabel}>重新开始</Text>
          </Pressable>
        </View>
      ) : null}
      <Pressable style={styles.secondary} onPress={restart}>
        <Text style={styles.secondaryText}>从头开始</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  meta: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
  },
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 220,
    justifyContent: 'center',
    gap: 12,
  },
  btn: {
    width: 96,
    height: 96,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
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
    padding: 8,
  },
  secondaryText: {
    color: '#2f95dc',
    fontWeight: '600',
    fontSize: 15,
  },
});
