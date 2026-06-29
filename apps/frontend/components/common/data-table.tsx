"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  cell: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  getRowKey: (row: T) => string;
};

export function DataTable<T>({
  columns,
  data,
  sortBy,
  sortDir,
  onSort,
  page = 1,
  totalPages = 1,
  onPageChange,
  onRowClick,
  getRowKey,
}: DataTableProps<T>) {
  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortBy !== columnKey) return <ArrowUpDown size={14} className="opacity-40" />;
    return sortDir === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {col.header}
                      <SortIcon columnKey={col.key} />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={getRowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
