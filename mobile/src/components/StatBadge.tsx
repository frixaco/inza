import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { colors, radius, spacing, typography } from "../theme";

export type StatBadgeProps = {
  label: string;
  value: number | string;
  tint?: string;
};

export const StatBadge: React.FC<StatBadgeProps> = ({ label, value, tint = colors.text }) => {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.inner}>
        <Text style={[styles.value, { color: tint }]}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.white80,
    backgroundColor: colors.white60,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  inner: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  value: {
    ...typography.title2,
    fontVariant: ["tabular-nums"],
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
