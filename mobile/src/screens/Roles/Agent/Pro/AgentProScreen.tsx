import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@mobile/components/ui/Card";
import { RoleGuard } from "@mobile/modules/Shared/RoleGuard";
import { UserRole } from "@shared/types/feature";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

export default function AgentProScreen({ navigation }) {
  return (
    <RoleGuard allowedRoles={[UserRole.AGENT]}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Agent Pro Dashboard</Text>
          <Text style={styles.subtitle}>Advanced CRM and deal management</Text>

          <Card style={styles.pipelineCard}>
            <Text style={styles.cardTitle}>Sales Pipeline</Text>
            <View style={styles.pipelineStats}>
              <View style={styles.pipelineStage}>
                <Text style={styles.stageNumber}>12</Text>
                <Text style={styles.stageLabel}>Leads</Text>
              </View>
              <View style={styles.pipelineStage}>
                <Text style={styles.stageNumber}>8</Text>
                <Text style={styles.stageLabel}>Qualified</Text>
              </View>
              <View style={styles.pipelineStage}>
                <Text style={styles.stageNumber}>3</Text>
                <Text style={styles.stageLabel}>Negotiation</Text>
              </View>
              <View style={styles.pipelineStage}>
                <Text style={styles.stageNumber}>2</Text>
                <Text style={styles.stageLabel}>Closed</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.actionsCard}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("CRM")}>
                <Text style={styles.actionTitle}>CRM Pipeline</Text>
                <Text style={styles.actionSubtitle}>Manage leads & deals</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("Deals")}>
                <Text style={styles.actionTitle}>Active Deals</Text>
                <Text style={styles.actionSubtitle}>Track negotiations</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem}>
                <Text style={styles.actionTitle}>Commission</Text>
                <Text style={styles.actionSubtitle}>Track earnings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem}>
                <Text style={styles.actionTitle}>Reports</Text>
                <Text style={styles.actionSubtitle}>Performance analytics</Text>
              </TouchableOpacity>
            </View>
          </Card>

          <Card style={styles.recentDealsCard}>
            <Text style={styles.cardTitle}>Recent Deals</Text>
            <View style={styles.dealItem}>
              <Text style={styles.dealTitle}>Tech Startup - Series A</Text>
              <Text style={styles.dealAmount}>₹50L</Text>
              <Text style={styles.dealStatus}>In Progress</Text>
            </View>
            <View style={styles.dealItem}>
              <Text style={styles.dealTitle}>Manufacturing MSME</Text>
              <Text style={styles.dealAmount}>₹25L</Text>
              <Text style={styles.dealStatus}>Closed</Text>
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </RoleGuard>
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
  pipelineCard: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  pipelineStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  pipelineStage: {
    alignItems: "center",
  },
  stageNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  stageLabel: {
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
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  actionTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  actionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  recentDealsCard: {
    marginBottom: SPACING.md,
  },
  dealItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dealTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  dealAmount: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  dealStatus: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
  },
});