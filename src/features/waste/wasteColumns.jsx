import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomToast } from "@/hooks/useCustomToast";
import CustomUpdateDialog from "@/components/ui/customUpdateDialog";
import CustomAlertDialog from "@/components/ui/customAletDialog";
import { useDeleteWasteMutation } from "@/services/wasteApi";
import { useSelector } from "react-redux";
import {
  rowNumberColumn,
  selectColumn,
} from "@/components/table/columns/commonColumns";

const ActionsCell = ({ waste }) => {
  const { pageSize, pageIndex: page } = useSelector((state) => state.waste);
  const { showLoadingToast, showSuccessToast, showErrorToast } =
    useCustomToast();
  const [deleteWaste] = useDeleteWasteMutation();

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
              {/* <UpdateRoll roll={roll} /> */}
              Editing
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
                const response = await deleteWaste(waste.id, page, pageSize);
                if (response.error) {
                  showErrorToast(response.error.data.message);
                } else {
                  showSuccessToast("Waste deleted successfully");
                }
              }}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const WasteColumns = () => {
  return [
    rowNumberColumn(),
    selectColumn,
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "autoCode",
      header: "Code",
    },
    {
      accessorKey: "thickness",
      header: "Thickness",
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell waste={row.original} />,
    },
  ];
};