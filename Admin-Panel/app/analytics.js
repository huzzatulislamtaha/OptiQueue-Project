import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

import styles from "../styles/analytics";

const serviceData = [
  {
    name: "General Consultation",
    tokens: 52,
    completed: 41,
    waiting: 5,
    avgWait: "18 min",
  },
  {
    name: "Specialist Consultation",
    tokens: 31,
    completed: 20,
    waiting: 8,
    avgWait: "32 min",
  },
  {
    name: "Diagnostic / Laboratory",
    tokens: 24,
    completed: 21,
    waiting: 3,
    avgWait: "14 min",
  },
  {
    name: "Pharmacy Service",
    tokens: 19,
    completed: 16,
    waiting: 2,
    avgWait: "08 min",
  },
];

const hourlyData = [
  { time: "09 AM", tokens: 8 },
  { time: "10 AM", tokens: 14 },
  { time: "11 AM", tokens: 21 },
  { time: "12 PM", tokens: 18 },
  { time: "01 PM", tokens: 12 },
  { time: "02 PM", tokens: 24 },
  { time: "03 PM", tokens: 17 },
  { time: "04 PM", tokens: 12 },
];

function MetricCard({
  icon,
  title,
  value,
  change,
  description,
}) {
  return (
    <View style={styles.metricCard}>

      <View style={styles.metricTop}>

        <View style={styles.metricIcon}>
          <Ionicons
            name={icon}
            size={21}
            color="#079C91"
          />
        </View>

        <View style={styles.changeBadge}>

          <Ionicons
            name="trending-up"
            size={12}
            color="#16A34A"
          />

          <Text style={styles.changeText}>
            {change}
          </Text>

        </View>

      </View>

      <Text style={styles.metricValue}>
        {value}
      </Text>

      <Text style={styles.metricTitle}>
        {title}
      </Text>

      <Text style={styles.metricDescription}>
        {description}
      </Text>

    </View>
  );
}

function ServiceAnalyticsRow({ item }) {
  return (
    <View style={styles.serviceRow}>

      <View style={styles.serviceNameArea}>

        <View style={styles.serviceIcon}>
          <Ionicons
            name="medical-outline"
            size={18}
            color="#079C91"
          />
        </View>

        <Text style={styles.serviceName}>
          {item.name}
        </Text>

      </View>

      <Text style={styles.serviceValue}>
        {item.tokens}
      </Text>

      <Text style={styles.serviceValue}>
        {item.completed}
      </Text>

      <Text style={styles.serviceValue}>
        {item.waiting}
      </Text>

      <Text style={styles.serviceWait}>
        {item.avgWait}
      </Text>

    </View>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState("Today");

  const periods = [
    "Today",
    "This Week",
    "This Month",
  ];

  return (
    <View style={styles.container}>

      {/* SIDEBAR */}
      <AdminSidebar active="Analytics" />

      {/* MAIN */}
      <View style={styles.main}>

        {/* HEADER */}
        <AdminHeader
          title="Analytics"
          subtitle="Analyze hospital queue performance and activity"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >

          {/* PAGE HEADER */}
          <View style={styles.pageHeader}>

            <View>
              <Text style={styles.pageTitle}>
                Queue Analytics
              </Text>

              <Text style={styles.pageSubtitle}>
                Monitor queue performance, patient flow and service efficiency
              </Text>
            </View>

            {/* PERIOD SELECTOR */}
            <View style={styles.periodContainer}>

              {periods.map((item) => {

                const active = period === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setPeriod(item)}
                    style={
                      active
                        ? styles.periodActive
                        : styles.periodItem
                    }
                  >

                    <Text
                      style={
                        active
                          ? styles.periodActiveText
                          : styles.periodText
                      }
                    >
                      {item}
                    </Text>

                  </Pressable>
                );
              })}

            </View>

          </View>

          {/* METRICS */}
          <View style={styles.metricsGrid}>

            <MetricCard
              icon="ticket-outline"
              title="Total Tokens"
              value="126"
              change="+12.5%"
              description="Compared with previous period"
            />

            <MetricCard
              icon="checkmark-done-outline"
              title="Completion Rate"
              value="77.8%"
              change="+5.2%"
              description="Tokens successfully completed"
            />

            <MetricCard
              icon="time-outline"
              title="Average Wait Time"
              value="18 min"
              change="-8.4%"
              description="Average patient waiting time"
            />

            <MetricCard
              icon="people-outline"
              title="Patients Served"
              value="98"
              change="+10.1%"
              description="Patients completed today"
            />

          </View>

          {/* CHART + INSIGHT */}
          <View style={styles.chartGrid}>

            {/* HOURLY CHART */}
            <View style={styles.chartCard}>

              <View style={styles.cardHeader}>

                <View>
                  <Text style={styles.cardTitle}>
                    Token Activity
                  </Text>

                  <Text style={styles.cardSubtitle}>
                    Tokens generated throughout the day
                  </Text>
                </View>

                <View style={styles.chartLegend}>

                  <View style={styles.legendDot} />

                  <Text style={styles.legendText}>
                    Tokens
                  </Text>

                </View>

              </View>

              <View style={styles.chartArea}>

                {hourlyData.map((item, index) => {

                  const maxValue = 24;
                  const height =
                    (item.tokens / maxValue) * 130;

                  return (
                    <View
                      key={index}
                      style={styles.barColumn}
                    >

                      <Text style={styles.barValue}>
                        {item.tokens}
                      </Text>

                      <View style={styles.barBackground}>

                        <View
                          style={[
                            styles.bar,
                            {
                              height,
                            },
                          ]}
                        />

                      </View>

                      <Text style={styles.barLabel}>
                        {item.time}
                      </Text>

                    </View>
                  );
                })}

              </View>

            </View>

            {/* QUEUE INSIGHTS */}
            <View style={styles.insightCard}>

              <View style={styles.cardHeader}>

                <View>
                  <Text style={styles.cardTitle}>
                    Queue Insights
                  </Text>

                  <Text style={styles.cardSubtitle}>
                    Current system observations
                  </Text>
                </View>

                <Ionicons
                  name="bulb-outline"
                  size={22}
                  color="#079C91"
                />

              </View>

              <View style={styles.insightItem}>

                <View style={styles.insightIcon}>
                  <Ionicons
                    name="trending-up-outline"
                    size={18}
                    color="#16A34A"
                  />
                </View>

                <View style={styles.insightText}>

                  <Text style={styles.insightTitle}>
                    High Activity
                  </Text>

                  <Text style={styles.insightDescription}>
                    Patient traffic is highest around 2 PM.
                  </Text>

                </View>

              </View>

              <View style={styles.insightItem}>

                <View style={styles.insightIcon}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color="#F59E0B"
                  />
                </View>

                <View style={styles.insightText}>

                  <Text style={styles.insightTitle}>
                    Waiting Time
                  </Text>

                  <Text style={styles.insightDescription}>
                    Specialist consultation has the longest queue.
                  </Text>

                </View>

              </View>

              <View style={styles.insightItem}>

                <View style={styles.insightIcon}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color="#079C91"
                  />
                </View>

                <View style={styles.insightText}>

                  <Text style={styles.insightTitle}>
                    Good Completion
                  </Text>

                  <Text style={styles.insightDescription}>
                    Overall completion rate is currently 77.8%.
                  </Text>

                </View>

              </View>

            </View>

          </View>

          {/* SERVICE PERFORMANCE */}
          <View style={styles.serviceCard}>

            <View style={styles.cardHeader}>

              <View>
                <Text style={styles.cardTitle}>
                  Service Performance
                </Text>

                <Text style={styles.cardSubtitle}>
                  Performance breakdown by hospital service
                </Text>
              </View>

              <Pressable style={styles.exportButton}>

                <Ionicons
                  name="download-outline"
                  size={17}
                  color="#079C91"
                />

                <Text style={styles.exportText}>
                  Export
                </Text>

              </Pressable>

            </View>

            {/* TABLE HEADER */}
            <View style={styles.serviceHeader}>

              <Text
                style={[
                  styles.serviceHeaderText,
                  { flex: 2 },
                ]}
              >
                SERVICE
              </Text>

              <Text
                style={[
                  styles.serviceHeaderText,
                  { flex: 1 },
                ]}
              >
                TOKENS
              </Text>

              <Text
                style={[
                  styles.serviceHeaderText,
                  { flex: 1 },
                ]}
              >
                COMPLETED
              </Text>

              <Text
                style={[
                  styles.serviceHeaderText,
                  { flex: 1 },
                ]}
              >
                WAITING
              </Text>

              <Text
                style={[
                  styles.serviceHeaderText,
                  { flex: 1 },
                ]}
              >
                AVG. WAIT
              </Text>

            </View>

            {/* SERVICE ROWS */}
            {serviceData.map((item, index) => (

              <ServiceAnalyticsRow
                key={index}
                item={item}
              />

            ))}

          </View>

          {/* AI PREDICTION PREVIEW */}
          <View style={styles.aiCard}>

            <View style={styles.aiIcon}>

              <Ionicons
                name="sparkles-outline"
                size={25}
                color="#079C91"
              />

            </View>

            <View style={styles.aiText}>

              <Text style={styles.aiTitle}>
                AI Queue Prediction
              </Text>

              <Text style={styles.aiDescription}>
                Predictive waiting-time and queue analysis
                will be integrated in the AI/ML phase of OptiQueue.
              </Text>

            </View>

            <View style={styles.aiStatus}>

              <Text style={styles.aiStatusText}>
                Coming Soon
              </Text>

            </View>

          </View>

          {/* FOOTER */}
          <View style={styles.footer}>

            <Text style={styles.footerText}>
              OptiQueue • Smart Hospital Queue Management System
            </Text>

            <Text style={styles.footerText}>
              Admin Panel v1.0.0
            </Text>

          </View>

        </ScrollView>

      </View>

    </View>
  );
}