
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import styles from "../styles/dashboard";
import { colors } from "../styles/theme";

import { API_BASE_URL } from "../constants/api";
import { useAuth } from "../context/AuthContext";

// Display a number with two digits.
function formatNumber(value) {
  return String(value ?? 0).padStart(2, "0");
}

// Display estimated waiting time.
function formatWait(value) {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  return `${value} min`;
}

// Safely convert a date into a timestamp.
function getTimestamp(value) {
  if (!value) return Number.MAX_SAFE_INTEGER;

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? Number.MAX_SAFE_INTEGER
    : timestamp;
}

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
  const { token } = useAuth();

  const [dashboardData, setDashboardData] = useState({
    totalTokens: 0,
    waiting: 0,
    serving: 0,
    completed: 0,
  });

  const [queues, setQueues] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Load dashboard information from the backend.
  const loadDashboard = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setIsLive(false);
      return;
    }

    try {
      setLoadError("");

      const authHeaders = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const publicHeaders = {
        Accept: "application/json",
      };

      const [
        dashboardResponse,
        queueResponse,
        servicesResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/dashboard`, {
          method: "GET",
          headers: authHeaders,
        }),

        fetch(`${API_BASE_URL}/queue/live`, {
          method: "GET",
          headers: publicHeaders,
        }),

        fetch(`${API_BASE_URL}/services`, {
          method: "GET",
          headers: publicHeaders,
        }),
      ]);

      // Convert API responses into JSON.
      const dashboardResult = await dashboardResponse.json();
      const queueResult = await queueResponse.json();
      const servicesResult = await servicesResponse.json();

      // Check dashboard API response.
      if (!dashboardResponse.ok || !dashboardResult.success) {
        throw new Error(
          dashboardResult.message ||
            "Dashboard data could not be loaded."
        );
      }

      // Check live queue API response.
      if (!queueResponse.ok || !queueResult.success) {
        throw new Error(
          queueResult.message ||
            "Live queue data could not be loaded."
        );
      }

      // Check services API response.
      if (!servicesResponse.ok || !servicesResult.success) {
        throw new Error(
          servicesResult.message ||
            "Service data could not be loaded."
        );
      }

      // Update today's dashboard statistics.
      setDashboardData({
        totalTokens: dashboardResult.totalTokens ?? 0,
        waiting: dashboardResult.waiting ?? 0,
        serving: dashboardResult.serving ?? 0,
        completed: dashboardResult.completed ?? 0,
      });

      // Update live queues.
      setQueues(
        Array.isArray(queueResult.queues)
          ? queueResult.queues
          : []
      );

      // Update active services.
      setServices(
        Array.isArray(servicesResult.services)
          ? servicesResult.services
          : []
      );

      // All required API requests succeeded.
      setIsLive(true);
    } catch (error) {
      console.error("Dashboard loading error:", error.message);

      setLoadError(
        error.message || "Unable to connect to the server."
      );

      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load data after login and refresh every 15 seconds.
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    loadDashboard();

    const refreshInterval = setInterval(() => {
      loadDashboard();
    }, 15000);

    return () => clearInterval(refreshInterval);
  }, [token, loadDashboard]);

  // Find the currently serving queue.
  const servingQueue = queues.find(
    (item) => item.nowServing
  );

  const currentToken = servingQueue?.nowServing || null;

  // Collect waiting tokens from every service.
  const allWaitingTokens = queues.flatMap((queue) =>
    (Array.isArray(queue.waiting) ? queue.waiting : []).map(
      (item) => ({
        ...item,
        serviceId: queue.serviceId,
        service: queue.service,
      })
    )
  );

  // Sort all waiting tokens by issue time.
  const sortedWaitingTokens = [...allWaitingTokens].sort(
    (a, b) =>
      getTimestamp(a.issuedAt) - getTimestamp(b.issuedAt)
  );

  // Select the earliest issued waiting token.
  const nextToken = sortedWaitingTokens[0] || null;

  // Create service-wise queue information.
  const queueData = services.map((service) => {
    const queue = queues.find(
      (item) =>
        String(item.serviceId) === String(service.id)
    );

    return {
      service: service.name,
      token: queue?.nowServing?.token || "--",
      waiting: formatNumber(queue?.waiting?.length || 0),
      wait: formatWait(service.estimated_wait_minutes),
    };
  });

  // Currently serving information.
  const servingLabel = currentToken?.token || "--";

  const servingService =
    servingQueue?.service || "No active service";

  const counterName =
    currentToken?.counter || "Not assigned";

  // Next patient information.
  const nextTokenLabel = nextToken?.token || "--";

  // Estimated wait for the currently serving service.
  const servingEstimatedWait = servingQueue
    ? formatWait(
        services.find(
          (item) =>
            String(item.id) === String(servingQueue.serviceId)
        )?.estimated_wait_minutes
      )
    : "--";

  // Waiting patients in the currently serving service.
  const servingWaitingCount = servingQueue
    ? servingQueue.waiting?.length || 0
    : 0;

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
              value={loading ? "--" : dashboardData.totalTokens}
              note="Today's generated tokens"
              iconBackground={colors.primaryLight}
            />

            <StatCard
              icon="people-outline"
              label="Waiting Patients"
              value={loading ? "--" : dashboardData.waiting}
              note="Currently in queue"
              iconBackground={colors.blueLight}
            />

            <StatCard
              icon="play-circle-outline"
              label="Now Serving"
              value={loading ? "--" : servingLabel}
              note={counterName}
              iconBackground={colors.successLight}
            />

            <StatCard
              icon="checkmark-circle-outline"
              label="Completed"
              value={loading ? "--" : dashboardData.completed}
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
                  <Text style={styles.servingToken}>
                    {loading ? "--" : servingLabel}
                  </Text>

                  <View style={styles.servingStatus}>
                    <Text style={styles.servingStatusText}>
                      {loading
                        ? "LOADING"
                        : currentToken
                        ? "SERVING"
                        : "NO ACTIVE TOKEN"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.serviceName}>
                  {loading ? "Loading..." : servingService}
                </Text>

                <Text style={styles.counterText}>
                  {loading ? "--" : counterName}
                </Text>

                <View style={styles.nextRow}>
                  <Text style={styles.nextLabel}>
                    Next Patient
                  </Text>

                  <Text style={styles.nextToken}>
                    {loading ? "--" : nextTokenLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.nextInfoRow}>
                <View style={styles.nextInfoItem}>
                  <Text style={styles.nextInfoLabel}>
                    Waiting
                  </Text>

                  <Text style={styles.nextInfoValue}>
                    {loading
                      ? "--"
                      : `${formatNumber(
                          servingWaitingCount
                        )} patients`}
                  </Text>
                </View>

                <View style={styles.nextInfoItem}>
                  <Text style={styles.nextInfoLabel}>
                    Estimated Wait
                  </Text>

                  <Text style={styles.nextInfoValue}>
                    {loading ? "--" : servingEstimatedWait}
                  </Text>
                </View>

                <View style={styles.nextInfoItem}>
                  <Text style={styles.nextInfoLabel}>
                    Queue Status
                  </Text>

                  <Text style={styles.liveQueueText}>
                    {loading
                      ? "Loading"
                      : isLive
                      ? "Live"
                      : "Offline"}
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
            {queueData.map((item, index) => (
              <View
                key={services[index]?.id || item.service}
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

            {!loading && queueData.length === 0 && (
              <Text style={styles.queueValue}>
                No active services found.
              </Text>
            )}
          </View>

          {/* Loading / Error Message */}
          {loading && (
            <Text style={styles.footerText}>
              Loading dashboard data...
            </Text>
          )}

          {!!loadError && (
            <Text style={styles.footerText}>
              {loadError}
            </Text>
          )}

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
