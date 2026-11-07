
import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";

import { useFonts } from "expo-font";

import {
  Stack,
  useRouter,
  useSegments,
} from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../constants/theme";

import {
  getAuthToken,
  saveAuthSession,
  clearAuthSession,
} from "../constants/auth";

import {
  API_BASE_URL,
  API_ENDPOINTS,
} from "../constants/api";

// Keep splash screen visible until app is ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const lastTokenRef = useRef(null);
  const verificationRef = useRef(false);
  const verificationIdRef = useRef(0);
  const navigationRef = useRef(null);

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [serverOffline, setServerOffline] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Inter: require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
  });

  // ========================================
  // Navigation Helper
  // ========================================

  const navigateTo = (path) => {
    if (navigationRef.current === path) {
      return;
    }

    navigationRef.current = path;
    router.replace(path);
  };

  // ========================================
  // Verify Login Session With Backend
  // ========================================

  const verifySession = async () => {
    if (verificationRef.current) {
      return "checking";
    }

    verificationRef.current = true;

    const verificationId = ++verificationIdRef.current;

    try {
      const token = await getAuthToken();

      if (!token) {
        lastTokenRef.current = null;

        await clearAuthSession();

        if (verificationId !== verificationIdRef.current) {
          return false;
        }

        setIsAuthenticated(false);
        setServerOffline(false);
        setAuthChecked(true);

        return false;
      }

      lastTokenRef.current = token;

      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 10000);

      let response;

      try {
        response = await fetch(
          API_BASE_URL + API_ENDPOINTS.ME,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );
      } finally {
        clearTimeout(timeout);
      }

      if (verificationId !== verificationIdRef.current) {
        return false;
      }

      const currentToken = await getAuthToken();

      if (currentToken !== token) {
        return false;
      }

      if (response.status === 401 || response.status === 403) {
        await clearAuthSession();

        lastTokenRef.current = null;

        setIsAuthenticated(false);
        setServerOffline(false);
        setAuthChecked(true);

        return false;
      }

      if (!response.ok) {
        throw new Error("Backend error: " + response.status);
      }

      const data = await response.json();

      if (verificationId !== verificationIdRef.current) {
        return false;
      }

      if (!data.success || data.user?.role !== "patient") {
        await clearAuthSession();

        lastTokenRef.current = null;

        setIsAuthenticated(false);
        setServerOffline(false);
        setAuthChecked(true);

        return false;
      }

      const latestToken = await getAuthToken();

      if (
        latestToken !== token ||
        verificationId !== verificationIdRef.current
      ) {
        return false;
      }

      await saveAuthSession(token, data.user);

      const savedToken = await getAuthToken();

      if (
        savedToken !== token ||
        verificationId !== verificationIdRef.current
      ) {
        return false;
      }

      setIsAuthenticated(true);
      setServerOffline(false);
      setAuthChecked(true);

      console.log("Session Verification: Successful");

      return true;

    } catch (error) {
      if (verificationId !== verificationIdRef.current) {
        return false;
      }

      console.log("Session Verification Error:", error.message);

      setIsAuthenticated(false);
      setServerOffline(true);
      setAuthChecked(true);

      return "offline";

    } finally {
      verificationRef.current = false;
    }
  };

  // ========================================
  // Initial Session Verification
  // ========================================

  useEffect(() => {
    verifySession();
  }, []);

  // ========================================
  // Monitor Login / Logout Changes
  // ========================================

  useEffect(() => {
    let isActive = true;

    const checkSavedSession = async () => {
      if (!isActive) {
        return;
      }

      try {
        const currentToken = await getAuthToken();

        if (!isActive) {
          return;
        }

        if (currentToken === lastTokenRef.current) {
          return;
        }

        lastTokenRef.current = currentToken;

        if (!currentToken) {
          verificationIdRef.current += 1;

          setIsAuthenticated(false);
          setServerOffline(false);
          setAuthChecked(true);

          const currentScreen = segments[0];

          const isPublicScreen =
            currentScreen === "login" ||
            currentScreen === "register";

          if (!isPublicScreen) {
            navigateTo("/login");
          }

          return;
        }

        setAuthChecked(false);

        const result = await verifySession();

        if (!isActive) {
          return;
        }

        if (result === true) {
          const currentScreen = segments[0];

          const isPublicScreen =
            currentScreen === "login" ||
            currentScreen === "register";

          if (isPublicScreen) {
            navigateTo("/");
          }

        } else if (result === false) {
          navigateTo("/login");
        }

      } catch (error) {
        console.log("Session Monitor Error:", error.message);
      }
    };

    const interval = setInterval(() => {
      checkSavedSession();
    }, 100);

    return () => {
      isActive = false;
      clearInterval(interval);
    };

  }, [segments, router]);

  // ========================================
  // Protect Private Screens
  // ========================================

  useEffect(() => {
    if (!authChecked || (!fontsLoaded && !fontError)) {
      return;
    }

    if (serverOffline) {
      return;
    }

    const currentScreen = segments[0];

    const isPublicScreen =
      currentScreen === "login" ||
      currentScreen === "register";

    if (isPublicScreen && isAuthenticated) {
      navigateTo("/");
      return;
    }

    if (!isPublicScreen && !isAuthenticated) {
      navigateTo("/login");
    }

  }, [
    authChecked,
    isAuthenticated,
    serverOffline,
    fontsLoaded,
    fontError,
    segments,
    router,
  ]);

  // ========================================
  // Retry Backend Connection
  // ========================================

  const handleRetry = async () => {
    if (retrying) {
      return;
    }

    setRetrying(true);
    setAuthChecked(false);

    await verifySession();

    setRetrying(false);
  };

  // ========================================
  // Hide Splash Screen
  // ========================================

  useEffect(() => {
    if ((fontsLoaded || fontError) && authChecked) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, authChecked]);

  // ========================================
  // Loading Screen
  // ========================================

  if ((!fontsLoaded && !fontError) || !authChecked) {
    return null;
  }

  // ========================================
  // Backend Offline Screen
  // ========================================

  if (serverOffline) {
    return (
      <View style={styles.offlineContainer}>
        <StatusBar
          style="dark"
          backgroundColor={colors.background}
        />

        <View style={styles.offlineIcon}>
          <Ionicons
            name="cloud-offline-outline"
            size={48}
            color={colors.primary}
          />
        </View>

        <Text style={styles.offlineTitle}>
          Connection Unavailable
        </Text>

        <Text style={styles.offlineMessage}>
          We cannot connect to the OptiQueue server right now.
          Please check your internet connection and try again.
        </Text>

        <TouchableOpacity
          style={[
            styles.retryButton,
            retrying && styles.retryButtonDisabled,
          ]}
          onPress={handleRetry}
          disabled={retrying}
          activeOpacity={0.8}
        >
          {retrying ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name="refresh-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.retryButtonText}>
                Retry Connection
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.offlineHint}>
          Your saved login session has not been deleted.
        </Text>
      </View>
    );
  }

  // ========================================
  // Main Application Navigation
  // ========================================

  return (
    <>
      <StatusBar
        style="dark"
        backgroundColor={colors.background}
      />

      <Stack
        screenOptions={{
          headerShown: false,

          animation:
            Platform.OS === "web"
              ? "none"
              : "fade_from_bottom",

          animationDuration: 280,

          gestureEnabled: Platform.OS !== "web",

          // Keep inactive screens attached on web
          detachInactiveScreens: Platform.OS !== "web",

          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </>
  );
}

// ========================================
// Styles
// ========================================

const styles = StyleSheet.create({
  offlineContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  offlineIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  offlineTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 23,
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },

  offlineMessage: {
    fontFamily: "Inter",
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary || colors.text,
    textAlign: "center",
    marginBottom: 30,
  },

  retryButton: {
    minWidth: 200,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
  },

  retryButtonDisabled: {
    opacity: 0.7,
  },

  retryButtonText: {
    fontFamily: "Inter-Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },

  offlineHint: {
    fontFamily: "Inter",
    fontSize: 12,
    color: colors.textSecondary || colors.text,
    textAlign: "center",
    marginTop: 22,
  },
});
