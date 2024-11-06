import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import CustomDropdownTrigger from "./ui/customDropDownTriger";

const themes = [
  {
    value: "light",
    colors: ["#444444", "#b2b2b2", "#444444"],
  },
  {
    value: "dark",
    colors: ["#eee", "#444", "#eee"],
  },
  {
    value: "shadow",
    colors: [" #eee", "#444", "#eee"],
  },
  {
    value: "iceberg_light",
    colors: ["#2d539e", "#adb1c4", "#33374c"],
  },
  {
    value: "aurora",
    colors: ["#00e980", "#245c69", "#fff"],
  },
  {
    value: "striker",
    colors: ["#d7dcda", "#0f2d4e", "#d6dbd9"],
  },
  {
    value: "miami",
    colors: [" #e4609b", "#47bac0", " #fff"],
  },
  {
    value: "note",
    colors: ["#f2c17b", "#768f95", "#d2dff4"],
  },
];

const ThemeSwitcher = () => {
  const { setTheme } = useContext(ThemeContext);

  const switchTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <CustomDropdownTrigger className="flex flex-col gap-1  w-fit px-1">
          <div className="bg-main size-2 rounded-full"></div>
          <div className="bg-sub size-2 rounded-full"></div>
          <div className="bg-text size-2 rounded-full"></div>
        </CustomDropdownTrigger>
        <DropdownMenuContent className="mx-4 p-0  min-w-fit">
          {themes.map((theme) => (
            <DropdownMenuItem
              className="py-1 my-2 "
              key={theme.value}
              onSelect={() => switchTheme(theme.value)}
            >
              {theme.colors.map((color, index) => (
                <div
                  key={index}
                  className="size-3 rounded-full border border-subAlt"
                  style={{
                    backgroundColor: `${color}`,
                  }}
                ></div>
              ))}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeSwitcher;
