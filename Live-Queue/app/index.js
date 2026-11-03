import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "../styles/liveQueue";
import { colors } from "../styles/theme";

/*
=========================================================
DUMMY DATA
=========================================================

Backend integration-এর সময় এই data API/database
থেকে আসবে।

এখন frontend development-এর জন্য dummy data রাখা হয়েছে।
*/

const nextTokens = [
  {
    token: "A-025",
    service: "General Consultation",
  },
  {
    token: "A-026",
    service: "General Consultation",
  },
  {
    token: "A-027",
    service: "General Consultation",
  },
  {
    token: "A-028",
    service: "General Consultation",
  },
];

const services = [
  {
    name: "General Consultation",
    token: "A-024",
    counter: "Counter 01",
    waiting: "12",
    wait: "18 min",
  },
  {
    name: "Specialist Consultation",
    token: "B-011",
    counter: "Counter 02",
    waiting: "8",
    wait: "32 min",
  },
  {
    name: "Diagnostic / Laboratory",
    token: "C-008",
    counter: "Counter 03",
    waiting: "5",
    wait: "14 min",
  },
  {
    name: "Pharmacy Service",
    token: "D-005",
    counter: "Counter 04",
    waiting: "3",
    wait: "08 min",
  },
];

const queueData = [
  {
    token: "A-024",
    service: "General Consultation",
    counter: "Counter 01",
    status: "Serving",
  },
  {
    token: "A-025",
    service: "General Consultation",
    counter: "Counter 01",
    status: "Waiting",
  },
  {
    token: "A-026",
    service: "General Consultation",
    counter: "Counter 01",
    status: "Waiting",
  },
  {
    token: "A-027",
    service: "General Consultation",
    counter: "Counter 01",
    status: "Waiting",
  },
  {
    token: "B-011",
    service: "Specialist Consultation",
    counter: "Counter 02",
    status: "Serving",
  },
  {
    token: "B-012",
    service: "Specialist Consultation",
    counter: "Counter 02",
    status: "Waiting",
  },
  {
    token: "C-008",
    service: "Diagnostic / Laboratory",
    counter: "Counter 03",
    status: "Serving",
  },
  {
    token: "D-005",
    service: "Pharmacy Service",
    counter: "Counter 04",
    status: "Serving",
  },
];

/* =====================================================
   STATUS BADGE
===================================================== */

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

/* =====================================================
   SERVICE CARD
===================================================== */

function ServiceCard({ service }) {
  return (
    <View style={styles.serviceCard}>

      <View style={styles.serviceHeader}>

        <View style={styles.serviceIcon}>
          <Ionicons
            name="medkit-outline"
            size={20}
            color={colors.primary}
          />
        </View>

        <View style={styles.serviceHeaderText}>

          <Text
            style={styles.serviceName}
            numberOfLines={1}
          >
            {service.name}
          </Text>

          <Text style={styles.serviceCounter}>
            {service.counter}
          </Text>

        </View>

        <View style={styles.serviceLiveBadge}>

          <View style={styles.serviceLiveDot} />

          <Text style={styles.serviceLiveText}>
            LIVE
          </Text>

        </View>

      </View>

      <View style={styles.serviceDivider} />

      <Text style={styles.serviceCurrentLabel}>
        NOW SERVING
      </Text>

      <Text style={styles.serviceCurrentToken}>
        {service.token}
      </Text>

      <View style={styles.serviceBottom}>

        <View style={styles.serviceMetric}>
          <Text style={styles.serviceMetricLabel}>
            WAITING
          </Text>

          <Text style={styles.serviceMetricValue}>
            {service.waiting}
          </Text>
        </View>

        <View style={styles.serviceMetric}>
          <Text style={styles.serviceMetricLabel}>
            EST. WAIT
          </Text>

          <Text style={styles.serviceMetricValue}>
            {service.wait}
          </Text>
        </View>

      </View>

    </View>
  );
}

/* =====================================================
   MAIN SCREEN
===================================================== */

export default function LiveQueue() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setCurrentTime(time);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.screen}>

      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>

        <View style={styles.brandArea}>

          <View style={styles.brandLogo}>
            <Ionicons
              name="medical"
              size={26}
              color={colors.primary}
            />
          </View>

          <View style={styles.brandInfo}>

            <Text style={styles.brandName}>
              OptiQueue
            </Text>

            <Text style={styles.brandSubtitle}>
              Smart Hospital Queue Management
            </Text>

          </View>

        </View>

        <View style={styles.headerRight}>

          <View style={styles.liveBadge}>

            <View style={styles.liveDot} />

            <Text style={styles.liveText}>
              LIVE QUEUE
            </Text>

          </View>

          <Text style={styles.currentTime}>
            {currentTime}
          </Text>

        </View>

      </View>

      {/* =================================================
          CONTENT
      ================================================= */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* =================================================
            TITLE
        ================================================= */}

        <View style={styles.introRow}>

          <View>

            <Text style={styles.pageTitle}>
              Live Queue Status
            </Text>

            <Text style={styles.pageSubtitle}>
              Current hospital queue and service status
            </Text>

          </View>

          <View style={styles.waitingSummary}>

            <View style={styles.waitingSummaryIcon}>
              <Ionicons
                name="people-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <View>

              <Text style={styles.waitingSummaryNumber}>
                28
              </Text>

              <Text style={styles.waitingSummaryLabel}>
                Patients Waiting
              </Text>

            </View>

          </View>

        </View>

        {/* =================================================
            NOW SERVING
        ================================================= */}

        <View style={styles.nowServingCard}>

          <View style={styles.nowServingTop}>

            <View style={styles.nowServingHeading}>

              <View style={styles.nowServingIcon}>
                <Ionicons
                  name="volume-high-outline"
                  size={23}
                  color={colors.white}
                />
              </View>

              <View>

                <Text style={styles.nowServingLabel}>
                  NOW SERVING
                </Text>

                <Text style={styles.nowServingCounter}>
                  Counter 01 • General Consultation
                </Text>

              </View>

            </View>

            <View style={styles.nowServingStatus}>

              <View style={styles.nowServingStatusDot} />

              <Text style={styles.nowServingStatusText}>
                SERVING
              </Text>

            </View>

          </View>

          <View style={styles.nowServingBody}>

            <View style={styles.mainTokenArea}>

              <Text style={styles.mainToken}>
                A-024
              </Text>

              <Text style={styles.mainTokenLabel}>
                CURRENT TOKEN
              </Text>

            </View>

            <View style={styles.nowServingDetails}>

              <View style={styles.detailBox}>

                <Text style={styles.detailLabel}>
                  SERVICE
                </Text>

                <Text style={styles.detailValue}>
                  General Consultation
                </Text>

              </View>

              <View style={styles.detailBox}>

                <Text style={styles.detailLabel}>
                  NEXT PATIENT
                </Text>

                <Text style={styles.detailValue}>
                  A-025
                </Text>

              </View>

              <View style={styles.detailBox}>

                <Text style={styles.detailLabel}>
                  WAITING
                </Text>

                <Text style={styles.detailValue}>
                  12 Patients
                </Text>

              </View>

            </View>

          </View>

        </View>

        {/* =================================================
            NEXT IN QUEUE
        ================================================= */}

        <View style={styles.section}>

          <View style={styles.sectionHeader}>

            <View>

              <Text style={styles.sectionTitle}>
                Next in Queue
              </Text>

              <Text style={styles.sectionSubtitle}>
                Please be ready when your token is called
              </Text>

            </View>

          </View>

          <View style={styles.nextTokenGrid}>

            {nextTokens.map((item, index) => (
              <View
                key={item.token}
                style={[
                  styles.nextTokenCard,
                  index === 0 &&
                    styles.nextTokenCardFirst,
                ]}
              >

                <Text style={styles.nextTokenPosition}>
                  NEXT {index + 1}
                </Text>

                <Text style={styles.nextTokenNumber}>
                  {item.token}
                </Text>

                <Text
                  style={styles.nextTokenService}
                  numberOfLines={1}
                >
                  {item.service}
                </Text>

              </View>
            ))}

          </View>

        </View>

        {/* =================================================
            SERVICE STATUS
        ================================================= */}

        <View style={styles.section}>

          <View style={styles.sectionHeader}>

            <View>

              <Text style={styles.sectionTitle}>
                Service Status
              </Text>

              <Text style={styles.sectionSubtitle}>
                Current status of all hospital services
              </Text>

            </View>

          </View>

          <View style={styles.serviceGrid}>

            {services.map((service) => (
              <ServiceCard
                key={service.name}
                service={service}
              />
            ))}

          </View>

        </View>

        {/* =================================================
            CURRENT QUEUE
        ================================================= */}

        <View style={styles.section}>

          <View style={styles.sectionHeader}>

            <View>

              <Text style={styles.sectionTitle}>
                Current Queue
              </Text>

              <Text style={styles.sectionSubtitle}>
                Live token status across hospital services
              </Text>

            </View>

            <View style={styles.liveBadge}>

              <View style={styles.liveDot} />

              <Text style={styles.liveText}>
                LIVE
              </Text>

            </View>

          </View>

          <View style={styles.queueCard}>

            {/* TABLE HEADER */}

            <View style={styles.tableHeader}>

              <Text
                style={[
                  styles.tableHeaderText,
                  styles.tokenColumn,
                ]}
              >
                TOKEN
              </Text>

              <Text
                style={[
                  styles.tableHeaderText,
                  styles.serviceColumn,
                ]}
              >
                SERVICE
              </Text>

              <Text
                style={[
                  styles.tableHeaderText,
                  styles.counterColumn,
                ]}
              >
                COUNTER
              </Text>

              <Text
                style={[
                  styles.tableHeaderText,
                  styles.statusColumn,
                ]}
              >
                STATUS
              </Text>

            </View>

            {/* TABLE ROWS */}

            {queueData.map((item, index) => (
              <View
                key={`${item.token}-${item.counter}`}
                style={[
                  styles.queueRow,
                  index === queueData.length - 1 &&
                    styles.queueRowLast,
                ]}
              >

                <Text style={styles.tokenText}>
                  {item.token}
                </Text>

                <Text
                  style={styles.serviceText}
                  numberOfLines={1}
                >
                  {item.service}
                </Text>

                <Text style={styles.counterText}>
                  {item.counter}
                </Text>

                <View style={styles.statusWrapper}>
                  <StatusBadge
                    status={item.status}
                  />
                </View>

              </View>
            ))}

          </View>

        </View>

        {/* =================================================
            FOOTER
        ================================================= */}

        <View style={styles.footer}>

          <View style={styles.footerBrand}>

            <Ionicons
              name="medical"
              size={16}
              color={colors.primary}
            />

            <Text style={styles.footerBrandText}>
              OptiQueue
            </Text>

          </View>

          <Text style={styles.footerSeparator}>
            •
          </Text>

          <Text style={styles.footerText}>
            Smart Hospital Queue Management System
          </Text>

          <Text style={styles.footerOnline}>
            ● System Online
          </Text>

        </View>

      </ScrollView>

    </View>
  );
}