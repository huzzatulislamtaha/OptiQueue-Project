import { StyleSheet } from "react-native";

import {
  colors,
  spacing,
  radius,
  typography,
} from "./theme";

export default StyleSheet.create({

  /* =====================================================
     SCREEN
  ===================================================== */

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    width: "100%",
    maxWidth: 1600,
    alignSelf: "center",

    paddingHorizontal: 34,
    paddingTop: 28,
    paddingBottom: 40,
  },

  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    minHeight: 82,

    paddingHorizontal: 34,

    backgroundColor: colors.white,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandLogo: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  brandInfo: {
    justifyContent: "center",
  },

  brandName: {
    fontSize: 23,
    fontWeight: "800",
    color: colors.text,
  },

  brandSubtitle: {
    marginTop: 2,

    fontSize: 11,

    color: colors.textSecondary,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  liveBadge: {
    height: 34,

    paddingHorizontal: 13,

    borderRadius: 18,

    backgroundColor: colors.successLight,

    flexDirection: "row",
    alignItems: "center",
  },

  liveDot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: colors.success,

    marginRight: 7,
  },

  liveText: {
    fontSize: 11,

    fontWeight: "800",

    color: colors.success,

    letterSpacing: 0.7,
  },

  currentTime: {
    marginLeft: 16,

    fontSize: 12,

    fontWeight: "600",

    color: colors.textSecondary,
  },

  /* =====================================================
     INTRO
  ===================================================== */

  introRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 22,
  },

  pageTitle: {
    fontSize: typography.title,

    fontWeight: "800",

    color: colors.text,
  },

  pageSubtitle: {
    marginTop: 5,

    fontSize: typography.body,

    color: colors.textSecondary,
  },

  waitingSummary: {
    minWidth: 190,

    paddingHorizontal: 16,
    paddingVertical: 11,

    borderRadius: radius.md,

    backgroundColor: colors.white,

    borderWidth: 1,
    borderColor: colors.border,

    flexDirection: "row",
    alignItems: "center",
  },

  waitingSummaryIcon: {
    width: 38,
    height: 38,

    borderRadius: 11,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  waitingSummaryNumber: {
    fontSize: 19,

    fontWeight: "800",

    color: colors.text,
  },

  waitingSummaryLabel: {
    marginTop: 2,

    fontSize: 10,

    color: colors.textSecondary,
  },

  /* =====================================================
     NOW SERVING
  ===================================================== */

  nowServingCard: {
    backgroundColor: colors.primary,

    borderRadius: radius.xl,

    padding: 28,

    marginBottom: 28,
  },

  nowServingTop: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  nowServingHeading: {
    flexDirection: "row",

    alignItems: "center",
  },

  nowServingIcon: {
    width: 46,
    height: 46,

    borderRadius: 13,

    backgroundColor: colors.primaryDark,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  nowServingLabel: {
    fontSize: 13,

    fontWeight: "800",

    color: colors.white,

    letterSpacing: 1,
  },

  nowServingCounter: {
    marginTop: 4,

    fontSize: 11,

    color: "#D8F4F1",
  },

  nowServingStatus: {
    height: 32,

    paddingHorizontal: 12,

    borderRadius: 17,

    backgroundColor: colors.white,

    flexDirection: "row",

    alignItems: "center",
  },

  nowServingStatusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: colors.success,

    marginRight: 6,
  },

  nowServingStatusText: {
    fontSize: 10,

    fontWeight: "800",

    color: colors.success,

    letterSpacing: 0.6,
  },

  nowServingBody: {
    marginTop: 24,

    flexDirection: "row",

    alignItems: "center",
  },

  mainTokenArea: {
    width: 270,
  },

  mainToken: {
    fontSize: 66,

    lineHeight: 72,

    fontWeight: "900",

    color: colors.white,

    letterSpacing: 1,
  },

  mainTokenLabel: {
    marginTop: 3,

    fontSize: 10,

    color: "#BFEAE6",

    letterSpacing: 0.8,
  },

  nowServingDetails: {
    flex: 1,

    flexDirection: "row",

    justifyContent: "space-between",

    marginLeft: 28,
  },

  detailBox: {
    flex: 1,

    paddingHorizontal: 18,

    borderLeftWidth: 1,

    borderLeftColor: "#48B7AE",
  },

  detailLabel: {
    fontSize: 9,

    fontWeight: "700",

    color: "#BFEAE6",

    letterSpacing: 0.7,
  },

  detailValue: {
    marginTop: 6,

    fontSize: 15,

    fontWeight: "700",

    color: colors.white,
  },

  /* =====================================================
     SECTION
  ===================================================== */

  section: {
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: typography.heading,

    fontWeight: "800",

    color: colors.text,
  },

  sectionSubtitle: {
    marginTop: 4,

    fontSize: typography.small,

    color: colors.textSecondary,
  },

  /* =====================================================
     NEXT TOKENS
  ===================================================== */

  nextTokenGrid: {
    flexDirection: "row",

    gap: 14,
  },

  nextTokenCard: {
    flex: 1,

    minHeight: 132,

    padding: 18,

    backgroundColor: colors.white,

    borderRadius: radius.lg,

    borderWidth: 1,

    borderColor: colors.border,
  },

  nextTokenCardFirst: {
    backgroundColor: colors.primaryLight,

    borderColor: colors.primary,
  },

  nextTokenPosition: {
    fontSize: 9,

    fontWeight: "800",

    color: colors.textLight,

    letterSpacing: 0.8,
  },

  nextTokenNumber: {
    marginTop: 10,

    fontSize: 30,

    fontWeight: "900",

    color: colors.text,
  },

  nextTokenService: {
    marginTop: 5,

    fontSize: 10,

    color: colors.textSecondary,
  },

  /* =====================================================
     SERVICE STATUS
  ===================================================== */

  serviceGrid: {
    flexDirection: "row",

    gap: 14,
  },

  serviceCard: {
    flex: 1,

    minHeight: 170,

    padding: 18,

    backgroundColor: colors.white,

    borderRadius: radius.lg,

    borderWidth: 1,

    borderColor: colors.border,
  },

  serviceHeader: {
    flexDirection: "row",

    alignItems: "center",
  },

  serviceIcon: {
    width: 40,
    height: 40,

    borderRadius: 11,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  serviceHeaderText: {
    flex: 1,
  },

  serviceName: {
    fontSize: 12,

    fontWeight: "700",

    color: colors.text,
  },

  serviceCounter: {
    marginTop: 3,

    fontSize: 10,

    color: colors.textSecondary,
  },

  serviceLiveBadge: {
    paddingHorizontal: 7,
    paddingVertical: 5,

    borderRadius: 10,

    backgroundColor: colors.successLight,

    flexDirection: "row",

    alignItems: "center",
  },

  serviceLiveDot: {
    width: 5,
    height: 5,

    borderRadius: 3,

    backgroundColor: colors.success,

    marginRight: 4,
  },

  serviceLiveText: {
    fontSize: 8,

    fontWeight: "800",

    color: colors.success,
  },

  serviceDivider: {
    height: 1,

    backgroundColor: colors.border,

    marginVertical: 15,
  },

  serviceCurrentLabel: {
    fontSize: 9,

    fontWeight: "700",

    color: colors.textLight,

    letterSpacing: 0.6,
  },

  serviceCurrentToken: {
    marginTop: 4,

    fontSize: 24,

    fontWeight: "900",

    color: colors.primary,
  },

  serviceBottom: {
    marginTop: 14,

    flexDirection: "row",
  },

  serviceMetric: {
    flex: 1,
  },

  serviceMetricLabel: {
    fontSize: 8,

    color: colors.textLight,
  },

  serviceMetricValue: {
    marginTop: 3,

    fontSize: 14,

    fontWeight: "800",

    color: colors.text,
  },

  /* =====================================================
     QUEUE TABLE
  ===================================================== */

  queueCard: {
    backgroundColor: colors.white,

    borderRadius: radius.lg,

    borderWidth: 1,

    borderColor: colors.border,

    overflow: "hidden",
  },

  tableHeader: {
    minHeight: 46,

    paddingHorizontal: 20,

    backgroundColor: colors.background,

    flexDirection: "row",

    alignItems: "center",
  },

  tableHeaderText: {
    fontSize: 9,

    fontWeight: "800",

    color: colors.textLight,

    letterSpacing: 0.7,
  },

  tokenColumn: {
    width: "15%",
  },

  serviceColumn: {
    width: "40%",
  },

  counterColumn: {
    width: "25%",
  },

  statusColumn: {
    width: "20%",
  },

  queueRow: {
    minHeight: 60,

    paddingHorizontal: 20,

    borderBottomWidth: 1,

    borderBottomColor: colors.border,

    flexDirection: "row",

    alignItems: "center",
  },

  queueRowLast: {
    borderBottomWidth: 0,
  },

  tokenText: {
    width: "15%",

    fontSize: 14,

    fontWeight: "800",

    color: colors.text,
  },

  serviceText: {
    width: "40%",

    paddingRight: 10,

    fontSize: 12,

    color: colors.textSecondary,
  },

  counterText: {
    width: "25%",

    fontSize: 11,

    color: colors.textSecondary,
  },

  statusWrapper: {
    width: "20%",

    alignItems: "flex-start",
  },

  statusBadge: {
    minWidth: 82,

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 12,

    flexDirection: "row",

    alignItems: "center",
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

    fontWeight: "700",
  },

  servingText: {
    color: colors.success,
  },

  waitingText: {
    color: colors.warning,
  },

  /* =====================================================
     FOOTER
  ===================================================== */

  footer: {
    paddingTop: 4,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",
  },

  footerBrand: {
    flexDirection: "row",

    alignItems: "center",
  },

  footerBrandText: {
    marginLeft: 5,

    fontSize: 12,

    fontWeight: "800",

    color: colors.text,
  },

  footerSeparator: {
    marginHorizontal: 9,

    fontSize: 10,

    color: colors.textLight,
  },

  footerText: {
    fontSize: 10,

    color: colors.textLight,
  },

  footerOnline: {
    marginLeft: 14,

    fontSize: 10,

    fontWeight: "700",

    color: colors.success,
  },
});