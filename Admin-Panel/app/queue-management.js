
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

import styles from "../styles/queueManagement";
import { colors } from "../styles/theme";

import { API_BASE_URL } from "../constants/api";
import { useAuth } from "../context/AuthContext";

// Format waiting time.
function formatWait(value) {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  return `${value} min`;
}

// Format token status.
function formatStatus(status) {
  if (status === "serving") return "Serving";
  if (status === "waiting") return "Waiting";

  return status || "Unknown";
}

// Safely convert date into timestamp.
function getTimestamp(value) {
  if (!value) return Number.MAX_SAFE_INTEGER;

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? Number.MAX_SAFE_INTEGER
    : timestamp;
}

// Summary Card.
function SummaryCard({
  icon,
  title,
  value,
  note,
  iconType,
}) {
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

// Token Status Badge.
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

// Currently Serving Card.
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
          <Text style={styles.counterLabel}>
            {counter}
          </Text>

          <Text style={styles.servingToken}>
            {token}
          </Text>
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
  const { token } = useAuth();

  // Backend data.
  const [queues, setQueues] = useState([]);
  const [services, setServices] = useState([]);
  const [counters, setCounters] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    completed: 0,
  });

  // UI states.
  const [selectedService, setSelectedService] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [callingNext, setCallingNext] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Load all queue data from backend.
  const loadQueueData = useCallback(
    async (showLoader = false) => {
      if (!token) {
        setLoading(false);
        setIsLive(false);
        return;
      }

      if (showLoader) {
        setRefreshing(true);
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

        // Request all required APIs together.
        const [
          queueResponse,
          servicesResponse,
          dashboardResponse,
          countersResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/queue/live?_=${Date.now()}`,
            {
              method: "GET",
              headers: publicHeaders,
              cache: "no-store",
            }
          ),

          fetch(
            `${API_BASE_URL}/services?_=${Date.now()}`,
            {
              method: "GET",
              headers: publicHeaders,
              cache: "no-store",
            }
          ),

          fetch(
            `${API_BASE_URL}/admin/dashboard?_=${Date.now()}`,
            {
              method: "GET",
              headers: authHeaders,
              cache: "no-store",
            }
          ),

          fetch(
            `${API_BASE_URL}/admin/counters?_=${Date.now()}`,
            {
              method: "GET",
              headers: authHeaders,
              cache: "no-store",
            }
          ),
        ]);

        const [
          queueResult,
          servicesResult,
          dashboardResult,
          countersResult,
        ] = await Promise.all([
          queueResponse.json(),
          servicesResponse.json(),
          dashboardResponse.json(),
          countersResponse.json(),
        ]);

        // Validate API responses.
        if (!queueResponse.ok || !queueResult.success) {
          throw new Error(
            queueResult.message || "Live queue could not be loaded."
          );
        }

        if (!servicesResponse.ok || !servicesResult.success) {
          throw new Error(
            servicesResult.message || "Services could not be loaded."
          );
        }

        if (!dashboardResponse.ok || !dashboardResult.success) {
          throw new Error(
            dashboardResult.message ||
              "Dashboard statistics could not be loaded."
          );
        }

        if (!countersResponse.ok || !countersResult.success) {
          throw new Error(
            countersResult.message ||
              "Counters could not be loaded."
          );
        }

        // Save queue data.
        setQueues(
          Array.isArray(queueResult.queues)
            ? queueResult.queues
            : []
        );

        // Save services.
        setServices(
          Array.isArray(servicesResult.services)
            ? servicesResult.services
            : []
        );

        // Save counters.
        setCounters(
          Array.isArray(countersResult.counters)
            ? countersResult.counters
            : []
        );

        // Save dashboard statistics.
        setDashboardData({
          completed: dashboardResult.completed ?? 0,
        });

        setIsLive(true);
      } catch (error) {
        console.error(
          "Queue loading error:",
          error.message
        );

        setLoadError(
          error.message || "Unable to connect to backend."
        );

        setIsLive(false);

        // Clear stale data when backend is unavailable.
        setQueues([]);
        setServices([]);
        setCounters([]);
        setDashboardData({
          completed: 0,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  // Initial loading and automatic refresh.
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setIsLive(false);
      return;
    }

    loadQueueData();

    const interval = setInterval(() => {
      loadQueueData();
    }, 15000);

    return () => clearInterval(interval);
  }, [token, loadQueueData]);

  // Service filter options.
  const serviceFilters = useMemo(() => {
    return [
      "All",
      ...services.map((service) => service.name),
    ];
  }, [services]);

  // Find service information.
  const getServiceInfo = useCallback(
    (serviceId) => {
      return services.find(
        (service) =>
          String(service.id) === String(serviceId)
      );
    },
    [services]
  );

  // Total waiting patients.
  const totalWaiting = queues.reduce(
    (total, queue) => {
      const waiting = Array.isArray(queue.waiting)
        ? queue.waiting.length
        : 0;

      return total + waiting;
    },
    0
  );

  // Currently serving queues.
  const servingQueues = queues.filter(
    (queue) => queue.nowServing
  );

  // Active serving counters.
  const servingCount = servingQueues.length;

  // Average estimated waiting time across active services.
  const estimatedWaitValues = services
    .map((service) =>
      Number(service.estimated_wait_minutes)
    )
    .filter(
      (value) =>
        Number.isFinite(value) && value >= 0
    );

  const averageWait =
    estimatedWaitValues.length > 0
      ? Math.round(
          estimatedWaitValues.reduce(
            (total, value) => total + value,
            0
          ) / estimatedWaitValues.length
        )
      : null;

  // Prepare currently serving cards.
  const servingCards = servingQueues.map((queue) => {
    const waitingList = [
      ...(Array.isArray(queue.waiting)
        ? queue.waiting
        : []),
    ];

    waitingList.sort(
      (a, b) =>
        getTimestamp(a.issuedAt) -
        getTimestamp(b.issuedAt)
    );

    const nextPatient = waitingList[0];

    return {
      id: queue.nowServing.id,
      token: queue.nowServing.token || "--",
      service: queue.service || "Unknown service",
      counter: queue.nowServing.counter || "Not assigned",
      nextToken: nextPatient?.token || "--",
    };
  });

  // Prepare live queue table rows.
  const allQueueRows = queues.flatMap((queue) => {
    const rows = [];

    const serviceInfo = getServiceInfo(queue.serviceId);

    const waitingList = Array.isArray(queue.waiting)
      ? queue.waiting
      : [];

    const estimatedWait =
      serviceInfo?.estimated_wait_minutes;

    // Currently serving patient.
    if (queue.nowServing) {
      rows.push({
        id: `serving-${queue.nowServing.id}`,
        token: queue.nowServing.token || "--",
        service: queue.service || "Unknown service",
        counter:
          queue.nowServing.counter || "Not assigned",
        waiting: waitingList.length,
        wait: formatWait(estimatedWait),
        status: "Serving",
        issuedAt: queue.nowServing.issuedAt || "",
      });
    }

    // Waiting patients.
    waitingList.forEach((item) => {
      rows.push({
        id: `waiting-${item.id}`,
        token: item.token || "--",
        service: queue.service || "Unknown service",
        counter: item.counter || "Not assigned",
        waiting: item.queuePosition ?? "--",
        wait: formatWait(estimatedWait),
        status: formatStatus(item.status),
        issuedAt: item.issuedAt || "",
      });
    });

    return rows;
  });

  // Filter table by selected service.
  const filteredQueue = useMemo(() => {
    if (selectedService === "All") {
      return allQueueRows;
    }

    return allQueueRows.filter(
      (item) => item.service === selectedService
    );
  }, [selectedService, queues, services]);

  // Call the next waiting patient.
  const handleCallNext = () => {
    if (!isLive || callingNext) {
      return;
    }

    // Find services without a serving patient.
    const availableQueues = queues.filter(
      (queue) => !queue.nowServing
    );

    // Collect all waiting patients from those services.
    const candidates = availableQueues.flatMap((queue) => {
      const waitingList = Array.isArray(queue.waiting)
        ? queue.waiting
        : [];

      return waitingList
        .filter((patient) => patient.status === "waiting")
        .map((patient) => ({
          ...patient,
          serviceId: queue.serviceId,
          serviceName: queue.service,
        }));
    });

    // Find the earliest issued token.
    candidates.sort(
      (a, b) =>
        getTimestamp(a.issuedAt) -
        getTimestamp(b.issuedAt)
    );

    const nextPatient = candidates[0];

    if (!nextPatient) {
      Alert.alert(
        "No Waiting Patient",
        "There is no available waiting patient to call."
      );

      return;
    }

    // Find an active counter for this service.
    const availableCounter = counters.find(
      (counter) => {
        if (!counter.is_active) return false;

        return (
          String(counter.service_id) ===
            String(nextPatient.serviceId) ||
          counter.service_id === null
        );
      }
    );

    if (!availableCounter) {
      Alert.alert(
        "No Active Counter",
        `No active counter is available for ${nextPatient.serviceName}.`
      );

      return;
    }

    // Confirm before changing token status.
    Alert.alert(
      "Call Next Patient",
      `Call token ${nextPatient.token} at ${availableCounter.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Call Patient",
          onPress: async () => {
            try {
              setCallingNext(true);

              const response = await fetch(
                `${API_BASE_URL}/admin/tokens/${nextPatient.id}/status`,
                {
                  method: "PATCH",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    status: "serving",
                    counterId: availableCounter.id,
                  }),
                }
              );

              const result = await response.json();

              if (!response.ok || !result.success) {
                throw new Error(
                  result.message ||
                    "Could not call the patient."
                );
              }

              Alert.alert(
                "Patient Called",
                `Token ${nextPatient.token} is now being served at ${availableCounter.name}.`
              );

              // Reload queue after successful call.
              await loadQueueData();
            } catch (error) {
              console.error(
                "Call next patient error:",
                error.message
              );

              Alert.alert(
                "Error",
                error.message ||
                  "Unable to call the next patient."
              );
            } finally {
              setCallingNext(false);
            }
          },
        },
      ]
    );
  };

  // Main screen.
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
          {/* Summary Cards */}
          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="people-outline"
              title="Total Waiting"
              value={loading ? "--" : totalWaiting}
              note="Patients currently waiting"
              iconType="Primary"
            />

            <SummaryCard
              icon="play-circle-outline"
              title="Currently Serving"
              value={loading ? "--" : servingCount}
              note="Active counters"
              iconType="Success"
            />

            <SummaryCard
              icon="time-outline"
              title="Average Wait"
              value={
                loading
                  ? "--"
                  : averageWait === null
                  ? "--"
                  : `${averageWait} min`
              }
              note="Across all services"
              iconType="Warning"
            />

            <SummaryCard
              icon="checkmark-done-outline"
              title="Completed Today"
              value={
                loading
                  ? "--"
                  : dashboardData.completed
              }
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
                  {loading
                    ? "Loading"
                    : isLive
                    ? "Queue Live"
                    : "Offline"}
                </Text>
              </View>
            </View>

            <View style={styles.servingGrid}>
              {servingCards.map((item) => (
                <ServingCard
                  key={item.id}
                  token={item.token}
                  service={item.service}
                  counter={item.counter}
                  nextToken={item.nextToken}
                />
              ))}

              {!loading &&
                isLive &&
                servingCards.length === 0 && (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="time-outline"
                      size={32}
                      color={colors.textLight}
                    />

                    <Text style={styles.emptyTitle}>
                      No Active Counters
                    </Text>

                    <Text style={styles.emptyText}>
                      No patient is currently being served.
                    </Text>
                  </View>
                )}
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

            <Pressable
              style={[
                styles.callButton,
                (!isLive || callingNext) && {
                  opacity: 0.5,
                },
              ]}
              onPress={handleCallNext}
              disabled={!isLive || callingNext}
            >
              {callingNext ? (
                <ActivityIndicator
                  size="small"
                  color={colors.white}
                />
              ) : (
                <Ionicons
                  name="play"
                  size={15}
                  color={colors.white}
                />
              )}

              <Text style={styles.callButtonText}>
                {callingNext
                  ? "Calling..."
                  : "Call Next Patient"}
              </Text>
            </Pressable>
          </View>

          {/* Live Queue Table */}
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

              <Pressable
                onPress={() => loadQueueData(true)}
                disabled={refreshing}
              >
                {refreshing ? (
                  <ActivityIndicator
                    color={colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="refresh-outline"
                    size={21}
                    color={colors.primary}
                  />
                )}
              </Pressable>
            </View>

            {/* Service Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {serviceFilters.map((service) => {
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
                  key={item.id}
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

              {!loading &&
                filteredQueue.length === 0 && (
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

          {/* Loading / Error */}
          {loading && (
            <View style={{ padding: 12 }}>
              <ActivityIndicator
                size="small"
                color={colors.primary}
              />

              <Text style={styles.footerText}>
                Loading queue data...
              </Text>
            </View>
          )}

          {!isLive && !loading && (
            <View style={{ padding: 12 }}>
              <Text style={styles.footerText}>
                Backend connection unavailable. Please check your server.
              </Text>

              {!!loadError && (
                <Text style={styles.footerText}>
                  {loadError}
                </Text>
              )}
            </View>
          )}

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
                Queue information is loaded from the OptiQueue
                backend. Data refreshes automatically every
                15 seconds.
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
