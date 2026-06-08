import React from "react";
import { ScrollView, StyleSheet, Text, View, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing, typography } from "../theme";
import { DECKS, STATS } from "../data";
import { DeckCard } from "../components/DeckCard";
import { StatBadge } from "../components/StatBadge";
import type { Deck } from "../data";

export type HomeScreenProps = {
  onStudyDeck: (deck: Deck) => void;
  onStudyAll: () => void;
  onSettings?: () => void;
  onAddDeck?: () => void;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStudyDeck,
  onStudyAll,
  onSettings,
  onAddDeck,
}) => {
  const handleStudyAll = () => {
    if (Platform.OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onStudyAll();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={{ width: 44 }} />
        <View style={styles.iconGroup}>
          <Pressable
            onPress={onAddDeck}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <SymbolView name="plus" size={20} weight="semibold" tintColor={colors.textSecondary} />
          </Pressable>
          <Pressable
            onPress={onSettings}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <SymbolView
              name="gearshape"
              size={20}
              weight="semibold"
              tintColor={colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatBadge label="Due" value={STATS.due} tint={colors.tintRed} />
          <StatBadge label="Learning" value={STATS.learning} tint={colors.tintAmber} />
          <StatBadge label="New" value={STATS.new} tint={colors.tintCyan} />
        </View>

        {DECKS.map((deck) => (
          <DeckCard key={deck.id} deck={deck} onPress={onStudyDeck} />
        ))}
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <Text style={styles.footerSubtitle}>{STATS.queued} cards waiting</Text>
        <Pressable onPress={handleStudyAll} style={styles.startButton}>
          <SymbolView name="play.fill" size={16} tintColor={colors.white} />
          <Text style={styles.startButtonText}>Start</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  iconGroup: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgWarm,
  },
  scrollContent: {
    paddingTop: spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  footerSubtitle: {
    ...typography.callout,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.text,
    borderRadius: radius.full,
    paddingVertical: spacing.xl,
    gap: spacing.sm,
    width: "100%",
  },
  startButtonText: {
    ...typography.callout,
    color: colors.white,
    fontWeight: "600",
  },
});
