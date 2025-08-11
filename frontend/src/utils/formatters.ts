
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
 * Format INR currency without options (wrapper)
 */
export const formatINR = (amount: number): string => {
  return formatCurrency(amount, { showSymbol: true, showDecimals: true, compact: false })
}

/**
 * Format compact currency as string with units (Cr, L, K)
 */
export const formatCompactCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    // 1 crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  } else if (amount >= 100000) {
    // 1 lakh
    return `₹${(amount / 100000).toFixed(1)}L`
  } else if (amount >= 1000) {
    // 1 thousand
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return formatINR(amount)
}

/**
 * Format percentage with proper rounding and optional sign
 */
export const formatPercentage = (
  value: number,
  decimals = 1,
  showSign = false,
): string => {
  const formatted = value.toFixed(decimals)
  const sign = showSign && value > 0 ? "+" : ""
  return `${sign}${formatted}%`
}

/**
 * Format date for Indian context
 */
export const formatDate = (
  date: Date | string | number,
  format: "short" | "medium" | "long" | "relative" = "medium",
  locale = "en-IN",
): string => {
  const dateObj = new Date(date)

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date"
  }

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

  return dateObj.toLocaleDateString(locale, options)
}

/**
 * Format relative date helper (alternative implementation)
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} month${months > 1 ? "s" : ""} ago`
  } else {
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} year${years > 1 ? "s" : ""} ago`
  }
}

/**
 * Format date and time with time
 */
export const formatDateTime = (date: Date | string | number, locale = "en-IN"): string => {
  const dateObj = new Date(date)

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date"
  }

  return dateObj.toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

/**
 * Format time only
 */
export const formatTime = (date: Date | string | number, locale = "en-IN"): string => {
  const dateObj = new Date(date)

  if (isNaN(dateObj.getTime())) {
    return "Invalid Time"
  }

  return dateObj.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

/**
 * Truncate string with suffix
 */
export const truncateString = (str: string, maxLength: number, suffix = "..."): string => {
  if (str.length <= maxLength) {
    return str
  }
  return str.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Truncate words with suffix
 */
export const truncateWords = (str: string, maxWords: number, suffix = "..."): string => {
  const words = str.split(" ")
  if (words.length <= maxWords) {
    return str
  }
  return words.slice(0, maxWords).join(" ") + suffix
}

/**
 * Format number with decimals
 */
export const formatNumber = (num: number, decimals = 0, locale = "en-IN"): string => {
  return num.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format compact number with units (Cr, L, K)
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}Cr`
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(1)}L`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * Format file size in human readable form
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Format phone number (Indian format)
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
 * Format GST number (Indian)
 */
export const formatGST = (gst: string): string => {
  const cleaned = gst.replace(/\s/g, "").toUpperCase()
  if (cleaned.length === 15) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7, 11)} ${cleaned.slice(11, 12)} ${cleaned.slice(12, 13)} ${cleaned.slice(13)}`
  }
  return gst
}

/**
 * Format PAN number (Indian)
 */
export const formatPAN = (pan: string): string => {
  const cleaned = pan.replace(/\s/g, "").toUpperCase()
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return pan
}

/**
 * Format business ID based on type (GST, PAN, CIN, UDYAM)
 */
export const formatBusinessId = (id: string, type: "GST" | "PAN" | "CIN" | "UDYAM"): string => {
  const cleaned = id.toUpperCase().replace(/\s/g, "")

  switch (type) {
    case "GST":
      if (cleaned.length === 15) {
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7, 11)} ${cleaned.slice(11, 12)} ${cleaned.slice(12, 13)} ${cleaned.slice(13)}`
      }
      break
    case "PAN":
      if (cleaned.length === 10) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
      }
      break
    case "CIN":
      if (cleaned.length === 21) {
        return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 12)} ${cleaned.slice(12, 15)} ${cleaned.slice(15)}`
      }
      break
    case "UDYAM":
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
 * Format business name by capitalizing each word
 */
export const formatBusinessName = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/**
 * Format address from parts, join with commas
 */
export const formatAddress = (address: {
  line1?: string
  line2?: string
  city?: string
  state?: string
  pincode?: string
  country?: string
}): string => {
  const parts = [address.line1, address.line2, address.city, address.state, address.pincode, address.country].filter(
    Boolean,
  )

  return parts.join(", ")
}

/**
 * Format time duration from seconds (h, m, s)
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

/**
 * Format rating as string with max rating
 */
export const formatRating = (rating: number, maxRating = 5): string => {
  return `${rating.toFixed(1)}/${maxRating}`
}

/**
 * Format order ID by prefixing #
 */
export const formatOrderId = (id: string): string => {
  return `#${id.toUpperCase()}`
}

/**
 * Format invoice number by prefixing INV-
 */
export const formatInvoiceNumber = (number: string): string => {
  return `INV-${number}`
}

/**
 * Validation helpers
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export const isValidGST = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return gstRegex.test(gst.replace(/\s/g, ""))
}

export const isValidPAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan.replace(/\s/g, ""))
}

export const isValidPincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/
  return pincodeRegex.test(pincode)
}

/**
 * Format loan status for display with label and color
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
 * Format time duration in months or years + months
 */
export const formatDurationMonths = (months: number): string => {
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
