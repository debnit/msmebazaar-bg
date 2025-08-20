import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { paymentsApiService } from "@/services/payment.api"; // Adjust import path if needed
import type { VerifyPaymentRequest, VerifyPaymentResponse } from "@/services/payment.api";
import type { ApiResponse } from "@/services/api-client";
import { toast } from "@/hooks/use-toast";

export function useVerifyPayment(): UseMutationResult<
  ApiResponse<VerifyPaymentResponse>,
  unknown,
  VerifyPaymentRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: VerifyPaymentRequest) => paymentsApiService.verifyPayment(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", "status", variables.paymentId] });
      queryClient.invalidateQueries({ queryKey: ["payments", "history"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] }); // refresh user data, e.g., PRO status update
      toast({ title: "Payment verified successfully", variant: "success" });
    },
    onError: (error: any) => {
      console.error("Payment verification failed:", error);
      toast({ title: "Verification error", description: error?.message || "Failed to verify payment", variant: "destructive" });
    },
  });
}
