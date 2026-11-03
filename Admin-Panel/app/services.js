import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import styles from "../styles/services";
import { colors } from "../styles/theme";

const initialServices = [
  {
    code: "GEN",
    name: "General Consultation",
    waiting: 5,
    avgWait: "18 min",
    currentToken: "A-024",
    counter: "Counter 01",
    status: "Active",
  },
  {
    code: "SPC",
    name: "Specialist Consultation",
    waiting: 8,
    avgWait: "32 min",
    currentToken: "B-011",
    counter: "Counter 02",
    status: "Active",
  },
  {
    code: "LAB",
    name: "Diagnostic / Laboratory",
    waiting: 3,
    avgWait: "14 min",
    currentToken: "C-008",
    counter: "Counter 03",
    status: "Active",
  },
  {
    code: "PHA",
    name: "Pharmacy Service",
    waiting: 2,
    avgWait: "8 min",
    currentToken: "D-005",
    counter: "Counter 04",
    status: "Active",
  },
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
        <Text style={styles.summaryLabel}>{title}</Text>

        <View style={[styles.summaryIcon, iconStyle]}>
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

function ServiceCard({ service }) {
  return (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>
            {service.code}
          </Text>
        </View>

        <View style={styles.activeBadge}>
          <View style={styles.activeDot} />

          <Text style={styles.activeText}>
            {service.status}
          </Text>
        </View>
      </View>

      <Text style={styles.serviceName}>
        {service.name}
      </Text>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>
            Waiting
          </Text>

          <Text style={styles.metricValue}>
            {service.waiting}
          </Text>
        </View>

        <View style={styles.metric}>
          <Text style={styles.metricLabel}>
            Avg. Wait
          </Text>

          <Text style={styles.metricValue}>
            {service.avgWait}
          </Text>
        </View>
      </View>

      <View style={styles.serviceFooter}>
        <View>
          <Text style={styles.footerLabel}>
            Current Token
          </Text>

          <Text style={styles.footerValue}>
            {service.currentToken}
          </Text>
        </View>

        <View style={styles.counterBox}>
          <Ionicons
            name="desktop-outline"
            size={14}
            color={colors.primary}
          />

          <Text style={styles.counterText}>
            {service.counter}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function Services() {
  const [services, setServices] =
    useState(initialServices);

  const activeServices = services.filter(
    (service) => service.status === "Active"
  );

  const totalWaiting = services.reduce(
    (total, service) => total + service.waiting,
    0
  );

  const toggleService = (code) => {
    setServices((current) =>
      current.map((service) =>
        service.code === code
          ? {
              ...service,
              status:
                service.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : service
      )
    );
  };

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Services"
        subtitle="Manage hospital services and counters"
      />

      <View style={styles.body}>
        <AdminSidebar active="Services" />

        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary */}
          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="medical-outline"
              title="Total Services"
              value={services.length}
              note="Configured hospital services"
              iconStyle={styles.primaryIcon}
            />

            <SummaryCard
              icon="checkmark-circle-outline"
              title="Active Services"
              value={activeServices.length}
              note="Currently available"
              iconStyle={styles.successIcon}
            />

            <SummaryCard
              icon="people-outline"
              title="Total Waiting"
              value={totalWaiting}
              note="Across all services"
              iconStyle={styles.warningIcon}
            />

            <SummaryCard
              icon="desktop-outline"
              title="Active Counters"
              value="4"
              note="Currently operational"
              iconStyle={styles.blueIcon}
            />
          </View>

          {/* Add Service */}
          <View style={styles.addCard}>
            <View style={styles.addInfo}>
              <View style={styles.addIcon}>
                <Ionicons
                  name="add-circle-outline"
                  size={23}
                  color={colors.primary}
                />
              </View>

              <View style={styles.addText}>
                <Text style={styles.addTitle}>
                  Hospital Services
                </Text>

                <Text style={styles.addSubtitle}>
                  Configure consultation, diagnostic and
                  pharmacy services.
                </Text>
              </View>
            </View>

            <Pressable style={styles.addButton}>
              <Ionicons
                name="add"
                size={16}
                color={colors.white}
              />

              <Text style={styles.addButtonText}>
                Add Service
              </Text>
            </Pressable>
          </View>

          {/* Service Grid */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Available Services
              </Text>

              <Text style={styles.sectionSubtitle}>
                Current service configuration and queue status
              </Text>
            </View>
          </View>

          <View style={styles.serviceGrid}>
            {services.map((service) => (
              <ServiceCard
                key={service.code}
                service={service}
              />
            ))}
          </View>

          {/* Configuration */}
          <View style={styles.configurationCard}>
            <View style={styles.configurationHeader}>
              <View>
                <Text style={styles.configurationTitle}>
                  Service Configuration
                </Text>

                <Text style={styles.configurationSubtitle}>
                  Enable or disable services for the patient app.
                </Text>
              </View>

              <Ionicons
                name="settings-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            {services.map((service) => {
              const active =
                service.status === "Active";

              return (
                <View
                  key={service.code}
                  style={styles.configRow}
                >
                  <View style={styles.configInfo}>
                    <View style={styles.configCode}>
                      <Text style={styles.configCodeText}>
                        {service.code}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.configName}>
                        {service.name}
                      </Text>

                      <Text style={styles.configCounter}>
                        {service.counter}
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    style={[
                      styles.toggle,
                      active && styles.toggleActive,
                    ]}
                    onPress={() =>
                      toggleService(service.code)
                    }
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        active &&
                          styles.toggleThumbActive,
                      ]}
                    />
                  </Pressable>
                </View>
              );
            })}
          </View>

          {/* Information */}
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
                Service Management
              </Text>

              <Text style={styles.infoText}>
                Services define the different queue categories
                available to patients. Backend integration will
                later allow administrators to manage services,
                counters and queue rules from the central system.
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