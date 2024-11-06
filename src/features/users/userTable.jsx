import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HardDrive } from "lucide-react";
import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { UserColumns } from "./userColumns";
import { selectAllUsers, useGetUsersQuery } from "@/services/userApi";
import UserToolBar from "./userToolBar";

export function UserTable() {
  const { isLoading, isError, error, refetch, isFetching } = useGetUsersQuery();
  const users = useSelector(selectAllUsers);
  const columns = UserColumns();
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      sorting,
    },
  });

  return (
    <>
      <UserToolBar table={table} refetch={refetch} />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={header.column.columnDef.style}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isError && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Error: {error}
              </TableCell>
            </TableRow>
          )}
          {isLoading || isFetching ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                {table.getAllColumns().map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton className="w-full h-10" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} style={cell.column.columnDef.style}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-52 text-center text-sub"
              >
                <HardDrive size={48} className="mx-auto" />
                <span className="font-medium mt-2">No data found!</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
