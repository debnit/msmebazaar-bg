/**
 * Utility functions for formatting data in MSME domain context
 * Includes currency, date, phone, business registration formatting
 */

/**
 * Format currency in Indian Rupees with proper locale
 */
export const formatCurrency = (
  amount: number,
  options: {
    showSymbol?: boolean
    showDecimals?: boolean
    compact?: boolean
  } = {},
): string => {
  const { showSymbol = true, showDecimals = true, compact = false } = options

  if (compact && amount >= 10000000) {
    // Format in crores
    const crores = amount / 10000000
    return `${showSymbol ? "₹" : ""}${crores.toFixed(1)}Cr`
  } else if (compact && amount >= 100000) {
    // Format in lakhs
    const lakhs = amount / 100000
    return `${showSymbol ? "₹" : ""}${lakhs.toFixed(1)}L`
  } else if (compact && amount >= 1000) {
    // Format in thousands
    const thousands = amount / 1000
    return `${showSymbol ? "₹" : ""}${thousands.toFixed(1)}K`
  }

  const formatter = new Intl.NumberFormat("en-IN", {
    style: showSymbol ? "currency" : "decimal",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })

  return formatter.format(amount)
}

/**
 * Format date for Indian context
 */
export const formatDate = (
  date: string | Date,
  format: "short" | "medium" | "long" | "relative" = "medium",
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date

  if (format === "relative") {
    const now = new Date()
    const diffInMs = now.getTime() - dateObj.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
  }

  switch (format) {
    case "short":
      options.day = "2-digit"
      options.month = "2-digit"
      options.year = "numeric"
      break
    case "medium":
      options.day = "numeric"
      options.month = "short"
      options.year = "numeric"
      break
    case "long":
      options.weekday = "long"
      options.day = "numeric"
      options.month = "long"
      options.year = "numeric"
      break
  }

  return new Intl.DateTimeFormat("en-IN", options).format(dateObj)
}

/**
 * Format Indian phone numbers
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "")

  // Handle Indian mobile numbers (10 digits)
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }

  // Handle numbers with country code
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    const number = cleaned.slice(2)
    return `+91 ${number.slice(0, 5)} ${number.slice(5)}`
  }

  return phone // Return original if format not recognized
}

/**
 * Format business registration numbers (GST, PAN, etc.)
 */
export const formatBusinessId = (id: string, type: "GST" | "PAN" | "CIN" | "UDYAM"): string => {
  const cleaned = id.toUpperCase().replace(/\s/g, "")

  switch (type) {
    case "GST":
      // Format: 22AAAAA0000A1Z5
      if (cleaned.length === 15) {
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7, 11)} ${cleaned.slice(11, 12)} ${cleaned.slice(12, 13)} ${cleaned.slice(13)}`
      }
      break
    case "PAN":
      // Format: AAAAA0000A
      if (cleaned.length === 10) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
      }
      break
    case "CIN":
      // Format: L17110DL1995PLC069348
      if (cleaned.length === 21) {
        return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 12)} ${cleaned.slice(12, 15)} ${cleaned.slice(15)}`
      }
      break
    case "UDYAM":
      // Format: UDYAM-XX-00-0000000
      if (cleaned.startsWith("UDYAM")) {
        const number = cleaned.slice(5)
        if (number.length === 11) {
          return `UDYAM-${number.slice(0, 2)}-${number.slice(2, 4)}-${number.slice(4)}`
        }
      }
      break
  }

  return id // Return original if format not recognized
}

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Format percentage with proper rounding
 */
export const formatPercentage = (
  value: number,
  options: {
    decimals?: number
    showSign?: boolean
  } = {},
): string => {
  const { decimals = 1, showSign = true } = options
  const formatted = (value * 100).toFixed(decimals)
  return `${formatted}${showSign ? "%" : ""}`
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Format business category for display
 */
export const formatBusinessCategory = (category: string): string => {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/**
 * Format loan status for display
 */
export const formatLoanStatus = (
  status: string,
): {
  label: string
  color: "green" | "yellow" | "red" | "blue" | "gray"
} => {
  const statusMap: Record<string, { label: string; color: "green" | "yellow" | "red" | "blue" | "gray" }> = {
    PENDING: { label: "Under Review", color: "yellow" },
    APPROVED: { label: "Approved", color: "green" },
    REJECTED: { label: "Rejected", color: "red" },
    DISBURSED: { label: "Disbursed", color: "blue" },
    CLOSED: { label: "Closed", color: "gray" },
    DRAFT: { label: "Draft", color: "gray" },
  }

  return statusMap[status] || { label: status, color: "gray" }
}

/**
 * Format time duration (e.g., for loan tenure)
 */
export const formatDuration = (months: number): string => {
  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""}`
  }

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? "s" : ""}`
  }

  return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`
}
