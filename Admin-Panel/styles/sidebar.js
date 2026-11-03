import { StyleSheet } from "react-native";

import {
  colors,
  spacing,
  radius,
  typography,
} from "./theme";

export default StyleSheet.create({

  /* =========================
     SIDEBAR
  ========================= */

  sidebar: {
    width: 250,
    height: "100%",
    backgroundColor: colors.white,

    borderRightWidth: 1,
    borderRightColor: colors.border,

    paddingTop: 22,

    flexDirection: "column",
  },

  /* =========================
     BRAND
  ========================= */

  brandSection: {
    height: 68,

    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    marginBottom: 14,
  },

  brandLogo: {
    width: 40,
    height: 40,

    borderRadius: 12,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  brandIcon: {
    color: colors.primary,
  },

  brandTextArea: {
    flex: 1,
    minWidth: 0,
  },

  brandName: {
    fontSize: 21,
    fontWeight: "800",
    color: colors.text,
  },

  brandSubtitle: {
    marginTop: 2,

    fontSize: 11,
    color: colors.textSecondary,
  },

  /* =========================
     MENU SCROLL
  ========================= */

  menuScroll: {
    flex: 1,
    minHeight: 0,
  },

  menuContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },

  menuHeading: {
    marginTop: 12,
    marginBottom: 8,

    paddingHorizontal: 10,

    fontSize: 10,
    fontWeight: "800",

    letterSpacing: 1.1,

    color: colors.textLight,
  },

  menuGroup: {
    gap: 4,
  },

  /* =========================
     MENU ITEM
  ========================= */

  menuItem: {
    minHeight: 46,

    borderRadius: 11,

    paddingHorizontal: 10,

    flexDirection: "row",
    alignItems: "center",
  },

  menuItemActive: {
    backgroundColor: colors.primaryLight,
  },

  menuIconBox: {
    width: 34,
    height: 34,

    borderRadius: 9,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 9,
  },

  menuIconBoxActive: {
    backgroundColor: colors.white,
  },

  activeIcon: {
    color: colors.primary,
  },

  inactiveIcon: {
    color: colors.textSecondary,
  },

  menuText: {
    flex: 1,

    fontSize: 13,
    fontWeight: "500",

    color: colors.textSecondary,
  },

  menuTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },

  /* =========================
     PROFILE
  ========================= */

  profileSection: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,

    borderTopWidth: 1,
    borderTopColor: colors.border,

    backgroundColor: colors.white,
  },

  profileCard: {
    minHeight: 58,

    paddingHorizontal: 9,
    paddingVertical: 8,

    borderRadius: 12,

    backgroundColor: colors.background,

    flexDirection: "row",
    alignItems: "center",
  },

  profileAvatar: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 9,
  },

  profileIcon: {
    color: colors.primary,
  },

  profileInfo: {
    flex: 1,
    minWidth: 0,
  },

  profileName: {
    fontSize: 12,
    fontWeight: "700",

    color: colors.text,
  },

  profileRole: {
    marginTop: 2,

    fontSize: 10,

    color: colors.textSecondary,
  },

  profileMore: {
    color: colors.textLight,
  },

  version: {
    marginTop: 8,

    textAlign: "center",

    fontSize: 9,

    color: colors.textLight,
  },
});