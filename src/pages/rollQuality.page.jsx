import { Separator } from "@/components/ui/separator";
import AddRollQuality from "@/features/rollQaulity/addRollQuality";
import RollQualities from "@/features/rollQaulity/rollQualities";

export default function RollQualityPage() {
  return (
    <>
      <AddRollQuality />
      <Separator className="my-5 bg-subAlt" />
      <RollQualities />
    </>
  );
}
