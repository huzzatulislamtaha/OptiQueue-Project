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
     PERIOD
  ========================= */

  periodSection: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 22,
  },

  periodTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
  },

  periodRow: {
    paddingRight: 10,
  },

  periodButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },

  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  periodText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  periodTextActive: {
    color: colors.white,
  },

  /* =========================
     SECTION
  ========================= */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  selectedPeriodBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 15,
  },

  selectedPeriodText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary,
    marginLeft: 5,
  },

  /* =========================
     REPORT CARDS
  ========================= */

  reportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 20,
  },

  reportCard: {
    width: "48.5%",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },

  reportIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  reportTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },

  reportDescription: {
    fontSize: 11,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 6,
    minHeight: 38,
  },

  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: radius.md,
    marginTop: 15,
  },

  generateButtonText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 6,
  },

  /* =========================
     RECENT REPORTS
  ========================= */

  recentCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },

  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },

  headerName: {
    flex: 1.5,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerPeriod: {
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerGenerated: {
    flex: 1.4,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerStatus: {
    width: 85,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerAction: {
    width: 65,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  nameCell: {
    flex: 1.5,
    fontSize: 11,
    fontWeight: "700",
    color: colors.text,
    paddingRight: 8,
  },

  periodCell: {
    flex: 1,
    fontSize: 11,
    color: colors.textSecondary,
  },

  generatedCell: {
    flex: 1.4,
    fontSize: 10,
    color: colors.textSecondary,
  },

  statusCell: {
    width: 85,
    alignItems: "flex-start",
  },

  generatedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
  },

  generatedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 5,
  },

  generatedText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.success,
  },

  viewButton: {
    width: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
    paddingVertical: 7,
    borderRadius: 8,
  },

  viewButtonText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary,
    marginLeft: 4,
  },

  /* =========================
     INFORMATION
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