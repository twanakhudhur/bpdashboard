import { AppSidebar } from "@/layout/maySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "./header";
import { Outlet } from "react-router-dom";
import Loading from "@/components/loading";
import { useGetCountriesQuery } from "@/services/countryApi";
import { useGetRollTypesQuery } from "@/services/rollType";
import { useGetRollQualitiesQuery } from "@/services/rollQuality";

export default function RootLayout() {
  const { isLoading: isCountriesLoading } = useGetCountriesQuery();
  const { isLoading: isTypesLoading } = useGetRollTypesQuery();
  const { isLoading: isQualitiesLoading } = useGetRollQualitiesQuery();

  const isLoading = isCountriesLoading || isTypesLoading || isQualitiesLoading;
  return (
    <SidebarProvider className="bg-background">
      <AppSidebar />
      <main className="flex flex-col w-full">
        <Header />
        <div className="p-4 pb-16 text-text border-t rounded-t-lg border-subAlt flex-1">
          {isLoading ? <Loading /> : <Outlet />}
        </div>
      </main>
    </SidebarProvider>
  );
}
