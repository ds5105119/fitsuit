"use client";

import BreadCrumb from "./breadcrumb";
import SidebarTrigger from "./sidebar-trigger";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 flex h-12 md:h-16 shrink-0 items-center gap-2 border-b border-b-sidebar-border bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="relative flex w-full justify-between items-center gap-2 px-4 md:px-6 md:justify-start">
        <SidebarTrigger className="-ml-1 pl-1.5 hidden md:block" />
        <BreadCrumb />
        <div className="flex items-center grow justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex items-center justify-center"
            onClick={() => {
              toggleSidebar();
            }}
          >
            <Menu className="size-6!" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
