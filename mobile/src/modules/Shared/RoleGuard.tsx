import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@mobile/store/authStore";
import { UserRole } from "@shared/types/feature";
import { COLORS, TYPOGRAPHY } from "@mobile/utils/constants";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please log in to access this feature.</Text>
      </View>
    );
  }

  const hasRequiredRole = user.roles.some(role => allowedRoles.includes(role as UserRole));

  if (!hasRequiredRole) {
    return fallback || (
      <View style={styles.container}>
        <Text style={styles.message}>
          You don't have permission to access this feature.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});