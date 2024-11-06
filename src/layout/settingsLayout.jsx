import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
const getDocumentDirection = () => {
  return document.dir || "ltr";
};
export default function SettingsLayout() {
  const location = useLocation();
  const tabValue = location.pathname.split("/").pop();
  const direction = getDocumentDirection();

  return (
    <>
      <Tabs dir={direction} value={tabValue} className=" grid gap-6 ">
        <TabsList>
          <Link to="users">
            <TabsTrigger value="users">Users</TabsTrigger>
          </Link>
          <Separator orientation="vertical" className="h-[50%]" />
          <Link to="countries">
            <TabsTrigger value="countries">Countries</TabsTrigger>
          </Link>
          <Separator orientation="vertical" className="h-[50%]" />
          <Link to="rollQualities">
            <TabsTrigger value="rollQualities">Roll Qualities</TabsTrigger>
          </Link>
          <Separator orientation="vertical" className="h-[50%]" />
          <Link to="rollTypes">
            <TabsTrigger value="rollTypes">Roll Types</TabsTrigger>
          </Link>
          <Separator orientation="vertical" className="h-[50%]" />
          <Link to="lines">
            <TabsTrigger value="lines">Lines</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      <Outlet />
    </>
  );
}
