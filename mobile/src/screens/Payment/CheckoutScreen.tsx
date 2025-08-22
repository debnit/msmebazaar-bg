import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaymentCheckout } from "@mobile/modules/Payment/PaymentCheckout";
import { COLORS } from "@mobile/utils/constants";

export default function CheckoutScreen({ route, navigation }) {
  const { amount, description, plan } = route.params || {};

  const handlePaymentSuccess = (paymentId: string) => {
    Alert.alert(
      "Payment Successful!",
      "Your payment has been processed successfully.",
      [
        {
          text: "Continue",
          onPress: () => {
            // Navigate to success screen or back to dashboard
            navigation.navigate("PaymentSuccess", { paymentId, plan });
          },
        },
      ]
    );
  };

  const handlePaymentFailure = (error: string) => {
    Alert.alert(
      "Payment Failed",
      error,
      [
        {
          text: "Retry",
          onPress: () => {
            // Allow user to retry payment
          },
        },
        {
          text: "Cancel",
          onPress: () => navigation.goBack(),
          style: "cancel",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <PaymentCheckout
        amount={amount || 99}
        description={description || "MSMEBazaar Pro Subscription"}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});