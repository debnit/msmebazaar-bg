import { REGEX_PATTERNS, ERROR_MESSAGES } from "./constants"

// Base validation result interface
export interface ValidationResult {
  isValid: boolean
  error?: string
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  if (!REGEX_PATTERNS.EMAIL.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL }
  }

  return { isValid: true }
}

// Phone number validation (Indian format)
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, "")

  if (!REGEX_PATTERNS.PHONE.test(cleanPhone)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_PHONE }
  }

  return { isValid: true }
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" }
  }

  if (!REGEX_PATTERNS.PASSWORD.test(password)) {
    return { isValid: false, error: ERROR_MESSAGES.WEAK_PASSWORD }
  }

  return { isValid: true }
}

// Confirm password validation
export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: ERROR_MESSAGES.PASSWORD_MISMATCH }
  }

  return { isValid: true }
}

// GST number validation
export function validateGST(gst: string): ValidationResult {
  if (!gst) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  const cleanGST = gst.replace(/\s/g, "").toUpperCase()

  if (!REGEX_PATTERNS.GST.test(cleanGST)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_GST }
  }

  return { isValid: true }
}

// PAN number validation
export function validatePAN(pan: string): ValidationResult {
  if (!pan) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  const cleanPAN = pan.replace(/\s/g, "").toUpperCase()

  if (!REGEX_PATTERNS.PAN.test(cleanPAN)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_PAN }
  }

  return { isValid: true }
}

// Pincode validation
export function validatePincode(pincode: string): ValidationResult {
  if (!pincode) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  const cleanPincode = pincode.replace(/\D/g, "")

  if (!REGEX_PATTERNS.PINCODE.test(cleanPincode)) {
    return { isValid: false, error: "Please enter a valid 6-digit pincode" }
  }

  return { isValid: true }
}

// IFSC code validation
export function validateIFSC(ifsc: string): ValidationResult {
  if (!ifsc) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  const cleanIFSC = ifsc.replace(/\s/g, "").toUpperCase()

  if (!REGEX_PATTERNS.IFSC.test(cleanIFSC)) {
    return { isValid: false, error: "Please enter a valid IFSC code" }
  }

  return { isValid: true }
}

// Aadhar number validation
export function validateAadhar(aadhar: string): ValidationResult {
  if (!aadhar) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  const cleanAadhar = aadhar.replace(/\D/g, "")

  if (!REGEX_PATTERNS.AADHAR.test(cleanAadhar)) {
    return { isValid: false, error: "Please enter a valid 12-digit Aadhar number" }
  }

  return { isValid: true }
}

// Required field validation
export function validateRequired(value: any, fieldName?: string): ValidationResult {
  if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
    return {
      isValid: false,
      error: fieldName ? `${fieldName} is required` : ERROR_MESSAGES.REQUIRED_FIELD,
    }
  }

  return { isValid: true }
}

// String length validation
export function validateLength(value: string, min?: number, max?: number, fieldName?: string): ValidationResult {
  if (!value) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  if (min && value.length < min) {
    return {
      isValid: false,
      error: `${fieldName || "Field"} must be at least ${min} characters long`,
    }
  }

  if (max && value.length > max) {
    return {
      isValid: false,
      error: `${fieldName || "Field"} must be no more than ${max} characters long`,
    }
  }

  return { isValid: true }
}

// Number range validation
export function validateRange(value: number, min?: number, max?: number, fieldName?: string): ValidationResult {
  if (value === null || value === undefined) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  if (min !== undefined && value < min) {
    return {
      isValid: false,
      error: `${fieldName || "Value"} must be at least ${min}`,
    }
  }

  if (max !== undefined && value > max) {
    return {
      isValid: false,
      error: `${fieldName || "Value"} must be no more than ${max}`,
    }
  }

  return { isValid: true }
}

// URL validation
export function validateURL(url: string): ValidationResult {
  if (!url) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: "Please enter a valid URL" }
  }
}

// Date validation
export function validateDate(date: string | Date, fieldName?: string): ValidationResult {
  if (!date) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  const dateObj = typeof date === "string" ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return {
      isValid: false,
      error: `Please enter a valid ${fieldName || "date"}`,
    }
  }

  return { isValid: true }
}

// Future date validation
export function validateFutureDate(date: string | Date, fieldName?: string): ValidationResult {
  const dateValidation = validateDate(date, fieldName)
  if (!dateValidation.isValid) {
    return dateValidation
  }

  const dateObj = typeof date === "string" ? new Date(date) : date
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (dateObj <= today) {
    return {
      isValid: false,
      error: `${fieldName || "Date"} must be in the future`,
    }
  }

  return { isValid: true }
}

// Past date validation
export function validatePastDate(date: string | Date, fieldName?: string): ValidationResult {
  const dateValidation = validateDate(date, fieldName)
  if (!dateValidation.isValid) {
    return dateValidation
  }

  const dateObj = typeof date === "string" ? new Date(date) : date
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  if (dateObj > today) {
    return {
      isValid: false,
      error: `${fieldName || "Date"} cannot be in the future`,
    }
  }

  return { isValid: true }
}

// Age validation (for date of birth)
export function validateAge(dateOfBirth: string | Date, minAge = 18, maxAge = 100): ValidationResult {
  const dateValidation = validateDate(dateOfBirth, "Date of birth")
  if (!dateValidation.isValid) {
    return dateValidation
  }

  const dob = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth
  const today = new Date()
  const age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    // Birthday hasn't occurred this year
  }

  if (age < minAge) {
    return {
      isValid: false,
      error: `You must be at least ${minAge} years old`,
    }
  }

  if (age > maxAge) {
    return {
      isValid: false,
      error: `Age cannot exceed ${maxAge} years`,
    }
  }

  return { isValid: true }
}

// File validation
export function validateFile(
  file: File,
  maxSize: number = 10 * 1024 * 1024, // 10MB
  allowedTypes: string[] = ["image/jpeg", "image/png", "application/pdf"],
): ValidationResult {
  if (!file) {
    return { isValid: false, error: "Please select a file" }
  }

  if (file.size > maxSize) {
    return { isValid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE }
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_FILE_TYPE }
  }

  return { isValid: true }
}

// Business name validation
export function validateBusinessName(name: string): ValidationResult {
  if (!name) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }

  if (name.length < 2) {
    return { isValid: false, error: "Business name must be at least 2 characters long" }
  }

  if (name.length > 100) {
    return { isValid: false, error: "Business name must be no more than 100 characters long" }
  }

  // Check for valid characters (letters, numbers, spaces, and common business symbols)
  const validBusinessNameRegex = /^[a-zA-Z0-9\s&.,'-]+$/
  if (!validBusinessNameRegex.test(name)) {
    return { isValid: false, error: "Business name contains invalid characters" }
  }

  return { isValid: true }
}

// Amount validation (for Indian currency)
export function validateAmount(
  amount: number | string,
  min = 0,
  max = 10000000, // 1 Crore
  fieldName?: string,
): ValidationResult {
  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount

  if (isNaN(numAmount)) {
    return { isValid: false, error: `Please enter a valid ${fieldName || "amount"}` }
  }

  if (numAmount < min) {
    return {
      isValid: false,
      error: `${fieldName || "Amount"} must be at least ₹${min.toLocaleString("en-IN")}`,
    }
  }

  if (numAmount > max) {
    return {
      isValid: false,
      error: `${fieldName || "Amount"} cannot exceed ₹${max.toLocaleString("en-IN")}`,
    }
  }

  return { isValid: true }
}

// Percentage validation
export function validatePercentage(
  percentage: number | string,
  min = 0,
  max = 100,
  fieldName?: string,
): ValidationResult {
  const numPercentage = typeof percentage === "string" ? Number.parseFloat(percentage) : percentage

  if (isNaN(numPercentage)) {
    return { isValid: false, error: `Please enter a valid ${fieldName || "percentage"}` }
  }

  if (numPercentage < min) {
    return {
      isValid: false,
      error: `${fieldName || "Percentage"} must be at least ${min}%`,
    }
  }

  if (numPercentage > max) {
    return {
      isValid: false,
      error: `${fieldName || "Percentage"} cannot exceed ${max}%`,
    }
  }

  return { isValid: true }
}

// Multiple field validation
export function validateMultiple(validations: (() => ValidationResult)[]): ValidationResult {
  for (const validation of validations) {
    const result = validation()
    if (!result.isValid) {
      return result
    }
  }

  return { isValid: true }
}

// Custom validation function type
export type CustomValidator<T = any> = (value: T) => ValidationResult

// Generic field validator that accepts multiple validation rules
export function validateField<T = any>(value: T, validators: CustomValidator<T>[]): ValidationResult {
  for (const validator of validators) {
    const result = validator(value)
    if (!result.isValid) {
      return result
    }
  }

  return { isValid: true }
}

// Form validation helper
export function validateForm<T extends Record<string, any>>(
  data: T,
  validationRules: Partial<Record<keyof T, CustomValidator<T[keyof T]>[]>>,
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {}
  let isValid = true

  for (const [field, validators] of Object.entries(validationRules)) {
    if (validators && Array.isArray(validators)) {
      const fieldValue = data[field as keyof T]
      const result = validateField(fieldValue, validators)

      if (!result.isValid) {
        errors[field as keyof T] = result.error
        isValid = false
      }
    }
  }

  return { isValid, errors }
}

// Export commonly used validator combinations
export const commonValidators = {
  required: (fieldName?: string) => (value: any) => validateRequired(value, fieldName),
  email: () => (value: string) => validateEmail(value),
  phone: () => (value: string) => validatePhone(value),
  password: () => (value: string) => validatePassword(value),
  gst: () => (value: string) => validateGST(value),
  pan: () => (value: string) => validatePAN(value),
  pincode: () => (value: string) => validatePincode(value),
  businessName: () => (value: string) => validateBusinessName(value),
  amount: (min?: number, max?: number, fieldName?: string) => (value: number | string) =>
    validateAmount(value, min, max, fieldName),
  length: (min?: number, max?: number, fieldName?: string) => (value: string) =>
    validateLength(value, min, max, fieldName),
  range: (min?: number, max?: number, fieldName?: string) => (value: number) =>
    validateRange(value, min, max, fieldName),
}
