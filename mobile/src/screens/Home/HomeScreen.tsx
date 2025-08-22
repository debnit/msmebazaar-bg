import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@mobile/components/ui/Card";
import { Button } from "@mobile/components/ui/Button";
import { useAuth } from "@mobile/store/authStore";
import { FeatureGate } from "@mobile/components/FeatureGating/FeatureGate";
import { LoanCTA } from "@mobile/components/Home/LoanCTA";
import { OnboardingCTA } from "@mobile/components/Home/OnboardingCTA";
import { FeaturesShowcase } from "@mobile/components/Home/FeaturesShowcase";
import { EnquiryForm } from "@mobile/components/Forms/EnquiryForm";
import { WhatsAppButton } from "@mobile/components/Home/WhatsAppButton";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              {user ? `Welcome back, ${user.name}!` : 'Welcome to MSMEBazaar'}
            </Text>
            <Text style={styles.headerSubtitle}>
              Your complete MSME business growth platform
            </Text>
          </View>
          {user?.isPro && (
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          )}
        </View>

        {/* Loan CTA - Primary Action */}
        <LoanCTA onPress={() => navigation.navigate("LoanApplication")} />

        {/* Onboarding CTA for new users */}
        {!user && <OnboardingCTA onPress={() => navigation.navigate("Welcome")} />}

        {/* Features Showcase */}
        <FeaturesShowcase 
          onLoanPress={() => navigation.navigate("BusinessLoans")}
          onValuationPress={() => navigation.navigate("AIValuation")}
          onMarketLinkagePress={() => navigation.navigate("MarketLinkage")}
          onExitStrategyPress={() => navigation.navigate("ExitStrategy")}
        />

        {/* Quick Stats (if user is logged in) */}
        {user && (
          <Card style={styles.statsCard}>
            <Text style={styles.cardTitle}>Your MSMEBazaar Journey</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Connections</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>₹5.2L</Text>
                <Text style={styles.statLabel}>Business Value</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Active Deals</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Business Tools */}
        <Card style={styles.toolsCard}>
          <Text style={styles.cardTitle}>🛠️ Business Tools</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity style={styles.toolItem} onPress={() => navigation.navigate("BusinessValuation")}>
              <Text style={styles.toolIcon}>📊</Text>
              <Text style={styles.toolTitle}>AI Valuation</Text>
              <Text style={styles.toolSubtitle}>Free assessment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolItem} onPress={() => navigation.navigate("LoanApplication")}>
              <Text style={styles.toolIcon}>💰</Text>
              <Text style={styles.toolTitle}>Business Loans</Text>
              <Text style={styles.toolSubtitle}>Up to ₹5 Crores</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolItem} onPress={() => navigation.navigate("MarketLinkage")}>
              <Text style={styles.toolIcon}>🔗</Text>
              <Text style={styles.toolTitle}>Market Linkage</Text>
              <Text style={styles.toolSubtitle}>Connect with buyers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolItem} onPress={() => navigation.navigate("ExitStrategy")}>
              <Text style={styles.toolIcon}>🚀</Text>
              <Text style={styles.toolTitle}>Exit Strategy</Text>
              <Text style={styles.toolSubtitle}>Plan your exit</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Enquiry Form */}
        <Card style={styles.enquiryCard}>
          <Text style={styles.cardTitle}>💬 Get Expert Consultation</Text>
          <Text style={styles.enquiryDescription}>
            Have questions about growing your MSME? Our experts are here to help!
          </Text>
          {showEnquiryForm ? (
            <EnquiryForm onSubmit={() => setShowEnquiryForm(false)} />
          ) : (
            <Button
              title="Start Free Consultation"
              onPress={() => setShowEnquiryForm(true)}
              style={styles.enquiryButton}
            />
          )}
        </Card>

        {/* Success Stories */}
        <Card style={styles.storiesCard}>
          <Text style={styles.cardTitle}>📈 Success Stories</Text>
          <View style={styles.storyItem}>
            <Text style={styles.storyText}>
              "MSMEBazaar helped me get a ₹50 lakh loan in just 15 days. My textile business has grown 3x!"
            </Text>
            <Text style={styles.storyAuthor}>- Priya Sharma, Mumbai</Text>
          </View>
          <View style={styles.storyItem}>
            <Text style={styles.storyText}>
              "Found 20+ verified buyers through MSMEBazaar. Monthly revenue increased by 200%!"
            </Text>
            <Text style={styles.storyAuthor}>- Raj Kumar, Delhi</Text>
          </View>
        </Card>

        {/* WhatsApp Support */}
        <WhatsAppButton 
          message="Hi! I need help with my MSME business growth. Can you assist me?"
          style={styles.whatsappButton}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Join 100,000+ MSMEs growing with MSMEBazaar
          </Text>
        </View>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.primary + "10",
  },
  welcomeText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  proBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  proText: {
    ...TYPOGRAPHY.caption,
    color: "#fff",
    fontWeight: "600",
  },
  statsCard: {
    margin: SPACING.md,
    marginTop: 0,
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
  toolsCard: {
    margin: SPACING.md,
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  toolItem: {
    width: "48%",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  toolIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  toolTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  toolSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  enquiryCard: {
    margin: SPACING.md,
    backgroundColor: COLORS.primary + "05",
  },
  enquiryDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  enquiryButton: {
    backgroundColor: COLORS.primary,
  },
  storiesCard: {
    margin: SPACING.md,
    backgroundColor: COLORS.success + "05",
  },
  storyItem: {
    marginBottom: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  storyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontStyle: "italic",
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
  storyAuthor: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  whatsappButton: {
    margin: SPACING.md,
  },
  footer: {
    padding: SPACING.lg,
    alignItems: "center",
  },
  footerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
});