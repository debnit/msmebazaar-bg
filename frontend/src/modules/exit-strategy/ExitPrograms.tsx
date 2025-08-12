"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";

interface ExitProgram {
  id: string;
  name: string;
  description: string;
}

export default function ExitPrograms() {
  const [programs, setPrograms] = useState<ExitProgram[]>([]);

  useEffect(() => {
    api.exitStrategy?.getPrograms?.().then(res => {
      if (res?.success && res.data) setPrograms(res.data);
    });
  }, []);

  if (!programs.length) return <p>No exit strategy programs available.</p>;

  return (
    <ul>
      {programs.map(p => (
        <li key={p.id} className="mb-2">
          <h4 className="font-semibold">{p.name}</h4>
          <p>{p.description}</p>
        </li>
      ))}
    </ul>
  );
}
