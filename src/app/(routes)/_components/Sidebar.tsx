"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ToolTipWrapper from "@/components/ui/ToolTipWrapper";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function SideBard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
    .split("/")
    .filter((r) => r);
  const router = useRouter();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb className="w-full">
              <BreadcrumbList>
                {pathname.map((r, index) => (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbPage className="capitalize">{r}</BreadcrumbPage>
                    {index < pathname.length - 1 && (
                      <ChevronRightIcon size={15} className="hidden md:block" />
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex w-full flex-row justify-end">
              <ToolTipWrapper content="Back">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                >
                  <ChevronLeftIcon size={20} />
                </Button>
              </ToolTipWrapper>
            </div>
          </div>
        </header>
        <div className="bg-background flex flex-1 flex-col gap-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
