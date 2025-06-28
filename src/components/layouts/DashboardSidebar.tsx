"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Files, Users, LogOut, CheckCircle, GraduationCap } from "lucide-react";
import { logout } from "@/lib/supabase/actions";

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
  const navLinks = role === 'Admin' ? adminNavLinks : userNavLinks;
  const homeLink = role === 'Admin' ? '/admin/dashboard' : '/dashboard';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-full flex-col relative overflow-hidden">
      {/* Background decorations matching hero section */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-800/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-10 w-40 h-40 bg-blue-900/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-slate-800/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header with enhanced styling */}
      <div className="relative flex h-12 items-center border-b border-blue-200/30 px-4 lg:h-[60px] lg:px-6 bg-gradient-to-r backdrop-blur-sm">
        <Link href={homeLink} className="flex items-center gap-2 font-semibold group">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Portal HKI
              </span>
              {role === 'Admin' && (
                <span className="text-xs text-blue-700 font-medium -mt-1">Admin Panel</span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="relative flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = link.exact 
              ? pathname === link.href 
              : pathname.startsWith(link.href);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-xl transform scale-[1.02]" 
                    : "text-slate-700 hover:text-blue-800 hover:bg-blue-50/80 hover:shadow-md hover:scale-[1.01] backdrop-blur-sm"
                )}
              >
                <link.icon className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isActive ? "text-white" : "text-blue-700 group-hover:scale-110"
                )} />
                <span className="font-semibold">{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Trust badge */}
      <div className="relative px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs text-blue-800 bg-blue-50/80 backdrop-blur-sm rounded-full px-3 py-2 w-fit border border-blue-200/60 shadow-sm">
          <CheckCircle className="h-3 w-3 text-blue-700" />
          UTY Creative Hub
        </div>
      </div>

      {/* Stats section */}
      <div className="relative px-4 py-3 border-t border-blue-200/30 bg-gradient-to-r from-blue-50/30 to-slate-50/30 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-900">500+</div>
            <div className="text-xs text-slate-600">HKI Aktif</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-900">98%</div>
            <div className="text-xs text-slate-600">Approval</div>
          </div>
        </div>
      </div>

      {/* Logout button with enhanced styling */}
      <div className="relative mt-auto border-t border-blue-200/30 p-4 bg-gradient-to-r from-blue-50/30 to-slate-50/30 backdrop-blur-sm">
        <form action={handleLogout}>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 px-4 py-3 rounded-xl font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50/80 hover:shadow-md transition-all duration-200 hover:scale-[1.01] group"
          >
            <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}