import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { colors } from "@mobile/styles/tokens/colors";

interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "overline";
  color?: string;
  children: React.ReactNode;
  style?: TextStyle;
}

export function Typography({ 
  variant = "body", 
  color = colors.neutral[900],
  children, 
  style 
}: TypographyProps) {
  return (
    <Text style={[styles[variant], { color }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    letterSpacing: -0.02,
  },
  h2: {
    fontSize: 28,
    fontWeight: "600", 
    lineHeight: 36,
    letterSpacing: -0.01,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  overline: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});