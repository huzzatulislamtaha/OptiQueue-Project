import React from "react";
import {
  View,
  Text,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "../styles/header";

export default function AdminHeader({
  title = "Dashboard",
  subtitle = "Hospital queue management overview",
}) {
  return (
    <View style={styles.header}>

      {/* PAGE TITLE */}
      <View style={styles.titleArea}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      {/* HEADER RIGHT */}
      <View style={styles.rightArea}>

        {/* LIVE STATUS */}
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />

          <Text style={styles.liveText}>
            Queue Live
          </Text>
        </View>

        {/* NOTIFICATION */}
        <Pressable style={styles.notificationButton}>
          <Ionicons
            name="notifications-outline"
            size={21}
            color="#173B3A"
          />

          <View style={styles.notificationDot} />
        </Pressable>

        {/* ADMIN PROFILE */}
        <Pressable style={styles.adminProfile}>

          <View style={styles.adminAvatar}>
            <Ionicons
              name="person"
              size={17}
              color="#079C91"
            />
          </View>

          <View style={styles.adminInfo}>
            <Text style={styles.adminName}>
              Hospital Admin
            </Text>

            <Text style={styles.adminRole}>
              Administrator
            </Text>
          </View>

          <Ionicons
            name="chevron-down"
            size={15}
            color="#829593"
            style={styles.profileArrow}
          />

        </Pressable>

      </View>

    </View>
  );
}