import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "@mobile/components/ui/Button";
import { Card } from "@mobile/components/ui/Card";
import { useFeatureGating } from "@mobile/hooks/FeatureGating/useFeatureGating";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  onUpgrade?: () => void;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, onUpgrade, fallback }: FeatureGateProps) {
  const { canAccess, hasReachedLimit, getUpgradeMessage } = useFeatureGating();

  const canAccessFeature = canAccess(feature);
  const limitReached = hasReachedLimit(feature);

  if (!canAccessFeature) {
    return fallback || (
      <Card style={styles.gateCard}>
        <Text style={styles.gateTitle}>🔒 Pro Feature</Text>
        <Text style={styles.gateMessage}>{getUpgradeMessage(feature)}</Text>
        <Button
          title="Upgrade to Pro - ₹99/month"
          onPress={onUpgrade || (() => Alert.alert("Upgrade", "Redirecting to upgrade page..."))}
          style={styles.upgradeButton}
        />
      </Card>
    );
  }

  if (limitReached) {
    return fallback || (
      <Card style={styles.limitCard}>
        <Text style={styles.limitTitle}>📊 Daily Limit Reached</Text>
        <Text style={styles.limitMessage}>{getUpgradeMessage(feature)}</Text>
        <Button
          title="Upgrade to Pro for Unlimited Access"
          onPress={onUpgrade || (() => Alert.alert("Upgrade", "Redirecting to upgrade page..."))}
          style={styles.upgradeButton}
        />
      </Card>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  gateCard: {
    backgroundColor: COLORS.warning + "10",
    borderWidth: 1,
    borderColor: COLORS.warning + "30",
    alignItems: "center",
  },
  limitCard: {
    backgroundColor: COLORS.error + "10",
    borderWidth: 1,
    borderColor: COLORS.error + "30",
    alignItems: "center",
  },
  gateTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  limitTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  gateMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  limitMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  upgradeButton: {
    backgroundColor: COLORS.success,
  },
});