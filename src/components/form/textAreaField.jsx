import { Controller } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export const TextAreaField = ({
  label,
  name,
  control,
  placeholder,
  rows = 5,
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea {...field} placeholder={placeholder} rows={rows} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
