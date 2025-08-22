import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

interface LoanCTAProps {
  onPress: () => void;
}

export function LoanCTA({ onPress }: LoanCTAProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primary + "CC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>💰 Get Business Loan</Text>
          <Text style={styles.subtitle}>Up to ₹5 Crores • 24-48 Hours Approval</Text>
          <Text style={styles.features}>
            ✓ Minimal Documentation  ✓ Competitive Rates  ✓ Quick Processing
          </Text>
          <View style={styles.cta}>
            <Text style={styles.ctaText}>Apply Now →</Text>
          </View>
        </View>
        <Text style={styles.loanIcon}>🏦</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: SPACING.md,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: "#fff",
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: "#fff",
    opacity: 0.9,
    marginBottom: SPACING.sm,
  },
  features: {
    ...TYPOGRAPHY.caption,
    color: "#fff",
    opacity: 0.8,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  cta: {
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  ctaText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: "600",
  },
  loanIcon: {
    fontSize: 48,
    opacity: 0.3,
  },
});