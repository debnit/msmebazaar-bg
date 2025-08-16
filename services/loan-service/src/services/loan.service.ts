import * as repo from "../repositories/loan.repository";
import { publishNotification } from "./notification-producer";

export async function getLoanOffer(userId: string, { loanAmount, purpose, tenureMonths }) {
  // Here you could call an ML service or do scoring
  return {
    eligibleAmount: loanAmount,
    recommendedTenure: tenureMonths,
    interestRate: 12.5 // example
    await publishNotification({
      userId: user.id,
      type: "loan-eligible",
      message: `Congratulations, your loan for ₹${eligibleAmount} is approved!`
    });
  };
  

}

export async function createApplication(userId: string, data: any) {
  return repo.createLoanApplication({ ...data, userId });
}

export async function listUserLoans(userId: string) {
  return repo.getLoanApplicationsByUser(userId);
}
