"use client";
import { useState } from "react";
import type { LoanApplicationForm, LoanType, LoanPurpose } from "@/types/loan";
import { useApiClient } from "@/hooks/useApiClient";
import { useRouter } from "next/navigation";

const defaultForm: LoanApplicationForm = {
  loanType: LoanType.WORKING_CAPITAL,
  amount: 0,
  purpose: LoanPurpose.WORKING_CAPITAL,
  tenure: 12,
  businessDetails: {},
  applicantDetails: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: new Date(),
    panNumber: "",
    aadharNumber: "",
    address: { street: "", city: "", state: "", pincode: "", country: "" },
    maritalStatus: "",
    qualification: "",
    experience: 0,
  },
  financialDetails: {},
};

export default function LoanFirstApplyPage() {
  const [formData, setFormData] = useState<LoanApplicationForm>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loans } = useApiClient();
  const router = useRouter();

  const handleChange = (field: keyof LoanApplicationForm, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    
    const result = await loans.apply(formData, {
      showSuccessToast: true,
      successMessage: 'Loan application submitted successfully!',
      onSuccess: (data) => {
        router.push(`/loan-only/status?applicationId=${data?.id}`);
      }
    });
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); submitApplication(); }} className="space-y-4">
      <h1>Loan First - Apply Now</h1>
      {/* Example field */}
      <select
        value={formData.loanType}
        onChange={(e) => handleChange("loanType", e.target.value as LoanType)}
      >
        {Object.values(LoanType).map((type) => (
          <option key={type} value={type}>{type.replace(/_/g, " ")}</option>
        ))}
      </select>
      {/* More fields here */}
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
