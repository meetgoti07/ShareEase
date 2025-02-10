import React from "react";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar.tsx";
import { useLocation } from "react-router-dom";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";

import logo from "@/assets/logo.svg";
import {useIsMobile} from "@/hooks/use-mobile.tsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {CircleUser, LogOut, ShoppingCart} from "lucide-react";
import {logout} from "@/lib/allAuth.tsx";
import {useUser} from "@/auth";


interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
    const location = useLocation();
    const parts = location.pathname.split('/').filter(part => part);

    const mobile = useIsMobile();
    const user = useUser();

    // Convert parts to breadcrumbs with first letter capitalized
    const breadcrumbs = parts.map(part =>
        part.charAt(0).toUpperCase() + part.slice(1)
    );

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
                    <div className="flex items-center w-full gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {mobile && <div className='flex w-full items-center justify-between'>
                            <img src={logo} width={26}/>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarFallback className="rounded-lg">{user.display[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side={mobile ? "bottom" : "right"}
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarFallback className="rounded-lg">{user.display[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">{user.display.toUpperCase()}</span>
                                                <span className="truncate text-xs">{user.email}</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <a href="/profile">
                                            <DropdownMenuItem>
                                                <CircleUser aria-hidden="true" />
                                                <span>Account</span>
                                            </DropdownMenuItem>
                                        </a>
                                        <DropdownMenuItem>
                                            <ShoppingCart aria-hidden="true" />
                                            <span>Orders</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout}>
                                        <LogOut aria-hidden="true" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>}
                        <Breadcrumb>
                        <BreadcrumbList>
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink>
                                                {crumb}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        {index < breadcrumbs.length - 1 && (
                                            <BreadcrumbSeparator className="hidden md:block" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
