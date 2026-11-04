
import React, { useEffect } from "react";

import {
  Stack,
  useRouter,
  useSegments,
} from "expo-router";

import {
  View,
  ActivityIndicator,
} from "react-native";

import {
  AuthProvider,
  useAuth,
} from "../context/AuthContext";

// Check whether the admin is logged in
function AuthGuard() {
  const { user, loading } = useAuth();

  const router = useRouter();
  const segments = useSegments();

  const isLoginScreen = segments[0] === "login";

  useEffect(() => {
    if (loading) return;

    // Not logged in: show Login screen
    if (!user && !isLoginScreen) {
      router.replace("/login");
    }

    // Already logged in: open Dashboard
    if (user && isLoginScreen) {
      router.replace("/");
    }
  }, [user, loading, isLoginScreen]);

  // Show loading screen while checking login
  if (loading || (!user && !isLoginScreen)) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F6FAFA",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#079C91"
        />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    />
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}
