import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@mobile/components/ui/Card";
import { Button } from "@mobile/components/ui/Button";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

export default function BuyerProScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Buyer Pro Dashboard</Text>
        <Text style={styles.subtitle}>Advanced buying tools and analytics</Text>

        {/* Enhanced Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Advanced Analytics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹2.4L</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Suppliers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8★</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </Card>

        {/* Pro Features */}
        <Card style={styles.featuresCard}>
          <Text style={styles.cardTitle}>Pro Features</Text>
          <View style={styles.featureGrid}>
            <TouchableOpacity style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔍</Text>
              <Text style={styles.featureTitle}>Advanced Search</Text>
              <Text style={styles.featureDescription}>AI-powered product discovery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureItem}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureTitle}>Direct Messaging</Text>
              <Text style={styles.featureDescription}>Unlimited supplier chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureTitle}>Price Analytics</Text>
              <Text style={styles.featureDescription}>Market price insights</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚚</Text>
              <Text style={styles.featureTitle}>Bulk Orders</Text>
              <Text style={styles.featureDescription}>Volume discount manager</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Text style={styles.activityTitle}>Order #ORD-2024-001 delivered</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityTitle}>New quote received from Supplier XYZ</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityTitle}>Price alert: Electronics category -15%</Text>
            <Text style={styles.activityTime}>2 days ago</Text>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Button title="Create RFQ" style={styles.actionButton} />
            <Button title="View Reports" variant="outline" style={styles.actionButton} />
          </View>
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
  featuresCard: {
    marginBottom: SPACING.md,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    width: "48%",
    alignItems: "center",
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  featureTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  featureDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  activityCard: {
    marginBottom: SPACING.md,
  },
  activityItem: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  activityTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  activityTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  actionsCard: {
    marginBottom: SPACING.md,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 0.48,
  },
});