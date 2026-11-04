
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Share,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import styles from "../styles/tokenManagement";
import { colors } from "../styles/theme";

import { API_BASE_URL } from "../constants/api";
import { useAuth } from "../context/AuthContext";

const filters = [
  "All",
  "Waiting",
  "Serving",
  "Completed",
  "Cancelled",
];

// Convert backend status to readable text
function formatStatus(status) {
  switch (String(status || "").toLowerCase()) {
    case "serving":
      return "Serving";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    case "waiting":
    default:
      return "Waiting";
  }
}

// Format token creation time
function formatDateTime(dateValue) {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Safely format CSV values
function csvValue(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

// Read related Supabase data
function getRelationName(relation) {
  if (Array.isArray(relation)) {
    return relation[0]?.name || null;
  }

  return relation?.name || null;
}

// Summary Card
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

// Token Status Badge
function StatusBadge({ status }) {
  let badgeStyle = styles.waitingBadge;
  let textStyle = styles.waitingText;
  let dotStyle = styles.waitingDot;

  if (status === "Serving") {
    badgeStyle = styles.servingBadge;
    textStyle = styles.servingText;
    dotStyle = styles.servingDot;
  } else if (status === "Completed") {
    badgeStyle = styles.completedBadge;
    textStyle = styles.completedText;
    dotStyle = styles.completedDot;
  }

  const cancelled = status === "Cancelled";

  return (
    <View
      style={[
        styles.statusBadge,
        badgeStyle,
        cancelled && {
          backgroundColor: "#FEE2E2",
        },
      ]}
    >
      <View
        style={[
          styles.statusDot,
          dotStyle,
          cancelled && {
            backgroundColor: "#DC2626",
          },
        ]}
      />

      <Text
        style={[
          styles.statusText,
          textStyle,
          cancelled && {
            color: "#B91C1C",
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

export default function TokenManagement() {
  const { token } = useAuth();

  const [selectedFilter, setSelectedFilter] =
    useState("All");

  const [tokens, setTokens] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isLive, setIsLive] = useState(false);
  const [loadError, setLoadError] = useState("");

  const mounted = useRef(true);
  const requestId = useRef(0);

  // Prevent state updates after screen unmount
  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      requestId.current += 1;
    };
  }, []);

  // Fetch JSON safely
  const fetchJSON = async (url, headers) => {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid response received from Backend.");
    }

    if (!response.ok || !data?.success) {
      throw new Error(
        data?.message || `Request failed (${response.status}).`
      );
    }

    return data;
  };

  // Fetch Token Management data
  const fetchTokenData = useCallback(
    async (manualRefresh = false) => {
      if (!token) {
        setIsLive(false);
        setLoadError("Admin login session is unavailable.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const currentRequest = ++requestId.current;
      const timestamp = Date.now();

      if (manualRefresh) {
        setRefreshing(true);
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        // Fetch main Token List and Dashboard
        const [tokenResult, dashboardResult, serviceResult] =
          await Promise.allSettled([
            fetchJSON(
              `${API_BASE_URL}/admin/tokens?_=${timestamp}`,
              headers
            ),

            fetchJSON(
              `${API_BASE_URL}/admin/dashboard?_=${timestamp}`,
              headers
            ),

            fetchJSON(
              `${API_BASE_URL}/services?_=${timestamp}`,
              headers
            ),
          ]);

        if (
          !mounted.current ||
          currentRequest !== requestId.current
        ) {
          return;
        }

        const errors = [];

        // Token List
        if (tokenResult.status === "fulfilled") {
          const data = tokenResult.value;

          if (Array.isArray(data.tokens)) {
            setTokens(data.tokens);
          } else {
            errors.push("Invalid Token List response.");
          }
        } else {
          errors.push("Token List could not be loaded.");
        }

        // Dashboard
        if (dashboardResult.status === "fulfilled") {
          setDashboard(dashboardResult.value);
        } else {
          errors.push("Dashboard information could not be loaded.");
        }

        // Services
        if (serviceResult.status === "fulfilled") {
          const data = serviceResult.value;

          if (Array.isArray(data.services)) {
            setServices(data.services);
          }
        } else {
          errors.push("Service information could not be loaded.");
        }

        if (
          !mounted.current ||
          currentRequest !== requestId.current
        ) {
          return;
        }

        // Main connection status
        const mainDataLoaded =
          tokenResult.status === "fulfilled" &&
          dashboardResult.status === "fulfilled" &&
          Array.isArray(tokenResult.value.tokens);

        setIsLive(mainDataLoaded);

        if (errors.length > 0) {
          setLoadError(errors.join(" "));
        } else {
          setLoadError("");
        }
      } catch (error) {
        if (
          !mounted.current ||
          currentRequest !== requestId.current
        ) {
          return;
        }

        console.log(
          "Token Management Error:",
          error.message
        );

        setIsLive(false);
        setLoadError(
          error.message || "Unable to connect to Backend."
        );
      } finally {
        if (
          mounted.current &&
          currentRequest === requestId.current
        ) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [token]
  );

  // Initial data loading
  useEffect(() => {
    fetchTokenData();
  }, [fetchTokenData]);

  // Automatic refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTokenData();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchTokenData]);

  // Convert Backend token records into table records
  const formattedTokens = useMemo(() => {
    return tokens.map((item) => {
      const service = services.find(
        (serviceItem) =>
          Number(serviceItem.id) === Number(item.service_id)
      );

      const patientName = getRelationName(item.users);
      const serviceName = getRelationName(item.services);
      const counterName = getRelationName(item.counters);

      return {
        id: item.id,

        token: item.token_number || "-",

        patient:
          patientName ||
          (item.user_id
            ? `Patient #${item.user_id}`
            : "Patient"),

        service:
          serviceName ||
          service?.name ||
          "Unknown Service",

        counter:
          counterName || "-",

        time: formatDateTime(item.issued_at),

        status: formatStatus(item.status),

        issuedAt: item.issued_at,
      };
    });
  }, [tokens, services]);

  // Apply status filter
  const filteredTokens = useMemo(() => {
    if (selectedFilter === "All") {
      return formattedTokens;
    }

    return formattedTokens.filter(
      (item) => item.status === selectedFilter
    );
  }, [selectedFilter, formattedTokens]);

  // Today's dashboard values
  const totalTokens = dashboard?.totalTokens ?? 0;
  const waitingTokens = dashboard?.waiting ?? 0;
  const servingTokens = dashboard?.serving ?? 0;
  const completedTokens = dashboard?.completed ?? 0;
  const cancelledTokens = dashboard?.cancelled ?? 0;

  // Admin Create Token
  const handleCreateToken = () => {
    Alert.alert(
      "Create New Token",
      "Admin token creation is not available in the current Backend API. Patients can currently create tokens through the Patient App.",
      [{ text: "OK" }]
    );
  };

  // Export CSV
  const handleExportTokens = async () => {
    if (formattedTokens.length === 0) {
      Alert.alert(
        "No Tokens",
        "There are no tokens available to export."
      );
      return;
    }

    try {
      const headers = [
        "Token",
        "Patient",
        "Service",
        "Counter",
        "Created",
        "Status",
      ];

      const rows = formattedTokens.map((item) => [
        item.token,
        item.patient,
        item.service,
        item.counter,
        item.time,
        item.status,
      ]);

      const csvContent = [
        headers.map(csvValue).join(","),
        ...rows.map((row) =>
          row.map(csvValue).join(",")
        ),
      ].join("\n");

      await Share.share({
        title: "OptiQueue Token Report",
        message: csvContent,
      });
    } catch (error) {
      Alert.alert(
        "Export Failed",
        error.message || "Unable to export tokens."
      );
    }
  };

  // Manual Refresh
  const handleRefresh = () => {
    fetchTokenData(true);
  };

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
          {/* Summary Cards */}
          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="ticket-outline"
              title="Total Tokens"
              value={loading ? "..." : totalTokens}
              note="Generated today"
              iconStyle={styles.primaryIcon}
            />

            <SummaryCard
              icon="time-outline"
              title="Waiting"
              value={loading ? "..." : waitingTokens}
              note="Currently waiting"
              iconStyle={styles.warningIcon}
            />

            <SummaryCard
              icon="play-circle-outline"
              title="Serving"
              value={loading ? "..." : servingTokens}
              note="Currently serving"
              iconStyle={styles.successIcon}
            />

            <SummaryCard
              icon="checkmark-circle-outline"
              title="Completed"
              value={loading ? "..." : completedTokens}
              note="Completed today"
              iconStyle={styles.blueIcon}
            />

            <SummaryCard
              icon="close-circle-outline"
              title="Cancelled"
              value={loading ? "..." : cancelledTokens}
              note="Cancelled today"
              iconStyle={styles.warningIcon}
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

            <Pressable
              style={styles.createButton}
              onPress={handleCreateToken}
            >
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
                  Latest generated digital tokens
                </Text>
              </View>

              <View style={styles.liveBadge}>
                <View
                  style={[
                    styles.liveDot,
                    !isLive && {
                      backgroundColor: "#EF4444",
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.liveText,
                    !isLive && {
                      color: "#EF4444",
                    },
                  ]}
                >
                  {isLive ? "Live" : "Offline"}
                </Text>
              </View>
            </View>

            {/* Error Message */}
            {!!loadError && (
              <View
                style={{
                  padding: 12,
                  marginBottom: 12,
                  borderRadius: 8,
                  backgroundColor: "#FEF2F2",
                }}
              >
                <Text
                  style={{
                    color: "#B91C1C",
                    fontSize: 13,
                  }}
                >
                  {loadError}
                </Text>
              </View>
            )}

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

            {/* Token Table */}
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

              {loading && tokens.length === 0 ? (
                <View
                  style={{
                    padding: 30,
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator
                    size="large"
                    color={colors.primary}
                  />

                  <Text
                    style={{
                      marginTop: 10,
                      color: colors.textLight,
                    }}
                  >
                    Loading tokens...
                  </Text>
                </View>
              ) : (
                <>
                  {filteredTokens.map((item) => (
                    <View
                      key={String(item.id)}
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
                </>
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

              <Pressable
                style={styles.quickButton}
                onPress={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="refresh-outline"
                    size={16}
                    color={colors.primary}
                  />
                )}

                <Text style={styles.quickButtonText}>
                  {refreshing
                    ? "Refreshing..."
                    : "Refresh Tokens"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.quickButton}
                onPress={handleExportTokens}
              >
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
