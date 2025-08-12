import { REGEX_PATTERNS, ERROR_MESSAGES } from "./constants"

// Base validator type
export type ValidatorResult = {
  isValid: boolean
  error?: string
}

export type ValidatorFunction = (value: any) => ValidatorResult

// Core validation functions
export const validators = {
  required:
    (message?: string): ValidatorFunction =>
    (value: any) => ({
      isValid: value !== null && value !== undefined && value !== "",
      error: message || ERROR_MESSAGES.REQUIRED_FIELD,
    }),

  email:
    (message?: string): ValidatorFunction =>
    (value: string) => ({
      isValid: !value || REGEX_PATTERNS.EMAIL.test(value),
      error: message || ERROR_MESSAGES.INVALID_EMAIL,
    }),

  phone:
    (message?: string): ValidatorFunction =>
    (value: string) => ({
      isValid: !value || REGEX_PATTERNS.PHONE.test(value),
      error: message || ERROR_MESSAGES.INVALID_PHONE,
    }),

  password:
    (message?: string): ValidatorFunction =>
    (value: string) => ({
      isValid: !value || REGEX_PATTERNS.PASSWORD.test(value),
      error: message || ERROR_MESSAGES.INVALID_PASSWORD,
    }),

  minLength:
    (min: number, message?: string): ValidatorFunction =>
    (value: string) => ({
      isValid: !value || value.length >= min,
      error: message || `Minimum ${min} characters required`,
    }),

  maxLength:
    (max: number, message?: string): ValidatorFunction =>
    (value: string) => ({
      isValid: !value || value.length <= max,
      error: message || `Maximum ${max} characters allowed`,
    }),

  min:
    (min: number, message?: string): ValidatorFunction =>
    (value: number) => ({
      isValid: value === null || value === undefined || value >= min,
      error: message || `Minimum value is ${min}`,
    }),

  max:
    (max: number, message?: string): ValidatorFunction =>
    (value: number) => ({
      isValid: value === null || value === undefined || value <= max,
      error: message || `Maximum value is ${max}`,
    }),

  url:
    (message?: string): ValidatorFunction =>
    (value: string) => ({
      isValid: !value || REGEX_PATTERNS.URL.test(value),
      error: message || ERROR_MESSAGES.INVALID_URL,
    }),

  // Indian business specific validators
  gst:
    (message?: string): ValidatorFunction =>
    (value: string) => {
      if (!value) return { isValid: true }

      const isValidFormat = REGEX_PATTERNS.GST.test(value)
      if (!isValidFormat) {
        return {
          isValid: false,
          error: message || ERROR_MESSAGES.INVALID_GST,
        }
      }

      // Additional GST checksum validation
      const gstRegex = /^([0-9]{2})([A-Z]{5})([0-9]{4})([A-Z]{1})([1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})$/
      const match = value.match(gstRegex)

      if (!match) {
        return {
          isValid: false,
          error: message || ERROR_MESSAGES.INVALID_GST,
        }
      }

      return { isValid: true }
    },

  pan:
    (message?: string): ValidatorFunction =>
    (value: string) => ({
      isValid: !value || REGEX_PATTERNS.PAN.test(value),
      error: message || ERROR_MESSAGES.INVALID_PAN,
    }),

  aadhar:
    (message?: string): ValidatorFunction =>
    (value: string) => {
      if (!value) return { isValid: true }

      // Remove spaces and check format
      const cleanAadhar = value.replace(/\s/g, "")
      const isValidFormat = REGEX_PATTERNS.AADHAR.test(cleanAadhar)

      if (!isValidFormat) {
        return {
          isValid: false,
          error: message || ERROR_MESSAGES.INVALID_AADHAR,
        }
      }

      // Verhoeff algorithm for Aadhar validation
      const verhoeffCheck = (num: string): boolean => {
        const d = [
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
          [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
          [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
          [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
          [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
          [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
          [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
          [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
          [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        ]

        const p = [
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
          [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
          [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
          [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
          [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
          [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
          [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
        ]

        let c = 0
        const reversedNum = num.split("").reverse()

        for (let i = 0; i < reversedNum.length; i++) {
          c = d[c][p[i % 8][Number.parseInt(reversedNum[i])]]
        }

        return c === 0
      }

      return {
        isValid: verhoeffCheck(cleanAadhar),
        error: message || ERROR_MESSAGES.INVALID_AADHAR,
      }
    },

  ifsc:
    (message?: string): ValidatorFunction =>
    (value: string) => ({
      isValid: !value || REGEX_PATTERNS.IFSC.test(value),
      error: message || ERROR_MESSAGES.INVALID_IFSC,
    }),

  pincode:
    (message?: string): ValidatorFunction =>
    (value: string) => ({
      isValid: !value || REGEX_PATTERNS.PINCODE.test(value),
      error: message || ERROR_MESSAGES.INVALID_PINCODE,
    }),

  businessName:
    (message?: string): ValidatorFunction =>
    (value: string) => {
      if (!value) return { isValid: true }

      // Check for minimum length and valid characters
      const isValidLength = value.length >= 2 && value.length <= 100
      const hasValidChars = /^[a-zA-Z0-9\s&.-]+$/.test(value)
      const hasAlphaNumeric = /[a-zA-Z0-9]/.test(value)

      return {
        isValid: isValidLength && hasValidChars && hasAlphaNumeric,
        error: message || "Business name must be 2-100 characters with valid business characters",
      }
    },

  // Date validators
  pastDate:
    (message?: string): ValidatorFunction =>
    (value: string | Date) => {
      if (!value) return { isValid: true }

      const date = new Date(value)
      const today = new Date()
      today.setHours(23, 59, 59, 999)

      return {
        isValid: date < today,
        error: message || "Date must be in the past",
      }
    },

  futureDate:
    (message?: string): ValidatorFunction =>
    (value: string | Date) => {
      if (!value) return { isValid: true }

      const date = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return {
        isValid: date > today,
        error: message || "Date must be in the future",
      }
    },

  minAge:
    (minAge: number, message?: string): ValidatorFunction =>
    (value: string | Date) => {
      if (!value) return { isValid: true }

      const birthDate = new Date(value)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age

      return {
        isValid: actualAge >= minAge,
        error: message || `Minimum age required is ${minAge} years`,
      }
    },

  // File validators
  fileSize:
    (maxSizeInMB: number, message?: string): ValidatorFunction =>
    (file: File) => {
      if (!file) return { isValid: true }

      const maxSizeInBytes = maxSizeInMB * 1024 * 1024

      return {
        isValid: file.size <= maxSizeInBytes,
        error: message || `File size must be less than ${maxSizeInMB}MB`,
      }
    },

  fileType:
    (allowedTypes: string[], message?: string): ValidatorFunction =>
    (file: File) => {
      if (!file) return { isValid: true }

      const fileExtension = file.name.split(".").pop()?.toLowerCase()

      return {
        isValid: allowedTypes.includes(fileExtension || ""),
        error: message || `Allowed file types: ${allowedTypes.join(", ")}`,
      }
    },

  // Amount validators
  amount:
    (message?: string): ValidatorFunction =>
    (value: number | string) => {
      if (!value) return { isValid: true }

      const numValue = typeof value === "string" ? Number.parseFloat(value) : value

      return {
        isValid: !isNaN(numValue) && numValue > 0,
        error: message || "Please enter a valid amount",
      }
    },

  percentage:
    (message?: string): ValidatorFunction =>
    (value: number | string) => {
      if (!value) return { isValid: true }

      const numValue = typeof value === "string" ? Number.parseFloat(value) : value

      return {
        isValid: !isNaN(numValue) && numValue >= 0 && numValue <= 100,
        error: message || "Percentage must be between 0 and 100",
      }
    },

  // Custom match validator
  match:
    (otherValue: any, fieldName: string, message?: string): ValidatorFunction =>
    (value: any) => ({
      isValid: value === otherValue,
      error: message || `Must match ${fieldName}`,
    }),
}

// Utility function to validate a single field with multiple validators
export const validateField = (value: any, validatorFunctions: ValidatorFunction[]): ValidatorResult => {
  for (const validator of validatorFunctions) {
    const result = validator(value)
    if (!result.isValid) {
      return result
    }
  }
  return { isValid: true }
}

// Utility function to validate an entire form
export const validateForm = <T extends Record<string, any>>(
  values: T,
  validationRules: Record<keyof T, ValidatorFunction[]>,
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {}
  let isValid = true

  for (const field in validationRules) {
    const fieldResult = validateField(values[field], validationRules[field])
    if (!fieldResult.isValid) {
      errors[field] = fieldResult.error
      isValid = false
    }
  }

  return { isValid, errors }
}

// Common validator combinations
export const commonValidators = {
  requiredEmail: [validators.required(), validators.email()],
  requiredPhone: [validators.required(), validators.phone()],
  requiredPassword: [validators.required(), validators.password()],
  requiredGST: [validators.required(), validators.gst()],
  requiredPAN: [validators.required(), validators.pan()],
  requiredBusinessName: [validators.required(), validators.businessName()],
  optionalEmail: [validators.email()],
  optionalPhone: [validators.phone()],
  optionalURL: [validators.url()],
  requiredAmount: [validators.required(), validators.amount()],
  requiredPercentage: [validators.required(), validators.percentage()],

  // File upload combinations
  requiredImage: [validators.required(), validators.fileType(["jpg", "jpeg", "png", "webp"]), validators.fileSize(5)],
  requiredDocument: [
    validators.required(),
    validators.fileType(["pdf", "jpg", "jpeg", "png"]),
    validators.fileSize(10),
  ],
  optionalImage: [validators.fileType(["jpg", "jpeg", "png", "webp"]), validators.fileSize(5)],
}

// Export individual validators for direct use
export const {
  required,
  email,
  phone,
  password,
  minLength,
  maxLength,
  min,
  max,
  url,
  gst,
  pan,
  aadhar,
  ifsc,
  pincode,
  businessName,
  pastDate,
  futureDate,
  minAge,
  fileSize,
  fileType,
  amount,
  percentage,
  match,
} = validators
