import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@mobile/components/ui/Button";
import { Card } from "@mobile/components/ui/Card";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

const roles = [
  { id: "buyer", title: "Buyer", description: "Find and purchase products/services", icon: "🛒" },
  { id: "seller", title: "Seller", description: "Sell your products and services", icon: "🏪" },
  { id: "agent", title: "Agent", description: "Connect buyers and sellers", icon: "🤝" },
  { id: "investor", title: "Investor", description: "Invest in growing businesses", icon: "💼" },
  { id: "msmeowner", title: "MSME Owner", description: "Manage your MSME business", icon: "🏢" },
  { id: "founder", title: "Founder", description: "Build and scale your startup", icon: "🚀" },
];

export default function RoleSelectionScreen({ navigation }) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleContinue = () => {
    if (selectedRoles.length > 0) {
      navigation.navigate("Register", { selectedRoles });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>What describes you best?</Text>
        <Text style={styles.subtitle}>Select all that apply to get personalized experience</Text>

        <View style={styles.rolesGrid}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              onPress={() => toggleRole(role.id)}
              style={[
                styles.roleCard,
                selectedRoles.includes(role.id) && styles.selectedRole
              ]}
            >
              <Text style={styles.roleIcon}>{role.icon}</Text>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          onPress={handleContinue}
          title="Continue"
          disabled={selectedRoles.length === 0}
          style={styles.continueButton}
        />
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
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  rolesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.xl,
  },
  roleCard: {
    width: "48%",
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedRole: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },
  roleIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  roleTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  roleDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  continueButton: {
    marginTop: SPACING.lg,
  },
});