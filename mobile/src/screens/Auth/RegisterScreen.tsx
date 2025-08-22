import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@mobile/components/ui/Button";
import { Card } from "@mobile/components/ui/Card";
import { apiClient } from "@mobile/api/apiClient";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formData;
    
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/auth/register", { name, email, password });
      Alert.alert(
        "Success", 
        "Account created successfully! Please login.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Join MSMEBazaar</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>

          <Card style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(value) => updateField("name", value)}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => updateField("email", value)}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => updateField("password", value)}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField("confirmPassword", value)}
              secureTextEntry
            />

            <Button
              onPress={handleRegister}
              title="Create Account"
              loading={loading}
              style={styles.registerButton}
            />
          </Card>

          <Button
            onPress={() => navigation.navigate("Login")}
            title="Already have an account? Sign In"
            variant="ghost"
            style={styles.loginButton}
          />
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
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
  registerButton: {
    marginTop: SPACING.sm,
  },
  loginButton: {
    alignSelf: "center",
  },
});