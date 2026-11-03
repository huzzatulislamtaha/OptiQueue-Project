import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import styles from "../styles/settings";
import { colors } from "../styles/theme";

function Toggle({ value, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.toggle,
        value ? styles.toggleActive : styles.toggleInactive,
      ]}
    >
      <View
        style={[
          styles.toggleCircle,
          value ? styles.toggleCircleActive : styles.toggleCircleInactive,
        ]}
      />
    </Pressable>
  );
}

function SettingRow({
  icon,
  title,
  description,
  value,
  onPress,
  type = "toggle",
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={19} color={colors.primary} />
        </View>

        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>

      {type === "toggle" && (
        <Toggle value={value} onPress={onPress} />
      )}
    </View>
  );
}

function SectionHeader({ icon, title, description }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>

      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [queueAlerts, setQueueAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    Alert.alert(
      "Settings Saved",
      "Your settings have been saved successfully."
    );
  };

  const handlePasswordChange = () => {
    Alert.alert(
      "Change Password",
      "Password management will be connected with the backend later."
    );
  };

  const handleBackup = () => {
    Alert.alert(
      "Database Backup",
      "Backup functionality will be connected with the backend later."
    );
  };

  const handleMaintenance = () => {
    Alert.alert(
      "Maintenance Mode",
      maintenanceMode
        ? "Maintenance mode has been disabled."
        : "Maintenance mode has been enabled."
    );

    setMaintenanceMode(!maintenanceMode);
  };

  return (
    <View style={styles.screen}>
      <AdminSidebar active="Settings" />

      <View style={styles.main}>
        <AdminHeader
          title="Settings"
          subtitle="Manage system and administrator preferences"
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pageIntro}>
            <View>
              <Text style={styles.pageTitle}>System Settings</Text>
              <Text style={styles.pageSubtitle}>
                Configure OptiQueue administration and queue preferences.
              </Text>
            </View>

            <Pressable
              onPress={handleSave}
              style={styles.saveButton}
            >
              <Ionicons
                name="save-outline"
                size={18}
                color={colors.white}
              />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </Pressable>
          </View>

          {/* General Settings */}
          <View style={styles.section}>
            <SectionHeader
              icon="settings-outline"
              title="General Settings"
              description="Basic system preferences"
            />

            <View style={styles.card}>
              <SettingRow
                icon="notifications-outline"
                title="System Notifications"
                description="Receive important system notifications"
                value={notifications}
                onPress={() =>
                  setNotifications(!notifications)
                }
              />

              <View style={styles.divider} />

              <SettingRow
                icon="refresh-outline"
                title="Auto Refresh"
                description="Automatically refresh queue information"
                value={autoRefresh}
                onPress={() =>
                  setAutoRefresh(!autoRefresh)
                }
              />
            </View>
          </View>

          {/* Queue Settings */}
          <View style={styles.section}>
            <SectionHeader
              icon="people-outline"
              title="Queue Settings"
              description="Configure queue monitoring behavior"
            />

            <View style={styles.card}>
              <SettingRow
                icon="notifications-circle-outline"
                title="Queue Alerts"
                description="Receive alerts when queue status changes"
                value={queueAlerts}
                onPress={() =>
                  setQueueAlerts(!queueAlerts)
                }
              />

              <View style={styles.divider} />

              <SettingRow
                icon="volume-high-outline"
                title="Sound Alerts"
                description="Play sound when a patient is called"
                value={soundAlerts}
                onPress={() =>
                  setSoundAlerts(!soundAlerts)
                }
              />
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <SectionHeader
              icon="megaphone-outline"
              title="Notifications"
              description="Notification preferences"
            />

            <View style={styles.card}>
              <View style={styles.notificationInfo}>
                <View style={styles.notificationIcon}>
                  <Ionicons
                    name="information-circle-outline"
                    size={21}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.notificationText}>
                  <Text style={styles.notificationTitle}>
                    Queue Notification System
                  </Text>

                  <Text style={styles.notificationDescription}>
                    Patient notifications and real-time alerts will be
                    connected with the backend notification service later.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Admin Account */}
          <View style={styles.section}>
            <SectionHeader
              icon="person-circle-outline"
              title="Admin Account"
              description="Administrator account preferences"
            />

            <View style={styles.card}>
              <View style={styles.accountRow}>
                <View style={styles.accountAvatar}>
                  <Ionicons
                    name="person"
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>
                    Hospital Admin
                  </Text>

                  <Text style={styles.accountRole}>
                    Administrator
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Pressable
                onPress={handlePasswordChange}
                style={styles.actionRow}
              >
                <View style={styles.actionIcon}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={19}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>
                    Change Password
                  </Text>

                  <Text style={styles.actionDescription}>
                    Update administrator password
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color={colors.textLight}
                />
              </Pressable>
            </View>
          </View>

          {/* System */}
          <View style={styles.section}>
            <SectionHeader
              icon="server-outline"
              title="System"
              description="System maintenance and data management"
            />

            <View style={styles.card}>
              <Pressable
                onPress={handleBackup}
                style={styles.actionRow}
              >
                <View style={styles.actionIcon}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={19}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>
                    Database Backup
                  </Text>

                  <Text style={styles.actionDescription}>
                    Create a backup of system data
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color={colors.textLight}
                />
              </Pressable>

              <View style={styles.divider} />

              <SettingRow
                icon="construct-outline"
                title="Maintenance Mode"
                description="Temporarily disable patient queue operations"
                value={maintenanceMode}
                onPress={handleMaintenance}
              />
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <SectionHeader
              icon="warning-outline"
              title="Danger Zone"
              description="Important system actions"
            />

            <View style={styles.dangerCard}>
              <View style={styles.dangerIcon}>
                <Ionicons
                  name="warning"
                  size={21}
                  color={colors.danger}
                />
              </View>

              <View style={styles.dangerText}>
                <Text style={styles.dangerTitle}>
                  System Reset
                </Text>

                <Text style={styles.dangerDescription}>
                  Resetting the system may remove configuration and
                  temporary data. Backend protection will be added later.
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  Alert.alert(
                    "System Reset",
                    "System reset will be available after backend integration."
                  )
                }
                style={styles.dangerButton}
              >
                <Text style={styles.dangerButtonText}>
                  Reset
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.backendNote}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color={colors.primary}
            />

            <Text style={styles.backendNoteText}>
              These settings currently use local UI state. They will be
              connected to the backend and database during the integration
              phase.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              OptiQueue • Smart Hospital Queue Management System
            </Text>

            <Text style={styles.footerVersion}>
              Admin Panel v1.0.0
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}