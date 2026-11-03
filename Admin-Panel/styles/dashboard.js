import { StyleSheet } from "react-native";
import { colors, spacing, radius } from "./theme";

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
    padding: spacing.xl,
  },

  mainContent: {
    paddingBottom: 30,
  },

  /* =========================
     STATISTICS
  ========================= */

  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },

  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginTop: 12,
  },

  statNote: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  /* =========================
     MAIN CONTENT
  ========================= */

  contentRow: {
    flexDirection: "row",
    gap: 18,
  },

  largeCard: {
    flex: 1.6,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },

  smallCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },

  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },

  /* =========================
     CURRENTLY SERVING
  ========================= */

  servingCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: 18,
    marginBottom: 12,
  },

  servingTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  servingToken: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
  },

  servingStatus: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },

  servingStatusText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.success,
  },

  serviceName: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
    marginTop: 8,
  },

  counterText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  nextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 16,
    paddingTop: 14,
  },

  nextLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  nextToken: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },

  nextInfoRow: {
    flexDirection: "row",
    marginTop: 6,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  nextInfoItem: {
    flex: 1,
  },

  nextInfoLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  nextInfoValue: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    marginTop: 4,
  },

  liveQueueText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.success,
    marginTop: 4,
  },

  /* =========================
     QUICK ACTIONS
  ========================= */

  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  quickText: {
    flex: 1,
  },

  quickTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },

  quickSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },

  /* =========================
     QUEUE OVERVIEW
  ========================= */

  queueSection: {
    marginTop: 18,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
  },

  viewAllText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    marginRight: 5,
  },

  queueRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  queueHeaderService: {
    flex: 2,
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  queueHeaderValue: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  queueService: {
    flex: 2,
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  queueValue: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
  },

  queueToken: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },

  /* =========================
     FOOTER
  ========================= */

  footer: {
    marginTop: 22,
    alignItems: "center",
  },

  footerText: {
    fontSize: 11,
    color: colors.textLight,
  },
});