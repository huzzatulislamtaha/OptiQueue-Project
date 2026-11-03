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
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
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

  summaryIconPrimary: {
    backgroundColor: colors.primaryLight,
  },

  summaryIconSuccess: {
    backgroundColor: colors.successLight,
  },

  summaryIconWarning: {
    backgroundColor: colors.warningLight,
  },

  summaryIconBlue: {
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
     SECTION
  ========================= */

  section: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 18,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
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

  liveStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  liveStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },

  liveStatusText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.success,
  },

  /* =========================
     SERVING CARDS
  ========================= */

  servingGrid: {
    flexDirection: "row",
    gap: 14,
  },

  servingCard: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: 17,
  },

  servingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  counterLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  servingToken: {
    fontSize: 27,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 5,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 5,
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
    fontSize: 9,
    fontWeight: "800",
    color: colors.success,
  },

  servingService: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginTop: 8,
  },

  nextPatientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 14,
    paddingTop: 12,
  },

  nextPatientLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  nextPatientToken: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.text,
  },

  /* =========================
     QUEUE CONTROL
  ========================= */

  controlCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  controlInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  controlIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  controlText: {
    flex: 1,
  },

  controlTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },

  controlSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 17,
    paddingVertical: 11,
    marginLeft: 15,
  },

  callButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
    marginLeft: 7,
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
    paddingBottom: 16,
  },

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
    width: 85,
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
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerWaiting: {
    width: 65,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerWait: {
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
    width: 85,
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },

  serviceCell: {
    flex: 2,
    fontSize: 11,
    fontWeight: "600",
    color: colors.text,
    paddingRight: 8,
  },

  counterCell: {
    flex: 1,
    fontSize: 11,
    color: colors.textSecondary,
  },

  waitingCell: {
    width: 65,
    fontSize: 11,
    color: colors.text,
  },

  waitCell: {
    width: 75,
    fontSize: 11,
    color: colors.textSecondary,
  },

  statusCell: {
    width: 90,
    alignItems: "flex-start",
  },

  /* =========================
     STATUS BADGE
  ========================= */

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
  },

  servingBadge: {
    backgroundColor: colors.successLight,
  },

  waitingBadge: {
    backgroundColor: colors.warningLight,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  servingDot: {
    backgroundColor: colors.success,
  },

  waitingDot: {
    backgroundColor: colors.warning,
  },

  statusText: {
    fontSize: 9,
    fontWeight: "800",
  },

  servingText: {
    color: colors.success,
  },

  waitingText: {
    color: colors.warning,
  },

  /* =========================
     EMPTY STATE
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