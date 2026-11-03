import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { colors, fonts } from "../constants/theme";

const items = [
  {
    label: "Home",
    route: "/",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    label: "My Token",
    route: "/my-token",
    icon: "ticket-outline",
    activeIcon: "ticket",
  },
  {
    label: "Alerts",
    route: "/notifications",
    icon: "notifications-outline",
    activeIcon: "notifications",
  },
  {
    label: "Settings",
    route: "/settings",
    icon: "settings-outline",
    activeIcon: "settings",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.wrapper}>
      <View style={styles.nav}>
        {items.map((item) => {
          const active =
            item.route === "/"
              ? pathname === "/"
              : pathname === item.route ||
                pathname.startsWith(item.route + "/");

          return (
            <Pressable
              key={item.label}
              style={styles.item}
              onPress={() => {
                if (!active) {
                  router.replace(item.route);
                }
              }}
            >
              <View
                style={[styles.iconBox, active && styles.activeIconBox]}
              >
                <Ionicons
                  name={active ? item.activeIcon : item.icon}
                  size={21}
                  color={active ? colors.primary : colors.textMuted}
                />
              </View>

              <Text style={[styles.label, active && styles.activeLabel]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: colors.white,
  },

  nav: {
    width: "100%",
    height: 76,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconBox: {
    width: 34,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  activeIconBox: {
    backgroundColor: colors.primaryLight,
  },

  label: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 4,
    fontFamily: fonts.medium,
  },

  activeLabel: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
});