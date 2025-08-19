import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { paymentsApiService } from "../../services/payment.api"; // Adjust path if needed
import type { CreatePaymentRequest, CreatePaymentResponse } from "../../services/payment.api";
import type { ApiResponse } from "../../services/api-client";

export function useCreatePayment(): UseMutationResult<
  ApiResponse<CreatePaymentResponse>,
  unknown,
  CreatePaymentRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePaymentRequest) =>
      paymentsApiService.createPayment(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "history"] });
    },
    onError: (error) => {
      console.error("Create payment failed:", error);
    },
  });
}
