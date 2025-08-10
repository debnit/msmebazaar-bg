/**
 * Utility functions for formatting currency, dates, strings, and other data
 * relevant to the MSME domain in the Indian context
 */

/**
 * Format currency in Indian Rupees with proper locale formatting
 */
export function formatCurrency(
  amount: number,
  options: {
    showSymbol?: boolean
    showDecimals?: boolean
    compact?: boolean
    locale?: string
  } = {},
): string {
  const { showSymbol = true, showDecimals = true, compact = false, locale = "en-IN" } = options

  if (compact && amount >= 10000000) {
    // Format in Crores
    const crores = amount / 10000000
    return `${showSymbol ? "₹" : ""}${crores.toFixed(crores >= 100 ? 0 : 1)} Cr`
  }

  if (compact && amount >= 100000) {
    // Format in Lakhs
    const lakhs = amount / 100000
    return `${showSymbol ? "₹" : ""}${lakhs.toFixed(lakhs >= 100 ? 0 : 1)} L`
  }

  if (compact && amount >= 1000) {
    // Format in Thousands
    const thousands = amount / 1000
    return `${showSymbol ? "₹" : ""}${thousands.toFixed(thousands >= 100 ? 0 : 1)}K`
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })

  let formatted = formatter.format(amount)

  if (!showSymbol) {
    formatted = formatted.replace("₹", "").trim()
  }

  return formatted
}

/**
 * Format numbers in Indian numbering system (Lakhs, Crores)
 */
export function formatIndianNumber(num: number, compact = false): string {
  if (compact) {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(1)}Cr`
    }
    if (num >= 100000) {
      return `${(num / 100000).toFixed(1)}L`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
  }

  return new Intl.NumberFormat("en-IN").format(num)
}

/**
 * Format date in Indian format (DD/MM/YYYY)
 */
export function formatDate(
  date: Date | string | number,
  options: {
    format?: "short" | "medium" | "long" | "relative"
    includeTime?: boolean
    locale?: string
  } = {},
): string {
  const { format = "medium", includeTime = false, locale = "en-IN" } = options

  const dateObj = new Date(date)

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date"
  }

  if (format === "relative") {
    return formatRelativeDate(dateObj)
  }

  const formatOptions: Intl.DateTimeFormatOptions = {}

  switch (format) {
    case "short":
      formatOptions.day = "2-digit"
      formatOptions.month = "2-digit"
      formatOptions.year = "numeric"
      break
    case "medium":
      formatOptions.day = "2-digit"
      formatOptions.month = "short"
      formatOptions.year = "numeric"
      break
    case "long":
      formatOptions.day = "numeric"
      formatOptions.month = "long"
      formatOptions.year = "numeric"
      formatOptions.weekday = "long"
      break
  }

  if (includeTime) {
    formatOptions.hour = "2-digit"
    formatOptions.minute = "2-digit"
    formatOptions.hour12 = true
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj)
}

/**
 * Format relative date (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeDate(date: Date | string | number): string {
  const dateObj = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
    if (count >= 1) {
      const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
      return rtf.format(diffInSeconds > 0 ? -count : count, interval.label as Intl.RelativeTimeFormatUnit)
    }
  }

  return "just now"
}

/**
 * Format business registration number (CIN, GSTIN, etc.)
 */
export function formatBusinessNumber(number: string, type: "CIN" | "GSTIN" | "PAN" | "UDYAM"): string {
  if (!number) return ""

  const cleaned = number.replace(/\s/g, "").toUpperCase()

  switch (type) {
    case "CIN":
      // Format: L12345MH2023PTC123456
      if (cleaned.length === 21) {
        return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 15)}-${cleaned.slice(15)}`
      }
      break
    case "GSTIN":
      // Format: 12ABCDE1234F1Z5
      if (cleaned.length === 15) {
        return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}-${cleaned.slice(11, 12)}-${cleaned.slice(12, 13)}-${cleaned.slice(13)}`
      }
      break
    case "PAN":
      // Format: ABCDE1234F
      if (cleaned.length === 10) {
        return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
      }
      break
    case "UDYAM":
      // Format: UDYAM-XX-00-0000000
      if (cleaned.startsWith("UDYAM") && cleaned.length >= 12) {
        return cleaned.replace(/(.{5})(.{2})(.{2})(.*)/, "$1-$2-$3-$4")
      }
      break
  }

  return cleaned
}

/**
 * Format phone number in Indian format
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ""

  const cleaned = phone.replace(/\D/g, "")

  // Indian mobile number format: +91 98765 43210
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }

  // If already has country code
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`
  }

  return phone
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Format percentage with proper decimal places
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format business name for display (title case, trim)
 */
export function formatBusinessName(name: string): string {
  if (!name) return ""

  return name
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/**
 * Format address for display
 */
export function formatAddress(address: {
  line1?: string
  line2?: string
  city?: string
  state?: string
  pincode?: string
  country?: string
}): string {
  const parts = [address.line1, address.line2, address.city, address.state, address.pincode, address.country].filter(
    Boolean,
  )

  return parts.join(", ")
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Format loan status for display
 */
export function formatLoanStatus(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: "Draft", color: "gray" },
    submitted: { label: "Submitted", color: "blue" },
    under_review: { label: "Under Review", color: "yellow" },
    approved: { label: "Approved", color: "green" },
    rejected: { label: "Rejected", color: "red" },
    disbursed: { label: "Disbursed", color: "green" },
    closed: { label: "Closed", color: "gray" },
  }

  return statusMap[status] || { label: status, color: "gray" }
}

/**
 * Format business stage for display
 */
export function formatBusinessStage(stage: string): string {
  const stageMap: Record<string, string> = {
    idea: "Idea Stage",
    startup: "Startup",
    growth: "Growth Stage",
    mature: "Mature Business",
    expansion: "Expansion Phase",
    exit: "Exit Ready",
  }

  return stageMap[stage] || stage
}

/**
 * Format industry type for display
 */
export function formatIndustryType(industry: string): string {
  return industry
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Format time duration (e.g., "2h 30m", "1d 5h")
 */
export function formatDuration(seconds: number): string {
  const units = [
    { label: "d", value: 86400 },
    { label: "h", value: 3600 },
    { label: "m", value: 60 },
    { label: "s", value: 1 },
  ]

  const parts: string[] = []
  let remaining = seconds

  for (const unit of units) {
    const count = Math.floor(remaining / unit.value)
    if (count > 0) {
      parts.push(`${count}${unit.label}`)
      remaining -= count * unit.value
    }
    if (parts.length >= 2) break // Show only top 2 units
  }

  return parts.join(" ") || "0s"
}

/**
 * Format credit score range
 */
export function formatCreditScore(score: number): { label: string; color: string } {
  if (score >= 750) return { label: "Excellent", color: "green" }
  if (score >= 700) return { label: "Good", color: "blue" }
  if (score >= 650) return { label: "Fair", color: "yellow" }
  if (score >= 600) return { label: "Poor", color: "orange" }
  return { label: "Very Poor", color: "red" }
}

/**
 * Format business turnover range
 */
export function formatTurnoverRange(turnover: number): string {
  if (turnover < 500000) return "Below ₹5 Lakh"
  if (turnover < 2000000) return "₹5 Lakh - ₹20 Lakh"
  if (turnover < 10000000) return "₹20 Lakh - ₹1 Crore"
  if (turnover < 50000000) return "₹1 Crore - ₹5 Crore"
  if (turnover < 250000000) return "₹5 Crore - ₹25 Crore"
  return "Above ₹25 Crore"
}

/**
 * Mask sensitive information (PAN, Aadhaar, etc.)
 */
export function maskSensitiveInfo(value: string, type: "pan" | "aadhaar" | "account" = "pan"): string {
  if (!value) return ""

  switch (type) {
    case "pan":
      // Show first 3 and last 1 characters: ABC***234F
      return value.length >= 4 ? `${value.slice(0, 3)}***${value.slice(-1)}` : value
    case "aadhaar":
      // Show last 4 digits: ****-****-1234
      return value.length >= 4 ? `****-****-${value.slice(-4)}` : value
    case "account":
      // Show last 4 digits: ****1234
      return value.length >= 4 ? `****${value.slice(-4)}` : value
    default:
      return value
  }
}
