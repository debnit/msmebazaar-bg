import type { LoanApplicationResponse, LoanListResponse } from "@/types/loan";

/**
 * Fetch status of a single loan application
 */
export async function fetchLoanStatus(loanId: string): Promise<LoanApplicationResponse> {
  const res = await fetch(`/api/loans/${loanId}`);
  if (!res.ok) throw new Error("Failed to fetch loan status");
  return res.json();
}

/**
 * Fetch paginated list of loans
 */
export async function listLoans(page = 1): Promise<LoanListResponse> {
  const res = await fetch(`/api/loans?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch loan list");
  return res.json();
}
