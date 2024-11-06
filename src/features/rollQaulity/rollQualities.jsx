import EmptyData from "@/components/emptyData";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/ui/customAletDialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomToast } from "@/hooks/useCustomToast";

import {
  selectAllRollQualities,
  useDeleteRollQualityMutation,
  useGetRollQualitiesQuery,
} from "@/services/rollQuality";
import { RefreshCcw, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function Qualities() {
  const { showLoadingToast, showSuccessToast, showErrorToast } =
    useCustomToast();
  const { isLoading, isError, error, refetch, isFetching } =
    useGetRollQualitiesQuery();
  const rollQualities = useSelector(selectAllRollQualities);
  const [deleteRollQuality] = useDeleteRollQualityMutation();

  return (
    <div className="p-6">
      <div className=" mb-5 flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-main">Roll Qualities</h1>
        <Button size="icon" variant="outline" onClick={() => refetch()}>
          <RefreshCcw />
        </Button>
      </div>
      {isLoading || isFetching ? (
        <>
          <ol className="space-y-3 list-decimal list-inside">
            {[1, 2, 3, 4, 5].map((item) => (
              <li
                key={item}
                className="flex justify-between items-center md:w-[50%]"
              >
                <span>
                  <Skeleton className="w-20 h-5" />
                </span>
                <span className="flex-1 px-6">
                  <Skeleton className="w-full h-2" />
                </span>
                <span>
                  <Skeleton className="w-5 h-5" />
                </span>
              </li>
            ))}
          </ol>
        </>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : rollQualities.length === 0 ? (
        <EmptyData message="No roll quality found!" />
      ) : (
        <>
          <ol className="space-y-3 list-decimal list-inside">
            {rollQualities.map((quality, index) => (
              <li
                key={quality.quality}
                className="flex justify-between items-center md:w-[50%]"
              >
                <span>
                  {index + 1}.<span className="mx-2"></span>
                  {quality.quality}
                </span>
                <span className="flex-1 px-6">
                  <Separator className="bg-sub" />
                </span>
                <CustomAlertDialog
                  trigger={<Trash2 size={16} />}
                  triggerClassName="border border-error rounded-md text-error hover:text-text hover:bg-error p-2.5"
                  title="Are you absolutely sure?"
                  description="This action is irreversible."
                  actionButton="Delete"
                  onAction={async () => {
                    showLoadingToast();
                    const response = await deleteRollQuality(quality.id);
                    if (response.error) {
                      showErrorToast(response.error.data.message);
                    } else {
                      showSuccessToast("Roll Quality deleted successfully");
                    }
                  }}
                />
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
