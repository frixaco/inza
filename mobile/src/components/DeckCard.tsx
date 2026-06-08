import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing, typography } from "../theme";
import type { Deck } from "../data";

export type DeckCardProps = {
  deck: Deck;
  onPress: (deck: Deck) => void;
};

export const DeckCard: React.FC<DeckCardProps> = ({ deck, onPress }) => {
  const handlePress = () => {
    if (Platform.OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(deck);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.glassWrapper}>
        <BlurView
          intensity={60}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>
          <View style={styles.left}>
            <View style={styles.textBlock}>
              <Text style={styles.name} numberOfLines={1}>
                {deck.name}
              </Text>
              <Text style={styles.path} numberOfLines={1}>
                {deck.path}
              </Text>
            </View>
          </View>
          <View style={styles.counts}>
            <CountBadge value={deck.due} />
            <CountBadge value={deck.learn} />
            <CountBadge value={deck.new} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const CountBadge: React.FC<{
  value: number;
}> = ({ value }) => (
  <View style={styles.badgeCol}>
    <Text style={styles.badgeValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  pressable: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  glassWrapper: {
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.white80,
    backgroundColor: colors.white60,
  },
  content: {
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.md,
  },
  textBlock: {
    flex: 1,
  },
  name: {
    ...typography.callout,
    color: colors.text,
  },
  path: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  counts: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  badgeCol: {
    alignItems: "center",
    minWidth: 32,
  },
  badgeValue: {
    ...typography.callout,
    color: colors.textSecondary,
    fontVariant: ["tabular-nums"],
  },

});
