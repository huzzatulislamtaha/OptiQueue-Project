
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { colors, fonts } from "../constants/theme";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { getAuthToken } from "../constants/auth";

export default function Queue() {
  const params = useLocalSearchParams();

  const paramToken = Array.isArray(params.token)
    ? params.token[0]
    : params.token;

  const paramServiceId = Array.isArray(params.serviceId)
    ? params.serviceId[0]
    : params.serviceId;

  const [myTokens, setMyTokens] = React.useState([]);
  const [queues, setQueues] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState("");

  // Fetch My Tokens and Live Queue
  const fetchQueueData = React.useCallback(async (manualRefresh = false) => {
    try {
      if (manualRefresh) setRefreshing(true);

      const authToken = await getAuthToken();

      if (!authToken) {
        throw new Error("Please login again.");
      }

      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };

      const [myResponse, queueResponse] = await Promise.all([
        fetch(`${API_BASE_URL}${API_ENDPOINTS.MY_TOKENS}`, {
          method: "GET",
          headers,
        }),
        fetch(`${API_BASE_URL}${API_ENDPOINTS.LIVE_QUEUE}`, {
          method: "GET",
          headers,
        }),
      ]);

      const myData = await myResponse.json();
      const queueData = await queueResponse.json();

      console.log("QUEUE MY TOKENS:", myData);
      console.log("QUEUE LIVE DATA:", queueData);

      if (!myResponse.ok || !myData.success) {
        throw new Error(myData.message || "Unable to load your tokens.");
      }

      if (!queueResponse.ok || !queueData.success) {
        throw new Error(queueData.message || "Unable to load live queue.");
      }

      setMyTokens(Array.isArray(myData.tokens) ? myData.tokens : []);
      setQueues(Array.isArray(queueData.queues) ? queueData.queues : []);
      setError("");
    } catch (err) {
      console.log("LIVE QUEUE ERROR:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial Load and Auto Refresh
  React.useEffect(() => {
    fetchQueueData();

    const interval = setInterval(() => {
      fetchQueueData();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchQueueData]);

  // Select Patient's Token
  const selectedToken = React.useMemo(() => {
    if (!myTokens.length) return null;

    if (paramToken) {
      const matched = myTokens.find(
        (item) => item.token_number === paramToken
      );
      if (matched) return matched;
    }

    if (paramServiceId) {
      const matched = myTokens.find(
        (item) => String(item.service_id) === String(paramServiceId)
      );
      if (matched) return matched;
    }

    // Latest token first
    return myTokens[0];
  }, [myTokens, paramToken, paramServiceId]);

  // Find Queue for Patient's Service
  const currentQueue = queues.find(
    (item) =>
      String(item.serviceId) === String(selectedToken?.service_id)
  );

  const waitingList = currentQueue?.waiting || [];
  const nowServing = currentQueue?.nowServing || null;

  // Serving Token Number
  const servingToken =
    typeof nowServing === "string"
      ? nowServing
      : nowServing?.token ||
        nowServing?.token_number ||
        null;

  // Patient's Token
  const myTokenNumber = selectedToken?.token_number || null;

  const myTokenStatus = selectedToken?.status || "waiting";

  // Find Patient in Waiting List
  const myQueueItem = waitingList.find(
    (item) =>
      String(item.id) === String(selectedToken?.id) ||
      item.token === myTokenNumber
  );

  const myPosition =
    myQueueItem?.queuePosition ??
    selectedToken?.queue_position ??
    null;

  // Build Actual Queue List
  const queueData = React.useMemo(() => {
    const items = [];

    // Currently serving token
    if (servingToken) {
      items.push({
        token: servingToken,
        status: "Serving",
        id: nowServing?.id || "serving",
      });
    }

    // Waiting tokens from backend
    waitingList.forEach((item) => {
      items.push({
        id: item.id,
        token: item.token,
        status:
          item.token === myTokenNumber ? "You" : "Waiting",
        queuePosition: item.queuePosition,
      });
    });

    return items;
  }, [servingToken, waitingList, myTokenNumber, nowServing]);

  // Number of people ahead of patient
  const peopleAhead =
    myPosition !== null ? Math.max(Number(myPosition) - 1, 0) : null;

  const totalWaiting = waitingList.length;

  // Progress based on actual queue position
  const progressPercent =
    myPosition && totalWaiting
      ? Math.min(
          Math.max(
            ((totalWaiting - Number(myPosition) + 1) /
              totalWaiting) *
              100,
            0
          ),
          100
        )
      : 0;

  const serviceName =
    currentQueue?.service ||
    selectedToken?.services?.name ||
    "Live Queue";

  // Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading live queue...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/")
            }
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Live Queue Status</Text>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => fetchQueueData(true)}
            disabled={refreshing}
          >
            <Ionicons
              name="refresh-outline"
              size={21}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >

          {/* Error Message */}
          {error !== "" && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => fetchQueueData(true)}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Current Token Card */}
          <View style={styles.currentCard}>
            <View style={styles.currentTop}>
              <View>
                <View style={styles.currentLabelRow}>
                  <Text style={styles.currentLabel}>Currently Serving</Text>

                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </View>

                <Text style={styles.currentToken}>
                  {servingToken || "—"}
                </Text>

                <Text style={styles.serviceSubtitle}>
                  {serviceName}
                </Text>
              </View>

              <View style={styles.currentIcon}>
                <Ionicons
                  name="pulse"
                  size={32}
                  color={colors.primary}
                />
              </View>
            </View>

            {/* Dynamic Queue Status Cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statusScroll}
            >
              {queueData.slice(0, 8).map((item) => {
                const isServing = item.status === "Serving";
                const isYou = item.status === "You";

                return (
                  <View
                    key={String(item.id)}
                    style={[
                      styles.statusCard,
                      isServing && styles.activeStatusCard,
                      isYou && styles.youStatusCard,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusCircle,
                        isServing && styles.activeCircle,
                        isYou && styles.youCircle,
                      ]}
                    >
                      <Ionicons
                        name={
                          isServing
                            ? "radio-button-on"
                            : isYou
                              ? "person"
                              : "time-outline"
                        }
                        size={13}
                        color={
                          isServing ? colors.white : colors.primary
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.statusToken,
                        isServing && styles.activeStatusToken,
                        isYou && styles.activeStatusToken,
                      ]}
                    >
                      {item.token}
                    </Text>

                    <Text style={styles.statusName}>
                      {item.status}
                    </Text>
                  </View>
                );
              })}

              {queueData.length === 0 && (
                <Text style={styles.emptyText}>
                  No queue tokens available.
                </Text>
              )}
            </ScrollView>

            {/* Progress */}
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                {peopleAhead !== null
                  ? `${peopleAhead} people ahead of you`
                  : "Your queue position is unavailable"}
              </Text>

              <Text style={styles.progressPercent}>
                {Math.round(progressPercent)}%
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>

          {/* Your Token Card */}
          <View style={styles.yourTokenCard}>
            <View style={styles.yourTokenHeader}>
              <View>
                <Text style={styles.yourTokenLabel}>Your Token</Text>
                <Text style={styles.yourTokenNumber}>
                  {myTokenNumber || "—"}
                </Text>
              </View>

              <View style={styles.inQueueBadge}>
                <View style={styles.inQueueDot} />
                <Text style={styles.inQueueText}>
                  {String(myTokenStatus).toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Waiting Tokens</Text>
                <Text style={styles.statValue}>{totalWaiting}</Text>
                <Text style={styles.statUnit}>in queue</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Your Position</Text>
                <Text style={styles.statValue}>
                  {myPosition ?? "—"}
                </Text>
                <Text style={styles.statUnit}>in queue</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>People Ahead</Text>
                <Text style={styles.callValue}>
                  {peopleAhead ?? "—"}
                </Text>
                <Text style={styles.statUnit}>before you</Text>
              </View>
            </View>

            {/* Queue Timeline */}
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineCircleActive}>
                  <Ionicons
                    name="people"
                    size={17}
                    color={colors.white}
                  />
                </View>
                <Text style={styles.timelineTitleActive}>
                  Waiting
                </Text>
                <Text style={styles.timelineSubtitle}>
                  {myTokenStatus === "waiting" ? "In queue" : "Queue"}
                </Text>
              </View>

              <View style={styles.timelineLineActive} />

              <View style={styles.timelineItem}>
                <View style={styles.timelineCircleMiddle}>
                  <Ionicons
                    name="walk"
                    size={17}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.timelineTitle}>
                  Almost There
                </Text>
                <Text style={styles.timelineSubtitle}>
                  {peopleAhead === 0 ? "You're next" : "Please wait"}
                </Text>
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
                <Text style={styles.timelineTitle}>
                  Your Turn
                </Text>
                <Text style={styles.timelineSubtitle}>
                  See the doctor
                </Text>
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
              <Text style={styles.reminderTitle}>
                Queue Reminder
              </Text>
              <Text style={styles.reminderText}>
                Please stay nearby. Your queue status updates automatically.
              </Text>
            </View>
          </View>

          {/* Live Queue List */}
          <View style={styles.queueSectionHeader}>
            <Text style={styles.queueSectionTitle}>Queue Status</Text>
            <Text style={styles.queueCount}>
              {queueData.length} Tokens
            </Text>
          </View>

          <View style={styles.queueList}>
            {queueData.map((item) => {
              const isServing = item.status === "Serving";
              const isYou = item.status === "You";

              return (
                <View
                  key={String(item.id)}
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
                      <Ionicons
                        name="play"
                        size={11}
                        color={colors.white}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.queueNumberText,
                          isYou && styles.queueNumberTextYou,
                        ]}
                      >
                        {item.token.split("-")[1] || ""}
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

            {queueData.length === 0 && (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No tokens in this queue yet.
                </Text>
              </View>
            )}
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

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 12,
    fontFamily: fonts.regular,
  },

  errorCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontFamily: fonts.regular,
  },

  retryText: {
    color: colors.primary,
    fontSize: 12,
    marginTop: 8,
    fontFamily: fonts.bold,
  },

  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },

  emptyText: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: fonts.regular,
  },

  serviceSubtitle: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
    fontFamily: fonts.regular,
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

  youStatusCard: {
    backgroundColor: colors.selectedCardBg,
    borderColor: colors.primaryLightBorder,
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
    backgroundColor: colors.primary,
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
