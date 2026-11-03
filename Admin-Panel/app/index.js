import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import styles from "../styles/dashboard";
import { colors } from "../styles/theme";

const queueData = [
  {
    service: "General Consultation",
    token: "A-024",
    waiting: "05",
    wait: "18 min",
  },
  {
    service: "Specialist Consultation",
    token: "B-011",
    waiting: "08",
    wait: "32 min",
  },
  {
    service: "Diagnostic / Laboratory",
    token: "C-008",
    waiting: "03",
    wait: "14 min",
  },
  {
    service: "Pharmacy Service",
    token: "D-005",
    waiting: "02",
    wait: "08 min",
  },
];

function StatCard({ icon, label, value, note, iconBackground }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>

        <View
          style={[
            styles.statIcon,
            { backgroundColor: iconBackground },
          ]}
        >
          <Ionicons name={icon} size={18} color={colors.primary} />
        </View>
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statNote}>{note}</Text>
    </View>
  );
}

function QuickAction({ icon, title, subtitle, route }) {
  return (
    <Pressable
      style={styles.quickAction}
      onPress={() => router.push(route)}
    >
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>

      <View style={styles.quickText}>
        <Text style={styles.quickTitle}>{title}</Text>
        <Text style={styles.quickSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={17}
        color={colors.textLight}
      />
    </Pressable>
  );
}

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <AdminHeader
        title="Dashboard"
        subtitle="Hospital queue management overview"
      />

      <View style={styles.body}>
        <AdminSidebar active="Dashboard" />

        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Statistics */}
          <View style={styles.statsGrid}>
            <StatCard
              icon="ticket-outline"
              label="Total Tokens"
              value="126"
              note="Today's generated tokens"
              iconBackground={colors.primaryLight}
            />

            <StatCard
              icon="people-outline"
              label="Waiting Patients"
              value="28"
              note="Currently in queue"
              iconBackground={colors.blueLight}
            />

            <StatCard
              icon="play-circle-outline"
              label="Now Serving"
              value="A-024"
              note="Counter 01"
              iconBackground={colors.successLight}
            />

            <StatCard
              icon="checkmark-circle-outline"
              label="Completed"
              value="98"
              note="Today's completed tokens"
              iconBackground={colors.purpleLight}
            />
          </View>

          {/* Main Content */}
          <View style={styles.contentRow}>
            {/* Currently Serving */}
            <View style={styles.largeCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>
                    Currently Serving
                  </Text>

                  <Text style={styles.cardSubtitle}>
                    Live counter status
                  </Text>
                </View>

                <Ionicons
                  name="radio-outline"
                  size={20}
                  color={colors.success}
                />
              </View>

              <View style={styles.servingCard}>
                <View style={styles.servingTop}>
                  <Text style={styles.servingToken}>A-024</Text>

                  <View style={styles.servingStatus}>
                    <Text style={styles.servingStatusText}>
                      SERVING
                    </Text>
                  </View>
                </View>

                <Text style={styles.serviceName}>
                  General Consultation
                </Text>

                <Text style={styles.counterText}>
                  Counter 01
                </Text>

                <View style={styles.nextRow}>
                  <Text style={styles.nextLabel}>
                    Next Patient
                  </Text>

                  <Text style={styles.nextToken}>
                    A-025
                  </Text>
                </View>
              </View>

              <View style={styles.nextInfoRow}>
                <View style={styles.nextInfoItem}>
                  <Text style={styles.nextInfoLabel}>
                    Waiting
                  </Text>

                  <Text style={styles.nextInfoValue}>
                    05 patients
                  </Text>
                </View>

                <View style={styles.nextInfoItem}>
                  <Text style={styles.nextInfoLabel}>
                    Estimated Wait
                  </Text>

                  <Text style={styles.nextInfoValue}>
                    18 min
                  </Text>
                </View>

                <View style={styles.nextInfoItem}>
                  <Text style={styles.nextInfoLabel}>
                    Queue Status
                  </Text>

                  <Text style={styles.liveQueueText}>
                    Live
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.smallCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>
                    Quick Actions
                  </Text>

                  <Text style={styles.cardSubtitle}>
                    Manage hospital queue
                  </Text>
                </View>

                <Ionicons
                  name="flash-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>

              <QuickAction
                icon="list-outline"
                title="Queue Management"
                subtitle="View and control live queue"
                route="/queue-management"
              />

              <QuickAction
                icon="ticket-outline"
                title="Token Management"
                subtitle="Manage patient tokens"
                route="/token-management"
              />

              <QuickAction
                icon="stats-chart-outline"
                title="Analytics"
                subtitle="View queue analytics"
                route="/analytics"
              />
            </View>
          </View>

          {/* Queue Overview */}
          <View style={styles.queueSection}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>
                  Queue Overview
                </Text>

                <Text style={styles.cardSubtitle}>
                  Current status by service
                </Text>
              </View>

              <Pressable
                style={styles.viewAllButton}
                onPress={() => router.push("/queue-management")}
              >
                <Text style={styles.viewAllText}>
                  View Queue
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color={colors.primary}
                />
              </Pressable>
            </View>

            {/* Table Header */}
            <View style={styles.queueRow}>
              <Text style={styles.queueHeaderService}>
                Service
              </Text>

              <Text style={styles.queueHeaderValue}>
                Current Token
              </Text>

              <Text style={styles.queueHeaderValue}>
                Waiting
              </Text>

              <Text style={styles.queueHeaderValue}>
                Avg. Wait
              </Text>
            </View>

            {/* Table Rows */}
            {queueData.map((item) => (
              <View
                key={item.service}
                style={styles.queueRow}
              >
                <Text style={styles.queueService}>
                  {item.service}
                </Text>

                <Text style={styles.queueToken}>
                  {item.token}
                </Text>

                <Text style={styles.queueValue}>
                  {item.waiting} patients
                </Text>

                <Text style={styles.queueValue}>
                  {item.wait}
                </Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              OptiQueue • Smart Hospital Queue Management System
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}