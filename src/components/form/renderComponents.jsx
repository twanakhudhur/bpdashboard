import { TextField } from "@/components/form/textField";
import { NumberField } from "@/components/form/numberField";
import { SelectField } from "@/components/form/selectField";
import { TextAreaField } from "@/components/form/textAreaField";

export const renderField = (field, control) => {
  const { type, label, name, ...props } = field;

  switch (type) {
    case "text":
      return (
        <TextField
          key={name}
          label={label}
          name={name}
          control={control}
          {...props}
        />
      );
    case "number":
      return (
        <NumberField
          key={name}
          label={label}
          name={name}
          control={control}
          {...props}
        />
      );
    case "select":
      return (
        <SelectField
          key={name}
          label={label}
          name={name}
          control={control}
          {...props}
        />
      );
    case "textarea":
      return (
        <TextAreaField
          key={name}
          label={label}
          name={name}
          control={control}
          {...props}
        />
      );
    default:
      return null;
  }
};
