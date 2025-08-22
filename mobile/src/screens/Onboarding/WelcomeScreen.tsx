import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@mobile/components/ui/Button";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require("@mobile/assets/images/welcome-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Welcome to MSMEBazaar</Text>
        <Text style={styles.subtitle}>
          Your one-stop platform for MSME business growth, funding, and marketplace access
        </Text>

        <View style={styles.features}>
          <Text style={styles.featureItem}>🏢 Connect with buyers and sellers</Text>
          <Text style={styles.featureItem}>💰 Access business loans and funding</Text>
          <Text style={styles.featureItem}>📊 Get business insights and analytics</Text>
          <Text style={styles.featureItem}>🤝 Network with industry experts</Text>
        </View>

        <Button
          onPress={() => navigation.navigate("RoleSelection")}
          title="Get Started"
          style={styles.getStartedButton}
        />
        
        <Button
          onPress={() => navigation.navigate("Login")}
          title="Already have an account? Sign In"
          variant="ghost"
          style={styles.signInButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  features: {
    marginBottom: SPACING.xxl,
  },
  featureItem: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  getStartedButton: {
    width: "100%",
    marginBottom: SPACING.md,
  },
  signInButton: {
    alignSelf: "center",
  },
});