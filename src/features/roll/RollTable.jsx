import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
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
import RollToolBar from "./rollToolBar";
import Paginations from "@/components/table/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { setRollPageIndex, setRollPageSize } from "@/app/slices/rollSlice";
import { selectAllRolls, useGetRollsQuery } from "@/services/rollApi";
import { RollColumns } from "./rollColumns";

export function RollTable() {
  const { isLoading, isError, error } = useGetRollsQuery();
  const rolls = useSelector(selectAllRolls);
  const columns = RollColumns();
  const dispatch = useDispatch();
  const { pageSize, pageIndex } = useSelector((state) => state.roll);

  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const hiddenColumns = useState(["grossWeight"]);

  const table = useReactTable({
    data: rolls || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    state: {
      rowSelection,
      columnFilters,
      sorting,
      pagination: { pageSize, pageIndex },
    },
    initialState: {
      pagination: { pageSize, pageIndex },
      columnVisibility: hiddenColumns.reduce((acc, col) => {
        acc[col] = false;
        return acc;
      }, {}),
    },
  });

  const handlePageChange = ({ pageIndex, pageSize }) => {
    if (pageIndex !== table.getState().pagination.pageIndex) {
      dispatch(setRollPageIndex(Number(pageIndex)));
    }
    if (pageSize !== table.getState().pagination.pageSize) {
      dispatch(setRollPageSize(Number(pageSize)));
    }
  };

  return (
    <>
      <RollToolBar table={table} />
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
          {isLoading ? (
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
      <Paginations
        table={table}
        onPageChange={handlePageChange} // Pass the page change handler
      />
    </>
  );
}