"use client";

import BreadCrumb from "./breadcrumb";
import SidebarTrigger from "./sidebar-trigger";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BellIcon, Menu, XIcon } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useId } from "react";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const uniqueId = useId();

  return (
    <header className="sticky top-0 z-50 flex h-12 md:h-16 shrink-0 items-center gap-2 border-b border-b-sidebar-border bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="relative flex w-full justify-between items-center gap-2 px-4 md:px-6 md:justify-start">
        <SidebarTrigger className="-ml-1 pl-1.5 hidden md:block" />
        <BreadCrumb />
        <div className="flex items-center grow justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden flex items-center justify-center mr-2">
                <BellIcon className="size-5.5!" />
              </Button>
            </SheetTrigger>

            <SheetContent className="overflow-hidden h-full w-full [&>button:first-of-type]:hidden gap-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus:outline-none focus:border-none">
              <SheetHeader className="sr-only">
                <SheetTitle>프로젝트 상세</SheetTitle>
              </SheetHeader>
              <div className="absolute top-7 -translate-y-1/2 right-4 z-50">
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="focus-visible:ring-0">
                    <XIcon className="size-5" strokeWidth={3} />
                  </Button>
                </SheetClose>
              </div>

              <SheetDescription className="sr-only" />
            </SheetContent>
          </Sheet>

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
