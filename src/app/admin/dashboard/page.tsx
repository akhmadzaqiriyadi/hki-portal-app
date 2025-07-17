// src/app/admin/dashboard/page.tsx

import Link from "next/link";
import { getAllRegistrations } from "@/lib/supabase/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Shield,
  Award,
  Activity,
  Eye,
  UserCheck,
  Download,
} from "lucide-react";
import type { StatusPendaftaran } from "@/lib/types";
import { QuickDownloadButton } from "@/components/features/admin/DownloadPDFButton";

/**
 * Helper untuk memberikan warna pada Badge Status
 */
const getStatusVariant = (status: StatusPendaftaran) => {
  switch (status) {
    case "approved":
      return "success";
    case "diproses_hki":
      return "info";
    case "revisi":
      return "destructive";
    case "submitted":
      return "warning";
    default:
      return "secondary";
  }
};

/**
 * Helper untuk mendapatkan icon status
 */
const getStatusIcon = (status: StatusPendaftaran) => {
  switch (status) {
    case "approved":
      return CheckCircle;
    case "revisi":
      return AlertCircle;
    case "submitted":
      return Clock;
    default:
      return Clock;
  }
};

export default async function AdminDashboardPage() {
  const { data: pendaftaran, error } = await getAllRegistrations();

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error: {error.message}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Stats calculation
  const totalPendaftaran = pendaftaran?.length || 0;
  const approvedCount = pendaftaran?.filter((p) => p.status === "approved").length || 0;
  const submittedCount = pendaftaran?.filter((p) => p.status === "submitted").length || 0;
  const revisiCount = pendaftaran?.filter((p) => p.status === "revisi").length || 0;
  const prosesCount = pendaftaran?.filter((p) => p.status === "diproses_hki").length || 0;

  // Get unique users count
  const uniqueUsers = new Set(pendaftaran?.map((p) => p.user_id) || []).size;

  // Recent registrations (last 5)
  const recentRegistrations = pendaftaran?.slice(0, 5) || [];

  return (
    <div className="relative min-h-screen">
      {/* Background decorations matching user dashboard */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-slate-800/3 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative space-y-8">
        {/* Welcome Header */}
        <div className="relative">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Icon hanya muncul dari sm (tablet) ke atas */}
              <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                  Dashboard Admin
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  Kelola dan verifikasi semua pendaftaran HKI sistem
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <Card className="relative overflow-hidden border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-900/5 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 md:-translate-y-10 md:translate-x-10"></div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                    Total Pendaftaran
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">
                    {totalPendaftaran}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-green-200/50 bg-gradient-to-br from-green-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-green-500/5 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 md:-translate-y-10 md:translate-x-10"></div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                    Disetujui
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">
                    {approvedCount}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-500/5 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 md:-translate-y-10 md:translate-x-10"></div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                    Menunggu Review
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-700">
                    {submittedCount}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-purple-200/50 bg-gradient-to-br from-purple-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-purple-500/5 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 md:-translate-y-10 md:translate-x-10"></div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                    Total Pengguna
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700">
                    {uniqueUsers}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Admin Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="relative overflow-hidden border-indigo-200/50 bg-gradient-to-br from-indigo-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full -translate-y-10 translate-x-10"></div>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Perlu Revisi
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-indigo-700">
                    {revisiCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Memerlukan perhatian segera
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-teal-200/50 bg-gradient-to-br from-teal-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 rounded-full -translate-y-10 translate-x-10"></div>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Dalam Proses HKI
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-teal-700">
                    {prosesCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Sedang diproses HKI
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Registrations */}
          <Card className="lg:col-span-2 border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                  Pendaftaran Terbaru
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-600 font-medium">
                  Review pendaftaran yang baru masuk
                </CardDescription>
              </div>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-3 sm:px-4"
              >
                <Link href="/admin/pendaftaran">
                  <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Lihat Semua</span>
                  <span className="sm:hidden">Semua</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentRegistrations && recentRegistrations.length > 0 ? (
                <div className="rounded-xl border border-blue-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50/80 to-slate-50/50 border-blue-200/30">
                        <TableHead className="text-xs sm:text-sm font-semibold text-slate-700">
                          Judul Karya
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-xs sm:text-sm font-semibold text-slate-700">
                          Pemohon
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm font-semibold text-slate-700">
                          Status
                        </TableHead>
                        <TableHead className="text-center text-xs sm:text-sm font-semibold text-slate-700">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentRegistrations.map((item) => (
                        <TableRow
                          key={item.id}
                          className="hover:bg-blue-50/30 transition-colors border-blue-100/30"
                        >
                          <TableCell className="font-medium text-slate-800 text-xs sm:text-sm">
                            <div className="max-w-[150px] sm:max-w-[200px] truncate" title={item.judul}>
                              {item.judul}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs sm:text-sm text-slate-600">
                            {item.users?.nama_lengkap || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={getStatusVariant(item.status)} 
                              className="text-xs capitalize shadow-sm"
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button asChild size="sm" variant="outline" className="text-xs h-7 px-2">
                                <Link href={`/admin/pendaftaran/${item.id}`}>
                                  <Eye className="h-3 w-3" />
                                  <span className="hidden sm:inline ml-1">Review</span>
                                </Link>
                              </Button>
                              <QuickDownloadButton 
                                pendaftaran={{...item, pencipta: []}}
                                className="h-7 w-7"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-gradient-to-br from-slate-50/50 to-blue-50/30 rounded-xl border border-blue-200/30">
                  <FileText className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                  <h3 className="text-sm font-medium text-slate-600 mb-1">
                    Belum Ada Pendaftaran
                  </h3>
                  <p className="text-xs text-slate-500">
                    Belum ada pendaftaran yang masuk ke sistem.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="border-slate-200/50 bg-gradient-to-br from-white to-slate-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-700" />
                Aksi Cepat
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Shortcut untuk tugas admin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start bg-gradient-to-r from-blue-50/50 to-white border-blue-200/50 hover:from-blue-100/50 hover:to-blue-50/30 hover:border-blue-300/50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Link href="/admin/pendaftaran">
                  <Eye className="mr-3 h-4 w-4 text-blue-700" />
                  Review Pendaftaran
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="w-full justify-start bg-gradient-to-r from-green-50/50 to-white border-green-200/50 hover:from-green-100/50 hover:to-green-50/30 hover:border-green-300/50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Link href="/admin/users">
                  <UserCheck className="mr-3 h-4 w-4 text-green-700" />
                  Kelola Pengguna
                </Link>
              </Button>
              
              <div className="pt-2 border-t border-slate-200/50">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <Award className="h-3 w-3" />
                  Status Sistem
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Sistem Status:</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update:</span>
                    <span className="text-slate-600">
                      {new Date().toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}