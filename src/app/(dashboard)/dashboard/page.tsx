import Link from "next/link";
import { getMyRegistrations } from "@/lib/supabase/actions";
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
  PlusCircle,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Award,
  Users,
  Target,
} from "lucide-react";
import type { StatusPendaftaran } from "@/lib/types";

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

export default async function DashboardPage() {
  const { data: pendaftaran, error } = await getMyRegistrations();

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
  const approvedCount =
    pendaftaran?.filter((p) => p.status === "approved").length || 0;
  const submittedCount =
    pendaftaran?.filter((p) => p.status === "submitted").length || 0;
  const revisiCount =
    pendaftaran?.filter((p) => p.status === "revisi").length || 0;

  return (
    <div className="relative min-h-screen">
      {/* Background decorations matching sidebar */}
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
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                  Dashboard HKI
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  Kelola dan pantau semua pendaftaran HKI Anda
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
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

          <Card className="relative overflow-hidden border-red-200/50 bg-gradient-to-br from-red-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-500/5 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 md:-translate-y-10 md:translate-x-10"></div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                    Perlu Revisi
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700">
                    {revisiCount}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="lg:col-span-2 border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                  Pendaftaran HKI Anda
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-600 font-medium">
                  Kelola dan pantau status semua pendaftaran Anda
                </CardDescription>
              </div>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-3 sm:px-4"
              >
                <Link href="/dashboard/pendaftaran/baru">
                  <PlusCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Daftarkan HKI Baru</span>
                  <span className="sm:hidden">HKI Baru</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {pendaftaran && pendaftaran.length > 0 ? (
                <div className="rounded-xl border border-blue-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50/80 to-slate-50/50 border-blue-200/30">
                        <TableHead className="font-semibold text-slate-700">
                          Judul Karya
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Jenis Karya
                        </TableHead>
                        <TableHead className="hidden md:table-cell font-semibold text-slate-700">
                          Tanggal Pengajuan
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          <span className="sr-only">Aksi</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendaftaran.map((item) => {
                        const StatusIcon = getStatusIcon(item.status);
                        return (
                          <TableRow
                            key={item.id}
                            className="hover:bg-blue-50/50 transition-colors duration-200"
                          >
                            <TableCell className="font-semibold text-slate-800">
                              {item.judul}
                            </TableCell>
                            <TableCell className="text-slate-600 font-medium">
                              {item.jenis_karya}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-slate-600">
                              {new Date(item.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusVariant(item.status)}
                                className="gap-1 px-3 py-1 font-semibold"
                              >
                                <StatusIcon className="h-3 w-3" />
                                {item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:scale-105 text-xs px-2 sm:px-3"
                              >
                                <Link
                                  href={`/dashboard/pendaftaran/${item.id}`}
                                >
                                  <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">
                                    Lihat Detail
                                  </span>
                                  <span className="sm:hidden">Detail</span>
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-blue-50/50 to-slate-50/30 rounded-xl border border-blue-200/30">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FileText className="h-8 w-8 text-blue-700" />
                  </div>
                  <p className="text-slate-600 font-medium mb-4">
                    Anda belum memiliki pendaftaran HKI
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-3 sm:px-4"
                  >
                    <Link href="/dashboard/pendaftaran/baru">
                      <PlusCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">
                        Mulai Pendaftaran Pertama
                      </span>
                      <span className="sm:hidden">Mulai Daftar</span>
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Panel */}
          <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">

              {/* Stats */}
              <div className="space-y-3 sm:space-y-4">

                <div className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-blue-50/50 to-slate-50/30 rounded-lg sm:rounded-xl border border-blue-200/30">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700" />
                    <span className="text-xs sm:text-sm font-medium text-slate-700">
                      Rata-rata Proses
                    </span>
                  </div>
                  <span className="text-sm sm:text-lg font-bold text-blue-900">
                    7 Hari
                  </span>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-lg sm:rounded-xl border border-amber-200/50">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  Tips Cepat
                </h4>
                <p className="text-xs sm:text-sm text-amber-700 leading-relaxed">
                  Pastikan dokumen lengkap dan sesuai format untuk mempercepat
                  proses review HKI Anda.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
