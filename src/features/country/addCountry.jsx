import FormFields from "@/components/form/formFields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useAddCountryMutation } from "@/services/countryApi";
import { countryCreateSchema } from "@/schemas/general.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

const addCountryFields = [
  {
    type: "text",
    label: "Country",
    name: "country",
    placeholder: "Country",
  },
];

export default function AddCountry() {
  const { showLoadingToast, showSuccessToast, dismiss } = useCustomToast();
  const [addCountry, { isLoading }] = useAddCountryMutation();

  const form = useForm({
    resolver: zodResolver(countryCreateSchema),
    defaultValues: {
      country: "",
    },
  });

  const onSubmit = async (data) => {
    showLoadingToast();
    const response = await addCountry(data);
    if (!response?.error) {
      form.reset();
      showSuccessToast("Added country successfully");
    } else {
      dismiss();
      if (response?.error.status === 400) {
        response.error.data?.errors.map((error) => {
          form.setError(error.path, { message: error.message });
        });
      }
      if (response?.error.status === 409) {
        addCountryFields.forEach((field) => {
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
          Add a new Country
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-6 items-end">
              <FormFields fields={addCountryFields} control={form.control} />
              <div>
                <Button type="submit" className="" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add country"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
}
