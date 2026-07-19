import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyText?: string;
}

export default function DataTable<T extends { id: string }>({ columns, data, onRowClick, emptyText = 'No items found.' }: DataTableProps<T>) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 bg-slate-950/30">
              {columns.map((col, i) => (
                <th key={i} className={`py-4 px-6 font-semibold uppercase tracking-wider text-xs ${col.className || ''}`}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} className="py-12 px-6 text-center text-slate-500 font-medium">{emptyText}</td></tr>
            ) : data.map((item) => (
              <tr key={item.id} onClick={() => onRowClick?.(item)} className={`border-b border-slate-800/40 hover:bg-slate-950/20 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}>
                {columns.map((col, i) => {
                  const content = typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode);
                  return <td key={i} className={`py-4 px-6 text-slate-300 font-medium ${col.className || ''}`}>{content}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
