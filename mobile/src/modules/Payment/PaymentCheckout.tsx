import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Card } from "@mobile/components/ui/Card";
import { Button } from "@mobile/components/ui/Button";
import { apiClient } from "@mobile/api/apiClient";
import { useAuth } from "@mobile/store/authStore";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

interface PaymentCheckoutProps {
  amount: number;
  description: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
}

export function PaymentCheckout({ amount, description, onSuccess, onFailure }: PaymentCheckoutProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    if (!user) {
      Alert.alert("Error", "Please login to continue");
      return;
    }

    setLoading(true);
    try {
      // Create order on backend
      const order = await apiClient.post<{
        id: string;
        amount: number;
        currency: string;
        key: string;
      }>("/payments/orders", {
        amount: amount * 100, // Convert to paise
        currency: "INR",
        description,
      });

      // In a real app, you would integrate with Razorpay React Native SDK here
      // For now, simulate payment success
      setTimeout(() => {
        onSuccess(order.id);
        setLoading(false);
      }, 2000);

    } catch (error: any) {
      setLoading(false);
      onFailure(error.message || "Payment failed");
    }
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount to Pay</Text>
        <Text style={styles.amount}>₹{amount.toLocaleString()}</Text>
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.userInfo}>
        <Text style={styles.userLabel}>Paying as:</Text>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <Button
        onPress={initiatePayment}
        title={loading ? "Processing..." : "Pay Now"}
        loading={loading}
        style={styles.payButton}
      />

      <Text style={styles.secureNote}>
        🔒 Your payment is secured with 256-bit SSL encryption
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  amountLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  amount: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    fontWeight: "700",
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  userInfo: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  userLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  userName: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  payButton: {
    marginBottom: SPACING.md,
  },
  secureNote: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});