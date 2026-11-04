
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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // Custom popup states
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

  // Validate email format
  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password) return null;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        label: "Weak Password",
        color: "#DC2626",
        width: "33%",
      };
    }

    if (score <= 4) {
      return {
        label: "Medium Password",
        color: "#D97706",
        width: "66%",
      };
    }

    return {
      label: "Strong Password",
      color: "#16A34A",
      width: "100%",
    };
  };

  // Register new patient account
  const handleRegister = async () => {
    if (loading) return;

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Required field validation
    if (
      !cleanName ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      showCustomAlert(
        "warning",
        "Missing Information",
        "Please fill in all fields."
      );
      return;
    }

    // Name validation
    if (cleanName.length < 2) {
      showCustomAlert(
        "warning",
        "Invalid Name",
        "Name must contain at least 2 characters."
      );
      return;
    }

    // Email validation
    if (!isValidEmail(cleanEmail)) {
      showCustomAlert(
        "warning",
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    // Password length validation
    if (password.length < 8) {
      showCustomAlert(
        "warning",
        "Weak Password",
        "Password must be at least 8 characters long."
      );
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      showCustomAlert(
        "warning",
        "Password Mismatch",
        "Passwords do not match. Please check both password fields."
      );
      return;
    }

    try {
      setLoading(true);

      // Send registration request to Backend
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password: password,
          }),
        }
      );

      // Read server response
      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      // Handle Backend errors
      if (!response.ok || !data.success) {
        showCustomAlert(
          "error",
          "Registration Failed",
          data.message ||
            `Registration failed. Server error: ${response.status}`
        );
        return;
      }

      // Verify patient account
      if (data.user?.role !== "patient") {
        showCustomAlert(
          "error",
          "Registration Error",
          "Patient account could not be verified."
        );
        return;
      }

      // Verify authentication token
      if (!data.token) {
        showCustomAlert(
          "error",
          "Registration Error",
          "Authentication token was not received from the server."
        );
        return;
      }

      // Save authentication session
      const saveSuccess = await saveAuthSession(
        data.token,
        data.user
      );

      if (!saveSuccess) {
        showCustomAlert(
          "error",
          "Session Error",
          "Your account was created, but the login session could not be saved. Please login manually."
        );
        return;
      }

      // Registration successful
      showCustomAlert(
        "success",
        "Account Created!",
        "Your OptiQueue account has been created successfully. Welcome aboard!",
        "Continue",
        () => router.replace("/")
      );

    } catch (error) {
      console.log("Register Error:", error.message);

      showCustomAlert(
        "error",
        "Connection Error",
        error.message ||
          "Unable to connect to the server. Please check your connection and try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

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

          <Text style={styles.appName}>
            OptiQueue
          </Text>

          <Text style={styles.tagline}>
            Smart Hospital Queue Management
          </Text>
        </View>

        {/* Registration Form */}
        <View style={styles.formCard}>
          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Register to manage your hospital visits.
          </Text>

          {/* Full Name */}
          <Text style={styles.label}>
            Full Name
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={colors.textMuted}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>
            Email Address
          </Text>

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
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textMuted}
            />

            <TextInput
              style={styles.input}
              placeholder="Minimum 8 characters"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(!showPassword)
              }
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

          {/* Password Strength */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthTrack}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      width: passwordStrength.width,
                      backgroundColor: passwordStrength.color,
                    },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.strengthText,
                  {
                    color: passwordStrength.color,
                  },
                ]}
              >
                {passwordStrength.label}
              </Text>
            </View>
          )}

          <Text style={styles.passwordHint}>
            Use at least 8 characters. A mix of letters,
            numbers and symbols is recommended.
          </Text>

          {/* Confirm Password */}
          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={colors.textMuted}
            />

            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              placeholderTextColor={colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  showConfirmPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={21}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Password Match Indicator */}
          {confirmPassword.length > 0 && (
            <View style={styles.matchContainer}>
              <Ionicons
                name={
                  password === confirmPassword
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={15}
                color={
                  password === confirmPassword
                    ? "#16A34A"
                    : "#DC2626"
                }
              />

              <Text
                style={[
                  styles.matchText,
                  {
                    color:
                      password === confirmPassword
                        ? "#16A34A"
                        : "#DC2626",
                  },
                ]}
              >
                {password === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </Text>
            </View>
          )}

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Text style={styles.registerButtonText}>
                  Create Account
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={colors.white}
                />
              </>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => router.replace("/login")}
            >
              <Text style={styles.loginLink}>
                {" "}Login
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

// Registration screen styles
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
    marginBottom: 18,
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

  strengthContainer: {
    marginTop: 10,
  },

  strengthTrack: {
    height: 5,
    width: "100%",
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },

  strengthFill: {
    height: "100%",
    borderRadius: 10,
  },

  strengthText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    marginTop: 5,
  },

  passwordHint: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 7,
    lineHeight: 17,
  },

  matchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    gap: 5,
  },

  matchText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },

  registerButton: {
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

  registerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bold,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    flexWrap: "wrap",
  },

  loginText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.regular,
  },

  loginLink: {
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
