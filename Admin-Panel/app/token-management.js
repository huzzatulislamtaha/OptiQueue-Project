import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import styles from "../styles/tokenManagement";
import { colors } from "../styles/theme";

const tokenData = [
  {
    token: "A-024",
    patient: "Patient #024",
    service: "General Consultation",
    counter: "Counter 01",
    time: "10:32 AM",
    status: "Serving",
  },
  {
    token: "A-025",
    patient: "Patient #025",
    service: "General Consultation",
    counter: "Counter 01",
    time: "10:38 AM",
    status: "Waiting",
  },
  {
    token: "A-026",
    patient: "Patient #026",
    service: "General Consultation",
    counter: "Counter 01",
    time: "10:44 AM",
    status: "Waiting",
  },
  {
    token: "A-027",
    patient: "Patient #027",
    service: "General Consultation",
    counter: "Counter 01",
    time: "10:49 AM",
    status: "Waiting",
  },
  {
    token: "B-011",
    patient: "Patient #011",
    service: "Specialist Consultation",
    counter: "Counter 02",
    time: "10:35 AM",
    status: "Serving",
  },
  {
    token: "B-012",
    patient: "Patient #012",
    service: "Specialist Consultation",
    counter: "Counter 02",
    time: "10:43 AM",
    status: "Waiting",
  },
  {
    token: "C-008",
    patient: "Patient #008",
    service: "Diagnostic / Laboratory",
    counter: "Counter 03",
    time: "10:40 AM",
    status: "Serving",
  },
  {
    token: "D-005",
    patient: "Patient #005",
    service: "Pharmacy Service",
    counter: "Counter 04",
    time: "10:47 AM",
    status: "Completed",
  },
];

const filters = [
  "All",
  "Waiting",
  "Serving",
  "Completed",
];

function SummaryCard({
  icon,
  title,
  value,
  note,
  iconStyle,
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTop}>
        <Text style={styles.summaryLabel}>
          {title}
        </Text>

        <View
          style={[
            styles.summaryIcon,
            iconStyle,
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={colors.primary}
          />
        </View>
      </View>

      <Text style={styles.summaryValue}>
        {value}
      </Text>

      <Text style={styles.summaryNote}>
        {note}
      </Text>
    </View>
  );
}

function StatusBadge({ status }) {
  let badgeStyle = styles.waitingBadge;
  let textStyle = styles.waitingText;
  let dotStyle = styles.waitingDot;

  if (status === "Serving") {
    badgeStyle = styles.servingBadge;
    textStyle = styles.servingText;
    dotStyle = styles.servingDot;
  }

  if (status === "Completed") {
    badgeStyle = styles.completedBadge;
    textStyle = styles.completedText;
    dotStyle = styles.completedDot;
  }

  return (
    <View
      style={[
        styles.statusBadge,
        badgeStyle,
      ]}
    >
      <View
        style={[
          styles.statusDot,
          dotStyle,
        ]}
      />

      <Text
        style={[
          styles.statusText,
          textStyle,
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

export default function TokenManagement() {
  const [selectedFilter, setSelectedFilter] =
    useState("All");

  const filteredTokens = useMemo(() => {
    if (selectedFilter === "All") {
      return tokenData;
    }

    return tokenData.filter(
      (item) => item.status === selectedFilter
    );
  }, [selectedFilter]);

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Token Management"
        subtitle="Create and manage patient queue tokens"
      />

      <View style={styles.body}>
        <AdminSidebar active="Token Management" />

        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary */}
          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="ticket-outline"
              title="Total Tokens"
              value="126"
              note="Generated today"
              iconStyle={styles.primaryIcon}
            />

            <SummaryCard
              icon="time-outline"
              title="Waiting"
              value="28"
              note="Currently waiting"
              iconStyle={styles.warningIcon}
            />

            <SummaryCard
              icon="play-circle-outline"
              title="Serving"
              value="3"
              note="Currently serving"
              iconStyle={styles.successIcon}
            />

            <SummaryCard
              icon="checkmark-circle-outline"
              title="Completed"
              value="98"
              note="Completed today"
              iconStyle={styles.blueIcon}
            />
          </View>

          {/* Create Token */}
          <View style={styles.createCard}>
            <View style={styles.createInfo}>
              <View style={styles.createIcon}>
                <Ionicons
                  name="add-circle-outline"
                  size={23}
                  color={colors.primary}
                />
              </View>

              <View style={styles.createText}>
                <Text style={styles.createTitle}>
                  Create New Token
                </Text>

                <Text style={styles.createSubtitle}>
                  Generate a digital queue token for a patient.
                </Text>
              </View>
            </View>

            <Pressable style={styles.createButton}>
              <Ionicons
                name="add"
                size={16}
                color={colors.white}
              />

              <Text style={styles.createButtonText}>
                Create Token
              </Text>
            </Pressable>
          </View>

          {/* Token Table */}
          <View style={styles.tableSection}>
            <View style={styles.tableTop}>
              <View>
                <Text style={styles.sectionTitle}>
                  Token List
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Today's generated digital tokens
                </Text>
              </View>

              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />

                <Text style={styles.liveText}>
                  Live
                </Text>
              </View>
            </View>

            {/* Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {filters.map((filter) => {
                const active =
                  selectedFilter === filter;

                return (
                  <Pressable
                    key={filter}
                    style={[
                      styles.filterButton,
                      active &&
                        styles.filterButtonActive,
                    ]}
                    onPress={() =>
                      setSelectedFilter(filter)
                    }
                  >
                    <Text
                      style={[
                        styles.filterText,
                        active &&
                          styles.filterTextActive,
                      ]}
                    >
                      {filter}
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

                <Text style={styles.headerPatient}>
                  Patient
                </Text>

                <Text style={styles.headerService}>
                  Service
                </Text>

                <Text style={styles.headerCounter}>
                  Counter
                </Text>

                <Text style={styles.headerTime}>
                  Created
                </Text>

                <Text style={styles.headerStatus}>
                  Status
                </Text>
              </View>

              {filteredTokens.map((item) => (
                <View
                  key={item.token}
                  style={styles.tableRow}
                >
                  <Text style={styles.tokenCell}>
                    {item.token}
                  </Text>

                  <Text style={styles.patientCell}>
                    {item.patient}
                  </Text>

                  <Text style={styles.serviceCell}>
                    {item.service}
                  </Text>

                  <Text style={styles.counterCell}>
                    {item.counter}
                  </Text>

                  <Text style={styles.timeCell}>
                    {item.time}
                  </Text>

                  <View style={styles.statusCell}>
                    <StatusBadge
                      status={item.status}
                    />
                  </View>
                </View>
              ))}

              {filteredTokens.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="ticket-outline"
                    size={34}
                    color={colors.textLight}
                  />

                  <Text style={styles.emptyTitle}>
                    No Tokens Found
                  </Text>

                  <Text style={styles.emptyText}>
                    There are no tokens in this category.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Information + Quick Actions */}
          <View style={styles.bottomGrid}>
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
                  Digital Token System
                </Text>

                <Text style={styles.infoText}>
                  Patients receive digital tokens through
                  the OptiQueue mobile application. The
                  token remains connected to the selected
                  hospital service and queue.
                </Text>
              </View>
            </View>

            <View style={styles.quickCard}>
              <Text style={styles.quickTitle}>
                Quick Actions
              </Text>

              <Pressable style={styles.quickButton}>
                <Ionicons
                  name="refresh-outline"
                  size={16}
                  color={colors.primary}
                />

                <Text style={styles.quickButtonText}>
                  Refresh Tokens
                </Text>
              </Pressable>

              <Pressable style={styles.quickButton}>
                <Ionicons
                  name="download-outline"
                  size={16}
                  color={colors.primary}
                />

                <Text style={styles.quickButtonText}>
                  Export Tokens
                </Text>
              </Pressable>
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