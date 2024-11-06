import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Settings2, X } from "lucide-react";
import { Input } from "../../components/ui/input";

export default function RollToolBar({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const logSelectedRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedData = selectedRows.map((row) => row.original); // Extract original data for each row
    console.log("Selected Rows:", selectedData);
  };

  return (
    <div className="flex items-center justify-between my-3">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={table.getColumn("rollCode")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("rollCode")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={logSelectedRows}
          className="h-8 px-2 lg:px-3"
        >
          print
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Settings2 className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
