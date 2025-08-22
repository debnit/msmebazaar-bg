import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@mobile/components/ui/Card";
import { Button } from "@mobile/components/ui/Button";
import { useQuery } from "react-query";
import { apiClient } from "@mobile/api/apiClient";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  seller: string;
}

export default function BuyerFreeScreen({ navigation }) {
  const { data: listings, isLoading } = useQuery<Listing[]>(
    "buyer-listings",
    () => apiClient.get("/marketplace/products?limit=5")
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Buyer Dashboard (Free)</Text>
        <Text style={styles.subtitle}>Discover products and services</Text>

        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Your Activity</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Inquiries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
          </View>
        </Card>

        {/* Featured Listings */}
        <Card style={styles.listingsCard}>
          <Text style={styles.cardTitle}>Featured Listings</Text>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            listings?.slice(0, 3).map((listing) => (
              <TouchableOpacity key={listing.id} style={styles.listingItem}>
                <Text style={styles.listingTitle}>{listing.title}</Text>
                <Text style={styles.listingPrice}>₹{listing.price.toLocaleString()}</Text>
                <Text style={styles.listingDescription} numberOfLines={2}>
                  {listing.description}
                </Text>
              </TouchableOpacity>
            ))
          )}
          <Button
            title="View All Listings"
            variant="outline"
            onPress={() => navigation.navigate("BuyerListings")}
            style={styles.viewAllButton}
          />
        </Card>

        {/* Pro Upgrade */}
        <Card style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Unlock Premium Features</Text>
          <Text style={styles.upgradeDescription}>
            • Unlimited inquiries and messaging
            • Advanced search and filters
            • Priority support
            • Bulk order management
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
  listingsCard: {
    marginBottom: SPACING.md,
  },
  listingItem: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  listingTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  listingPrice: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  listingDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  viewAllButton: {
    marginTop: SPACING.md,
  },
  upgradeCard: {
    backgroundColor: COLORS.primary + "10",
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