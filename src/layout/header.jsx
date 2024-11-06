import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/themeSwitcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Slash } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";

const routeTitleMap = {
  "": "Home",
  dashboard: "Dashboard",
  roll: "Rolls",
  slit: "Slit Operations",
  piece: "Pieces",
  waste: "Wastes",
  tambur: "Tambur",
};

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    let accumulatedPath = "";
    return pathSegments.map((segment) => {
      accumulatedPath += `/${segment}`;
      return {
        title: routeTitleMap[segment] || segment,
        href: accumulatedPath,
      };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky z-50 top-0 flex h-14 shrink-0 items-center bg-background  gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 justify-between w-full">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="ms-1 me-2 h-4" />
          <span className="text-text mx-2 text-sm">
            {user.username} / {user.role}
          </span>
          <Separator orientation="vertical" className="ms-1 me-2 h-4" />
          <Breadcrumb className="hidden md:block ">
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link as={Link} to="/">
                  Home
                </Link>
              </BreadcrumbItem>
              {breadcrumbs.map((breadcrumb) => (
                <React.Fragment key={breadcrumb.href}>
                  <BreadcrumbSeparator>
                    <Slash />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <Link as={Link} to={breadcrumb.href}>
                      {breadcrumb.title}
                    </Link>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
