export const formatCurrency = (amount: number, currency = "INR", locale = "en-IN"): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch (error) {
    // Fallback for unsupported currencies
    return `₹${amount.toLocaleString("en-IN")}`
  }
}

export const formatINR = (amount: number): string => {
  return formatCurrency(amount, "INR", "en-IN")
}

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

export const formatPercentage = (value: number, decimals = 1, showSign = false): string => {
  const formatted = value.toFixed(decimals)
  const sign = showSign && value > 0 ? "+" : ""
  return `${sign}${formatted}%`
}

export const formatDate = (
  date: Date | string | number,
  format: "short" | "medium" | "long" | "relative" = "medium",
  locale = "en-IN",
): string => {
  const dateObj = new Date(date)

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date"
  }

  switch (format) {
    case "short":
      return dateObj.toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })

    case "medium":
      return dateObj.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })

    case "long":
      return dateObj.toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
      })

    case "relative":
      return formatRelativeDate(dateObj)

    default:
      return dateObj.toLocaleDateString(locale)
  }
}

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

export const truncateString = (str: string, maxLength: number, suffix = "..."): string => {
  if (str.length <= maxLength) {
    return str
  }
  return str.substring(0, maxLength - suffix.length) + suffix
}

export const truncateWords = (str: string, maxWords: number, suffix = "..."): string => {
  const words = str.split(" ")
  if (words.length <= maxWords) {
    return str
  }
  return words.slice(0, maxWords).join(" ") + suffix
}

export const formatNumber = (num: number, decimals = 0, locale = "en-IN"): string => {
  return num.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export const formatCompactNumber = (num: number): string => {
  if (num >= 10000000) {
    // 1 crore
    return `${(num / 10000000).toFixed(1)}Cr`
  } else if (num >= 100000) {
    // 1 lakh
    return `${(num / 100000).toFixed(1)}L`
  } else if (num >= 1000) {
    // 1 thousand
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "")

  // Indian phone number format
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`
  }

  return phone // Return original if format doesn't match
}

export const formatGST = (gst: string): string => {
  // Format GST number: 22AAAAA0000A1Z5
  const cleaned = gst.replace(/\s/g, "").toUpperCase()
  if (cleaned.length === 15) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7, 11)} ${cleaned.slice(11, 12)} ${cleaned.slice(12, 13)} ${cleaned.slice(13)}`
  }
  return gst
}

export const formatPAN = (pan: string): string => {
  // Format PAN: ABCDE1234F
  const cleaned = pan.replace(/\s/g, "").toUpperCase()
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return pan
}

export const formatBusinessName = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

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

export const formatRating = (rating: number, maxRating = 5): string => {
  return `${rating.toFixed(1)}/${maxRating}`
}

export const formatOrderId = (id: string): string => {
  return `#${id.toUpperCase()}`
}

export const formatInvoiceNumber = (number: string): string => {
  return `INV-${number}`
}

// Validation helpers
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
