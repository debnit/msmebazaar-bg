import React from "react";
import { TouchableOpacity, Text, StyleSheet, Linking, Alert } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

interface WhatsAppButtonProps {
  message?: string;
  phoneNumber?: string;
  style?: any;
}

export function WhatsAppButton({ 
  message = "Hi! I need help with MSMEBazaar services.", 
  phoneNumber = "+919876543210",
  style 
}: WhatsAppButtonProps) {
  
  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert("Error", "WhatsApp is not installed on your device");
        }
      })
      .catch((err) => {
        console.error("WhatsApp error:", err);
        Alert.alert("Error", "Failed to open WhatsApp");
      });
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={openWhatsApp}>
      <Text style={styles.icon}>📱</Text>
      <Text style={styles.text}>Chat on WhatsApp</Text>
      <Text style={styles.subtitle}>Get instant support</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: 12,
    marginHorizontal: SPACING.md,
  },
  icon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  text: {
    ...TYPOGRAPHY.body,
    color: "#fff",
    fontWeight: "600",
    flex: 1,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: "#fff",
    opacity: 0.8,
  },
});