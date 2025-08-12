// src/hooks/useLoanStatus.ts
"use client";
import { useState, useCallback } from "react";
import { api } from "@/services/api-client";
import type { LoanApplication } from "@/types/loan";

export function useLoanStatus() {
  const [loanData, setLoanData] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async (loanId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.loans.fetchLoanStatus(loanId);
      if (response.success && response.data) {
        setLoanData(response.data);
      } else {
        setError(response.message || "Failed to load loan status");
      }
    } catch (err: any) {
      setError(err.message || "Error loading loan status");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loanData, loading, error, fetchStatus };
}
