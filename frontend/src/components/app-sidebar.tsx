import * as React from "react"
import {
  AudioWaveform, Banknote,
  Command,
  GalleryVerticalEnd, Home, HousePlus, LandPlot, MessageSquare,ShoppingCart
} from "lucide-react"

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
import {useUser} from "@/auth";

// This is sample data.
const data = {
  user: {
    name: "Meet Goti",
    email: "22bce100@nirmauni.ac.in",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  buy: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true
    },
    {
      title: "Shop",
      url: "/shop",
      icon: ShoppingCart,
    },
    {
      title: "Rent",
      url: "/rent",
      icon: HousePlus,
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
    },
  ],
  sell: [
    {
      title: "Sell Items",
      url: "/sell",
      icon: Banknote,
    },
    {
      title: "List Property",
      url: "/rent/my-listings",
      icon: LandPlot,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();

  return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavMain data={data} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  )
}
