import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../constants/theme";

export default function ServiceCard({
  icon,
  title,
  waiting,
  waitTime,
  onPress,
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
      onPress={onPress}
    >
      <View style={styles.icon}>
        <Ionicons name={icon} size={25} color={colors.neon} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.waiting}>{waiting} patients waiting</Text>
        <Text style={styles.time}>Estimated wait · {waitTime}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.secondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.neonBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  info: {
    flex: 1,
  },

  title: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },

  waiting: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 4,
    fontFamily: fonts.regular,
  },

  time: {
    color: colors.neon,
    fontSize: 11,
    marginTop: 4,
    fontFamily: fonts.regular,
  },
});