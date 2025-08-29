import { z } from "zod";

// Loan Application Schema
export const loanApplicationSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  loanAmount: z.number().positive("Loan amount must be positive"),
  purpose: z.enum(["WORKING_CAPITAL", "EQUIPMENT_PURCHASE", "INVENTORY", "EXPANSION", "DEBT_CONSOLIDATION", "EMERGENCY", "OTHER"]),
  tenureMonths: z.number().int().min(1).max(360, "Loan tenure cannot exceed 30 years"),
  interestRate: z.number().positive().max(50).optional(),
  businessId: z.string().cuid().optional(),
  personalIncome: z.number().positive().optional(),
  businessRevenue: z.number().positive().optional(),
  creditScore: z.number().int().min(300).max(900).optional(),
  documents: z.record(z.string().url()).optional(),
});

// Loan Disbursement Schema
export const loanDisbursementSchema = z.object({
  applicationId: z.string().cuid("Invalid application ID"),
  amount: z.number().positive("Disbursement amount must be positive"),
  transactionRef: z.string().optional(),
});

// Loan Repayment Schema
export const loanRepaymentSchema = z.object({
  applicationId: z.string().cuid("Invalid application ID"),
  amount: z.number().positive("Repayment amount must be positive"),
  principalAmount: z.number().positive("Principal amount must be positive"),
  interestAmount: z.number().min(0, "Interest amount cannot be negative"),
  dueDate: z.date(),
  transactionRef: z.string().optional(),
});

// Loan Assessment Schema
export const loanAssessmentSchema = z.object({
  applicationId: z.string().cuid("Invalid application ID"),
  assessorId: z.string().cuid("Invalid assessor ID"),
  creditScore: z.number().int().min(300).max(900),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "VERY_HIGH"]),
  approvedAmount: z.number().positive().optional(),
  recommendedRate: z.number().positive().max(50).optional(),
  assessment: z.string().min(1, "Assessment notes are required").max(2000),
  conditions: z.array(z.string()).optional(),
});

// Update Schemas
export const updateLoanApplicationSchema = z.object({
  status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "DISBURSED", "ACTIVE", "COMPLETED", "DEFAULTED"]),
  approvedAmount: z.number().positive().optional(),
  rejectionReason: z.string().max(1000).optional(),
  assignedTo: z.string().cuid().optional(),
  reviewedBy: z.string().cuid().optional(),
  approvedAt: z.date().optional(),
});

// Loan Query Schema
export const loanQuerySchema = z.object({
  userId: z.string().cuid().optional(),
  status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "DISBURSED", "ACTIVE", "COMPLETED", "DEFAULTED"]).optional(),
  purpose: z.enum(["WORKING_CAPITAL", "EQUIPMENT_PURCHASE", "INVENTORY", "EXPANSION", "DEBT_CONSOLIDATION", "EMERGENCY", "OTHER"]).optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Types
export type LoanApplicationInput = z.infer<typeof loanApplicationSchema>;
export type LoanDisbursementInput = z.infer<typeof loanDisbursementSchema>;
export type LoanRepaymentInput = z.infer<typeof loanRepaymentSchema>;
export type LoanAssessmentInput = z.infer<typeof loanAssessmentSchema>;
export type UpdateLoanApplicationInput = z.infer<typeof updateLoanApplicationSchema>;
export type LoanQueryInput = z.infer<typeof loanQuerySchema>;