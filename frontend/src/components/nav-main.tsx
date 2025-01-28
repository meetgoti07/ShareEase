"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


export function NavMain({
  data,
}: {
  data : {
    buy: {
      title: string
      url: string
      icon: LucideIcon
    }[]
    sell: {
      title: string
      url: string
      icon: LucideIcon
    }[]
  }
}) {
  return (
      <div>
    <SidebarGroup>
      <SidebarGroupLabel>Buy</SidebarGroupLabel>
      <SidebarMenu>
        {data.buy.map((item,index) => (
            <a href={item.url} key={index}>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            </a>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  <SidebarGroup>
    <SidebarGroupLabel>Sell</SidebarGroupLabel>
    <SidebarMenu>
      {data.sell.map((item,index) => (
          <a href={item.url} key={index}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </a>
      ))}
    </SidebarMenu>
  </SidebarGroup>
      </div>
  )
}
