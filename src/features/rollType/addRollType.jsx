import FormFields from "@/components/form/formFields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { rollTypeCreateSchema } from "@/schemas/general.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useAddRollTypeMutation } from "@/services/rollType";

const addRollTypeFields = [
  {
    type: "text",
    label: "Roll Type",
    name: "type",
    placeholder: "Roll Type",
  },
];

export default function AddRollType() {
  const { showLoadingToast, showSuccessToast, dismiss } = useCustomToast();
  const [addType, { isLoading }] = useAddRollTypeMutation();

  const form = useForm({
    resolver: zodResolver(rollTypeCreateSchema),
    defaultValues: {
      type: "",
    },
  });

  const onSubmit = async (data) => {
    showLoadingToast();
    const response = await addType(data);
    if (!response?.error) {
      form.reset();
      showSuccessToast("Added roll type successfully");
    } else {
      dismiss();
      if (response?.error.status === 400) {
        response.error.data?.errors.map((error) => {
          form.setError(error.path, { message: error.message });
        });
      }
      if (response?.error.status === 409) {
        addRollTypeFields.forEach((field) => {
          if (response.error.data.path.includes(field.name)) {
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
        <h1 className="text-2xl font-semibold mb-2 text-main">
          Add a new roll type
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-6 items-end">
              <FormFields fields={addRollTypeFields} control={form.control} />
              <div>
                <Button type="submit" className="" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add roll type"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
}
