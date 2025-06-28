import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, GraduationCap } from "lucide-react";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Desktop Layout */}
      <div className="hidden md:flex">
        {/* Sidebar */}
        <div className="w-[280px] lg:w-[320px] fixed left-0 top-0 h-screen border-r border-blue-200/30 bg-white/95 backdrop-blur-sm shadow-lg z-10">
          <DashboardSidebar role="User" />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-[280px] lg:ml-[320px]">
          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-blue-200/30 bg-white/95 backdrop-blur-sm px-4 shadow-sm">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 border-blue-200 hover:bg-blue-50"
              >
                <Menu className="h-5 w-5 text-blue-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SheetHeader className="px-4 py-4 border-b border-blue-200/30 bg-gradient-to-r from-blue-50/50 to-slate-50/50">
                <SheetTitle className="text-lg font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-900 to-blue-800 rounded-md flex items-center justify-center">
                    <GraduationCap className="h-3 w-3 text-white" />
                  </div>
                  Menu Navigasi
                </SheetTitle>
              </SheetHeader>
              <DashboardSidebar role="User" />
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Portal HKI
              </h1>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}