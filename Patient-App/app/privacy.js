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

function PrivacyRow({ icon, title, text }) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{text}</Text>
      </View>
    </View>
  );
}

export default function Privacy() {
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
            <Text style={styles.title}>Privacy & Security</Text>
            <Text style={styles.subtitle}>
              Your queue information is protected
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <PrivacyRow
            icon="person-outline"
            title="Your Information"
            text="Patient information is used for account and queue management."
          />

          <View style={styles.divider} />

          <PrivacyRow
            icon="shield-checkmark-outline"
            title="Data Protection"
            text="Your account and queue information should be protected by the system."
          />

          <View style={styles.divider} />

          <PrivacyRow
            icon="share-social-outline"
            title="Data Sharing"
            text="Information sharing will be handled according to the hospital system."
          />

          <View style={styles.divider} />

          <PrivacyRow
            icon="lock-closed-outline"
            title="Account Security"
            text="Account security features will be connected to the backend authentication system."
          />
        </View>

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.noticeText}>
            Privacy and authentication controls will be connected to the real
            backend during the implementation phase.
          </Text>
        </View>
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

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  row: {
    padding: 16,
    flexDirection: "row",
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  rowText: {
    flex: 1,
    marginLeft: 11,
  },

  rowTitle: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  rowDescription: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 16,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 67,
  },

  notice: {
    marginTop: 14,
    padding: 14,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    flexDirection: "row",
  },

  noticeText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 10,
    lineHeight: 16,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
};