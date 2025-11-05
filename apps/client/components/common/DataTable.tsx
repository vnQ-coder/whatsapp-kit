"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "./Button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { TableLoader } from "./TableLoader";

export interface Column<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onSelect?: (selected: T[]) => void;
  keyExtractor: (row: T) => string | number;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onEdit,
  onDelete,
  onSelect,
  keyExtractor,
  isLoading = false,
}: DataTableProps<T>) {
  const [selected, setSelected] = React.useState<Set<string | number>>(
    new Set()
  );

  const toggleSelect = (key: string | number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelected(newSelected);
    if (onSelect) {
      onSelect(
        data.filter((row) => newSelected.has(keyExtractor(row)))
      );
    }
  };

  const toggleSelectAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set());
      onSelect?.([]);
    } else {
      const allKeys = new Set(data.map(keyExtractor));
      setSelected(allKeys);
      onSelect?.(data);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {(onEdit || onDelete || onSelect) && (
                <TableHead className="w-12"></TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={String(column.accessorKey)}>
                  {column.header}
                </TableHead>
              ))}
              {(onEdit || onDelete) && (
                <TableHead className="w-12"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={
                  columns.length +
                  (onEdit || onDelete || onSelect ? 2 : 0)
                }
                className="h-24"
              >
                <TableLoader />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {(onEdit || onDelete || onSelect) && (
              <TableHead className="w-12">
                {onSelect && (
                  <Checkbox
                    checked={
                      data.length > 0 && selected.size === data.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                )}
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead key={String(column.accessorKey)}>
                {column.header}
              </TableHead>
            ))}
            {(onEdit || onDelete) && (
              <TableHead className="w-12"></TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  columns.length +
                  (onEdit || onDelete || onSelect ? 2 : 0)
                }
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const key = keyExtractor(row);
              return (
                <TableRow key={key}>
                  {(onEdit || onDelete || onSelect) && (
                    <TableCell>
                      {onSelect && (
                        <Checkbox
                          checked={selected.has(key)}
                          onCheckedChange={() => toggleSelect(key)}
                        />
                      )}
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={String(column.accessorKey)}>
                      {column.cell
                        ? column.cell(row)
                        : String(row[column.accessorKey] ?? "")}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(row)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(row)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

