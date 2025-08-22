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
import { useAuth } from "@mobile/store/authStore";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "An error occurred");
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Welcome to MSMEBazaar</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <Card style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />

            <Button
              onPress={handleLogin}
              title="Sign In"
              loading={loading}
              style={styles.loginButton}
            />

            <Button
              onPress={() => navigation.navigate("ForgotPassword")}
              title="Forgot Password?"
              variant="ghost"
              style={styles.forgotButton}
            />
          </Card>

          <Button
            onPress={() => navigation.navigate("Register")}
            title="Create Account"
            variant="outline"
            style={styles.registerButton}
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
  loginButton: {
    marginBottom: SPACING.sm,
  },
  forgotButton: {
    alignSelf: "center",
  },
  registerButton: {
    alignSelf: "center",
  },
});