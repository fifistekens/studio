"use client";

import type { ColumnDef, Column, Table } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, CheckCircle, XCircle, Edit2, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { BureauUsageReportRecord } from "@/services/bureau-usage-report";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Helper component for column header with sorting
const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}) => {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2 group", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-50" />
        )}
      </Button>
    </div>
  );
};


// Helper component for column filter (text input)
const TextColumnFilter = ({
  column,
}: {
  column: Column<any, any>;
  table: Table<any>; // table prop is not used, but kept for consistency with SelectColumnFilter
}) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <Input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-full border shadow rounded h-8 text-xs"
    />
  );
};

// Helper component for column filter (select dropdown)
const SelectColumnFilter = ({
  column,
  options,
}: {
  column: Column<any, any>;
  table: Table<any>; // table prop is not used but often part of filter component signature
  options: string[];
}) => {
  const columnFilterValue = column.getFilterValue() as string | undefined;

  return (
    <Select
      value={columnFilterValue ?? ""}
      onValueChange={(value) => column.setFilterValue(value === "all" ? undefined : value)}
    >
      <SelectTrigger className="w-full border shadow rounded h-8 text-xs">
        <SelectValue placeholder="Filter..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};


export const columns = (uniqueUserIds: string[]): ColumnDef<BureauUsageReportRecord>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "UserId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User ID" />
    ),
    cell: ({ row }) => <div className="w-[100px] truncate">{row.getValue("UserId")}</div>,
    filterFn: 'equals',
    meta: {
      filterComponent: (props: { column: Column<any, unknown>, table: Table<any>}) => 
        <SelectColumnFilter {...props} options={uniqueUserIds} />,
    },
  },
  {
    accessorKey: "Title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row, table }) => {
      const title = row.getValue("Title") as string;
      const filterValue = table.getColumn("Title")?.getFilterValue() as string;
      if (filterValue && title) {
        const parts = title.split(new RegExp(`(${filterValue.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi"));
        return (
          <div className="min-w-[150px]">
            {parts.map((part, i) =>
              part.toLowerCase() === filterValue.toLowerCase() ? (
                <span key={i} className="bg-accent text-accent-foreground font-bold">
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </div>
        );
      }
      return <div className="min-w-[150px] truncate">{title}</div>;
    },
     meta: {
      filterComponent: TextColumnFilter,
    },
  },
  {
    accessorKey: "Category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("Category") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      if (category === "Category A") variant = "secondary";
      if (category === "Category B") variant = "outline";
      
      return <Badge variant={variant} className="capitalize min-w-[100px] text-center block">{category?.toLowerCase()}</Badge>;
    },
    filterFn: 'equals',
    meta: {
      filterComponent: (props: { column: Column<any, unknown>, table: Table<any>}) => 
        <SelectColumnFilter {...props} options={["Category A", "Category B"]} />,
    },
  },
  {
    accessorKey: "Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">
        {new Date(row.getValue("Date")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "Value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Value"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium w-[100px]">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(record.UserId)}
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert(`Viewing details for: ${record.Title}`)}>
              <FileText className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Edit2 className="mr-2 h-4 w-4" /> Edit Record
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" disabled>
             <Trash2 className="mr-2 h-4 w-4" /> Delete Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
