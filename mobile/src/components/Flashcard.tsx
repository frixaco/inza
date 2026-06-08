import React from "react";
import {
  Animated,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing, typography } from "../theme";
import type { Card } from "../data";

export type FlashcardProps = {
  card: Card;
  revealed: boolean;
  onReveal: () => void;
};

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  revealed,
  onReveal,
}) => {
  const [answerVisible, setAnswerVisible] = React.useState(revealed);
  const fadeAnim = React.useRef(new Animated.Value(revealed ? 1 : 0)).current;
  const slideAnim = React.useRef(
    new Animated.Value(revealed ? 0 : 14),
  ).current;
  const scaleAnim = React.useRef(
    new Animated.Value(revealed ? 1 : 0.98),
  ).current;

  React.useEffect(() => {
    if (revealed) {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(150, "easeInEaseOut", "opacity")
      );
      setAnswerVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(14);
      scaleAnim.setValue(0.98);
      setAnswerVisible(false);
    }
  }, [revealed, fadeAnim, slideAnim, scaleAnim]);

  const handleReveal = () => {
    if (!revealed) {
      if (Platform.OS === "ios") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onReveal();
    }
  };

  return (
    <View style={styles.pressable}>
      <View style={styles.cardContent}>
        <View style={styles.middle}>
          <Text style={[styles.prompt, revealed && styles.promptRevealed]}>{card.prompt}</Text>

          {answerVisible && (
            <Animated.View
              style={[
                styles.answerWrap,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.divider} />
              <Text style={styles.answer}>{card.answer}</Text>
            </Animated.View>
          )}
        </View>

        {!revealed && (
          <Pressable onPress={handleReveal} style={styles.revealHint}>
            <View style={styles.revealPill}>
              <Text style={styles.revealText}>Show Answer</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    marginHorizontal: spacing.lg,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  middle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  prompt: {
    ...typography.title1,
    color: colors.text,
    textAlign: "center",
  },
  promptRevealed: {
    ...typography.title2,
    color: colors.textSecondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
    marginVertical: spacing.lg,
    width: 40,
    alignSelf: "center",
  },
  answerWrap: {
    marginTop: spacing.md,
    alignItems: "center",
  },
  answer: {
    ...typography.largeTitle,
    color: colors.text,
    textAlign: "center",
    fontWeight: "700",
  },
  revealHint: {
    alignSelf: "center",
    marginBottom: spacing.lg,
  },
  revealPill: {
    backgroundColor: colors.text,
    borderRadius: radius.full,
    paddingVertical: spacing.md + 6,
    paddingHorizontal: 40,
  },
  revealText: {
    ...typography.callout,
    color: colors.white,
    fontWeight: "600",
  },
});
