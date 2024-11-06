import { rowNumberColumn } from "@/components/table/columns/commonColumns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import CustomAlertDialog from "@/components/ui/customAletDialog";
import CustomUpdateDialog from "@/components/ui/customUpdateDialog";
import UpdateUser from "./updateUser";
import { selectAllUsers, useDeleteUserMutation } from "@/services/userApi";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useSelector } from "react-redux";

const ActionsCell = ({ user }) => {
  const { showLoadingToast, showSuccessToast, showErrorToast } =
    useCustomToast();
  const [deleteUser] = useDeleteUserMutation();

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <div className="px-2 py-0 text-text hover:bg-main font-medium hover:text-background text-sm">
            <CustomUpdateDialog trigger="Edit" title="Edit User">
              <UpdateUser user={user} />
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
                const response = await deleteUser(user.id);
                if (response.error) {
                  showErrorToast(response.error.data.message);
                } else {
                  showSuccessToast("User deleted successfully");
                }
              }}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const UserColumns = () => {
  const users = useSelector(selectAllUsers);

  return [
    rowNumberColumn({ page: 1, pageSize: users?.length }),
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "isFrozen",
      header: "Status",
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell user={row.original} />,
    },
  ];
};
