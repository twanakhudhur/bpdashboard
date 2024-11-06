import { setWastePageIndex } from "@/app/slices/wasteSlice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AddWaste from "@/features/waste/addWaste";
import { useDeleteWasteMutation, useGetWastesQuery } from "@/services/wasteApi";
import { useDispatch, useSelector } from "react-redux";

export default function WastePage() {
  const dispatch = useDispatch();
  const { pageSize, pageIndex } = useSelector((state) => state.waste);
  const { data, isLoading, isError, error } = useGetWastesQuery({
    page: pageIndex,
    pageSize,
  });

  const [deleteWaste] = useDeleteWasteMutation();

  // Pass pagination to selectAllWastes

  console.log(data);

  if (isLoading) return <Skeleton />;
  if (isError) return <div>{error}</div>;

  // console.log(pageIndex);

  return (
    <>
      <AddWaste />
      {data.wastes.map((waste) => (
        <div key={waste.id}>
          <p>{waste.autoCode}</p>
          <p>{waste.grossWeight}</p>
          <Button onClick={() => deleteWaste(waste.id)}>Delete</Button>
        </div>
      ))}

      <Button
        disabled={pageIndex <= 1}
        onClick={() => dispatch(setWastePageIndex(pageIndex - 1))}
      >
        Prev
      </Button>
      <Button onClick={() => dispatch(setWastePageIndex(pageIndex + 1))}>
        Next
      </Button>
    </>
  );
}
