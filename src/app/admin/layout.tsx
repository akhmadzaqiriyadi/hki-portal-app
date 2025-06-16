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
import { Menu } from "lucide-react";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proteksi Lapis Pertama: Cek apakah ada user yang login
  if (!user) {
    redirect("/login");
  }

  // Proteksi Lapis Kedua: Cek apakah user memiliki peran 'Admin'
  const { data: userProfile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || userProfile?.role !== "Admin") {
    // Jika bukan admin, arahkan ke dashboard pengguna biasa
    redirect("/dashboard");
  }

  // Jika lolos semua pengecekan, tampilkan layout admin
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        {/* ✅ Perubahan: Panggil sidebar dengan peran 'Admin' */}
        <DashboardSidebar role="Admin" />
      </aside>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SheetHeader className="px-4 py-3 border-b">
                <SheetTitle className="text-lg">Menu Admin</SheetTitle>
              </SheetHeader>
              {/* ✅ Perubahan: Panggil juga di sini dengan peran 'Admin' */}
              <DashboardSidebar role="Admin" />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Panel Admin</h1>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}