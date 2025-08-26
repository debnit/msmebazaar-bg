"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import OwnerLoanApplications from "@/modules/msme-owner/OwnerLoanApplications";
import OwnerBusinessTools from "@/modules/msme-owner/OwnerBusinessTools";

export default function MSMEOwnerProPage() {
  return (
    <RoleGuard allowedRoles={["msme_owner"]} proOnly>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">MSME Owner Pro Dashboard</h1>
        <OwnerLoanApplications /> {/* Shows priority loans via api.loans.getApplications(priority:true) */}
        <OwnerBusinessTools />    {/* Fetches documents/templates via api.business.getDocuments */}
      </div>
    </RoleGuard>
  );
}
