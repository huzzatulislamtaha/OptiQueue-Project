
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, fonts } from "../constants/theme";

import { API_BASE_URL } from "../constants/api";
import {
  getAuthToken,
  getAuthUser,
  saveAuthSession,
} from "../constants/auth";

export default function ProfileSettings() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load profile information from backend
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await getAuthToken();

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login to view your profile."
        );
        router.replace("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load profile.");
      }

      const user = result.user;

      setName(user.name || "");
      setMobile(user.mobile_number || "");
      setEmail(user.email || "");

    } catch (error) {
      Alert.alert(
        "Profile Error",
        error.message || "Unable to load profile information."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update profile information in backend
  const saveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(
        "Missing Information",
        "Name and email are required."
      );
      return;
    }

    try {
      setSaving(true);
      setSaved(false);

      const token = await getAuthToken();

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login again."
        );
        router.replace("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          mobile_number: mobile.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Profile update failed."
        );
      }

      // Update locally stored user information
      const oldUser = await getAuthUser();

      const updatedUser = {
        ...(oldUser || {}),
        ...result.user,
      };

      await saveAuthSession(token, updatedUser);

      // Update input fields with saved backend data
      setName(result.user.name || "");
      setEmail(result.user.email || "");
      setMobile(result.user.mobile_number || "");

      // Show success message on screen
      setSaved(true);

    } catch (error) {
      Alert.alert(
        "Update Failed",
        error.message || "Unable to update profile."
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/")
            }
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>

          <View>
            <Text style={styles.title}>Profile Settings</Text>
            <Text style={styles.subtitle}>
              Manage your account details
            </Text>
          </View>
        </View>

        {/* Account Information */}
        <View style={styles.accountCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={25}
              color={colors.primary}
            />
          </View>

          <Text style={styles.accountName}>
            {name || "Patient User"}
          </Text>

          <Text style={styles.accountType}>
            Patient Account
          </Text>
        </View>

        {loading ? (
          <View style={{ padding: 30, alignItems: "center" }}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />

            <Text
              style={{
                marginTop: 10,
                color: colors.textSecondary,
              }}
            >
              Loading profile...
            </Text>
          </View>
        ) : (
          <>
            {/* Profile Update Success Message */}
            {saved && (
              <View style={styles.successMessage}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color="#16834B"
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.successTitle}>
                    Profile Updated Successfully!
                  </Text>

                  <Text style={styles.successSubtitle}>
                    Your profile information has been saved.
                  </Text>
                </View>
              </View>
            )}

            {/* Profile Form */}
            <View style={styles.formCard}>
              <Text style={styles.label}>Full Name</Text>

              <View style={styles.inputBox}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={colors.textMuted}
                />

                <TextInput
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    setSaved(false);
                  }}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                />
              </View>

              <Text style={styles.label}>Mobile Number</Text>

              <View style={styles.inputBox}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={colors.textMuted}
                />

                <TextInput
                  value={mobile}
                  onChangeText={(value) => {
                    setMobile(value);
                    setSaved(false);
                  }}
                  placeholder="01XXXXXXXXX"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>

              <Text style={styles.label}>Email</Text>

              <View style={styles.inputBox}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={colors.textMuted}
                />

                <TextInput
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    setSaved(false);
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Save Changes Button */}
            <Pressable
              style={[
                styles.saveButton,
                saved && styles.savedButton,
                saving && { opacity: 0.7 },
              ]}
              onPress={saveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <View style={styles.saveButtonContent}>
                  {saved && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.white}
                      style={{ marginRight: 7 }}
                    />
                  )}

                  <Text style={styles.saveText}>
                    {saved ? "Saved Successfully" : "Save Changes"}
                  </Text>
                </View>
              )}
            </Pressable>
          </>
        )}

        {/* Change Password */}
        <Pressable
          style={styles.passwordButton}
          onPress={() =>
            Alert.alert(
              "Change Password",
              "Password management will be connected to the backend later."
            )
          }
        >
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={colors.primary}
          />

          <Text style={styles.passwordText}>
            Change Password
          </Text>

          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.textMuted}
          />
        </Pressable>
      </ScrollView>
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
    paddingBottom: 30,
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

  title: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  accountCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    alignItems: "center",
    marginBottom: 16,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  accountName: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  accountType: {
    marginTop: 3,
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  formCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },

  label: {
    marginBottom: 7,
    fontSize: 11,
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
  },

  inputBox: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },

  // Profile update success banner
  successMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9F8F0",
    borderWidth: 1,
    borderColor: "#B7E8CC",
    borderRadius: 12,
    padding: 13,
    marginBottom: 15,
    gap: 10,
  },

  successTitle: {
    fontSize: 13,
    color: "#16834B",
    fontFamily: fonts.bold,
  },

  successSubtitle: {
    marginTop: 3,
    fontSize: 10,
    color: "#26734B",
    fontFamily: fonts.regular,
  },

  saveButton: {
    height: 50,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  // Green button after successful update
  savedButton: {
    backgroundColor: "#16834B",
  },

  saveButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  saveText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.bold,
  },

  passwordButton: {
    height: 54,
    marginTop: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },

  passwordText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
  },
};
