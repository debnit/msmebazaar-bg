import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@mobile/components/ui/Card";
import { Button } from "@mobile/components/ui/Button";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

export default function SellerFreeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Seller Dashboard (Free)</Text>
        <Text style={styles.subtitle}>Manage your products and sales</Text>

        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Quick Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Inquiries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹15K</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.limitsCard}>
          <Text style={styles.cardTitle}>Free Plan Limits</Text>
          <Text style={styles.limitText}>• Up to 10 product listings</Text>
          <Text style={styles.limitText}>• Basic inquiries (5 per day)</Text>
          <Text style={styles.limitText}>• Standard support</Text>
          <Text style={styles.limitText}>• Basic analytics</Text>
        </Card>

        <Card style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Grow Your Business</Text>
          <Text style={styles.upgradeDescription}>
            Upgrade to Pro for unlimited listings, advanced analytics, priority support, and more!
          </Text>
          <Button
            title="Upgrade to Pro"
            onPress={() => navigation.navigate("ProUpgrade")}
            style={styles.upgradeButton}
          />
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  limitsCard: {
    marginBottom: SPACING.md,
  },
  limitText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  upgradeCard: {
    backgroundColor: COLORS.success + "10",
    marginBottom: SPACING.md,
  },
  upgradeTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  upgradeDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  upgradeButton: {
    alignSelf: "flex-start",
  },
});