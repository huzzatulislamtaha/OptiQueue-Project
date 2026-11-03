import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import styles from "../styles/queueManagement";
import { colors } from "../styles/theme";

const queueData = [
  {
    token: "A-024",
    service: "General Consultation",
    counter: "Counter 01",
    waiting: 5,
    wait: "18 min",
    status: "Serving",
  },
  {
    token: "A-025",
    service: "General Consultation",
    counter: "Counter 01",
    waiting: 4,
    wait: "14 min",
    status: "Waiting",
  },
  {
    token: "A-026",
    service: "General Consultation",
    counter: "Counter 01",
    waiting: 3,
    wait: "11 min",
    status: "Waiting",
  },
  {
    token: "A-027",
    service: "General Consultation",
    counter: "Counter 01",
    waiting: 2,
    wait: "8 min",
    status: "Waiting",
  },
  {
    token: "B-011",
    service: "Specialist Consultation",
    counter: "Counter 02",
    waiting: 8,
    wait: "32 min",
    status: "Serving",
  },
  {
    token: "B-012",
    service: "Specialist Consultation",
    counter: "Counter 02",
    waiting: 7,
    wait: "28 min",
    status: "Waiting",
  },
  {
    token: "C-008",
    service: "Diagnostic / Laboratory",
    counter: "Counter 03",
    waiting: 3,
    wait: "14 min",
    status: "Serving",
  },
  {
    token: "D-005",
    service: "Pharmacy Service",
    counter: "Counter 04",
    waiting: 2,
    wait: "8 min",
    status: "Waiting",
  },
];

const services = [
  "All",
  "General Consultation",
  "Specialist Consultation",
  "Diagnostic / Laboratory",
  "Pharmacy Service",
];

function SummaryCard({ icon, title, value, note, iconType }) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTop}>
        <Text style={styles.summaryLabel}>{title}</Text>

        <View
          style={[
            styles.summaryIcon,
            styles[`summaryIcon${iconType}`],
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={colors.primary}
          />
        </View>
      </View>

      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryNote}>{note}</Text>
    </View>
  );
}

function StatusBadge({ status }) {
  const isServing = status === "Serving";

  return (
    <View
      style={[
        styles.statusBadge,
        isServing
          ? styles.servingBadge
          : styles.waitingBadge,
      ]}
    >
      <View
        style={[
          styles.statusDot,
          isServing
            ? styles.servingDot
            : styles.waitingDot,
        ]}
      />

      <Text
        style={[
          styles.statusText,
          isServing
            ? styles.servingText
            : styles.waitingText,
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

function ServingCard({
  token,
  service,
  counter,
  nextToken,
}) {
  return (
    <View style={styles.servingCard}>
      <View style={styles.servingHeader}>
        <View>
          <Text style={styles.counterLabel}>{counter}</Text>
          <Text style={styles.servingToken}>{token}</Text>
        </View>

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <Text style={styles.servingService}>
        {service}
      </Text>

      <View style={styles.nextPatientRow}>
        <Text style={styles.nextPatientLabel}>
          Next Patient
        </Text>

        <Text style={styles.nextPatientToken}>
          {nextToken}
        </Text>
      </View>
    </View>
  );
}

export default function QueueManagement() {
  const [selectedService, setSelectedService] =
    useState("All");

  const filteredQueue = useMemo(() => {
    if (selectedService === "All") {
      return queueData;
    }

    return queueData.filter(
      (item) => item.service === selectedService
    );
  }, [selectedService]);

  const servingPatients = queueData.filter(
    (item) => item.status === "Serving"
  );

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Queue Management"
        subtitle="Monitor and control hospital queues"
      />

      <View style={styles.body}>
        <AdminSidebar active="Queue Management" />

        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary */}
          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="people-outline"
              title="Total Waiting"
              value="28"
              note="Patients currently waiting"
              iconType="Primary"
            />

            <SummaryCard
              icon="play-circle-outline"
              title="Currently Serving"
              value="3"
              note="Active counters"
              iconType="Success"
            />

            <SummaryCard
              icon="time-outline"
              title="Average Wait"
              value="18 min"
              note="Across all services"
              iconType="Warning"
            />

            <SummaryCard
              icon="checkmark-done-outline"
              title="Completed Today"
              value="98"
              note="Successfully completed"
              iconType="Blue"
            />
          </View>

          {/* Currently Serving */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Currently Serving
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Active hospital counters
                </Text>
              </View>

              <View style={styles.liveStatus}>
                <View style={styles.liveStatusDot} />
                <Text style={styles.liveStatusText}>
                  Queue Live
                </Text>
              </View>
            </View>

            <View style={styles.servingGrid}>
              <ServingCard
                token="A-024"
                service="General Consultation"
                counter="Counter 01"
                nextToken="A-025"
              />

              <ServingCard
                token="B-011"
                service="Specialist Consultation"
                counter="Counter 02"
                nextToken="B-012"
              />

              <ServingCard
                token="C-008"
                service="Diagnostic / Laboratory"
                counter="Counter 03"
                nextToken="C-009"
              />
            </View>
          </View>

          {/* Queue Controls */}
          <View style={styles.controlCard}>
            <View style={styles.controlInfo}>
              <View style={styles.controlIcon}>
                <Ionicons
                  name="megaphone-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>

              <View style={styles.controlText}>
                <Text style={styles.controlTitle}>
                  Queue Control
                </Text>

                <Text style={styles.controlSubtitle}>
                  Call the next patient from the active queue.
                </Text>
              </View>
            </View>

            <Pressable style={styles.callButton}>
              <Ionicons
                name="play"
                size={15}
                color={colors.white}
              />

              <Text style={styles.callButtonText}>
                Call Next Patient
              </Text>
            </Pressable>
          </View>

          {/* Filter */}
          <View style={styles.tableSection}>
            <View style={styles.tableTop}>
              <View>
                <Text style={styles.sectionTitle}>
                  Live Queue
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Current patient queue by service
                </Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {services.map((service) => {
                const active =
                  selectedService === service;

                return (
                  <Pressable
                    key={service}
                    style={[
                      styles.filterButton,
                      active && styles.filterButtonActive,
                    ]}
                    onPress={() =>
                      setSelectedService(service)
                    }
                  >
                    <Text
                      style={[
                        styles.filterText,
                        active && styles.filterTextActive,
                      ]}
                    >
                      {service}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Table */}
            <View style={styles.tableCard}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerToken}>
                  Token
                </Text>

                <Text style={styles.headerService}>
                  Service
                </Text>

                <Text style={styles.headerCounter}>
                  Counter
                </Text>

                <Text style={styles.headerWaiting}>
                  Waiting
                </Text>

                <Text style={styles.headerWait}>
                  Est. Wait
                </Text>

                <Text style={styles.headerStatus}>
                  Status
                </Text>
              </View>

              {filteredQueue.map((item) => (
                <View
                  key={item.token}
                  style={styles.tableRow}
                >
                  <Text style={styles.tokenCell}>
                    {item.token}
                  </Text>

                  <Text style={styles.serviceCell}>
                    {item.service}
                  </Text>

                  <Text style={styles.counterCell}>
                    {item.counter}
                  </Text>

                  <Text style={styles.waitingCell}>
                    {item.waiting}
                  </Text>

                  <Text style={styles.waitCell}>
                    {item.wait}
                  </Text>

                  <View style={styles.statusCell}>
                    <StatusBadge status={item.status} />
                  </View>
                </View>
              ))}

              {filteredQueue.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="file-tray-outline"
                    size={32}
                    color={colors.textLight}
                  />

                  <Text style={styles.emptyTitle}>
                    No Queue Data
                  </Text>

                  <Text style={styles.emptyText}>
                    No patients are available for this service.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Queue Information */}
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="information-circle-outline"
                size={21}
                color={colors.primary}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Queue Information
              </Text>

              <Text style={styles.infoText}>
                Queue data is currently displayed using
                realistic demo data. Real-time backend
                integration will connect this screen with
                the central OptiQueue database.
              </Text>
            </View>
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