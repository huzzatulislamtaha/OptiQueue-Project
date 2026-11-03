import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "../constants/theme";

export default function QueueCard({ token, position, status, current }) {
  return (
    <View style={[styles.card, current && styles.currentCard]}>
      <View>
        <Text style={styles.token}>{token}</Text>
        <Text style={styles.position}>Position #{position}</Text>
      </View>

      <View style={[styles.badge, current && styles.currentBadge]}>
        <Text style={[styles.badgeText, current && styles.currentText]}>
          {status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  currentCard: {
    borderColor: colors.neonBorder,
  },

  token: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.bold,
  },

  position: {
    color: colors.secondary,
    fontSize: 11,
    marginTop: 4,
    fontFamily: fonts.regular,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.badgeBg,
  },

  currentBadge: {
    backgroundColor: colors.neonBg,
  },

  badgeText: {
    color: colors.secondary,
    fontSize: 10,
    fontFamily: fonts.semiBold,
  },

  currentText: {
    color: colors.neon,
  },
});