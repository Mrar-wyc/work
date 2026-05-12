import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { SectionList, Pressable, StyleSheet, View } from 'react-native';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { games, type GameCategory, type GameDefinition } from '@/src/games';
import { zh } from '@/src/i18n/zh';

const CATEGORY_ORDER: GameCategory[] = ['puzzle', 'arcade', 'classic'];

function buildSections(list: GameDefinition[]) {
  const bucket = new Map<GameCategory, GameDefinition[]>();
  for (const cat of CATEGORY_ORDER) {
    bucket.set(cat, []);
  }
  for (const g of list) {
    const cat = g.category ?? 'arcade';
    bucket.get(cat)!.push(g);
  }
  return CATEGORY_ORDER.filter((cat) => (bucket.get(cat) ?? []).length > 0).map((cat) => ({
    title: zh.categoryLabels[cat],
    data: bucket.get(cat)!,
  }));
}

export default function LobbyScreen() {
  const router = useRouter();
  const sections = buildSections(games);

  return (
    <ThemedView style={styles.container}>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <ThemedText style={styles.subtitle}>{zh.lobbySubtitle}</ThemedText>
            </View>
          }
          renderSectionHeader={({ section: { title } }) => (
            <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
          )}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => router.push(`/game/${item.id}`)}>
              <ThemedView style={styles.iconWrap}>
                <Ionicons name={item.icon} size={28} color="#2f95dc" />
              </ThemedView>
              <ThemedView style={styles.textCol}>
                <ThemedText style={styles.title}>{item.title}</ThemedText>
                {item.description ? (
                  <ThemedText style={styles.description} numberOfLines={2}>
                    {item.description}
                  </ThemedText>
                ) : null}
              </ThemedView>
              <Ionicons name="chevron-forward" size={22} color="#888" />
            </Pressable>
          )}
          renderSectionFooter={() => <View style={styles.sectionFooter} />}
        />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.75,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.55,
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'none',
  },
  sectionFooter: {
    height: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(127,127,127,0.35)',
    gap: 12,
    marginBottom: 10,
  },
  rowPressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(47,149,220,0.12)',
  },
  textCol: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.75,
  },
});
