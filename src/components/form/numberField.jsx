import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function NumberField({ label, name, control, min, max, placeholder }) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="number"
              placeholder={placeholder}
              min={min}
              max={max}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value ? parseFloat(value) : "");
              }}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
