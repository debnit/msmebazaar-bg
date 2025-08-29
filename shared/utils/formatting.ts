// Formatting utilities
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return phone;
};

export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 3) {
    return `${localPart.charAt(0)}***@${domain}`;
  }
  return `${localPart.slice(0, 3)}***@${domain}`;
};

export const maskPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 10) {
    return `${cleaned.slice(0, 2)}****${cleaned.slice(-4)}`;
  }
  return phone;
};

export const formatBusinessSize = (size: string): string => {
  const sizeMap: Record<string, string> = {
    'MICRO': 'Micro Enterprise',
    'SMALL': 'Small Enterprise',
    'MEDIUM': 'Medium Enterprise'
  };
  return sizeMap[size] || size;
};
