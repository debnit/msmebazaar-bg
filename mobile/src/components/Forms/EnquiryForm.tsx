import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Button } from "@mobile/components/ui/Button";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

interface EnquiryFormProps {
  onSubmit: (data: any) => void;
}

export function EnquiryForm({ onSubmit }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    business: "",
    requirement: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.requirement) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(
        "Enquiry Submitted!",
        "Our expert will contact you within 2 hours.",
        [{ text: "OK", onPress: () => onSubmit(formData) }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Your Name *"
        value={formData.name}
        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number *"
        value={formData.phone}
        onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={formData.business}
        onChangeText={(text) => setFormData(prev => ({ ...prev, business: text }))}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="What do you need help with? *"
        value={formData.requirement}
        onChangeText={(text) => setFormData(prev => ({ ...prev, requirement: text }))}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      
      <Button
        title={loading ? "Submitting..." : "Submit Enquiry"}
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: "#fff",
    ...TYPOGRAPHY.body,
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.success,
  },
});