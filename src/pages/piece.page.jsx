import { Separator } from "@/components/ui/separator";
import AddPiece from "@/features/piece/addPiece";
import { PieceTable } from "@/features/piece/pieceTable";

export default function PiecePage() {
  return (
    <>
      <AddPiece />
      <Separator className="my-5 bg-subAlt" />
      <PieceTable />
    </>
  );
}
