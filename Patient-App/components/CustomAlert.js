import React, { useEffect, useRef } from "react";

import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
  BackHandler,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, fonts } from "../constants/theme";

export default function CustomAlert({
  visible,
  type = "info",
  title = "Information",
  message = "",
  buttonText = "OK",
  secondaryButtonText,
  onPress,
  onSecondaryPress,
  onClose,
}) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Popup open animation
  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  // Android back button handling
  useEffect(() => {
    if (!visible) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (onClose) onClose();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [visible, onClose]);

  // Popup type settings
  const alertSettings = {
    success: {
      icon: "checkmark-circle",
      color: "#087F77",
      background: "#DCFCE7",
      defaultTitle: "Success",
    },
    error: {
      icon: "close-circle",
      color: "#DC2626",
      background: "#FEE2E2",
      defaultTitle: "Something Went Wrong",
    },
    info: {
      icon: "information-circle",
      color: "#2563EB",
      background: "#DBEAFE",
      defaultTitle: "Information",
    },
    warning: {
      icon: "alert-circle",
      color: "#D97706",
      background: "#FEF3C7",
      defaultTitle: "Attention",
    },
  };

  const current = alertSettings[type] || alertSettings.info;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.popup,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: current.background },
            ]}
          >
            <Ionicons
              name={current.icon}
              size={42}
              color={current.color}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {title || current.defaultTitle}
          </Text>

          {/* Message */}
          <Text style={styles.message}>
            {message}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {secondaryButtonText ? (
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={onSecondaryPress || onClose}
              >
                <Text style={styles.secondaryButtonText}>
                  {secondaryButtonText}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: current.color },
                secondaryButtonText && styles.flexButton,
              ]}
              activeOpacity={0.85}
              onPress={onPress || onClose}
            >
              <Text style={styles.primaryButtonText}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  popup: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 24,
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },

  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 21,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },

  message: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 25,
  },

  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },

  primaryButton: {
    minHeight: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
    flex: 1,
  },

  flexButton: {
    flex: 1,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },

  secondaryButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    flex: 1,
  },

  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
});