import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { colors, fonts } from "../constants/theme";

export default function Confirmation() {
  const { service, wait } = useLocalSearchParams();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");

  const selectedService = service || "General Consultation";
  const estimatedWait = wait || "18 min";

  const handleConfirm = () => {
    if (!fullName.trim()) {
      Alert.alert("Required", "Please enter your full name.");
      return;
    }

    if (!mobile.trim()) {
      Alert.alert("Required", "Please enter your mobile number.");
      return;
    }

    if (mobile.trim().length < 10) {
      Alert.alert(
        "Invalid Mobile Number",
        "Please enter a valid mobile number."
      );
      return;
    }

    router.push({
      pathname: "/my-token",
      params: {
        service: selectedService,
        wait: estimatedWait,
        token: "A-027",
      },
    });
  };

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.replace("/")}>
          <Ionicons name="arrow-back" size={21} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Confirm Token</Text>
          <Text style={styles.headerSubtitle}>Review your queue details</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* PROGRESS */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={styles.completedCircle}>
              <Ionicons name="checkmark" size={15} color={colors.white} />
            </View>
            <Text style={styles.completedText}>Service</Text>
          </View>

          <View style={styles.progressLine} />

          <View style={styles.progressStep}>
            <View style={styles.activeCircle}>
              <Text style={styles.activeNumber}>2</Text>
            </View>
            <Text style={styles.activeText}>Details</Text>
          </View>

          <View style={styles.progressLineInactive} />

          <View style={styles.progressStep}>
            <View style={styles.inactiveCircle}>
              <Text style={styles.inactiveNumber}>3</Text>
            </View>
            <Text style={styles.inactiveText}>Token</Text>
          </View>
        </View>

        {/* TITLE */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Almost there</Text>
          <Text style={styles.subtitle}>
            Review your service and provide your information before getting your
            token.
          </Text>
        </View>

        {/* SERVICE CARD */}
        <View style={styles.card}>
          <View style={styles.serviceRow}>
            <View style={styles.serviceIcon}>
              <Ionicons
                name="medkit-outline"
                size={23}
                color={colors.primary}
              />
            </View>

            <View style={styles.serviceInfo}>
              <Text style={styles.smallLabel}>SELECTED SERVICE</Text>
              <Text style={styles.serviceName}>{selectedService}</Text>
            </View>

            <View style={styles.checkIcon}>
              <Ionicons name="checkmark" size={15} color={colors.white} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.queueInfoRow}>
            <View style={styles.queueInfoItem}>
              <View style={styles.smallIcon}>
                <Ionicons
                  name="people-outline"
                  size={17}
                  color={colors.primary}
                />
              </View>
              <View>
                <Text style={styles.smallLabel}>PEOPLE IN QUEUE</Text>
                <Text style={styles.infoValue}>5 people</Text>
              </View>
            </View>

            <View style={styles.queueInfoItem}>
              <View style={styles.smallIcon}>
                <Ionicons
                  name="time-outline"
                  size={17}
                  color={colors.primary}
                />
              </View>
              <View>
                <Text style={styles.smallLabel}>EST. WAIT</Text>
                <Text style={styles.infoValue}>{estimatedWait}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* PATIENT INFORMATION */}
        <View style={styles.patientCard}>
          <View style={styles.patientHeader}>
            <View style={styles.patientIcon}>
              <Ionicons
                name="person-outline"
                size={21}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={styles.patientTitle}>Patient Information</Text>
              <Text style={styles.patientSubtitle}>
                Required for your digital queue token
              </Text>
            </View>
          </View>

          {/* NAME */}
          <Text style={styles.inputLabel}>Full Name *</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={18}
              color={colors.textMuted}
            />
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          {/* MOBILE */}
          <Text style={styles.inputLabel}>Mobile Number *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={18} color={colors.textMuted} />
            <TextInput
              value={mobile}
              onChangeText={setMobile}
              placeholder="01XXXXXXXXX"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              maxLength={11}
              style={styles.input}
            />
          </View>
        </View>

        {/* LIVE TRACKING */}
        <View style={styles.liveCard}>
          <View style={styles.liveIcon}>
            <Ionicons name="pulse-outline" size={22} color={colors.primary} />
          </View>
          <View style={styles.liveTextArea}>
            <Text style={styles.liveTitle}>Live queue tracking</Text>
            <Text style={styles.liveSubtitle}>
              After confirmation, you'll receive a digital token and live queue
              position.
            </Text>
          </View>
        </View>

        {/* BEFORE CONFIRM */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="information-outline"
              size={19}
              color={colors.primary}
            />
          </View>
          <View style={styles.infoTextArea}>
            <Text style={styles.infoTitle}>Before you confirm</Text>
            <Text style={styles.infoDescription}>
              Please make sure the selected service and patient information are
              correct.
            </Text>
          </View>
        </View>

        {/* BUTTON */}
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Ionicons name="ticket-outline" size={19} color={colors.white} />
          <Text style={styles.confirmButtonText}>Confirm & Get Token</Text>
        </Pressable>

        <Pressable style={styles.changeButton} onPress={() => router.canGoBack() ? router.back() : router.replace("/")}>
          <Text style={styles.changeButtonText}>Change Service</Text>
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

  header: {
    height: 72,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    marginLeft: 12,
  },

  headerTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  content: {
    padding: 18,
    paddingBottom: 35,
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  progressStep: {
    alignItems: "center",
  },

  completedCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  activeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  inactiveCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.progressInactiveBg,
    alignItems: "center",
    justifyContent: "center",
  },

  activeNumber: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.bold,
  },

  inactiveNumber: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },

  completedText: {
    marginTop: 5,
    fontSize: 9,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },

  activeText: {
    marginTop: 5,
    fontSize: 9,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },

  inactiveText: {
    marginTop: 5,
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },

  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primary,
    marginHorizontal: 5,
    marginBottom: 14,
  },

  progressLineInactive: {
    flex: 1,
    height: 2,
    backgroundColor: colors.progressLine,
    marginHorizontal: 5,
    marginBottom: 14,
  },

  titleSection: {
    marginBottom: 18,
  },

  title: {
    fontSize: 24,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },

  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  serviceIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  serviceInfo: {
    flex: 1,
    marginLeft: 12,
  },

  smallLabel: {
    fontSize: 8,
    color: colors.textMuted,
    letterSpacing: 0.5,
    fontFamily: fonts.bold,
  },

  serviceName: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  checkIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 15,
  },

  queueInfoRow: {
    flexDirection: "row",
  },

  queueInfoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  smallIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  infoValue: {
    marginTop: 3,
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
  },

  patientCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },

  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  patientIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  patientTitle: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  patientSubtitle: {
    marginTop: 3,
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  inputLabel: {
    marginBottom: 7,
    fontSize: 11,
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
  },

  inputContainer: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 13,
  },

  input: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },

  liveCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  liveIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  liveTextArea: {
    flex: 1,
    marginLeft: 10,
  },

  liveTitle: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  liveSubtitle: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: "row",
    marginBottom: 18,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  infoTextArea: {
    flex: 1,
    marginLeft: 10,
  },

  infoTitle: {
    fontSize: 11,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  infoDescription: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  confirmButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  confirmButtonText: {
    marginLeft: 8,
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.bold,
  },

  changeButton: {
    alignItems: "center",
    paddingVertical: 14,
  },

  changeButtonText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
  },
};