import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  rowNumberColumn,
  selectColumn,
} from "@/components/table/columns/commonColumns";
import { useCustomToast } from "@/hooks/useCustomToast";
import CustomUpdateDialog from "@/components/ui/customUpdateDialog";
import CustomAlertDialog from "@/components/ui/customAletDialog";
import { useDeleteRollMutation } from "@/services/rollApi";
import UpdateRoll from "./updateRoll";
import { formatDate } from "@/components/table/tableHelpers";
import { ArrowUpDown } from "lucide-react";

const ActionsCell = ({ roll }) => {
  const { showLoadingToast, showSuccessToast, showErrorToast } =
    useCustomToast();
  const [deleteRoll] = useDeleteRollMutation();

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            onClick={(e) => e.stopPropagation()}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <div className="px-2 py-0 text-text hover:bg-main font-medium hover:text-background text-sm">
            <CustomUpdateDialog trigger="Edit" title="Edit User">
              <UpdateRoll roll={roll} />
            </CustomUpdateDialog>
          </div>
          <DropdownMenuSeparator />
          <div className="px-2 py-0 text-error hover:bg-error font-medium hover:text-text text-sm">
            <CustomAlertDialog
              trigger="Delete"
              title="Are you absolutely sure?"
              description="This action is irreversible."
              actionButton="Delete"
              triggerClassName="w-full h-full text-start py-1.5"
              onAction={async () => {
                showLoadingToast();
                const response = await deleteRoll(roll.id);
                if (response.error) {
                  showErrorToast(response.error.data.message);
                } else {
                  showSuccessToast("Roll deleted successfully");
                }
              }}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const RollColumns = () => {
  return [
    rowNumberColumn(),
    selectColumn,
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "rollCode",
      header: "Code",
    },
    {
      accessorKey: "thickness",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Thickness
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "width",
      header: "Width",
    },
    {
      accessorKey: "netWeight",
      header: "Net Weight",
    },
    {
      accessorKey: "grossWeight",
      header: "Gross Weight",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CreatedAt
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell roll={row.original} />,
    },
  ];
};
