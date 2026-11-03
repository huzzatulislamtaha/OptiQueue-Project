import { StyleSheet } from "react-native";
import { colors, radius } from "./theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  body: {
    flex: 1,
    flexDirection: "row",
  },

  main: {
    flex: 1,
    padding: 28,
  },

  mainContent: {
    paddingBottom: 30,
  },

  /* =========================
     SUMMARY
  ========================= */

  summaryGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },

  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },

  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryIcon: {
    backgroundColor: colors.primaryLight,
  },

  successIcon: {
    backgroundColor: colors.successLight,
  },

  warningIcon: {
    backgroundColor: colors.warningLight,
  },

  blueIcon: {
    backgroundColor: colors.blueLight,
  },

  summaryValue: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
    marginTop: 12,
  },

  summaryNote: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  /* =========================
     ADD SERVICE
  ========================= */

  addCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  addInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  addIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  addText: {
    flex: 1,
  },

  addTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },

  addSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: radius.md,
    marginLeft: 15,
  },

  addButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 6,
  },

  /* =========================
     SECTION
  ========================= */

  sectionHeader: {
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  /* =========================
     SERVICE GRID
  ========================= */

  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  serviceCard: {
    width: "48.5%",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },

  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  codeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },

  codeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
  },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 5,
  },

  activeText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.success,
  },

  serviceName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginTop: 16,
  },

  metricsRow: {
    flexDirection: "row",
    marginTop: 20,
  },

  metric: {
    flex: 1,
  },

  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  metricValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginTop: 4,
  },

  serviceFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 18,
    paddingTop: 14,
  },

  footerLabel: {
    fontSize: 9,
    color: colors.textSecondary,
  },

  footerValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 3,
  },

  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 8,
  },

  counterText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textSecondary,
    marginLeft: 5,
  },

  /* =========================
     CONFIGURATION
  ========================= */

  configurationCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 20,
    overflow: "hidden",
  },

  configurationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  configurationTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },

  configurationSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  configRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  configInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  configCode: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  configCodeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
  },

  configName: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },

  configCounter: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
  },

  toggle: {
    width: 42,
    height: 24,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 3,
    justifyContent: "center",
  },

  toggleActive: {
    backgroundColor: colors.primary,
  },

  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.white,
    alignSelf: "flex-start",
  },

  toggleThumbActive: {
    alignSelf: "flex-end",
  },

  /* =========================
     INFO
  ========================= */

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: 18,
    marginTop: 18,
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },

  infoText: {
    fontSize: 11,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 5,
  },

  /* =========================
     FOOTER
  ========================= */

  footer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 5,
  },

  footerText: {
    fontSize: 11,
    color: colors.textLight,
  },
});