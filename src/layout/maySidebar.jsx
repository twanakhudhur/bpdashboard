import {
  Puzzle,
  Shell,
  Slice,
  LayoutDashboard,
  Trash2,
  LifeBuoy,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLogoutMutation } from "@/services/authApi";
// import { useSelector } from "react-redux";

export function AppSidebar() {
  // const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();

  const items = [
    {
      title: t("general.dashboard"),
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: t("general.rolls"),
      url: "/rolls",
      icon: Shell,
    },
    {
      title: t("general.slits"),
      url: "/slits",
      icon: Slice,
    },
    {
      title: t("general.pieces"),
      url: "/pieces",
      icon: Puzzle,
    },
    {
      title: t("general.wastes"),
      url: "/wastes",
      icon: Trash2,
    },
    {
      title: t("general.tamburs"),
      url: "/tamburs",
      icon: LifeBuoy,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      {/* <SidebarHeader className="py-3">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="hover:bg-background  hover:!text-text group-data-[collapsible=icon]:p-1"
                size="lg"
                asChild
              >
                <div>
                  <img src="/favicon.ico" className="w-20" alt="logo" />
                  <span>
                    {user.username} / {user.role}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarHeader> */}
      <SidebarHeader>
        <SidebarGroupContent>
          <SidebarMenu className="py-4">
            <img src="/favicon.ico" className=" mx-auto w-[75%]" alt="logo" />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  location.pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={isActive} size="lg" asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton variant={"outline"} size="lg" asChild>
                <div
                  className="hover:cursor-pointer"
                  onClick={async () => {
                    try {
                      await logout();
                      navigate("/login");
                    } catch (error) {
                      console.error("Logout failed:", error);
                    }
                  }}
                >
                  <LogOut className="rotate-180" />
                  <span>{t("general.logout")}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/settings/users">
                  <Settings />
                  <span>{t("general.settings")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
