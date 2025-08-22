import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@mobile/components/ui/Button";
import { Card } from "@mobile/components/ui/Card";
import { apiClient } from "@mobile/api/apiClient";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      setSent(true);
      Alert.alert(
        "Email Sent",
        "If an account with this email exists, you'll receive password reset instructions."
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>

          <Card style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!sent}
            />

            <Button
              onPress={handleResetPassword}
              title={sent ? "Email Sent" : "Send Reset Instructions"}
              loading={loading}
              disabled={sent}
              style={styles.resetButton}
            />
          </Card>

          <Button
            onPress={() => navigation.goBack()}
            title="Back to Login"
            variant="ghost"
            style={styles.backButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: "center",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: "center",
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  resetButton: {
    marginTop: SPACING.sm,
  },
  backButton: {
    alignSelf: "center",
  },
});