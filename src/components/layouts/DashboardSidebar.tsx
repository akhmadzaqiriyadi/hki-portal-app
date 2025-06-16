"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { LayoutDashboard, Files, Users, LogOut } from "lucide-react";
import { logout } from "@/lib/supabase/actions";

// ✅ Data untuk link navigasi PENGGUNA BIASA
const userNavLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/pendaftaran",
    label: "Pendaftaran",
    icon: Files,
    exact: false,
  },
];

// Data untuk link navigasi ADMIN
const adminNavLinks = [
  {
    href: "/admin/dashboard",
    label: "Dashboard Admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/pendaftaran",
    label: "Verifikasi Pendaftaran",
    icon: Files,
    exact: false,
  },
  {
    href: "/admin/users",
    label: "Manajemen Pengguna",
    icon: Users,
    exact: true,
  },
];

interface DashboardSidebarProps {
  role: 'User' | 'Admin';
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  // ✅ Pilih link navigasi yang sesuai berdasarkan peran
  const navLinks = role === 'Admin' ? adminNavLinks : userNavLinks;
  const homeLink = role === 'Admin' ? '/admin/dashboard' : '/dashboard';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href={homeLink} className="flex items-center gap-2 font-semibold">
          <span className="">Portal HKI {role === 'Admin' && <span className="text-xs text-muted-foreground">(Admin)</span>}</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navLinks.map((link) => {
            const isActive = link.exact 
              ? pathname === link.href 
              : pathname.startsWith(link.href);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                  "justify-start gap-3 px-3"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <form action={handleLogout}>
          <Button variant="ghost" className="w-full justify-start gap-3 px-3">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}