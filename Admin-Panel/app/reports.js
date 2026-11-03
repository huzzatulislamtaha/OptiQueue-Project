import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import styles from "../styles/reports";
import { colors } from "../styles/theme";

const reportTypes = [
  {
    icon: "bar-chart-outline",
    title: "Queue Performance",
    description:
      "Analyze waiting time, queue length and service performance.",
  },
  {
    icon: "ticket-outline",
    title: "Token Activity",
    description:
      "Review generated, served and completed digital tokens.",
  },
  {
    icon: "medical-outline",
    title: "Service Performance",
    description:
      "Compare performance across hospital services.",
  },
  {
    icon: "document-text-outline",
    title: "Daily Hospital Summary",
    description:
      "Generate a complete daily queue management summary.",
  },
];

const recentReports = [
  {
    name: "Daily Hospital Summary",
    period: "25 Sep 2026",
    generated: "25 Sep 2026, 6:10 PM",
    status: "Generated",
  },
  {
    name: "Queue Performance",
    period: "25 Sep 2026",
    generated: "25 Sep 2026, 5:42 PM",
    status: "Generated",
  },
  {
    name: "Service Performance",
    period: "This Week",
    generated: "25 Sep 2026, 4:20 PM",
    status: "Generated",
  },
  {
    name: "Token Activity",
    period: "This Month",
    generated: "24 Sep 2026, 6:05 PM",
    status: "Generated",
  },
];

const periods = [
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
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

        <View style={[styles.summaryIcon, iconStyle]}>
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

function ReportCard({ report }) {
  return (
    <View style={styles.reportCard}>
      <View style={styles.reportIcon}>
        <Ionicons
          name={report.icon}
          size={20}
          color={colors.primary}
        />
      </View>

      <Text style={styles.reportTitle}>
        {report.title}
      </Text>

      <Text style={styles.reportDescription}>
        {report.description}
      </Text>

      <Pressable style={styles.generateButton}>
        <Ionicons
          name="download-outline"
          size={14}
          color={colors.white}
        />

        <Text style={styles.generateButtonText}>
          Generate Report
        </Text>
      </Pressable>
    </View>
  );
}

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] =
    useState("Today");

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Reports"
        subtitle="Generate and review hospital queue reports"
      />

      <View style={styles.body}>
        <AdminSidebar active="Reports" />

        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary */}
          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="document-text-outline"
              title="Total Reports"
              value="24"
              note="Generated reports"
              iconStyle={styles.primaryIcon}
            />

            <SummaryCard
              icon="today-outline"
              title="Today's Reports"
              value="6"
              note="Generated today"
              iconStyle={styles.successIcon}
            />

            <SummaryCard
              icon="bar-chart-outline"
              title="Queue Reports"
              value="9"
              note="Queue performance reports"
              iconStyle={styles.warningIcon}
            />

            <SummaryCard
              icon="medical-outline"
              title="Service Reports"
              value="9"
              note="Service analysis reports"
              iconStyle={styles.blueIcon}
            />
          </View>

          {/* Period */}
          <View style={styles.periodSection}>
            <Text style={styles.periodTitle}>
              Report Period
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.periodRow}
            >
              {periods.map((period) => {
                const active =
                  selectedPeriod === period;

                return (
                  <Pressable
                    key={period}
                    style={[
                      styles.periodButton,
                      active &&
                        styles.periodButtonActive,
                    ]}
                    onPress={() =>
                      setSelectedPeriod(period)
                    }
                  >
                    <Text
                      style={[
                        styles.periodText,
                        active &&
                          styles.periodTextActive,
                      ]}
                    >
                      {period}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Generate Reports */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Generate Reports
              </Text>

              <Text style={styles.sectionSubtitle}>
                Select a report type to generate a summary.
              </Text>
            </View>

            <View style={styles.selectedPeriodBadge}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color={colors.primary}
              />

              <Text style={styles.selectedPeriodText}>
                {selectedPeriod}
              </Text>
            </View>
          </View>

          <View style={styles.reportGrid}>
            {reportTypes.map((report) => (
              <ReportCard
                key={report.title}
                report={report}
              />
            ))}
          </View>

          {/* Recent Reports */}
          <View style={styles.recentCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>
                  Recent Reports
                </Text>

                <Text style={styles.cardSubtitle}>
                  Previously generated reports
                </Text>
              </View>

              <Ionicons
                name="time-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.headerName}>
                Report
              </Text>

              <Text style={styles.headerPeriod}>
                Period
              </Text>

              <Text style={styles.headerGenerated}>
                Generated
              </Text>

              <Text style={styles.headerStatus}>
                Status
              </Text>

              <Text style={styles.headerAction}>
                Action
              </Text>
            </View>

            {/* Table Rows */}
            {recentReports.map((report) => (
              <View
                key={`${report.name}-${report.generated}`}
                style={styles.tableRow}
              >
                <Text style={styles.nameCell}>
                  {report.name}
                </Text>

                <Text style={styles.periodCell}>
                  {report.period}
                </Text>

                <Text style={styles.generatedCell}>
                  {report.generated}
                </Text>

                <View style={styles.statusCell}>
                  <View style={styles.generatedBadge}>
                    <View style={styles.generatedDot} />

                    <Text style={styles.generatedText}>
                      {report.status}
                    </Text>
                  </View>
                </View>

                <Pressable style={styles.viewButton}>
                  <Ionicons
                    name="eye-outline"
                    size={14}
                    color={colors.primary}
                  />

                  <Text style={styles.viewButtonText}>
                    View
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>

          {/* Report Information */}
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
                Report System
              </Text>

              <Text style={styles.infoText}>
                Reports will use queue, token and service data
                from the central OptiQueue database. The final
                system can generate downloadable reports for
                hospital administration and project analysis.
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