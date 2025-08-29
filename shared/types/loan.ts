// Loan related types
export interface Loan {
  id: string;
  borrowerId: string;
  lenderId?: string;
  amount: number;
  interestRate: number;
  tenure: number; // in months
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  repaymentSchedule: RepaymentSchedule[];
  collateral?: Collateral[];
  creditScore?: number;
  riskAssessment?: string;
  documents: LoanDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RepaymentSchedule {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: Date;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';
  paidAmount?: number;
  paidDate?: Date;
}

export interface Collateral {
  id: string;
  type: 'PROPERTY' | 'VEHICLE' | 'GOLD' | 'SHARES' | 'OTHER';
  description: string;
  estimatedValue: number;
  documents: string[];
}

export interface LoanDocument {
  id: string;
  loanId: string;
  type: 'INCOME_PROOF' | 'BANK_STATEMENT' | 'ITR' | 'BUSINESS_PROOF' | 'COLLATERAL_DOCS' | 'OTHER';
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  verifiedAt?: Date;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}
