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
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { colors, fonts } from "../constants/theme";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { saveAuthSession } from "../constants/auth";
import CustomAlert from "../components/CustomAlert";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Custom popup state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertButtonText, setAlertButtonText] = useState("OK");
  const [alertAction, setAlertAction] = useState(null);

  // Show custom popup
  const showCustomAlert = (
    type,
    title,
    message,
    buttonText = "OK",
    action = null
  ) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtonText(buttonText);
    setAlertAction(() => action);
    setAlertVisible(true);
  };

  // Close custom popup
  const closeCustomAlert = () => {
    setAlertVisible(false);
    setAlertAction(null);
  };

  // Handle popup button press
  const handleAlertPress = () => {
    const action = alertAction;

    closeCustomAlert();

    if (action) {
      action();
    }
  };

  // Login API connection
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      showCustomAlert(
        "warning",
        "Missing Information",
        "Please enter your email address and password."
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

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response received from server.");
      }

      // Check API response
      if (!response.ok || !data.success) {
        showCustomAlert(
          "error",
          "Login Failed",
          data.message || "Invalid email or password."
        );
        return;
      }

      // Check patient role
      if (data.user?.role !== "patient") {
        showCustomAlert(
          "error",
          "Access Denied",
          "This account is not a patient account."
        );
        return;
      }

      // Check JWT token
      if (!data.token) {
        showCustomAlert(
          "error",
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
        showCustomAlert(
          "error",
          "Session Error",
          "Failed to save login session. Please try again."
        );
        return;
      }

      // Login successful
      showCustomAlert(
        "success",
        "Login Successful!",
        `Welcome back, ${data.user.name || "Patient"}! You are now logged in.`,
        "Continue",
        () => router.replace("/")
      );
    } catch (error) {
      showCustomAlert(
        "error",
        "Connection Error",
        "Unable to connect to the server. Please check your internet connection and try again."
      );

      console.log("Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  // Backend password reset API is not implemented yet.
  const handleForgotPassword = () => {
    showCustomAlert(
      "info",
      "Forgot Password?",
      "Password reset is not available yet. Please contact the hospital administrator for assistance."
    );
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
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
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

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPasswordText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

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

      {/* Custom Alert Popup */}
      <CustomAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        buttonText={alertButtonText}
        onPress={handleAlertPress}
        onClose={closeCustomAlert}
      />
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

  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginTop: 13,
    paddingVertical: 4,
  },

  forgotPasswordText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.semiBold,
  },

  loginButton: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 11,
    marginTop: 24,
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