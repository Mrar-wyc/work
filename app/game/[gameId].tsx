import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { getGameById } from '@/src/games';
import { zh } from '@/src/i18n/zh';

export default function GameScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const id = Array.isArray(gameId) ? gameId[0] : gameId;
  const game = id ? getGameById(id) : undefined;

  if (!game) {
    return (
      <>
        <Stack.Screen options={{ title: zh.gameNotFoundTitle }} />
        <View style={styles.centered}>
          <Text style={styles.heading}>{zh.gameNotFoundTitle}</Text>
          <Text style={styles.sub}>{zh.gameNotFoundBody(id ?? '')}</Text>
        </View>
      </>
    );
  }

  const Game = game.component;

  return (
    <>
      <Stack.Screen options={{ title: game.title }} />
      <View style={styles.gameShell}>
        <Game />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  gameShell: {
    flex: 1,
  },
  centered: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  sub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
    maxWidth: 320,
  },
});
