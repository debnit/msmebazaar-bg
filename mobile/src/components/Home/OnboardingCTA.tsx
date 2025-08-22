import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

interface OnboardingCTAProps {
  onPress: () => void;
}

export function OnboardingCTA({ onPress }: OnboardingCTAProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.icon}>🚀</Text>
        <View style={styles.textContent}>
          <Text style={styles.title}>New to MSMEBazaar?</Text>
          <Text style={styles.subtitle}>
            Join 100,000+ businesses and get started in 2 minutes
          </Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: SPACING.md,
    backgroundColor: COLORS.success + "10",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.success + "30",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
  },
  icon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  textContent: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  arrow: {
    ...TYPOGRAPHY.h2,
    color: COLORS.success,
    marginLeft: SPACING.sm,
  },
});