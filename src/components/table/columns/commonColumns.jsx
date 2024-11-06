import { Checkbox } from "@/components/ui/checkbox";

export const selectColumn = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
  style: { width: "1rem", textAlign: "center", padding: "0 0.5rem" },
};

export const rowNumberColumn = () => ({
  id: "rowNumber",
  header: "#",
  cell: ({ row }) => row.index + 1,
  enableSorting: false,
  enableHiding: false,
  style: { width: "1rem", textAlign: "center", padding: "0 0.5rem" },
});
