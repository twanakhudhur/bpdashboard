import FormFields from "@/components/form/formFields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { lineCreateSchema } from "@/schemas/general.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useAddLineMutation } from "@/services/line";

const addLineFields = [
  {
    type: "text",
    label: "Line",
    name: "line",
    placeholder: "Line",
  },
];

export default function AddLine() {
  const { showLoadingToast, showSuccessToast, dismiss } = useCustomToast();
  const [addLine, { isLoading }] = useAddLineMutation();

  const form = useForm({
    resolver: zodResolver(lineCreateSchema),
    defaultValues: {
      line: "",
    },
  });

  const onSubmit = async (data) => {
    showLoadingToast();
    const response = await addLine(data);
    if (!response?.error) {
      form.reset();
      showSuccessToast("Added line successfully");
    } else {
      dismiss();
      if (response?.error.status === 400) {
        response.error.data?.errors.map((error) => {
          form.setError(error.path, { message: error.message });
        });
      }
      if (response?.error.status === 409) {
        addLineFields.forEach((field) => {
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
          Add a new line
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-6 items-end">
              <FormFields fields={addLineFields} control={form.control} />
              <div>
                <Button type="submit" className="" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add line"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
}
