import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import BottomNav from "../components/BottomNav";
import { colors, fonts } from "../constants/theme";

export default function MyToken() {
  const params = useLocalSearchParams();

  const token = params.token || "A-027";
  const service = params.service || "General Consultation";
  const wait = params.wait || "18 min";

  const [cancelled, setCancelled] = React.useState(false);

  const handleCancelToken = () => {
    Alert.alert(
      "Cancel Token",
      `Are you sure you want to cancel token ${token}?`,
      [
        {
          text: "Keep Token",
          style: "cancel",
        },
        {
          text: "Cancel Token",
          style: "destructive",
          onPress: () => {
            setCancelled(true);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>My Token</Text>
            <Text style={styles.headerSubtitle}>
              {cancelled
                ? "Token has been cancelled"
                : "Your active queue token"}
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Status */}
          <View
            style={[
              styles.statusRow,
              cancelled && styles.cancelledStatusRow,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                cancelled && styles.cancelledDot,
              ]}
            />
            <Text
              style={[
                styles.statusText,
                cancelled && styles.cancelledStatusText,
              ]}
            >
              {cancelled ? "CANCELLED" : "WAITING"}
            </Text>
          </View>

          {/* Token Card */}
          <View
            style={[
              styles.tokenCard,
              cancelled && styles.cancelledTokenCard,
            ]}
          >
            <View style={styles.tokenTopRow}>
              <View>
                <Text style={styles.tokenLabel}>YOUR TOKEN</Text>
                <Text
                  style={[
                    styles.tokenNumber,
                    cancelled && styles.cancelledTokenNumber,
                  ]}
                >
                  {token}
                </Text>
              </View>

              <View
                style={[
                  styles.tokenIcon,
                  cancelled && styles.cancelledTokenIcon,
                ]}
              >
                <Ionicons
                  name="ticket-outline"
                  size={25}
                  color={cancelled ? colors.cancelledIcon : colors.primary}
                />
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.serviceLabel}>SERVICE</Text>
            <Text style={styles.serviceName}>{service}</Text>
          </View>

          {!cancelled ? (
            <>
              {/* Queue Status */}
              <Text style={styles.sectionTitle}>Queue Status</Text>

              <View style={styles.queueCard}>
                {/* Position */}
                <View style={styles.queueItem}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name="people-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View>
                    <Text style={styles.queueLabel}>YOUR POSITION</Text>
                    <Text style={styles.queueValue}>#06</Text>
                  </View>
                </View>

                <View style={styles.verticalDivider} />

                {/* Wait */}
                <View style={styles.queueItem}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View>
                    <Text style={styles.queueLabel}>EST. WAIT</Text>
                    <Text style={styles.queueValue}>{wait}</Text>
                  </View>
                </View>
              </View>

              {/* Currently Serving */}
              <View style={styles.servingCard}>
                <View style={styles.servingIcon}>
                  <Ionicons
                    name="pulse-outline"
                    size={21}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.servingInfo}>
                  <Text style={styles.servingLabel}>CURRENTLY SERVING</Text>
                  <Text style={styles.servingToken}>A-021</Text>
                </View>

                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>

              {/* Message */}
              <View style={styles.messageCard}>
                <View style={styles.messageIcon}>
                  <Ionicons
                    name="notifications-outline"
                    size={18}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.messageText}>
                  Please stay nearby. Your queue position updates
                  automatically.
                </Text>
              </View>

              {/* Actions */}
              <TouchableOpacity
                style={styles.queueButton}
                activeOpacity={0.85}
                onPress={() => router.push("/queue")}
              >
                <Text style={styles.queueButtonText}>View Live Queue</Text>
                <View style={styles.queueButtonIcon}>
                  <Ionicons
                    name="arrow-forward"
                    size={17}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={handleCancelToken}
              >
                <Text style={styles.cancelText}>Cancel Token</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Cancelled Message */}
              <View style={styles.cancelledMessageCard}>
                <View style={styles.cancelledIcon}>
                  <Ionicons
                    name="close-circle-outline"
                    size={29}
                    color={colors.danger}
                  />
                </View>

                <Text style={styles.cancelledTitle}>Token Cancelled</Text>
                <Text style={styles.cancelledMessage}>
                  Your token has been cancelled successfully. You can get a
                  new digital token whenever you need one.
                </Text>
              </View>

              {/* New Token */}
              <TouchableOpacity
                style={styles.newTokenButton}
                activeOpacity={0.85}
                onPress={() => router.push("/get-token")}
              >
                <Ionicons
                  name="ticket-outline"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.newTokenButtonText}>Get New Token</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Space for Bottom Navigation */}
          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Permanent Bottom Navigation */}
        <BottomNav />

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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  headerInfo: {
    flex: 1,
  },

  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontFamily: fonts.bold,
  },

  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
    fontFamily: fonts.regular,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 20,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.statusBorder,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  cancelledStatusRow: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.dangerBorder,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 7,
  },

  cancelledDot: {
    backgroundColor: colors.danger,
  },

  statusText: {
    color: colors.primary,
    fontSize: 10,
    letterSpacing: 1,
    fontFamily: fonts.bold,
  },

  cancelledStatusText: {
    color: colors.danger,
  },

  tokenCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: 16,
    padding: 22,
  },

  cancelledTokenCard: {
    borderColor: colors.dangerBorder,
  },

  tokenTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tokenLabel: {
    color: colors.primary,
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: fonts.bold,
  },

  tokenNumber: {
    color: colors.textPrimary,
    fontSize: 56,
    letterSpacing: 2,
    marginTop: 3,
    fontFamily: fonts.bold,
  },

  cancelledTokenNumber: {
    color: colors.cancelledText,
  },

  tokenIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelledTokenIcon: {
    backgroundColor: colors.cancelledBg,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 17,
  },

  serviceLabel: {
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: fonts.bold,
  },

  serviceName: {
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: 5,
    fontFamily: fonts.bold,
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    marginTop: 24,
    marginBottom: 12,
    fontFamily: fonts.bold,
  },

  queueCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  queueItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  queueLabel: {
    color: colors.textMuted,
    fontSize: 8,
    letterSpacing: 0.7,
    fontFamily: fonts.bold,
  },

  queueValue: {
    color: colors.textPrimary,
    fontSize: 18,
    marginTop: 3,
    fontFamily: fonts.bold,
  },

  verticalDivider: {
    width: 1,
    height: 42,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },

  servingCard: {
    marginTop: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 17,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  servingIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  servingInfo: {
    flex: 1,
  },

  servingLabel: {
    color: colors.textMuted,
    fontSize: 8,
    letterSpacing: 0.8,
    fontFamily: fonts.bold,
  },

  servingToken: {
    color: colors.textPrimary,
    fontSize: 17,
    marginTop: 3,
    fontFamily: fonts.bold,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 5,
  },

  liveText: {
    color: colors.primary,
    fontSize: 8,
    fontFamily: fonts.bold,
  },

  messageCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 15,
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    flexDirection: "row",
    alignItems: "center",
  },

  messageIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  messageText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 9,
    fontFamily: fonts.regular,
  },

  queueButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  queueButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.bold,
  },

  queueButtonIcon: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  cancelButton: {
    alignItems: "center",
    paddingTop: 12,
  },

  cancelText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },

  cancelledMessageCard: {
    marginTop: 25,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },

  cancelledIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.dangerLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  cancelledTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: fonts.bold,
  },

  cancelledMessage: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 9,
    fontFamily: fonts.regular,
  },

  newTokenButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    gap: 9,
  },

  newTokenButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});