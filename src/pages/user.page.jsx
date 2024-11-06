import { Separator } from "@/components/ui/separator";
import AddUser from "@/features/users/addUser";
import { UserTable } from "@/features/users/userTable";

export default function UserPage() {
  return (
    <div>
      <AddUser />
      <Separator className="my-5 bg-subAlt" />
      <UserTable />
    </div>
  );
}
