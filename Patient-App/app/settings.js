import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import BottomNav from "../components/BottomNav";
import { colors, fonts } from "../constants/theme";

function SettingRow({ icon, title, subtitle, onPress, right }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      {right || (
        <Ionicons
          name="chevron-forward"
          size={17}
          color={colors.textMuted}
        />
      )}
    </Pressable>
  );
}

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>
              App preferences & information
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.primary}
            />
          </View>
        </View>

        {/* USER CARD */}
        <Pressable
          style={styles.userCard}
          onPress={() => router.push("/profile-settings")}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={colors.primary} />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>Patient User</Text>
            <Text style={styles.userType}>Patient Account</Text>

            <View style={styles.digitalBadge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>DIGITAL QUEUE</Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color={colors.primary}
          />
        </Pressable>

        {/* PREFERENCES */}
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.sectionCard}>
          <SettingRow
            icon="notifications-outline"
            title="Notifications"
            subtitle={
              notificationsEnabled
                ? "Queue updates enabled"
                : "Queue updates disabled"
            }
            onPress={() => setNotificationsEnabled((prev) => !prev)}
            right={
              <Pressable
                onPress={() => setNotificationsEnabled((prev) => !prev)}
                style={[
                  styles.switchTrack,
                  notificationsEnabled
                    ? styles.switchTrackOn
                    : styles.switchTrackOff,
                ]}
              >
                <View
                  style={[
                    styles.switchKnob,
                    notificationsEnabled
                      ? styles.switchKnobOn
                      : styles.switchKnobOff,
                  ]}
                />
              </Pressable>
            }
          />
        </View>

        {/* APP INFORMATION */}
        <Text style={styles.sectionTitle}>App Information</Text>

        <View style={styles.sectionCard}>
          <SettingRow
            icon="information-circle-outline"
            title="About OptiQueue"
            subtitle="Smart hospital queue management"
            onPress={() => router.push("/about")}
          />

          <View style={styles.rowDivider} />

          <SettingRow
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            subtitle="Your queue information is protected"
            onPress={() => router.push("/privacy")}
          />

          <View style={styles.rowDivider} />

          <SettingRow
            icon="code-slash-outline"
            title="Version"
            subtitle="OptiQueue mobile application"
            right={
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>v1.0.0</Text>
              </View>
            }
          />
        </View>

        {/* SUPPORT */}
        <Text style={styles.sectionTitle}>Support</Text>

        <View style={styles.sectionCard}>
          <SettingRow
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Need help using OptiQueue?"
            onPress={() => router.push("/help")}
          />
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 18,
    paddingBottom: 95,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  userCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  userInfo: {
    flex: 1,
    marginLeft: 12,
  },

  userName: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  userType: {
    marginTop: 3,
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  digitalBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    flexDirection: "row",
    alignItems: "center",
  },

  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 4,
  },

  badgeText: {
    fontSize: 7,
    color: colors.primary,
    fontFamily: fonts.bold,
  },

  sectionTitle: {
    marginBottom: 9,
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 20,
  },

  row: {
    minHeight: 68,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  rowIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  rowText: {
    flex: 1,
    marginLeft: 10,
  },

  rowTitle: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
  },

  rowSubtitle: {
    marginTop: 3,
    fontSize: 9,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 62,
  },

  switchTrack: {
    width: 42,
    height: 24,
    borderRadius: 13,
    padding: 3,
    justifyContent: "center",
  },

  switchTrackOn: {
    backgroundColor: colors.primary,
    alignItems: "flex-end",
  },

  switchTrackOff: {
    backgroundColor: colors.switchTrackOff,
    alignItems: "flex-start",
  },

  switchKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.white,
  },

  switchKnobOn: {},

  switchKnobOff: {},

  versionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: colors.primaryLight,
  },

  versionText: {
    fontSize: 8,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
};