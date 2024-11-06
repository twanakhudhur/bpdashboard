import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useToast } from "./use-toast";

export function useCustomToast() {
  const { toast, dismiss } = useToast();

  const showLoadingToast = () =>
    toast({
      description: <LoadingSpinner />,
    });

  const showSuccessToast = (message) =>
    toast({
      description: message,
    });

  const showErrorToast = (message) =>
    toast({
      description: message,
      className: "text-error",
    });

  return { showLoadingToast, showSuccessToast, showErrorToast, dismiss };
}
