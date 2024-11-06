// components/DatePicker.js
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, DeleteIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

function DatePicker({
  selected = null,
  onSelect,
  label = "Pick a date",
  className = "",
}) {
  const handleResetDate = (e) => {
    e.stopPropagation(); // Prevents the button from triggering the popover
    onSelect(null); // Calls the onSelect function to reset the date
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "yyyy-MM-dd") : <span>{label}</span>}
          {selected && (
            <span className="ml-2 cursor-pointer" onClick={handleResetDate}>
              <DeleteIcon className="h-4 w-4" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
