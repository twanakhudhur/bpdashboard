import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function CustomMonthYearSelector({ month, year, onMonthChange, onYearChange }) {
  const years = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() - i
  ); // Current year to 30 years ago
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // Months from 1 to 12

  return (
    <div className="flex items-center justify-between gap-1 flex-1">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="!text-xs p-2 h-fit w-28 ">
            {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
              new Date(0, month)
            )}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-80 overflow-y-auto">
          {months.map((m) => (
            <DropdownMenuItem key={m} onClick={() => onMonthChange(m)}>
              {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
                new Date(0, m - 1)
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Year Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="!text-xs  p-2 h-fit">
            {year} <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-80 overflow-y-auto">
          {years.map((y) => (
            <DropdownMenuItem key={y} onClick={() => onYearChange(y)}>
              {y}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth()
  ); // 0-indexed month
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear()
  );

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prevYear) => prevYear + 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth + 1);
    }
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prevYear) => prevYear - 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth - 1);
    }
  };

  return (
    <DayPicker
      month={new Date(selectedYear, selectedMonth)} // Month is 0-indexed
      selected={props.selected} // Use the selected date from props
      onSelect={(date) => {
        console.log("Selected date:", date); // Debugging log
        props.onSelect(date); // Pass the selected date to the onSelect function from props
      }}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between items-center pt-1 relative",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-neutral-500 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-subAlt [&:has([aria-selected])]:bg-subAlt first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:!bg-main hover:!text-text cursor-pointer" // Add `cursor-pointer` here
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-main text-background hover:bg-main hover:text-background focus:bg-main focus:text-text",
        day_today: "border border-sub text-text",
        day_outside:
          "day-outside text-neutral-500 aria-selected:bg-sub aria-selected:text-text hover:!bg-sub",
        day_disabled: "text-neutral-500 opacity-50",
        day_range_middle: "aria-selected:bg-main aria-selected:text-main",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: () => (
          <div className="flex items-center justify-between ">
            <div className="flex items-center justify-center gap-3 flex-1">
              <Button
                variant={"ghost"}
                size="icon"
                className="h-fit w-fit"
                onClick={handlePreviousMonth}
              >
                <ChevronLeft />
              </Button>
              <CustomMonthYearSelector
                month={selectedMonth}
                year={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />
              <Button
                variant={"ghost"}
                size="icon"
                className="h-fit w-fit"
                onClick={handleNextMonth}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
