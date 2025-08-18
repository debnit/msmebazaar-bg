import { useMutation } from "@tanstack/react-query"
import { paymentsApiService } from "../payment.api"

export function useCreatePayment() {
  return useMutation({
    mutationFn: paymentsApiService.createPayment.bind(paymentsApiService),
    onError: (err) => console.error("Payment creation failed:", err),
  })
}
