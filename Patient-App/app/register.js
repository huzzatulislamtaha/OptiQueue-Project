
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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate email format
  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // Register new patient account
  const handleRegister = async () => {
    // Prevent multiple registration requests
    if (loading) return;

    // Check required fields
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    // Validate email
    if (!isValidEmail(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long."
      );
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Send registration request to backend
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
          }),
        }
      );

      // Read server response safely
      const responseText = await response.text();

      let data;

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.log("Invalid Server Response:", responseText);

        Alert.alert(
          "Server Error",
          "The server returned an invalid response. Please check the backend."
        );
        return;
      }

      // Handle backend registration errors
      if (!response.ok || !data.success) {
        Alert.alert(
          "Registration Failed",
          data.message ||
            `Server error (${response.status}). Please try again.`
        );
        return;
      }

      // Verify patient account
      if (!data.user || data.user.role !== "patient") {
        Alert.alert(
          "Registration Error",
          "Patient account could not be verified."
        );
        return;
      }

      // Verify authentication token
      if (!data.token) {
        Alert.alert(
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
        Alert.alert(
          "Session Error",
          "Account created, but login session could not be saved. Please login."
        );
        return;
      }

      // Registration successful
      Alert.alert(
        "Account Created",
        "Your OptiQueue account has been created successfully!",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/"),
          },
        ]
      );

    } catch (error) {
      // Display actual connection error for debugging
      console.log("Register Error:", error);

      Alert.alert(
        "Connection Error",
        error.message ||
          "Unable to connect to the server. Please check your connection and try again."
      );

    } finally {
      // Always stop loading indicator
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

        {/* Registration Form */}
        <View style={styles.formCard}>
          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>
            Register to manage your hospital visits.
          </Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>

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
            />
          </View>

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
              placeholder="Minimum 8 characters"
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
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={21}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>

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
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

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
              <Text style={styles.loginLink}> Login</Text>
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
