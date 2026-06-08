import { Platform } from "react-native";

export const colors = {
  bg: "#fafaf9",
  bgWarm: "#f5f5f4",
  text: "#1c1917",
  textSecondary: "#78716c",
  textMuted: "#a8a29e",
  border: "rgba(0,0,0,0.06)",
  borderStrong: "rgba(0,0,0,0.1)",
  white: "#ffffff",
  white60: "rgba(255,255,255,0.60)",
  white80: "rgba(255,255,255,0.80)",
  black5: "rgba(0,0,0,0.05)",
  black10: "rgba(0,0,0,0.10)",
  black50: "rgba(0,0,0,0.50)",
  tintRed: "#ef4444",
  tintGreen: "#22c55e",
  tintAmber: "#f59e0b",
  tintPurple: "#a855f7",
  tintCyan: "#06b6d4",
  ratingAgain: "#ef4444",
  ratingHard: "#f97316",
  ratingGood: "#22c55e",
  ratingEasy: "#3b82f6",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  largeTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  title1: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  title2: {
    fontSize: 22,
    fontWeight: "600" as const,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  title3: {
    fontSize: 18,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  callout: {
    fontSize: 14,
    fontWeight: "500" as const,
    letterSpacing: -0.1,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
    letterSpacing: 0,
    lineHeight: 16,
  },
};

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: {
      elevation: 3,
    },
  }),
  float: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: {
      elevation: 8,
    },
  }),
};
