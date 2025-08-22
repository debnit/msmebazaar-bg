import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { Card } from "@mobile/components/ui/Card";
import { Button } from "@mobile/components/ui/Button";
import { apiClient } from "@mobile/api/apiClient";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

// Shared with frontend - matches your webapp's loan application structure
interface LoanApplicationData {
  businessName: string;
  businessType: string;
  annualTurnover: number;
  loanAmount: number;
  purpose: string;
  gstNumber?: string;
  panNumber: string;
}

export function LoanApplicationForm({ onSuccess }: { onSuccess: (applicationId: string) => void }) {
  const [formData, setFormData] = useState<LoanApplicationData>({
    businessName: "",
    businessType: "",
    annualTurnover: 0,
    loanAmount: 0,
    purpose: "",
    gstNumber: "",
    panNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const submitApplication = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post<{ id: string }>("/loans/applications", formData);
      onSuccess(response.id);
    } catch (error) {
      console.error("Loan application failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof LoanApplicationData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.title}>Business Loan Application</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          value={formData.businessName}
          onChangeText={(value) => updateField("businessName", value)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Business Type"
          value={formData.businessType}
          onChangeText={(value) => updateField("businessType", value)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Annual Turnover"
          value={formData.annualTurnover.toString()}
          onChangeText={(value) => updateField("annualTurnover", parseFloat(value) || 0)}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Loan Amount Required"
          value={formData.loanAmount.toString()}
          onChangeText={(value) => updateField("loanAmount", parseFloat(value) || 0)}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Purpose of Loan"
          value={formData.purpose}
          onChangeText={(value) => updateField("purpose", value)}
          multiline
          numberOfLines={3}
        />
        
        <TextInput
          style={styles.input}
          placeholder="GST Number (Optional)"
          value={formData.gstNumber}
          onChangeText={(value) => updateField("gstNumber", value)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="PAN Number"
          value={formData.panNumber}
          onChangeText={(value) => updateField("panNumber", value)}
        />
        
        <Button
          onPress={submitApplication}
          title="Submit Application"
          loading={loading}
          style={styles.submitButton}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: "center",
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
  submitButton: {
    marginTop: SPACING.md,
  },
});