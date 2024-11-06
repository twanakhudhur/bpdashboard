import FormFields from "@/components/form/formFields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCustomToast } from "@/hooks/useCustomToast";
import { rollQualityCreateSchema } from "@/schemas/general.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useAddRollQualityMutation } from "@/services/rollQuality";

const addRollQualityFields = [
  {
    type: "text",
    label: "Roll Quality",
    name: "quality",
    placeholder: "Roll Quality",
  },
];

export default function AddRollQuality() {
  const { showLoadingToast, showSuccessToast, dismiss } = useCustomToast();
  const [addQuality, { isLoading }] = useAddRollQualityMutation();

  const form = useForm({
    resolver: zodResolver(rollQualityCreateSchema),
    defaultValues: {
      quality: "",
    },
  });

  const onSubmit = async (data) => {
    showLoadingToast();
    const response = await addQuality(data);
    if (!response?.error) {
      form.reset();
      showSuccessToast("Added roll quality successfully");
    } else {
      dismiss();
      if (response?.error.status === 400) {
        response.error.data?.errors.map((error) => {
          form.setError(error.path, { message: error.message });
        });
      }
      if (response?.error.status === 409) {
        addRollQualityFields.forEach((field) => {
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
          Add a new roll quality
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-6 items-end">
              <FormFields
                fields={addRollQualityFields}
                control={form.control}
              />
              <div>
                <Button type="submit" className="" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add roll quality"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
}
