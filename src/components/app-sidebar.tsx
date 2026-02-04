"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  PieChart,
  SquareTerminal,
} from "lucide-react"
import SelangorIcon from "@/assets/icon/960px-Flag_of_Selangor.svg.png"
import KLIcon from "@/assets/icon/kl-flag.png"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Settings",
    email: "admin@lasttable.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "LastTable",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
    {
      name: "Development",
      logo: AudioWaveform,
      plan: "Team",
    },
    {
      name: "Marketing",
      logo: Command,
      plan: "Business",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "#",
      icon: PieChart,
      isActive: false,
      isOverview: true,
    },
    {
      title: "Route List",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Selangor",
          url: "#",
          icon: SelangorIcon,
          region: "selangor" as const,
        },
        {
          title: "Kuala Lumpur",
          url: "#",
          icon: KLIcon,
          region: "kl" as const,
        },
      ],
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onNavigate?: (view: "overview" | "list" | "detail", region?: "selangor" | "kl") => void
}

export function AppSidebar({ onNavigate, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onNavigate={onNavigate} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
