import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../constants/theme";

export default function TokenCard() {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View>
          <Text style={styles.label}>YOUR ACTIVE TOKEN</Text>
          <Text style={styles.token}>A-026</Text>
        </View>

        <View style={styles.status}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>WAITING</Text>
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.details}>
        <View>
          <Text style={styles.detailLabel}>SERVICE</Text>
          <Text style={styles.detailValue}>General Consultation</Text>
        </View>

        <View>
          <Text style={styles.detailLabel}>POSITION</Text>
          <Text style={styles.detailValue}>#05</Text>
        </View>

        <View>
          <Text style={styles.detailLabel}>EST. WAIT</Text>
          <Text style={styles.detailValue}>18 min</Text>
        </View>
      </View>

      <View style={styles.counter}>
        <Ionicons
          name="location-outline"
          size={16}
          color={colors.neon}
        />
        <Text style={styles.counterText}>
          Counter 01 · General Consultation
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface2,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.neonBorder,
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  label: {
    color: colors.secondary,
    fontSize: 10,
    letterSpacing: 1,
    fontFamily: fonts.bold,
  },

  token: {
    color: colors.white,
    fontSize: 42,
    marginTop: 4,
    letterSpacing: 1,
    fontFamily: fonts.bold,
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.successBg,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: colors.success,
    marginRight: 6,
  },

  statusText: {
    color: colors.success,
    fontSize: 10,
    fontFamily: fonts.bold,
  },

  line: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 18,
  },

  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  detailLabel: {
    color: colors.muted,
    fontSize: 9,
    fontFamily: fonts.bold,
  },

  detailValue: {
    color: colors.white,
    fontSize: 12,
    marginTop: 5,
    fontFamily: fonts.medium,
  },

  counter: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  counterText: {
    color: colors.secondary,
    fontSize: 11,
    marginLeft: 7,
    fontFamily: fonts.regular,
  },
});