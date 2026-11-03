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

  warningIcon: {
    backgroundColor: colors.warningLight,
  },

  successIcon: {
    backgroundColor: colors.successLight,
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
     CREATE TOKEN
  ========================= */

  createCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  createInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  createIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  createText: {
    flex: 1,
  },

  createTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },

  createSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: radius.md,
    marginLeft: 15,
  },

  createButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 6,
  },

  /* =========================
     TABLE SECTION
  ========================= */

  tableSection: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingTop: 20,
    overflow: "hidden",
  },

  tableTop: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successLight,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 15,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 5,
  },

  liveText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.success,
  },

  /* =========================
     FILTER
  ========================= */

  filterRow: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  filterTextActive: {
    color: colors.white,
  },

  /* =========================
     TABLE
  ========================= */

  tableCard: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },

  headerToken: {
    width: 75,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerPatient: {
    width: 105,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerService: {
    flex: 2,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerCounter: {
    width: 90,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerTime: {
    width: 75,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerStatus: {
    width: 90,
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

  tokenCell: {
    width: 75,
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },

  patientCell: {
    width: 105,
    fontSize: 11,
    color: colors.text,
    fontWeight: "600",
  },

  serviceCell: {
    flex: 2,
    fontSize: 11,
    color: colors.text,
    paddingRight: 8,
  },

  counterCell: {
    width: 90,
    fontSize: 11,
    color: colors.textSecondary,
  },

  timeCell: {
    width: 75,
    fontSize: 11,
    color: colors.textSecondary,
  },

  statusCell: {
    width: 90,
    alignItems: "flex-start",
  },

  /* =========================
     STATUS
  ========================= */

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
  },

  waitingBadge: {
    backgroundColor: colors.warningLight,
  },

  servingBadge: {
    backgroundColor: colors.successLight,
  },

  completedBadge: {
    backgroundColor: colors.blueLight,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  waitingDot: {
    backgroundColor: colors.warning,
  },

  servingDot: {
    backgroundColor: colors.success,
  },

  completedDot: {
    backgroundColor: colors.blue,
  },

  statusText: {
    fontSize: 9,
    fontWeight: "800",
  },

  waitingText: {
    color: colors.warning,
  },

  servingText: {
    color: colors.success,
  },

  completedText: {
    color: colors.blue,
  },

  /* =========================
     EMPTY
  ========================= */

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 45,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginTop: 10,
  },

  emptyText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 5,
  },

  /* =========================
     BOTTOM CARDS
  ========================= */

  bottomGrid: {
    flexDirection: "row",
    gap: 18,
    marginTop: 18,
  },

  infoCard: {
    flex: 1.6,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: 18,
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
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },

  infoText: {
    fontSize: 11,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 5,
  },

  quickCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },

  quickTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },

  quickButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  quickButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
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