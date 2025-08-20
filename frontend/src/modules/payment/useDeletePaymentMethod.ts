import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApiService } from "../../services/payment.api";

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentMethodId: string) =>
      paymentsApiService.deletePaymentMethod(paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "methods"] });
    },
    onError: (error) => {
      console.error("Delete payment method failed:", error);
    },
  });
}
