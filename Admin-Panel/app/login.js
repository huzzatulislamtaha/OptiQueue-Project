import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);

      await login(email, password);

    } catch (err) {
      setError(err.message || "Unable to login.");

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#F6FAFA",
      }}
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width: "100%",
            maxWidth: 430,
            alignSelf: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: 28,
            borderWidth: 1,
            borderColor: "#E5EEEE",
          }}
        >
          {/* Logo */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundColor: "#E8F7F5",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginBottom: 20,
            }}
          >
            <Ionicons
              name="medical"
              size={32}
              color="#079C91"
            />
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 25,
              fontWeight: "800",
              color: "#173B3A",
              textAlign: "center",
            }}
          >
            OptiQueue
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: "#647575",
              textAlign: "center",
              marginTop: 7,
              marginBottom: 28,
            }}
          >
            Admin Panel Login
          </Text>

          {/* Email */}
          <Text style={labelStyle}>
            Email Address
          </Text>

          <View style={inputContainerStyle}>
            <Ionicons
              name="mail-outline"
              size={19}
              color="#829593"
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter admin email"
              placeholderTextColor="#94A3A3"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={inputStyle}
              editable={!submitting}
            />
          </View>

          {/* Password */}
          <Text
            style={[
              labelStyle,
              { marginTop: 18 },
            ]}
          >
            Password
          </Text>

          <View style={inputContainerStyle}>
            <Ionicons
              name="lock-closed-outline"
              size={19}
              color="#829593"
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#94A3A3"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={inputStyle}
              editable={!submitting}
              onSubmitEditing={handleLogin}
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={20}
                color="#829593"
              />
            </Pressable>
          </View>

          {/* Error Message */}
          {!!error && (
            <View
              style={{
                backgroundColor: "#FDECEC",
                borderRadius: 9,
                padding: 12,
                marginTop: 18,
              }}
            >
              <Text
                style={{
                  color: "#D94A4A",
                  fontSize: 13,
                }}
              >
                {error}
              </Text>
            </View>
          )}

          {/* Login Button */}
          <Pressable
            onPress={handleLogin}
            disabled={submitting}
            style={{
              height: 52,
              borderRadius: 11,
              backgroundColor: submitting
                ? "#65BDB6"
                : "#079C91",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 25,
              flexDirection: "row",
            }}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  Login to Dashboard
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                  style={{ marginLeft: 9 }}
                />
              </>
            )}
          </Pressable>

          <Text
            style={{
              textAlign: "center",
              color: "#94A3A3",
              fontSize: 12,
              marginTop: 24,
            }}
          >
            Authorized administrators only
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const labelStyle = {
  fontSize: 14,
  fontWeight: "600",
  color: "#173B3A",
  marginBottom: 9,
};

const inputContainerStyle = {
  height: 50,
  borderWidth: 1,
  borderColor: "#D5E2E0",
  borderRadius: 10,
  paddingHorizontal: 13,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
};

const inputStyle = {
  flex: 1,
  marginLeft: 10,
  color: "#173B3A",
  fontSize: 14,
};