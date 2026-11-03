import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, fonts } from "../constants/theme";

export default function About() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>

          <View>
            <Text style={styles.title}>About OptiQueue</Text>
            <Text style={styles.subtitle}>
              Smart hospital queue management
            </Text>
          </View>
        </View>

        <View style={styles.logoCard}>
          <View style={styles.logo}>
            <Ionicons name="medical" size={32} color={colors.primary} />
          </View>

          <Text style={styles.brand}>OptiQueue</Text>
          <Text style={styles.tagline}>
            Smart Hospital Queue Management System
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>About the Project</Text>

          <Text style={styles.description}>
            OptiQueue is a digital hospital queue management system designed to
            help patients receive digital queue tokens and monitor their queue
            status in real time.
          </Text>

          <Text style={styles.description}>
            The system connects the Patient App, Hospital Admin Panel and Live
            Queue Display through a central backend and database.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Project Features</Text>

          <Text style={styles.feature}>• Digital queue token</Text>
          <Text style={styles.feature}>• Live queue tracking</Text>
          <Text style={styles.feature}>• Hospital queue management</Text>
          <Text style={styles.feature}>• Notifications and updates</Text>
          <Text style={styles.feature}>• Queue analytics</Text>
          <Text style={styles.feature}>• AI-based waiting-time prediction</Text>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
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
    paddingBottom: 35,
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

  logoCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 25,
    alignItems: "center",
    marginBottom: 14,
  },

  logo: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    marginTop: 12,
    fontSize: 21,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  tagline: {
    marginTop: 5,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: "center",
    fontFamily: fonts.regular,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 17,
    marginBottom: 14,
  },

  heading: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 9,
    fontFamily: fonts.bold,
  },

  description: {
    fontSize: 11,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: 9,
    fontFamily: fonts.regular,
  },

  feature: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 9,
    fontFamily: fonts.regular,
  },

  version: {
    textAlign: "center",
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
    fontFamily: fonts.regular,
  },
};