
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import BottomNav from "../components/BottomNav";

import { colors, fonts } from "../constants/theme";

import {
  getAuthToken,
  getAuthUser,
  clearAuthSession,
} from "../constants/auth";

import {
  API_BASE_URL,
  API_ENDPOINTS,
} from "../constants/api";

// ========================================
// Settings Row Component
// ========================================

function SettingRow({ icon, title, subtitle, onPress, right }) {
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      disabled={!onPress && !right}
    >
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

// ========================================
// Settings Screen
// ========================================

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // ========================================
  // Load Logged-in User Information
  // ========================================

  useEffect(() => {
    loadUserInformation();
  }, []);

  const loadUserInformation = async () => {
    try {
      const token = await getAuthToken();
      const savedUser = await getAuthUser();

      if (token && savedUser && savedUser.role === "patient") {
        setUser(savedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("Settings User Loading Error:", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Logout Confirmation
  // ========================================

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout from your OptiQueue account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: confirmLogout,
        },
      ]
    );
  };

  // ========================================
  // Secure Logout
  // ========================================

  const confirmLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    let serverLogoutSuccessful = false;

    try {
      // Get current authentication token
      const token = await getAuthToken();

      // Revoke JWT session from backend
      if (token) {
        try {
          // ========================================
          // DEBUG LOGS (Temporarily Disabled)
          // ========================================

          // Debug 1: Show only token prefix, never the full JWT.
          // Enable when needed for logout debugging.
          // console.log(
          //   "LOGOUT REQUEST TOKEN PREFIX:",
          //   token.substring(0, 8)
          // );

          // Debug 2: Show logout API URL.
          // console.log(
          //   "LOGOUT API URL:",
          //   `${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`
          // );

          const response = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          const result = await response.json();

          // Debug 3: Show backend response.
          // console.log(
          //   "LOGOUT API RESPONSE:",
          //   response.status,
          //   result
          // );

          // Successful server-side logout
          if (response.ok && result.success) {
            serverLogoutSuccessful = true;

            // Debug 4: Backend logout confirmation.
            // console.log("Backend session revoked successfully.");
          }

          // A previously revoked or expired session
          // does not need another successful revocation.
          if (
            response.status === 401 &&
            result.message
          ) {
            serverLogoutSuccessful = true;

            // Debug: Session already invalid.
            // console.log("Session is already invalid.");
          }

          if (!response.ok && response.status !== 401) {
            console.log(
              "Backend Logout Error:",
              result.message || "Server logout failed."
            );
          }
        } catch (networkError) {
          console.log(
            "Backend Logout Network Error:",
            networkError.message
          );
        }
      } else {
        console.log("LOGOUT ERROR: No authentication token found.");
      }

      // Always clear local session
      const cleared = await clearAuthSession();

      if (!cleared) {
        throw new Error("Unable to clear local login session.");
      }

      // Debug 5: Local session cleared confirmation.
      // console.log("Local authentication session cleared.");

      setUser(null);

      // Navigate to Login Screen
      router.replace("/login");

      // Inform user if backend could not be reached
      if (!serverLogoutSuccessful && token) {
        setTimeout(() => {
          Alert.alert(
            "Logged Out",
            "Your device session has been cleared, but the server could not confirm session revocation. Please connect to the internet."
          );
        }, 300);
      }

    } catch (error) {
      console.log("Logout Error:", error.message);

      Alert.alert(
        "Logout Failed",
        "Unable to clear your login session. Please try again."
      );

    } finally {
      setLoggingOut(false);
    }
  };

  // ========================================
  // Loading Screen
  // ========================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  // ========================================
  // Main Settings Screen
  // ========================================

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
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.replace("/")
            }
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              Settings
            </Text>

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
            <Ionicons
              name="person"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.name || "Patient User"}
            </Text>

            <Text style={styles.userType}>
              {user?.email || "Patient Account"}
            </Text>

            <View style={styles.digitalBadge}>
              <View style={styles.badgeDot} />

              <Text style={styles.badgeText}>
                DIGITAL QUEUE
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color={colors.primary}
          />
        </Pressable>

        {/* PREFERENCES */}

        <Text style={styles.sectionTitle}>
          Preferences
        </Text>

        <View style={styles.sectionCard}>
          <SettingRow
            icon="notifications-outline"
            title="Notifications"
            subtitle={
              notificationsEnabled
                ? "Queue updates enabled"
                : "Queue updates disabled"
            }
            onPress={() =>
              setNotificationsEnabled((prev) => !prev)
            }
            right={
              <Pressable
                onPress={() =>
                  setNotificationsEnabled((prev) => !prev)
                }
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

        <Text style={styles.sectionTitle}>
          App Information
        </Text>

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
                <Text style={styles.versionText}>
                  v1.0.0
                </Text>
              </View>
            }
          />
        </View>

        {/* SUPPORT */}

        <Text style={styles.sectionTitle}>
          Support
        </Text>

        <View style={styles.sectionCard}>
          <SettingRow
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Need help using OptiQueue?"
            onPress={() => router.push("/help")}
          />
        </View>

        {/* ACCOUNT */}

        {user && (
          <>
            <Text style={styles.sectionTitle}>
              Account
            </Text>

            <View style={styles.sectionCard}>
              <Pressable
                style={styles.logoutRow}
                onPress={handleLogout}
                disabled={loggingOut}
              >
                <View style={styles.logoutIcon}>
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={colors.danger}
                  />
                </View>

                <View style={styles.rowText}>
                  <Text style={styles.logoutTitle}>
                    Logout
                  </Text>

                  <Text style={styles.rowSubtitle}>
                    Sign out from your account
                  </Text>
                </View>

                {loggingOut ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.danger}
                  />
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={colors.danger}
                  />
                )}
              </Pressable>
            </View>
          </>
        )}

        <Text style={styles.footerText}>
          OptiQueue v1.0.0
        </Text>

      </ScrollView>

      <BottomNav />
    </View>
  );
}

// ========================================
// Styles
// ========================================

const styles = {

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
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

  // Logout section

  logoutRow: {
    minHeight: 68,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  logoutIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: colors.dangerLight,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutTitle: {
    fontSize: 12,
    color: colors.danger,
    fontFamily: fonts.bold,
  },

  footerText: {
    textAlign: "center",
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 2,
    marginBottom: 15,
  },

};
