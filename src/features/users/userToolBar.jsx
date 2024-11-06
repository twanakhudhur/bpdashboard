import { Button } from "../../components/ui/button";
import { RefreshCcw, X } from "lucide-react";
import { Input } from "../../components/ui/input";

export default function UserToolBar({ table, refetch }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between my-3">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={table.getColumn("username")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
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
      </div>
      <Button size="icon" variant="outline" onClick={() => refetch()}>
        <RefreshCcw />
      </Button>
    </div>
  );
}
