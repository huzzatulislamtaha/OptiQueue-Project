
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { colors, fonts } from "../constants/theme";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { saveAuthSession } from "../constants/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login API connection
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      // Check API response
      if (!response.ok || !data.success) {
        Alert.alert(
          "Login Failed",
          data.message || "Invalid email or password."
        );
        return;
      }

      // Check patient role
      if (data.user?.role !== "patient") {
        Alert.alert(
          "Access Denied",
          "This account is not a patient account."
        );
        return;
      }

      // Check JWT token
      if (!data.token) {
        Alert.alert(
          "Login Error",
          "Authentication token was not received from the server."
        );
        return;
      }

      // Save login session in device storage
      const saveSuccess = await saveAuthSession(
        data.token,
        data.user
      );

      if (!saveSuccess) {
        Alert.alert(
          "Session Error",
          "Failed to save login session. Please try again."
        );
        return;
      }

      // Login successful
      Alert.alert("Success", "Login successful!", [
        {
          text: "Continue",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Connection Error",
        "Unable to connect to the server. Please try again."
      );

      console.log("Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo and Branding */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons
              name="medical"
              size={34}
              color={colors.white}
            />
          </View>

          <Text style={styles.appName}>OptiQueue</Text>

          <Text style={styles.tagline}>
            Smart Hospital Queue Management
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.formCard}>
          <Text style={styles.title}>Welcome Back!</Text>

          <Text style={styles.subtitle}>
            Login to continue to your account.
          </Text>

          {/* Email */}
          <Text style={styles.label}>Email Address</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.textMuted}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textMuted}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={21}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Text style={styles.loginButtonText}>
                  Login
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={colors.white}
                />
              </>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/register")}
            >
              <Text style={styles.registerLink}>
                {" "}Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Your health journey, managed smarter.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Login screen styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  logo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  appName: {
    fontSize: 29,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  tagline: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 6,
  },

  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },

  title: {
    fontSize: 25,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 28,
  },

  label: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginBottom: 9,
    marginTop: 16,
  },

  inputContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    gap: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },

  loginButton: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 11,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  disabledButton: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bold,
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    flexWrap: "wrap",
  },

  registerText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.regular,
  },

  registerLink: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.bold,
  },

  footer: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
});
