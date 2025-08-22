import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@mobile/store/authStore";
import { Card } from "@mobile/components/ui/Card";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Welcome back, {user?.name}!</Text>
        
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Quick Stats</Text>
          <Text style={styles.statText}>Account Type: {user?.isPro ? "Pro" : "Free"}</Text>
          <Text style={styles.statText}>Roles: {user?.roles.join(", ")}</Text>
        </Card>

        <Card style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          {/* Add quick action buttons based on user roles */}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scrollView: {
    flex: 1,
    padding: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  statsCard: {
    marginBottom: SPACING.md,
  },
  actionsCard: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
});