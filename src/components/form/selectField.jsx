import { Controller } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export const SelectField = ({ label, name, control, options }) => (
  <FormField
    name={name}
    control={control}
    render={() => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${label}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
