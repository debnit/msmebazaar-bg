"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"

export interface ValidationRule<T = any> {
  required?: boolean | string
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  pattern?: RegExp | { value: RegExp; message: string }
  min?: number | { value: number; message: string }
  max?: number | { value: number; message: string }
  custom?: (value: T) => string | boolean
  email?: boolean | string
  phone?: boolean | string
  gst?: boolean | string
  pan?: boolean | string
}

export interface FieldConfig<T = any> {
  defaultValue?: T
  validation?: ValidationRule<T>
  transform?: (value: any) => T
}

export interface FormConfig<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FieldConfig<T[K]>
  }
  onSubmit?: (data: T) => Promise<void> | void
  validateOnChange?: boolean
  validateOnBlur?: boolean
  showSuccessToast?: boolean
  successMessage?: string
}

export interface FormState<T extends Record<string, any>> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
}

export interface FormReturn<T extends Record<string, any>> extends FormState<T> {
  setValue: <K extends keyof T>(field: K, value: T[K]) => void
  setError: <K extends keyof T>(field: K, error: string) => void
  clearError: <K extends keyof T>(field: K) => void
  setTouched: <K extends keyof T>(field: K, touched?: boolean) => void
  validateField: <K extends keyof T>(field: K) => string | null
  validateForm: () => boolean
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  reset: (newValues?: Partial<T>) => void
  getFieldProps: <K extends keyof T>(
    field: K,
  ) => {
    value: T[K]
    onChange: (value: T[K]) => void
    onBlur: () => void
    error: string | undefined
    touched: boolean
  }
}

function validateValue<T>(value: T, rules: ValidationRule<T>): string | null {
  if (rules.required) {
    const isEmpty =
      value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)
    if (isEmpty) {
      return typeof rules.required === "string" ? rules.required : "This field is required"
    }
  }

  if (value === null || value === undefined || value === "") {
    return null // Skip other validations for empty values
  }

  const stringValue = String(value)

  if (rules.minLength) {
    const minLength = typeof rules.minLength === "number" ? rules.minLength : rules.minLength.value
    const message =
      typeof rules.minLength === "object" ? rules.minLength.message : `Minimum length is ${minLength} characters`
    if (stringValue.length < minLength) {
      return message
    }
  }

  if (rules.maxLength) {
    const maxLength = typeof rules.maxLength === "number" ? rules.maxLength : rules.maxLength.value
    const message =
      typeof rules.maxLength === "object" ? rules.maxLength.message : `Maximum length is ${maxLength} characters`
    if (stringValue.length > maxLength) {
      return message
    }
  }

  if (rules.pattern) {
    const pattern = rules.pattern instanceof RegExp ? rules.pattern : rules.pattern.value
    const message = typeof rules.pattern === "object" ? rules.pattern.message : "Invalid format"
    if (!pattern.test(stringValue)) {
      return message
    }
  }

  if (typeof value === "number") {
    if (rules.min) {
      const min = typeof rules.min === "number" ? rules.min : rules.min.value
      const message = typeof rules.min === "object" ? rules.min.message : `Minimum value is ${min}`
      if (value < min) {
        return message
      }
    }

    if (rules.max) {
      const max = typeof rules.max === "number" ? rules.max : rules.max.value
      const message = typeof rules.max === "object" ? rules.max.message : `Maximum value is ${max}`
      if (value > max) {
        return message
      }
    }
  }

  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const message = typeof rules.email === "string" ? rules.email : "Invalid email address"
    if (!emailRegex.test(stringValue)) {
      return message
    }
  }

  if (rules.phone) {
    const phoneRegex = /^[6-9]\d{9}$/
    const message = typeof rules.phone === "string" ? rules.phone : "Invalid phone number"
    if (!phoneRegex.test(stringValue.replace(/\D/g, ""))) {
      return message
    }
  }

  if (rules.gst) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    const message = typeof rules.gst === "string" ? rules.gst : "Invalid GST number"
    if (!gstRegex.test(stringValue)) {
      return message
    }
  }

  if (rules.pan) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    const message = typeof rules.pan === "string" ? rules.pan : "Invalid PAN number"
    if (!panRegex.test(stringValue)) {
      return message
    }
  }

  if (rules.custom) {
    const result = rules.custom(value)
    if (typeof result === "string") {
      return result
    }
    if (result === false) {
      return "Invalid value"
    }
  }

  return null
}

export function useForm<T extends Record<string, any>>(config: FormConfig<T>): FormReturn<T> {
  const { toast } = useToast()

  // Initialize form state
  const initialValues = useMemo(() => {
    const values = {} as T
    Object.keys(config.fields).forEach((key) => {
      const field = config.fields[key as keyof T]
      values[key as keyof T] = field.defaultValue as T[keyof T]
    })
    return values
  }, [config.fields])

  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false,
  })

  const validateField = useCallback(
    <K extends keyof T>(field: K): string | null => {
      const fieldConfig = config.fields[field]
      const value = state.values[field]

      if (!fieldConfig?.validation) return null

      let processedValue = value
      if (fieldConfig.transform) {
        processedValue = fieldConfig.transform(value)
      }

      return validateValue(processedValue, fieldConfig.validation)
    },
    [config.fields, state.values],
  )

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(config.fields).forEach((key) => {
      const fieldKey = key as keyof T
      const error = validateField(fieldKey)
      if (error) {
        newErrors[fieldKey] = error
        isValid = false
      }
    })

    setState((prev) => ({
      ...prev,
      errors: newErrors,
      isValid,
    }))

    return isValid
  }, [config.fields, validateField])

  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setState((prev) => {
        const newValues = { ...prev.values, [field]: value }
        const newState = {
          ...prev,
          values: newValues,
          isDirty: true,
        }

        if (config.validateOnChange) {
          const fieldConfig = config.fields[field]
          let processedValue = value
          if (fieldConfig?.transform) {
            processedValue = fieldConfig.transform(value)
          }

          const error = fieldConfig?.validation ? validateValue(processedValue, fieldConfig.validation) : null

          newState.errors = { ...prev.errors }
          if (error) {
            newState.errors[field] = error
          } else {
            delete newState.errors[field]
          }

          newState.isValid = Object.keys(newState.errors).length === 0
        }

        return newState
      })
    },
    [config.fields, config.validateOnChange],
  )

  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
      isValid: false,
    }))
  }, [])

  const clearError = useCallback(<K extends keyof T>(field: K) => {
    setState((prev) => {
      const newErrors = { ...prev.errors }
      delete newErrors[field]
      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      }
    })
  }, [])

  const setTouched = useCallback(
    <K extends keyof T>(field: K, touched = true) => {
      setState((prev) => {
        const newState = {
          ...prev,
          touched: { ...prev.touched, [field]: touched },
        }

        if (touched && config.validateOnBlur) {
          const error = validateField(field)
          if (error) {
            newState.errors = { ...prev.errors, [field]: error }
            newState.isValid = false
          }
        }

        return newState
      })
    },
    [config.validateOnBlur, validateField],
  )

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      setState((prev) => ({ ...prev, isSubmitting: true }))

      try {
        const isValid = validateForm()
        if (!isValid) {
          setState((prev) => ({ ...prev, isSubmitting: false }))
          return
        }

        if (config.onSubmit) {
          await config.onSubmit(state.values)
        }

        if (config.showSuccessToast) {
          toast({
            title: "Success",
            description: config.successMessage || "Form submitted successfully",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        })
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }))
      }
    },
    [config, state.values, validateForm, toast],
  )

  const reset = useCallback(
    (newValues?: Partial<T>) => {
      const resetValues = newValues ? { ...initialValues, ...newValues } : initialValues
      setState({
        values: resetValues,
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: true,
        isDirty: false,
      })
    },
    [initialValues],
  )

  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => ({
      value: state.values[field],
      onChange: (value: T[K]) => setValue(field, value),
      onBlur: () => setTouched(field, true),
      error: state.errors[field],
      touched: state.touched[field] || false,
    }),
    [state.values, state.errors, state.touched, setValue, setTouched],
  )

  return {
    ...state,
    setValue,
    setError,
    clearError,
    setTouched,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    getFieldProps,
  }
}
