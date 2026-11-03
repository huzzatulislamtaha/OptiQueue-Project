import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, fonts } from "../constants/theme";

const questions = [
  "How do I get a token?",
  "How can I check my queue?",
  "How do I cancel a token?",
  "How will I know when my turn comes?",
];

export default function Help() {
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
            <Text style={styles.title}>Help & Support</Text>
            <Text style={styles.subtitle}>Need help using OptiQueue?</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        <View style={styles.card}>
          {questions.map((question, index) => (
            <React.Fragment key={question}>
              <Pressable
                style={styles.questionRow}
                onPress={() =>
                  Alert.alert(
                    "Help",
                    "This help topic will be expanded during the final implementation."
                  )
                }
              >
                <View style={styles.questionIcon}>
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color={colors.primary}
                  />
                </View>

                <Text style={styles.questionText}>{question}</Text>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.textSecondary}
                />
              </Pressable>

              {index !== questions.length - 1 && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Contact Support</Text>

        <Pressable
          style={styles.contactCard}
          onPress={() =>
            Alert.alert(
              "Contact Support",
              "Hospital support contact details will be connected later."
            )
          }
        >
          <View style={styles.contactIcon}>
            <Ionicons
              name="headset-outline"
              size={22}
              color={colors.primary}
            />
          </View>

          <View style={styles.contactText}>
            <Text style={styles.contactTitle}>Hospital Support</Text>
            <Text style={styles.contactSubtitle}>
              Email / Phone / Location
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={17}
            color={colors.textMuted}
          />
        </Pressable>
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
    marginBottom: 22,
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

  sectionTitle: {
    marginBottom: 9,
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 22,
  },

  questionRow: {
    minHeight: 62,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  questionIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  questionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 11,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 60,
  },

  contactCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  contactText: {
    flex: 1,
    marginLeft: 10,
  },

  contactTitle: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  contactSubtitle: {
    marginTop: 3,
    fontSize: 9,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
};