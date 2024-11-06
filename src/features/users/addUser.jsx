import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useAddUserMutation } from "@/services/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addUserFields } from "./userFields";
import { createUserSchema } from "@/schemas/user.schema";
import { useCustomToast } from "@/hooks/useCustomToast";
import { renderField } from "@/components/form/renderComponents";

export default function AddUser() {
  const { showLoadingToast, showSuccessToast, dismiss } = useCustomToast();
  const [addUser, { isLoading }] = useAddUserMutation();
  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      phone: "",
      role: "user",
    },
  });

  const onSubmit = async (data) => {
    showLoadingToast();
    const response = await addUser(data);
    if (!response?.error) {
      form.reset();
      showSuccessToast("Added user successfully");
    } else {
      dismiss();
      if (response?.error.status === 400) {
        response.error.data?.errors.map((error) => {
          form.setError(error.path, { message: error.message });
        });
      }
      if (response?.error.status === 409) {
        addUserFields.forEach((field) => {
          if (response.error.data.path.includes(field.name)) {
            form.setError(field.name, {
              message: `${field.label} already exists`,
            });
          }
        });
      }
    }
  };

  return (
    <Card className="border-none p-6 ">
      <h1 className="text-2xl font-semibold mb-2 text-main">Add a new User</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-2 gap-6">
            {addUserFields.map((field) => renderField(field, form.control))}
            {/* <FormFields fields={addUserFields} control={form.control} /> */}
          </div>
          <div className="w-full flex justify-end">
            <Button type="submit" className="mt-4 " disabled={isLoading}>
              {isLoading ? "Adding..." : "Add User"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
