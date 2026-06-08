import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import { colors, radius, shadows, spacing, typography } from "../theme";
import { Flashcard } from "../components/Flashcard";
import type { Card, Deck } from "../data";

export type StudyScreenProps = {
  deck?: Deck;
  cards: Card[];
  onFinish: () => void;
};

type Rating = "again" | "hard" | "good" | "easy";

const RATING_CONFIG: {
  key: Rating;
  label: string;
  interval: string;
  bg: string;
}[] = [
  { key: "again", label: "Again", interval: "< 1 m", bg: "#dc2626" },
  { key: "hard", label: "Hard", interval: "2 d", bg: "#ea580c" },
  { key: "good", label: "Good", interval: "4 d", bg: "#16a34a" },
  { key: "easy", label: "Easy", interval: "7 d", bg: "#2563eb" },
];

export const StudyScreen: React.FC<StudyScreenProps> = ({ deck, cards, onFinish }) => {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const currentCard = cards[index];
  const progress = cards.length > 0 ? index / cards.length : 0;

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const handleRate = useCallback(
    (rating: Rating) => {
      if (Platform.OS === "ios") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      console.log("Rated", rating, "for card", currentCard?.id);

      if (index + 1 >= cards.length) {
        onFinish();
      } else {
        setIndex((i) => i + 1);
        setRevealed(false);
      }
    },
    [index, cards.length, currentCard, onFinish],
  );

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No cards to study</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={onFinish}
          style={styles.closeButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <SymbolView
            name="chevron.left"
            size={22}
            weight="semibold"
            tintColor={colors.textSecondary}
          />
        </Pressable>

        <View style={styles.progressPill}>
          <View style={[styles.progressPillFill, { width: `${Math.max(progress * 100, 4)}%` }]} />
          <Text style={styles.progressPillText} numberOfLines={1}>
            {deck?.name}
          </Text>
        </View>

        <Text style={styles.headerCounter}>
          {index + 1} / {cards.length}
        </Text>
      </View>

      {/* Card */}
      <View style={styles.cardArea}>
        <Flashcard card={currentCard} revealed={revealed} onReveal={handleReveal} />
      </View>

      {/* Rating tiles — 2×2 grid */}
      {revealed && (
        <View style={styles.gridWrap}>
          <View style={styles.grid}>
            {RATING_CONFIG.map((cfg) => (
              <Pressable
                key={cfg.key}
                onPress={() => handleRate(cfg.key)}
                style={({ pressed }) => [
                  styles.tile,
                  { backgroundColor: cfg.bg },
                  pressed && styles.tilePressed,
                ]}
              >
                <Text style={styles.tileLabel}>{cfg.label}</Text>
                <Text style={styles.tileInterval}>{cfg.interval}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgWarm,
  },
  headerCounter: {
    ...typography.caption,
    color: colors.textSecondary,
    fontVariant: ["tabular-nums"],
    minWidth: 40,
    textAlign: "right",
  },
  progressPill: {
    flex: 1,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.bgWarm,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: spacing.md,
  },
  progressPillFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.black5,
    borderRadius: radius.full,
  },
  progressPillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  cardArea: {
    flex: 1,
  },
  gridWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing["3xl"],
    paddingTop: spacing["4xl"],
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  tile: {
    width: "47%",
    paddingVertical: 26,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.card,
  },
  tilePressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  tileLabel: {
    ...typography.title2,
    color: colors.white,
    fontWeight: "700",
  },
  tileInterval: {
    ...typography.callout,
    color: "rgba(255,255,255,0.78)",
    marginTop: spacing.xs,
    fontVariant: ["tabular-nums"],
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    ...typography.title2,
    color: colors.textSecondary,
  },
});
