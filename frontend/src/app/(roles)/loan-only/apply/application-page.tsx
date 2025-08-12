"use client";
import { useState } from "react";
import type { LoanApplicationForm, LoanType, LoanPurpose } from "@/types/loan";

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

  const handleChange = (field: keyof LoanApplicationForm, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const submitApplication = async () => {
    // Example POST to API
    const res = await fetch("/api/loans/loan-first/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      // handle error
    }
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
      <button type="submit">Submit Application</button>
    </form>
  );
}
