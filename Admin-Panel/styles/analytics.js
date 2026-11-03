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
     PERIOD
  ========================= */

  periodRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  periodButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },

  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  periodText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  periodTextActive: {
    color: colors.white,
  },

  /* =========================
     METRICS
  ========================= */

  metricsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },

  metricCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },

  metricTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },

  metricIcon: {
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

  metricValue: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
    marginTop: 12,
  },

  metricChange: {
    fontSize: 10,
    color: colors.success,
    fontWeight: "600",
    marginTop: 5,
  },

  /* =========================
     CHART
  ========================= */

  chartCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 20,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  chartBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 15,
  },

  chartBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary,
    marginLeft: 5,
  },

  chartArea: {
    height: 205,
    flexDirection: "row",
    marginTop: 20,
  },

  yAxis: {
    width: 30,
    height: 165,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  axisText: {
    fontSize: 9,
    color: colors.textLight,
  },

  chartBars: {
    flex: 1,
    height: 180,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  barGroup: {
    height: 180,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  bar: {
    width: 28,
    minHeight: 5,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },

  barLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 7,
    height: 15,
  },

  /* =========================
     INSIGHTS
  ========================= */

  insightsCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 20,
  },

  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  insightIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  insightHeaderText: {
    flex: 1,
  },

  insightTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },

  insightSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },

  insightList: {
    marginTop: 17,
  },

  insightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  insightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: 9,
  },

  insightText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  /* =========================
     TABLE
  ========================= */

  tableCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 20,
  },

  tableTop: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
    backgroundColor: colors.background,
  },

  headerService: {
    flex: 2,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  headerWait: {
    width: 80,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  serviceName: {
    flex: 2,
    fontSize: 11,
    fontWeight: "600",
    color: colors.text,
    paddingRight: 8,
  },

  serviceCell: {
    flex: 1,
    fontSize: 11,
    color: colors.text,
  },

  serviceWait: {
    width: 80,
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },

  /* =========================
     AI PREDICTION
  ========================= */

  predictionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 20,
  },

  predictionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  predictionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.purpleLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  predictionText: {
    flex: 1,
  },

  predictionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },

  predictionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },

  comingBadge: {
    backgroundColor: colors.purpleLight,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 15,
  },

  comingBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.purple,
  },

  predictionDescription: {
    fontSize: 11,
    lineHeight: 19,
    color: colors.textSecondary,
    marginTop: 16,
  },

  predictionFeatures: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  predictionFeature: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },

  featureText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 5,
  },

  /* =========================
     FOOTER
  ========================= */

  footer: {
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },

  footerText: {
    fontSize: 11,
    color: colors.textLight,
  },
});