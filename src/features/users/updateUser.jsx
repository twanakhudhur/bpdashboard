import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useUpdateUserMutation } from "@/services/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserFields } from "./userFields";
import { updateUserSchema } from "@/schemas/user.schema";
import { useCustomToast } from "@/hooks/useCustomToast";
import { renderField } from "@/components/form/renderComponents";

export default function UpdateUser({ user, closeDialog }) {
  const { showLoadingToast, showSuccessToast, dismiss } = useCustomToast();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user.username,
      phone: user.phone,
      role: user.role,
    },
  });

  const onSubmit = async (data) => {
    showLoadingToast();
    const response = await updateUser({ id: user.id, ...data });
    if (!response?.error) {
      form.reset();
      showSuccessToast("Updated user successfully");
      closeDialog();
    } else {
      dismiss();
      if (response?.error.status === 400) {
        response.error.data?.errors.map((error) => {
          form.setError(error.path, { message: error.message });
        });
      }
      if (response?.error.status === 409) {
        updateUserFields.forEach((field) => {
          if (response.error.data.error.path.includes(field.name)) {
            form.setError(field.name, {
              message: `${field.name} already exists`,
            });
          }
        });
      }
    }
  };

  return (
    <>
      <Card className="border-none p-6 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {updateUserFields.map((field) =>
                renderField(field, form.control)
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="mt-4" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update User"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
}
