import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

interface FeaturesShowcaseProps {
  onLoanPress: () => void;
  onValuationPress: () => void;
  onMarketLinkagePress: () => void;
  onExitStrategyPress: () => void;
}

const features = [
  {
    icon: "💰",
    title: "Business Loans",
    subtitle: "Up to ₹5 Cr funding",
    color: COLORS.primary,
    key: "loan"
  },
  {
    icon: "🤖",
    title: "AI Valuation", 
    subtitle: "Free business assessment",
    color: COLORS.success,
    key: "valuation"
  },
  {
    icon: "🔗",
    title: "Market Linkage",
    subtitle: "Connect with buyers",
    color: COLORS.warning,
    key: "market"
  },
  {
    icon: "🚀",
    title: "Exit Strategy",
    subtitle: "Plan your business exit",
    color: COLORS.error,
    key: "exit"
  }
];

export function FeaturesShowcase({ onLoanPress, onValuationPress, onMarketLinkagePress, onExitStrategyPress }: FeaturesShowcaseProps) {
  
  const handlePress = (key: string) => {
    switch (key) {
      case "loan":
        onLoanPress();
        break;
      case "valuation":
        onValuationPress();
        break;
      case "market":
        onMarketLinkagePress();
        break;
      case "exit":
        onExitStrategyPress();
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Core Features</Text>
      <View style={styles.featuresGrid}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.key}
            style={[styles.featureCard, { borderColor: feature.color + "30" }]}
            onPress={() => handlePress(feature.key)}
          >
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  featureTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  featureSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
});