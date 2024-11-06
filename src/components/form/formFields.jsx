import { TextField } from "@/components/form/textField";
import { SelectField } from "@/components/form/selectField";

export default function FormFields({ fields, control }) {
  return (
    <>
      {fields.map((field) => {
        const { type, label, name, ...props } = field;
        if (type === "text") {
          return (
            <TextField
              key={name}
              label={label}
              name={name}
              control={control}
              {...props}
            />
          );
        } else if (type === "select") {
          return (
            <SelectField
              key={name}
              label={label}
              name={name}
              control={control}
              {...props}
            />
          );
        }
        return null;
      })}
    </>
  );
}
