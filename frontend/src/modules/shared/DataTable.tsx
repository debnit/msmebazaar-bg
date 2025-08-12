'use client';
import { useState } from 'react';

interface DataTableProps<T> {
  data: T[];
  renderRow: (item: T) => JSX.Element;
  keyField: keyof T;
}

export default function DataTable<T>({ data, renderRow, keyField }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortAsc ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortAsc ? 1 : -1;
        return 0;
      })
    : data;

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <table className='min-w-full border-collapse border'>
      <thead>
        <tr>{/* header cells should be implemented by caller for flexibility */}</tr>
      </thead>
      <tbody>{sortedData.map(item => renderRow(item))}</tbody>
    </table>
  );
}
