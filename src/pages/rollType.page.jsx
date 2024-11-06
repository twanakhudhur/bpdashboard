import { Separator } from "@/components/ui/separator";
import AddRollType from "@/features/rollType/addRollType";
import RollTypes from "@/features/rollType/rollTypes";

export default function RollTypePage() {
  return (
    <>
      <AddRollType />
      <Separator className="my-5 bg-subAlt" />
      <RollTypes />
    </>
  );
}
