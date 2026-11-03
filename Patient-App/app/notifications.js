import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import BottomNav from "../components/BottomNav";
import { colors, fonts } from "../constants/theme";

const initialNotifications = [
  {
    id: 1,
    title: "Token Confirmed",
    message: "Your token A-027 has been successfully confirmed.",
    time: "2 min ago",
    icon: "notifications",
    unread: true,
  },
  {
    id: 2,
    title: "Queue Update",
    message: "There are currently 5 patients ahead of you.",
    time: "5 min ago",
    icon: "time",
    unread: true,
  },
  {
    id: 3,
    title: "Now Serving",
    message: "Currently serving token A-021.",
    time: "8 min ago",
    icon: "person",
    unread: false,
  },
  {
    id: 4,
    title: "Service Available",
    message: "General Consultation service is currently available.",
    time: "15 min ago",
    icon: "checkmark-circle",
    unread: false,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [menuOpen, setMenuOpen] = useState(false);

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      }))
    );
    setMenuOpen(false);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setMenuOpen(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>
              Stay updated with your queue
            </Text>
          </View>

          <Pressable
            style={styles.menuButton}
            onPress={() => setMenuOpen(!menuOpen)}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>

        {/* MENU */}
        {menuOpen && (
          <View style={styles.menu}>
            <Pressable style={styles.menuItem} onPress={markAllAsRead}>
              <Ionicons
                name="checkmark-done-outline"
                size={17}
                color={colors.primary}
              />
              <Text style={styles.menuText}>Mark all as read</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable
              style={styles.menuItem}
              onPress={clearNotifications}
            >
              <Ionicons
                name="trash-outline"
                size={17}
                color={colors.danger}
              />
              <Text style={[styles.menuText, styles.deleteText]}>
                Clear notifications
              </Text>
            </Pressable>
          </View>
        )}

        {/* LIVE CARD */}
        <View style={styles.liveCard}>
          <View style={styles.liveIcon}>
            <Ionicons
              name="pulse-outline"
              size={21}
              color={colors.primary}
            />
          </View>

          <View style={styles.liveText}>
            <Text style={styles.liveTitle}>Queue is Live</Text>
            <Text style={styles.liveSubtitle}>
              Your queue information is being updated.
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        </View>

        {/* RECENT */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>

          {notifications.some((item) => item.unread) && (
            <Pressable onPress={markAllAsRead}>
              <Text style={styles.markAll}>Mark all read</Text>
            </Pressable>
          )}
        </View>

        {/* NOTIFICATIONS */}
        <View style={styles.notificationCard}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="notifications-off-outline"
                  size={24}
                  color={colors.textMuted}
                />
              </View>
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptySubtitle}>
                Your notification list is clear.
              </Text>
            </View>
          ) : (
            notifications.map((item, index) => (
              <React.Fragment key={item.id}>
                <Pressable
                  style={[
                    styles.notificationRow,
                    item.unread && styles.unreadRow,
                  ]}
                  onPress={() => markAsRead(item.id)}
                >
                  <View style={styles.notificationIcon}>
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.notificationText}>
                    <View style={styles.titleRow}>
                      <Text style={styles.notificationTitle}>
                        {item.title}
                      </Text>
                      {item.unread && <View style={styles.unreadDot} />}
                    </View>

                    <Text style={styles.message}>{item.message}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.textMuted}
                  />
                </Pressable>

                {index !== notifications.length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNav active="Alerts" />
    </View>
  );
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 18,
    paddingBottom: 95,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
    marginLeft: 11,
  },

  title: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  menu: {
    position: "absolute",
    top: 60,
    right: 18,
    width: 190,
    zIndex: 20,
    backgroundColor: colors.white,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },

  menuItem: {
    minHeight: 45,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    marginLeft: 9,
    fontSize: 11,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
  },

  deleteText: {
    color: colors.danger,
  },

  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
  },

  liveCard: {
    backgroundColor: colors.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 21,
  },

  liveIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  liveText: {
    flex: 1,
    marginLeft: 10,
  },

  liveTitle: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  liveSubtitle: {
    marginTop: 3,
    fontSize: 9,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: colors.successLight,
    flexDirection: "row",
    alignItems: "center",
  },

  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 4,
  },

  liveBadgeText: {
    fontSize: 8,
    color: colors.success,
    fontFamily: fonts.bold,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  sectionTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  markAll: {
    fontSize: 10,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },

  notificationCard: {
    backgroundColor: colors.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  notificationRow: {
    minHeight: 82,
    paddingHorizontal: 13,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  unreadRow: {
    backgroundColor: colors.unreadBg,
  },

  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 7,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationTitle: {
    fontSize: 11,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 6,
  },

  message: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 14,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  time: {
    marginTop: 4,
    fontSize: 8,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 63,
  },

  emptyState: {
    paddingVertical: 45,
    alignItems: "center",
  },

  emptyIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  emptySubtitle: {
    marginTop: 4,
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
};