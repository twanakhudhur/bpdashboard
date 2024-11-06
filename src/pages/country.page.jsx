import { Separator } from "@/components/ui/separator";
import AddCountry from "@/features/country/addCountry";
import Countries from "@/features/country/countries";

export default function CountryPage() {
  return (
    <>
      <AddCountry />
      <Separator className="my-5 bg-subAlt" />
      <Countries />
    </>
  );
}
