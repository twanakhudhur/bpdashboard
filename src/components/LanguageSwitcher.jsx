import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import CustomDropdownTrigger from "./ui/customDropDownTriger";
import { Languages } from "lucide-react";

const languages = [
  {
    code: "en",
    name: "English",
  },
  {
    code: "ar",
    name: "العربية",
  },
  {
    code: "ku",
    name: "کوردی",
  },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <CustomDropdownTrigger className="flex flex-col gap-1 w-fit p-1.5">
          <Languages size={20} />
        </CustomDropdownTrigger>
        <DropdownMenuContent className=" min-w-28">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              className={`py-1 my-2  flex items-center justify-between 
                ${
                  currentLanguage === lang.code
                    ? "opacity-55 cursor-default"
                    : ""
                }`}
              onSelect={() => changeLanguage(lang.code)}
            >
              {lang.name}
              <img
                src={`/flags/${lang.code}.svg`}
                alt={lang.code}
                className="w-4 h-4"
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSwitcher;
