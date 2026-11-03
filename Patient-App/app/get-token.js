import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, fonts } from "../constants/theme";

const services = [
  {
    id: "general",
    title: "General Consultation",
    subtitle: "General doctor consultation",
    icon: "medkit-outline",
    wait: "18 min",
    queue: "05 people",
  },
  {
    id: "specialist",
    title: "Specialist Consultation",
    subtitle: "Consult with a specialist",
    icon: "person-outline",
    wait: "32 min",
    queue: "08 people",
  },
  {
    id: "diagnostic",
    title: "Diagnostic / Laboratory",
    subtitle: "Blood test, imaging & reports",
    icon: "flask-outline",
    wait: "12 min",
    queue: "03 people",
  },
  {
    id: "pharmacy",
    title: "Pharmacy Service",
    subtitle: "Medicine collection",
    icon: "medical-outline",
    wait: "08 min",
    queue: "02 people",
  },
];

export default function GetToken() {
  const [selectedService, setSelectedService] = useState("general");

  const selected = services.find(
    (service) => service.id === selectedService
  );

  const handleContinue = () => {
    router.push({
      pathname: "/confirmation",
      params: {
        service: selected.title,
        wait: selected.wait,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Get Digital Token</Text>
            <Text style={styles.headerSubtitle}>
              Select a service to join the queue
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Step Indicator */}
          <View style={styles.stepSection}>
            <View style={styles.stepRow}>
              <View style={styles.stepActive}>
                <Text style={styles.stepNumberActive}>1</Text>
              </View>

              <View style={styles.stepLine} />

              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
              </View>

              <View style={styles.stepLine} />

              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
            </View>

            <View style={styles.stepLabels}>
              <Text style={styles.activeLabel}>Service</Text>
              <Text style={styles.label}>Details</Text>
              <Text style={styles.label}>Token</Text>
            </View>
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose a Service</Text>
            <Text style={styles.sectionDescription}>
              Select the service you need today.
            </Text>
          </View>

          {/* Service Cards */}
          <View style={styles.serviceList}>
            {services.map((service) => {
              const isSelected = selectedService === service.id;

              return (
                <TouchableOpacity
                  key={service.id}
                  activeOpacity={0.88}
                  style={[
                    styles.serviceCard,
                    isSelected && styles.serviceCardSelected,
                  ]}
                  onPress={() => setSelectedService(service.id)}
                >
                  {/* Icon */}
                  <View
                    style={[
                      styles.iconBox,
                      isSelected && styles.iconBoxSelected,
                    ]}
                  >
                    <Ionicons
                      name={service.icon}
                      size={23}
                      color={isSelected ? colors.white : colors.primary}
                    />
                  </View>

                  {/* Information */}
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceSubtitle}>
                      {service.subtitle}
                    </Text>

                    <View style={styles.serviceMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="people-outline"
                          size={14}
                          color={colors.textMuted}
                        />
                        <Text style={styles.metaText}>{service.queue}</Text>
                      </View>

                      <View style={styles.metaItem}>
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color={colors.textMuted}
                        />
                        <Text style={styles.metaText}>
                          ~ {service.wait}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Radio */}
                  <View
                    style={[
                      styles.radio,
                      isSelected && styles.radioSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Service */}
          <View style={styles.previewCard}>
            <View style={styles.previewIcon}>
              <Ionicons
                name="checkmark-circle"
                size={23}
                color={colors.primary}
              />
            </View>

            <View style={styles.previewInfo}>
              <Text style={styles.previewLabel}>SELECTED SERVICE</Text>
              <Text style={styles.previewTitle}>{selected.title}</Text>
              <Text style={styles.previewWait}>
                Estimated waiting time: {selected.wait}
              </Text>
            </View>
          </View>

          {/* Information Box */}
          <View style={styles.infoBox}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={colors.primary}
              />
            </View>
            <Text style={styles.infoText}>
              Your digital token will be generated after confirming the
              selected service.
            </Text>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.88}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
            <View style={styles.arrowCircle}>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.primary}
              />
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontFamily: fonts.bold,
  },

  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
    fontFamily: fonts.regular,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 5,
  },

  stepSection: {
    marginTop: 5,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  stepActive: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  step: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: colors.softBg,
    borderWidth: 1,
    borderColor: colors.progressInactiveBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  stepNumberActive: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.bold,
  },

  stepNumber: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },

  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },

  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginHorizontal: 1,
  },

  activeLabel: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.bold,
  },

  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: fonts.medium,
  },

  sectionHeader: {
    marginTop: 25,
    marginBottom: 15,
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontFamily: fonts.bold,
  },

  sectionDescription: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 5,
    fontFamily: fonts.regular,
  },

  serviceList: {
    gap: 11,
  },

  serviceCard: {
    minHeight: 105,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 17,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  serviceCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.selectedCardBg,
  },

  iconBox: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  iconBoxSelected: {
    backgroundColor: colors.primary,
  },

  serviceInfo: {
    flex: 1,
  },

  serviceTitle: {
    color: colors.textPrimary,
    fontSize: 14.5,
    fontFamily: fonts.bold,
  },

  serviceSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    fontFamily: fonts.regular,
  },

  serviceMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 9,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaText: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: fonts.regular,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.radioBorder,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  radioSelected: {
    borderColor: colors.primary,
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  previewCard: {
    marginTop: 17,
    backgroundColor: colors.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  previewIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  previewInfo: {
    flex: 1,
  },

  previewLabel: {
    color: colors.primary,
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: fonts.bold,
  },

  previewTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    marginTop: 3,
    fontFamily: fonts.bold,
  },

  previewWait: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 3,
    fontFamily: fonts.regular,
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    padding: 14,
    backgroundColor: colors.infoBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.infoBorder,
  },

  infoIcon: {
    marginRight: 10,
  },

  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    fontFamily: fonts.regular,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  continueButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  continueText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.bold,
  },

  arrowCircle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});