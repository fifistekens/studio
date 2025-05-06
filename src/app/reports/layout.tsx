import * as React from "react";
import type { PropsWithChildren } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut, Building } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ReportsLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Sidebar variant="sidebar" collapsible="icon" side="left">
        <SidebarHeader className="items-center justify-between">
           <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
              Invoicify Pro
            </h1>
           </div>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </SidebarHeader>
        <Separator className="mb-2" />
        <SidebarContent>
          <React.Suspense fallback={<SidebarMenuSkeleton showIcon />}>
            <MainNav />
          </React.Suspense>
        </SidebarContent>
        <SidebarFooter className="mt-auto">
          <div className="flex items-center justify-between p-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" aria-label="Log out">
              <LogOut />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
    
  );
}
