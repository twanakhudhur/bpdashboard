import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function Paginations({
  table,
  onPageChange, // Add this prop
  pageSizeOptions = [10, 20, 30, 40, 50],
}) {
  return (
    <div className="flex items-center justify-end my-3 gap-3">
      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          const newSize = Number(value);
          table.setPageSize(newSize);
          // Notify the parent component
          if (onPageChange) {
            onPageChange({
              pageIndex: table.getState().pagination.pageIndex,
              pageSize: newSize,
            });
          }
        }}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {pageSizeOptions.map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => {
            table.setPageIndex(0);
            onPageChange({
              pageIndex: 0,
              pageSize: table.getState().pagination.pageSize,
            });
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => {
            table.previousPage();
            onPageChange({
              pageIndex: table.getState().pagination.pageIndex - 1,
              pageSize: table.getState().pagination.pageSize,
            });
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => {
            table.nextPage();
            onPageChange({
              pageIndex: table.getState().pagination.pageIndex + 1,
              pageSize: table.getState().pagination.pageSize,
            });
          }}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => {
            table.setPageIndex(table.getPageCount() - 1);
            onPageChange({
              pageIndex: table.getPageCount() - 1,
              pageSize: table.getState().pagination.pageSize,
            });
          }}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
