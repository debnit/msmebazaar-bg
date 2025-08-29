import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  errorStyle,
  style,
  ...props
}, ref) => {
  const inputStyle = [
    styles.base,
    styles[variant],
    styles[size],
    leftIcon && styles.withLeftIcon,
    rightIcon && styles.withRightIcon,
    error && styles.error,
    style,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={inputStyle}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text style={styles.helperText}>
          {helperText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  base: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#111827',
  },
  default: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  outlined: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderColor: '#6b7280',
  },
  filled: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderColor: 'transparent',
  },
  sm: {
    paddingVertical: 8,
    fontSize: 14,
  },
  md: {
    paddingVertical: 12,
    fontSize: 16,
  },
  lg: {
    paddingVertical: 16,
    fontSize: 18,
  },
  withLeftIcon: {
    paddingLeft: 44,
  },
  withRightIcon: {
    paddingRight: 44,
  },
  error: {
    borderColor: '#ef4444',
  },
  leftIconContainer: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});

export default Input;
