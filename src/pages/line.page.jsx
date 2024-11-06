import { Separator } from "@/components/ui/separator";
import AddLine from "@/features/line/addLine";
import Lines from "@/features/line/lines";

export default function LinePage() {
  return (
    <>
      <AddLine />
      <Separator className="my-5 bg-subAlt" />
      <Lines />
    </>
  );
}
