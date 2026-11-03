import { StyleSheet } from "react-native";
import {
  colors,
  spacing,
  radius,
  typography,
} from "./theme";

export default StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.background,
  },

  main: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: spacing.xl,
    paddingBottom: 40,
  },

  pageIntro: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
    gap: spacing.md,
  },

  pageTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
  },

  pageSubtitle: {
    marginTop: 5,
    fontSize: typography.body,
    color: colors.textSecondary,
  },

  saveButton: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveButtonText: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.white,
  },

  section: {
    marginBottom: spacing.xl,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  sectionHeaderIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  sectionTitle: {
    fontSize: typography.heading,
    fontWeight: "800",
    color: colors.text,
  },

  sectionDescription: {
    marginTop: 3,
    fontSize: typography.small,
    color: colors.textSecondary,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  settingRow: {
    minHeight: 78,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: spacing.md,
  },

  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
  },

  settingDescription: {
    marginTop: 4,
    fontSize: typography.small,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 68,
  },

  toggle: {
    width: 48,
    height: 28,
    borderRadius: 20,
    padding: 3,
    justifyContent: "center",
  },

  toggleActive: {
    backgroundColor: colors.primary,
    alignItems: "flex-end",
  },

  toggleInactive: {
    backgroundColor: colors.border,
    alignItems: "flex-start",
  },

  toggleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },

  toggleCircleActive: {
    backgroundColor: colors.white,
  },

  toggleCircleInactive: {
    backgroundColor: colors.white,
  },

  notificationInfo: {
    flexDirection: "row",
    padding: spacing.lg,
    alignItems: "flex-start",
  },

  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  notificationText: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
  },

  notificationDescription: {
    marginTop: 5,
    fontSize: typography.small,
    lineHeight: 19,
    color: colors.textSecondary,
  },

  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
  },

  accountAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  accountInfo: {
    flex: 1,
  },

  accountName: {
    fontSize: typography.subHeading,
    fontWeight: "800",
    color: colors.text,
  },

  accountRole: {
    marginTop: 4,
    fontSize: typography.small,
    color: colors.textSecondary,
  },

  actionRow: {
    minHeight: 74,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },

  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  actionText: {
    flex: 1,
  },

  actionTitle: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
  },

  actionDescription: {
    marginTop: 4,
    fontSize: typography.small,
    color: colors.textSecondary,
  },

  dangerCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.dangerLight,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
  },

  dangerIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.dangerLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  dangerText: {
    flex: 1,
    paddingRight: spacing.md,
  },

  dangerTitle: {
    fontSize: typography.body,
    fontWeight: "800",
    color: colors.danger,
  },

  dangerDescription: {
    marginTop: 4,
    fontSize: typography.small,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  dangerButton: {
    minWidth: 72,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },

  dangerButtonText: {
    fontSize: typography.small,
    fontWeight: "700",
    color: colors.danger,
  },

  backendNote: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.xl,
  },

  backendNoteText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.small,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  footer: {
    paddingTop: spacing.md,
    alignItems: "center",
  },

  footerText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    textAlign: "center",
  },

  footerVersion: {
    marginTop: 4,
    fontSize: typography.tiny,
    color: colors.textLight,
  },
});