import { StyleSheet } from "react-native";

import {
  colors,
  spacing,
  radius,
  typography,
} from "./theme";

export default StyleSheet.create({

  /* =========================
     MAIN HEADER
  ========================= */

  header: {
    height: 94,
    width: "100%",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: spacing.xl,
  },

  /* =========================
     TITLE AREA
  ========================= */

  titleArea: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
  },

  subtitle: {
    marginTop: 5,
    fontSize: typography.body,
    color: colors.textSecondary,
  },

  /* =========================
     RIGHT AREA
  ========================= */

  rightArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",

    gap: 14,
    flexShrink: 0,
  },

  /* =========================
     LIVE BADGE
  ========================= */

  liveBadge: {
    height: 34,
    paddingHorizontal: 12,

    borderRadius: 18,
    backgroundColor: colors.successLight,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 7,
  },

  liveText: {
    fontSize: typography.small,
    fontWeight: "700",
    color: colors.success,
  },

  /* =========================
     NOTIFICATION
  ========================= */

  notificationButton: {
    width: 40,
    height: 40,

    borderRadius: 20,
    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  notificationDot: {
    position: "absolute",

    top: 8,
    right: 9,

    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: colors.danger,

    borderWidth: 1,
    borderColor: colors.white,
  },

  /* =========================
     ADMIN PROFILE
  ========================= */

  adminProfile: {
    minWidth: 190,
    height: 52,

    paddingHorizontal: 8,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: radius.md,
  },

  adminAvatar: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  adminInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },

  adminName: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,

    includeFontPadding: false,
  },

  adminRole: {
    marginTop: 3,

    fontSize: typography.small,
    color: colors.textSecondary,

    includeFontPadding: false,
  },

  profileArrow: {
    marginLeft: 8,
  },
});