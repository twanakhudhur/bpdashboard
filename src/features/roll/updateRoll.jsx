import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRollSchema } from "@/schemas/roll.schema.js";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useUpdateRollMutation } from "@/services/rollApi";
import { selectAllCountries } from "@/services/countryApi";
import { selectAllRollTypes } from "@/services/rollType";
import { selectAllRollQualities } from "@/services/rollQuality";
import { useSelector } from "react-redux";
import { getRollFields } from "./rollFields";
import { renderField } from "../../components/form/renderComponents";
import { handleFormErrors } from "@/lib/utils";

export default function UpdateRoll({ roll, closeDialog }) {
  const countries = useSelector(selectAllCountries);
  const rollTypes = useSelector(selectAllRollTypes);
  const rollQualities = useSelector(selectAllRollQualities);
  const { showLoadingToast, showSuccessToast, dismiss } = useCustomToast();
  const [updateRoll, { isLoading }] = useUpdateRollMutation();

  const rollFields = getRollFields(countries, rollTypes, rollQualities);
  const form = useForm({
    resolver: zodResolver(createRollSchema),
    defaultValues: {
      rollCode: roll.rollCode,
      netWeight: Number(roll.netWeight),
      grossWeight: Number(roll.grossWeight),
      width: Number(roll.width),
      theoryLength: Number(roll.theoryLength) || null,
      actualLength: Number(roll.actualLength) || null,
      thickness: Number(roll.thickness),
      img: roll.img,
      comment: roll.comment,
      madeInId: roll.madeInId || "",
      typeId: roll.typeId || "",
      qualityId: roll.qualityId || "",
    },
  });

  const onSubmit = async (data) => {
    showLoadingToast();
    const response = await updateRoll({ id: roll.id, ...data });

    if (!response?.error) {
      form.reset();
      showSuccessToast("Updated roll successfully");
      closeDialog();
    } else {
      dismiss();
      handleFormErrors(form, response, rollFields);
    }
  };

  const leftFields = rollFields.filter((field) => field.column === "left");
  const rightFields = rollFields.filter((field) => field.column === "right");

  return (
    <Card className="border-none p-6 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-semibold mb-8 text-main">
            Add a new Roll
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
              {isLoading ? "updating..." : "Update Roll"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
