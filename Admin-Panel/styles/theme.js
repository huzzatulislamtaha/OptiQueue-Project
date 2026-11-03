import { StyleSheet } from "react-native";

export const colors = {
  primary: "#079C91",
  primaryDark: "#067F76",
  primaryLight: "#E8F7F5",

  white: "#FFFFFF",
  background: "#F6FAFA",
  surface: "#FFFFFF",

  text: "#172B2A",
  textSecondary: "#647575",
  textLight: "#94A3A3",

  border: "#E5EEEE",

  success: "#159A6C",
  successLight: "#E9F8F1",

  warning: "#D89016",
  warningLight: "#FFF5E3",

  danger: "#D94A4A",
  dangerLight: "#FDECEC",

  blue: "#3B82F6",
  blueLight: "#EDF4FF",

  purple: "#7C5CFC",
  purpleLight: "#F2EEFF",

  sidebar: "#FFFFFF",
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 36,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const typography = {
  title: 24,
  heading: 18,
  subHeading: 16,
  body: 14,
  small: 12,
  tiny: 11,
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sectionTitle: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
  },

  sectionSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: "700",
  },
});