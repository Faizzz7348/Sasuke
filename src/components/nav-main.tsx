import { ChevronRight, type LucideIcon, Search } from "lucide-react"
import { useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"

export function NavMain({
  items,
  onNavigate,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon | string
    isActive?: boolean
    region?: "selangor" | "kl"
    isOverview?: boolean
    items?: {
      title: string
      url: string
      icon?: string
      region?: "selangor" | "kl"
    }[]
  }[]
  onNavigate?: (view: "overview" | "list" | "detail", region?: "selangor" | "kl") => void
}) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <SidebarGroup>
      <div className="px-2 pb-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>
      <SidebarGroupLabel>Vending Machine</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Handle Overview menu (standalone menu without collapse)
          if (item.isOverview) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title}
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate("overview")
                    }
                  }}
                >
                  {item.icon && (
                    typeof item.icon === 'string' ? (
                      <img 
                        src={item.icon} 
                        alt="" 
                        className="h-5 w-8 object-contain rounded-sm" 
                        style={{ imageRendering: 'crisp-edges' }}
                      />
                    ) : (
                      <item.icon />
                    )
                  )}
                  <span className="font-semibold text-xs">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // If item has region, it's a simple menu item (not collapsible)
          if (item.region) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title}
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate("list", item.region)
                    }
                  }}
                >
                  {item.icon && (
                    typeof item.icon === 'string' ? (
                      <img 
                        src={item.icon} 
                        alt="" 
                        className="h-5 w-8 object-contain rounded-sm" 
                        style={{ imageRendering: 'crisp-edges' }}
                      />
                    ) : (
                      <item.icon />
                    )
                  )}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
          
          // Otherwise, it's a collapsible menu item
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && (
                      typeof item.icon === 'string' ? (
                        <img 
                          src={item.icon} 
                          alt="" 
                          className="h-5 w-8 object-contain rounded-sm" 
                          style={{ imageRendering: 'crisp-edges' }}
                        />
                      ) : (
                        <item.icon />
                      )
                    )}
                    <span className="font-semibold text-sm">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a 
                            href={subItem.url}
                            onClick={(e) => {
                              e.preventDefault()
                              if (subItem.region && onNavigate) {
                                onNavigate("list", subItem.region)
                              }
                            }}
                          >
                            {subItem.icon && (
                              <img 
                                src={subItem.icon} 
                                alt="" 
                                className="h-4 w-6 object-contain rounded-sm mr-2" 
                                style={{ imageRendering: 'crisp-edges' }}
                              />
                            )}
                            <span className="font-semibold text-xs">{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
