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

  if (isNaN(amount)) return "₹0"

  // Handle compact formatting for large numbers
  if (compact) {
    if (amount >= 10000000) {
      // 1 crore and above
      const crores = amount / 10000000
      return `${showSymbol ? "₹" : ""}${crores.toFixed(crores >= 100 ? 0 : 1)}Cr`
    } else if (amount >= 100000) {
      // 1 lakh and above
      const lakhs = amount / 100000
      return `${showSymbol ? "₹" : ""}${lakhs.toFixed(lakhs >= 100 ? 0 : 1)}L`
    } else if (amount >= 1000) {
      // 1 thousand and above
      const thousands = amount / 1000
      return `${showSymbol ? "₹" : ""}${thousands.toFixed(thousands >= 100 ? 0 : 1)}K`
    }
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })

  let formatted = formatter.format(amount)

  // Remove currency symbol if not needed
  if (!showSymbol) {
    formatted = formatted.replace(/₹|INR/g, "").trim()
  }

  return formatted
}

/**
 * Format numbers in Indian numbering system (lakhs, crores)
 */
export function formatIndianNumber(num: number): string {
  if (isNaN(num)) return "0"

  const numStr = Math.abs(num).toString()
  const isNegative = num < 0

  if (numStr.length <= 3) {
    return (isNegative ? "-" : "") + numStr
  }

  // Indian numbering system: last 3 digits, then groups of 2
  const lastThree = numStr.substring(numStr.length - 3)
  const otherNumbers = numStr.substring(0, numStr.length - 3)

  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree

  return (isNegative ? "-" : "") + formatted
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

  if (Math.abs(diffInSeconds) < 60) {
    return "just now"
  }

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
    if (count >= 1) {
      const suffix = count === 1 ? "" : "s"
      const timePhrase = `${count} ${interval.label}${suffix}`
      return diffInSeconds < 0 ? `in ${timePhrase}` : `${timePhrase} ago`
    }
  }

  return "just now"
}

/**
 * Format business registration number (CIN, GSTIN, etc.)
 */
export function formatBusinessNumber(number: string, type: "CIN" | "GSTIN" | "PAN" | "UDYAM" = "GSTIN"): string {
  if (!number) return ""

  const cleaned = number.replace(/\s+/g, "").toUpperCase()

  switch (type) {
    case "GSTIN":
      // Format: 22AAAAA0000A1Z5
      if (cleaned.length === 15) {
        return cleaned.replace(/(.{2})(.{10})(.{3})/, "$1 $2 $3")
      }
      break
    case "CIN":
      // Format: L17110DL1995PLC069348
      if (cleaned.length === 21) {
        return cleaned.replace(/(.{1})(.{5})(.{2})(.{4})(.{3})(.{6})/, "$1$2$3$4$5$6")
      }
      break
    case "PAN":
      // Format: AAAPL1234C
      if (cleaned.length === 10) {
        return cleaned.replace(/(.{5})(.{4})(.{1})/, "$1$2$3")
      }
      break
    case "UDYAM":
      // Format: UDYAM-XX-00-0000000
      return cleaned.replace(/UDYAM/, "UDYAM-").replace(/(.{8})(.{2})(.{2})(.{7})/, "$1$2-$3-$4")
  }

  return cleaned
}

/**
 * Format phone number in Indian format
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ""

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "")

  // Handle Indian mobile numbers (10 digits) and landline with STD (11 digits)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{5})(\d{5})/, "$1 $2")
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3")
  } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
    // With country code
    return cleaned.replace(/(\d{2})(\d{5})(\d{5})/, "+$1 $2 $3")
  }

  return phone
}

/**
 * Format percentage with proper decimal places
 */
export function formatPercentage(
  value: number,
  options: {
    decimals?: number
    showSign?: boolean
  } = {},
): string {
  const { decimals = 1, showSign = true } = options

  if (isNaN(value)) return "0%"

  const formatted = value.toFixed(decimals)
  return `${showSign && value > 0 ? "+" : ""}${formatted}%`
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Format business name with proper capitalization
 */
export function formatBusinessName(name: string): string {
  if (!name) return ""

  // Common business suffixes that should remain uppercase
  const suffixes = ["LLP", "PVT", "LTD", "LLC", "INC", "CORP", "CO"]

  return name
    .toLowerCase()
    .split(" ")
    .map((word) => {
      // Keep suffixes uppercase
      if (suffixes.includes(word.toUpperCase())) {
        return word.toUpperCase()
      }
      // Capitalize first letter of other words
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(" ")
}

/**
 * Format address in Indian format
 */
export function formatAddress(address: {
  line1?: string
  line2?: string
  city?: string
  state?: string
  pincode?: string
  country?: string
}): string {
  const parts = []

  if (address.line1) parts.push(address.line1)
  if (address.line2) parts.push(address.line2)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.pincode) parts.push(address.pincode)
  if (address.country && address.country !== "India") parts.push(address.country)

  return parts.join(", ")
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

/**
 * Format loan amount with tenure
 */
export function formatLoanDetails(amount: number, tenure: number, interestRate?: number): string {
  const formattedAmount = formatCurrency(amount, { compact: true })
  const tenureText = `${tenure} ${tenure === 1 ? "month" : "months"}`

  if (interestRate) {
    return `${formattedAmount} for ${tenureText} at ${formatPercentage(interestRate)} p.a.`
  }

  return `${formattedAmount} for ${tenureText}`
}

/**
 * Format business turnover range
 */
export function formatTurnoverRange(min: number, max: number): string {
  const minFormatted = formatCurrency(min, { compact: true })
  const maxFormatted = formatCurrency(max, { compact: true })
  return `${minFormatted} - ${maxFormatted}`
}

/**
 * Format employee count range
 */
export function formatEmployeeRange(min: number, max: number): string {
  if (min === max) return `${min} employees`
  return `${min}-${max} employees`
}

/**
 * Format business stage/category
 */
export function formatBusinessStage(stage: string): string {
  const stageMap: Record<string, string> = {
    startup: "Startup",
    growth: "Growth Stage",
    mature: "Mature Business",
    expansion: "Expansion Phase",
    turnaround: "Turnaround",
  }

  return stageMap[stage.toLowerCase()] || stage
}

/**
 * Format industry/sector name
 */
export function formatIndustry(industry: string): string {
  return industry
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/**
 * Format duration in human readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? "s" : ""}`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`
  }

  return `${hours}h ${remainingMinutes}m`
}

/**
 * Format status with color coding
 */
export function formatStatus(status: string): {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
} {
  const statusMap: Record<string, { label: string; variant: any }> = {
    pending: { label: "Pending", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    rejected: { label: "Rejected", variant: "destructive" },
    in_progress: { label: "In Progress", variant: "default" },
    completed: { label: "Completed", variant: "success" },
    cancelled: { label: "Cancelled", variant: "secondary" },
    draft: { label: "Draft", variant: "outline" },
    active: { label: "Active", variant: "success" },
    inactive: { label: "Inactive", variant: "secondary" },
  }

  return statusMap[status.toLowerCase()] || { label: status, variant: "default" }
}
