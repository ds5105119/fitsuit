"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const nameMapping: Record<string, string> = {
  admin: "어드민",
  dashboard: "대시보드",
  service: "서비스",
  data: "데이터",
  report: "리포트",
  development: "개발상황",
  library: "라이브러리",
  settings: "설정",
  information: "정보",
  group: "그룹",
  user: "사용자",
  documents: "문서",
  profile: "프로필",
  orders: "주문",
  inquiries: "문의",
};

export default function BreadCrumb() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathNames.map((segment, index) => {
          const href = "/" + pathNames.slice(0, index + 1).join("/");
          const name = nameMapping[segment];
          const nextName = pathNames.length > index + 1 ? nameMapping[pathNames[index + 1]] : undefined;

          if (!name) {
            return null;
          }

          return index === pathNames.length - 1 ? (
            <BreadcrumbPage key={index}>{name}</BreadcrumbPage>
          ) : (
            <div className="flex items-center gap-2" key={index}>
              {nextName ? (
                <>
                  <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
                  <BreadcrumbSeparator className="[&>svg]:size-4" />
                </>
              ) : (
                <BreadcrumbPage key={index}>{name}</BreadcrumbPage>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
