"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, InboxIcon, SettingsIcon, ShoppingBagIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarSeparator } from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";

const NAV_ITEMS = [
  { title: "주문 관리", href: "/admin/orders", icon: ShoppingBagIcon },
  { title: "문의 관리", href: "/admin/inquiries", icon: InboxIcon },
  { title: "관리자 설정", href: "/admin/settings", icon: SettingsIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="w-56">
      <SidebarHeader className="px-4 py-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500">ADMIN</p>
          <h1 className="text-lg font-bold text-neutral-900">GOLD FINGER</h1>
          <p className="text-sm text-neutral-500">컨시어지 & 문의 관리</p>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain items={NAV_ITEMS} />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="px-4 py-4">
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
        >
          <HomeIcon className="h-4 w-4" />
          사이트로 이동
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
