import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetchSlitsQuery } from "@/services/sliApi";
import { useDispatch, useSelector } from "react-redux";

export default function SlitPage() {
  const dispatch = useDispatch();
  const { searchValue, page, pageSize, date } = useSelector(
    (state) => state.slit
  );
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { data, isError, error, isLoading, isFetching, refetch } =
    useFetchSlitsQuery({
      page,
      pageSize,
      searchValue: debouncedSearchValue,
      date,
    });

  console.log(data);

  return (
    <>
      <Separator className="my-5 bg-subAlt" />
    </>
  );
}
