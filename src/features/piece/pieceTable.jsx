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
import PieceToolBar from "./pieceToolBar";
import Paginations from "@/components/table/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { setPiecePageIndex, setPiecePageSize } from "@/app/slices/pieceSlice";
import { selectAllPieces, useGetPiecesQuery } from "@/services/pieceApi";
import { PieceColumns } from "./pieceColumns";

export function PieceTable() {
  const { isLoading, isError, error } = useGetPiecesQuery();
  const pieces = useSelector(selectAllPieces);
  const columns = PieceColumns();
  const dispatch = useDispatch();
  const { pageSize, pageIndex } = useSelector((state) => state.piece);

  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const hiddenColumns = useState(["grossWeight"]);

  const table = useReactTable({
    data: pieces || [],
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
      dispatch(setPiecePageIndex(Number(pageIndex)));
    }
    if (pageSize !== table.getState().pagination.pageSize) {
      dispatch(setPiecePageSize(Number(pageSize)));
    }
  };

  return (
    <>
      <PieceToolBar table={table} />
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
