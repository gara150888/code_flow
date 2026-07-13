"use client";

import {
  NavMain,
  NavUser,
  TeamSwitcher,
} from "@/components/sidebar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  TerminalSquareIcon,
  PlugZap,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  UserIcon,
} from "lucide-react";

const data = {
  navMain: [
    {
      title: "Playground",
      url: "/dashboard",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Integrations",
      url: "/integrations",
      icon: <PlugZap />,
      items: [
        { title: "Instagram", url: "/integrations/instagram" },
        { title: "Slack", url: "/integrations/slack" },
        { title: "GitHub", url: "/integrations/github" },
      ],
    },
    {
      title: "Profile",
      url: "/profile",
      icon: <UserIcon />,
      items: [
        { title: "Overview", url: "/profile" },
        { title: "Edit Profile", url: "/profile/edit" }, 
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        { title: "General", url: "#" },
        { title: "Account", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: <FrameIcon /> },
    { name: "Sales & Marketing", url: "#", icon: <PieChartIcon /> },
    { name: "Travel", url: "#", icon: <MapIcon /> },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
