import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWasteSchema } from "@/schemas/waste.schema.js";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCustomToast } from "@/hooks/useCustomToast";
import { selectAllCountries } from "@/services/countryApi";
import { selectAllRollTypes } from "@/services/rollType";
import { selectAllRollQualities } from "@/services/rollQuality";
import { useSelector } from "react-redux";
import { renderField } from "../../components/form/renderComponents";
import { handleFormErrors } from "@/lib/utils";
import { useAddWasteMutation } from "@/services/wasteApi";
import { getWasteFields } from "./wasteFields";

// Field mapper function
export default function AddWaste() {
  const countries = useSelector(selectAllCountries);
  const rollTypes = useSelector(selectAllRollTypes);
  const rollQualities = useSelector(selectAllRollQualities);
  const [addWaste, { isLoading }] = useAddWasteMutation();
  const { showLoadingToast, showSuccessToast, dismiss } = useCustomToast();

  const wasteFields = getWasteFields(countries, rollTypes, rollQualities);

  const form = useForm({
    resolver: zodResolver(createWasteSchema),
    defaultValues: {
      autoCode: "",
      weight: null,
      width: null,
      theoryLength: null,
      actualLength: null,
      thickness: null,
      comment: "",
      madeInId: countries.length > 0 ? countries[0].id : "",
      typeId: rollTypes.length > 0 ? rollTypes[0].id : "",
      qualityId: rollQualities.length > 0 ? rollQualities[0].id : "",
    },
  });

  const onSubmit = async (data) => {
    showLoadingToast();
    const response = await addWaste(data);

    if (!response?.error) {
      form.reset();
      showSuccessToast("Added waste successfully");
    } else {
      dismiss();
      handleFormErrors(form, response, wasteFields);
    }
  };

  const leftFields = wasteFields.filter((field) => field.column === "left");
  const rightFields = wasteFields.filter((field) => field.column === "right");

  return (
    <Card className="border-none p-6 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-semibold mb-8 text-main">
            Add a new Waste
          </h1>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {leftFields.map((field) => renderField(field, form.control))}
            </div>
            <div>
              {rightFields.map((field) => renderField(field, form.control))}
            </div>
          </div>
          <div className="flex justify-end px-10">
            <Button type="submit" className="mt-4" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Waste"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
