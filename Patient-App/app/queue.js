import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, fonts } from "../constants/theme";

const queueData = [
  { token: "A-021", status: "Served" },
  { token: "A-022", status: "Served" },
  { token: "A-023", status: "Served" },
  { token: "A-024", status: "Serving" },
  { token: "A-025", status: "Waiting" },
  { token: "A-026", status: "Waiting" },
  { token: "A-027", status: "You" },
  { token: "A-028", status: "Waiting" },
];

export default function Queue() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Live Queue Status</Text>

          <TouchableOpacity style={styles.menuButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={21}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Current Token Card */}
          <View style={styles.currentCard}>
            <View style={styles.currentTop}>
              <View>
                <View style={styles.currentLabelRow}>
                  <Text style={styles.currentLabel}>Current Token</Text>
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </View>
                <Text style={styles.currentToken}>A-024</Text>
              </View>

              <View style={styles.currentIcon}>
                <Ionicons name="pulse" size={32} color={colors.primary} />
              </View>
            </View>

            {/* Queue Status Cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statusScroll}
            >
              {queueData.slice(0, 6).map((item) => {
                const isServing = item.status === "Serving";
                const isServed = item.status === "Served";

                return (
                  <View
                    key={item.token}
                    style={[
                      styles.statusCard,
                      isServing && styles.activeStatusCard,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusCircle,
                        isServing && styles.activeCircle,
                        isServed && styles.servedCircle,
                      ]}
                    >
                      <Ionicons
                        name={isServing ? "radio-button-on" : "checkmark"}
                        size={13}
                        color={isServing ? colors.primary : colors.white}
                      />
                    </View>

                    <Text
                      style={[
                        styles.statusToken,
                        isServing && styles.activeStatusToken,
                      ]}
                    >
                      {item.token}
                    </Text>

                    <Text style={styles.statusName}>
                      {isServing ? "Serving" : "Served"}
                    </Text>
                  </View>
                );
              })}

              {/* Your Token */}
              <View style={styles.statusCard}>
                <View style={styles.youCircle}>
                  <Ionicons name="person" size={13} color={colors.primary} />
                </View>
                <Text style={styles.statusToken}>A-027</Text>
                <Text style={styles.statusName}>You</Text>
              </View>
            </ScrollView>

            {/* Progress */}
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>3 of 5 ahead of you</Text>
              <Text style={styles.progressPercent}>75%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>

          {/* Your Token Card */}
          <View style={styles.yourTokenCard}>
            <View style={styles.yourTokenHeader}>
              <View>
                <Text style={styles.yourTokenLabel}>Your Token</Text>
                <Text style={styles.yourTokenNumber}>A-027</Text>
              </View>

              <View style={styles.inQueueBadge}>
                <View style={styles.inQueueDot} />
                <Text style={styles.inQueueText}>IN QUEUE</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Waiting Time</Text>
                <Text style={styles.statValue}>~18</Text>
                <Text style={styles.statUnit}>Minutes</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Your Position</Text>
                <Text style={styles.statValue}>4</Text>
                <Text style={styles.statUnit}>in queue</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Est. Call Time</Text>
                <Text style={styles.callValue}>3:30 PM</Text>
                <Text style={styles.statUnit}>Today</Text>
              </View>
            </View>

            {/* Queue Timeline */}
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineCircleActive}>
                  <Ionicons name="people" size={17} color={colors.white} />
                </View>
                <Text style={styles.timelineTitleActive}>Waiting</Text>
                <Text style={styles.timelineSubtitle}>Hang tight</Text>
              </View>

              <View style={styles.timelineLineActive} />

              <View style={styles.timelineItem}>
                <View style={styles.timelineCircleMiddle}>
                  <Ionicons name="walk" size={17} color={colors.primary} />
                </View>
                <Text style={styles.timelineTitle}>Almost There</Text>
                <Text style={styles.timelineSubtitle}>You're next</Text>
              </View>

              <View style={styles.timelineLine} />

              <View style={styles.timelineItem}>
                <View style={styles.timelineCircle}>
                  <Ionicons
                    name="person-outline"
                    size={17}
                    color={colors.timelineInactive}
                  />
                </View>
                <Text style={styles.timelineTitle}>Your Turn</Text>
                <Text style={styles.timelineSubtitle}>See the doctor</Text>
              </View>
            </View>
          </View>

          {/* Queue Reminder */}
          <View style={styles.reminderCard}>
            <View style={styles.reminderIcon}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <View style={styles.reminderTextContainer}>
              <Text style={styles.reminderTitle}>Queue Reminder</Text>
              <Text style={styles.reminderText}>
                Please stay nearby. Your queue status will update
                automatically.
              </Text>
            </View>
          </View>

          {/* Live Queue List */}
          <View style={styles.queueSectionHeader}>
            <Text style={styles.queueSectionTitle}>Queue Status</Text>
            <Text style={styles.queueCount}>8 Tokens</Text>
          </View>

          <View style={styles.queueList}>
            {queueData.map((item) => {
              const isServing = item.status === "Serving";
              const isYou = item.status === "You";

              return (
                <View
                  key={item.token}
                  style={[
                    styles.queueRow,
                    isServing && styles.queueServingRow,
                    isYou && styles.queueYouRow,
                  ]}
                >
                  <View
                    style={[
                      styles.queueNumber,
                      isServing && styles.queueNumberActive,
                      isYou && styles.queueNumberYou,
                    ]}
                  >
                    {isServing ? (
                      <Ionicons name="play" size={11} color={colors.white} />
                    ) : (
                      <Text
                        style={[
                          styles.queueNumberText,
                          isYou && styles.queueNumberTextYou,
                        ]}
                      >
                        {item.token.replace("A-", "")}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.queueToken,
                      isServing && styles.queueTokenActive,
                      isYou && styles.queueTokenYou,
                    ]}
                  >
                    {item.token}
                  </Text>

                  <View style={styles.flexSpace} />

                  <Text
                    style={[
                      styles.queueStatus,
                      isServing && styles.queueServingText,
                      isYou && styles.queueYouText,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={{ height: 35 }} />
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.softBg,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 19,
    marginLeft: 14,
    fontFamily: fonts.bold,
  },

  menuButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },

  currentCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  currentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  currentLabelRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  currentLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.medium,
  },

  liveBadge: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successLight,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 5,
  },

  liveText: {
    color: colors.successDark,
    fontSize: 7,
    fontFamily: fonts.bold,
  },

  currentToken: {
    color: colors.primary,
    fontSize: 30,
    marginTop: 2,
    fontFamily: fonts.bold,
  },

  currentIcon: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  statusScroll: {
    paddingTop: 18,
    paddingBottom: 5,
    paddingRight: 8,
  },

  statusCard: {
    width: 74,
    height: 92,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.statusCardBg,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  activeStatusCard: {
    backgroundColor: colors.selectedCardBg,
    borderColor: colors.primary,
    borderBottomWidth: 4,
  },

  statusCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.progressInactiveBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  servedCircle: {
    backgroundColor: colors.success,
  },

  activeCircle: {
    backgroundColor: colors.activeCircleBg,
  },

  youCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.activeCircleBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  statusToken: {
    color: colors.textDark,
    fontSize: 11,
    fontFamily: fonts.bold,
  },

  activeStatusToken: {
    color: colors.primary,
  },

  statusName: {
    color: colors.textMuted,
    fontSize: 8,
    marginTop: 3,
    fontFamily: fonts.regular,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 7,
  },

  progressText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontFamily: fonts.medium,
  },

  progressPercent: {
    color: colors.textSecondary,
    fontSize: 10,
    fontFamily: fonts.semiBold,
  },

  progressTrack: {
    height: 7,
    backgroundColor: colors.divider,
    borderRadius: 5,
    overflow: "hidden",
  },

  progressFill: {
    width: "75%",
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 5,
  },

  yourTokenCard: {
    marginTop: 14,
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },

  yourTokenHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  yourTokenLabel: {
    color: colors.primarySoftText,
    fontSize: 10,
    fontFamily: fonts.medium,
  },

  yourTokenNumber: {
    color: colors.white,
    fontSize: 28,
    marginTop: 1,
    fontFamily: fonts.bold,
  },

  inQueueBadge: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  inQueueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 5,
  },

  inQueueText: {
    color: colors.white,
    fontSize: 7,
    fontFamily: fonts.bold,
  },

  statsRow: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    textAlign: "center",
    fontFamily: fonts.regular,
  },

  statValue: {
    color: colors.primary,
    fontSize: 20,
    marginTop: 4,
    fontFamily: fonts.bold,
  },

  callValue: {
    color: colors.primary,
    fontSize: 17,
    marginTop: 7,
    fontFamily: fonts.bold,
  },

  statUnit: {
    color: colors.textMuted,
    fontSize: 8,
    marginTop: 2,
    fontFamily: fonts.regular,
  },

  statDivider: {
    width: 1,
    backgroundColor: colors.divider,
    marginVertical: 3,
  },

  timeline: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  timelineItem: {
    width: 82,
    alignItems: "center",
  },

  timelineCircleActive: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  timelineCircleMiddle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  timelineCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.softBg,
    alignItems: "center",
    justifyContent: "center",
  },

  timelineLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 19,
  },

  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.progressLine,
    marginTop: 19,
  },

  timelineTitleActive: {
    color: colors.primary,
    fontSize: 9,
    marginTop: 7,
    fontFamily: fonts.bold,
  },

  timelineTitle: {
    color: colors.textDark,
    fontSize: 9,
    marginTop: 7,
    fontFamily: fonts.bold,
  },

  timelineSubtitle: {
    color: colors.textMuted,
    fontSize: 8,
    marginTop: 3,
    textAlign: "center",
    fontFamily: fonts.regular,
  },

  reminderCard: {
    marginTop: 14,
    backgroundColor: colors.previewBg,
    borderRadius: 15,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  reminderIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.previewIconBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  reminderTextContainer: {
    flex: 1,
  },

  reminderTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontFamily: fonts.bold,
  },

  reminderText: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
    fontFamily: fonts.regular,
  },

  queueSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 10,
  },

  queueSectionTitle: {
    color: colors.textDark,
    fontSize: 17,
    fontFamily: fonts.bold,
  },

  queueCount: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: fonts.regular,
  },

  queueList: {
    gap: 8,
  },

  queueRow: {
    minHeight: 55,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  queueServingRow: {
    backgroundColor: colors.selectedCardBg,
    borderColor: colors.primary,
  },

  queueYouRow: {
    backgroundColor: colors.selectedCardBg,
    borderColor: colors.primaryLightBorder,
  },

  queueNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.softBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  queueNumberActive: {
    backgroundColor: colors.primary,
  },

  queueNumberYou: {
    backgroundColor: colors.activeCircleBg,
  },

  queueNumberText: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: fonts.bold,
  },

  queueNumberTextYou: {
    color: colors.primary,
  },

  queueToken: {
    color: colors.textDark,
    fontSize: 13,
    fontFamily: fonts.bold,
  },

  queueTokenActive: {
    color: colors.primary,
  },

  queueTokenYou: {
    color: colors.primary,
  },

  flexSpace: {
    flex: 1,
  },

  queueStatus: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: fonts.medium,
  },

  queueServingText: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },

  queueYouText: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
});