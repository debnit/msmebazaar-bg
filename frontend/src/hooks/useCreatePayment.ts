import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { paymentsApiService } from "@/services/payment.api"; // Adjust import path if needed
import type { CreatePaymentRequest, CreatePaymentResponse } from "@/services/payment.api";
import type { ApiResponse } from "@/services/api-client";
import { toast } from "@/hooks/use-toast";

export function useCreatePayment(): UseMutationResult<
  ApiResponse<CreatePaymentResponse>,
  unknown,
  CreatePaymentRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePaymentRequest) => paymentsApiService.createPayment(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "history"] });
      toast({ title: "Payment created successfully", variant: "success" });
    },
    onError: (error: any) => {
      console.error("Create payment failed:", error);
      toast({ title: "Payment error", description: error?.message || "Failed to create payment", variant: "destructive" });
    },
  });
}
