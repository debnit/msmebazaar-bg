// Business related types
export interface Business {
  id: string;
  name: string;
  description?: string;
  industry: string;
  size: 'MICRO' | 'SMALL' | 'MEDIUM';
  establishedYear: number;
  website?: string;
  email: string;
  phone: string;
  address: BusinessAddress;
  gstNumber?: string;
  panNumber?: string;
  udyamNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface BusinessDocument {
  id: string;
  businessId: string;
  type: 'GST_CERTIFICATE' | 'PAN_CARD' | 'UDYAM_CERTIFICATE' | 'BANK_STATEMENT' | 'OTHER';
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  verifiedAt?: Date;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}
