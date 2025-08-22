import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@mobile/components/ui/Card";
import { Button } from "@mobile/components/ui/Button";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

export default function SellerProScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Seller Pro Dashboard</Text>
        <Text style={styles.subtitle}>Advanced selling tools and analytics</Text>

        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Business Performance</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Total Sales</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹2.4L</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.7★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("Products")}>
              <Text style={styles.actionIcon}>📦</Text>
              <Text style={styles.actionTitle}>Manage Products</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("Orders")}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionTitle}>View Orders</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionTitle}>Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionTitle}>Messages</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.proFeaturesCard}>
          <Text style={styles.cardTitle}>Pro Features Active</Text>
          <Text style={styles.featureItem}>✓ Unlimited product listings</Text>
          <Text style={styles.featureItem}>✓ Advanced analytics dashboard</Text>
          <Text style={styles.featureItem}>✓ Priority customer support</Text>
          <Text style={styles.featureItem}>✓ Bulk product management</Text>
          <Text style={styles.featureItem}>✓ Export sales reports</Text>
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
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  statsCard: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  statNumber: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  actionsCard: {
    marginBottom: SPACING.md,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionItem: {
    width: "48%",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  actionTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  proFeaturesCard: {
    backgroundColor: COLORS.success + "10",
    marginBottom: SPACING.md,
  },
  featureItem: {
    ...TYPOGRAPHY.body,
    color: COLORS.success,
    marginBottom: SPACING.xs,
    fontWeight: "500",
  },
});