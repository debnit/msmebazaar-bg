"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";

interface ComplianceItem {
  id: string;
  title: string;
  status: "pending" | "completed";
}

export default function ComplianceChecklist() {
  const [items, setItems] = useState<ComplianceItem[]>([]);

  useEffect(() => {
    api.compliance?.getList?.().then(res => {
      if (res?.success && res.data) setItems(res.data);
    });
  }, []);

  return (
    <div>
      <h3 className="font-semibold mb-2">Compliance Checklist</h3>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            {i.title} — {i.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
