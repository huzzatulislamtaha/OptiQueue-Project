import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";

import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import { colors, fonts } from "../constants/theme";

const services = [
  {
    icon: "medkit-outline",
    title: "General Consultation",
    waiting: 7,
    waitTime: "18 min",
  },
  {
    icon: "medical-outline",
    title: "Specialist Consultation",
    waiting: 12,
    waitTime: "32 min",
  },
  {
    icon: "flask-outline",
    title: "Diagnostic / Laboratory",
    waiting: 5,
    waitTime: "14 min",
  },
  {
    icon: "medkit-outline",
    title: "Pharmacy Service",
    waiting: 3,
    waitTime: "8 min",
  },
];

export default function Services() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Header
          title="Services"
          subtitle="Choose a service to get your digital token"
        />

        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Text style={styles.introIconText}>+</Text>
          </View>

          <View style={styles.introContent}>
            <Text style={styles.introTitle}>Digital Queue</Text>
            <Text style={styles.introText}>
              Select the service you need and get your token instantly.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Available Services</Text>

        {services.map((service) => (
          <ServiceCard
            key={service.title}
            {...service}
            onPress={() =>
              router.push({
                pathname: "/get-token",
                params: {
                  service: service.title,
                  waiting: service.waiting,
                  waitTime: service.waitTime,
                },
              })
            }
          />
        ))}
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 110,
  },

  introCard: {
    marginTop: 18,
    marginBottom: 22,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.previewBg,
    flexDirection: "row",
    alignItems: "center",
  },

  introIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  introIconText: {
    color: colors.white,
    fontSize: 25,
    fontFamily: fonts.bold,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    marginBottom: 3,
    fontFamily: fonts.bold,
  },

  introText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: fonts.regular,
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    marginBottom: 12,
    fontFamily: fonts.bold,
  },
});