"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";

interface Training {
  id: string;
  title: string;
  instructor: string;
}

export default function TrainingCatalog() {
  const [list, setList] = useState<Training[]>([]);

  useEffect(() => {
    api.training?.getCatalog?.().then(res => {
      if (res?.success && res.data) setList(res.data);
    });
  }, []);

  return (
    <ul>
      {list.map(t => (
        <li key={t.id}>
          {t.title} — {t.instructor}
        </li>
      ))}
    </ul>
  );
}
