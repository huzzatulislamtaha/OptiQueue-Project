import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "../constants/theme";

export default function Header({ title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },

  title: {
    color: colors.white,
    fontSize: 28,
    letterSpacing: -0.5,
    fontFamily: fonts.bold,
  },

  subtitle: {
    color: colors.secondary,
    fontSize: 14,
    marginTop: 6,
    fontFamily: fonts.regular,
  },
});