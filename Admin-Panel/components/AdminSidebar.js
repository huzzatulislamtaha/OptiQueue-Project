import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import styles from "../styles/sidebar";
import { colors } from "../styles/theme";

const mainMenu = [
  {
    label: "Dashboard",
    route: "/",
    icon: "grid-outline",
    activeIcon: "grid",
  },
  {
    label: "Queue Management",
    route: "/queue-management",
    icon: "git-network-outline",
    activeIcon: "git-network",
  },
  {
    label: "Token Management",
    route: "/token-management",
    icon: "ticket-outline",
    activeIcon: "ticket",
  },
  {
    label: "Services",
    route: "/services",
    icon: "medkit-outline",
    activeIcon: "medkit",
  },
  {
    label: "Analytics",
    route: "/analytics",
    icon: "stats-chart-outline",
    activeIcon: "stats-chart",
  },
  {
    label: "Reports",
    route: "/reports",
    icon: "document-text-outline",
    activeIcon: "document-text",
  },
];

const systemMenu = [
  {
    label: "Settings",
    route: "/settings",
    icon: "settings-outline",
    activeIcon: "settings",
  },
];

function MenuItem({ item, active }) {
  const isActive = active === item.label;

  const handlePress = () => {
    router.replace(item.route);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.menuItem,
        isActive && styles.menuItemActive,
      ]}
    >
      <View
        style={[
          styles.menuIconBox,
          isActive && styles.menuIconBoxActive,
        ]}
      >
        <Ionicons
          name={isActive ? item.activeIcon : item.icon}
          size={20}
          color={isActive ? colors.primary : colors.textSecondary}
        />
      </View>

      <Text
        style={[
          styles.menuText,
          isActive && styles.menuTextActive,
        ]}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

export default function AdminSidebar({
  active = "Dashboard",
}) {
  return (
    <View style={styles.sidebar}>

      {/* BRAND */}
      <View style={styles.brandSection}>

        <View style={styles.brandLogo}>
          <Ionicons
            name="medical"
            size={22}
            color={colors.primary}
          />
        </View>

        <View style={styles.brandTextArea}>
          <Text style={styles.brandName}>
            OptiQueue
          </Text>

          <Text style={styles.brandSubtitle}>
            Hospital Management
          </Text>
        </View>

      </View>

      {/* MENU */}
      <ScrollView
        style={styles.menuScroll}
        contentContainerStyle={styles.menuContent}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.menuHeading}>
          MAIN MENU
        </Text>

        <View style={styles.menuGroup}>
          {mainMenu.map((item) => (
            <MenuItem
              key={item.label}
              item={item}
              active={active}
            />
          ))}
        </View>

        <Text style={styles.menuHeading}>
          SYSTEM
        </Text>

        <View style={styles.menuGroup}>
          {systemMenu.map((item) => (
            <MenuItem
              key={item.label}
              item={item}
              active={active}
            />
          ))}
        </View>

      </ScrollView>

      {/* ADMIN PROFILE */}
      <View style={styles.profileSection}>

        <View style={styles.profileCard}>

          <View style={styles.profileAvatar}>
            <Ionicons
              name="person"
              size={18}
              color={colors.primary}
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              Hospital Admin
            </Text>

            <Text style={styles.profileRole}>
              Administrator
            </Text>
          </View>

          <Ionicons
            name="ellipsis-horizontal"
            size={18}
            color={colors.textLight}
          />

        </View>

        <Text style={styles.version}>
          OptiQueue Admin • v1.0.0
        </Text>

      </View>

    </View>
  );
}