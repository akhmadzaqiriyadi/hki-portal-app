"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { getMyRegistrations } from "@/lib/supabase/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  GraduationCap,
  Search,
  Filter,
  X,
} from "lucide-react";
import type { StatusPendaftaran, Pendaftaran } from "@/lib/types";
import { PendaftaranActions } from "@/components/features/pendaftaran/PendaftaranActions";

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
    case "diproses_hki":
      return Clock;
    default:
      return Clock;
  }
};

export default function PendaftaranListPage() {
  const [pendaftaran, setPendaftaran] = useState<Pendaftaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // State untuk search dan filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jenisKaryaFilter, setJenisKaryaFilter] = useState<string>("all");

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data, error } = await getMyRegistrations();
        if (error) {
          setError(error);
        } else {
          setPendaftaran(data || []);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter dan search data
  const filteredPendaftaran = useMemo(() => {
    return pendaftaran.filter((item) => {
      // Search filter
      const matchesSearch =
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.jenis_karya?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      // Status filter
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      // Jenis karya filter
      const matchesJenisKarya =
        jenisKaryaFilter === "all" || item.jenis_karya === jenisKaryaFilter;

      return matchesSearch && matchesStatus && matchesJenisKarya;
    });
  }, [pendaftaran, searchQuery, statusFilter, jenisKaryaFilter]);

  // Get unique jenis karya untuk filter options
  const uniqueJenisKarya = useMemo(() => {
    return [...new Set(pendaftaran.map((item) => item.jenis_karya).filter((jenis): jenis is string => jenis !== null))];
  }, [pendaftaran]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setJenisKaryaFilter("all");
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchQuery !== "" || statusFilter !== "all" || jenisKaryaFilter !== "all";

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="relative space-y-8">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background decorations matching dashboard */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative space-y-8">
        {/* Header Halaman */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Manajemen Pendaftaran HKI
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Semua pendaftaran yang pernah Anda ajukan ada di sini.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link href="/dashboard/pendaftaran/baru">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pendaftaran
            </Link>
          </Button>
        </div>

        {/* Search and Filter Section */}
        <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-4 -mb-8">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-700" />
              <CardTitle className="text-lg font-bold text-slate-800">
                Pencarian & Filter
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari berdasarkan judul atau jenis karya..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Filter Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="diproses_hki">Diproses HKI</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="revisi">Revisi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Filter Jenis Karya
                </label>
                <Select
                  value={jenisKaryaFilter}
                  onValueChange={setJenisKaryaFilter}
                >
                  <SelectTrigger className="border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20">
                    <SelectValue placeholder="Semua Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    {uniqueJenisKarya.map((jenis) => (
                      <SelectItem key={jenis} value={jenis}>
                        {jenis}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-blue-200/50 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              )}
            </div>

            {/* Results Count */}
            {hasActiveFilters && (
              <div className="text-sm text-slate-600 bg-blue-50/50 px-3 py-2 rounded-lg border border-blue-200/30">
                Menampilkan {filteredPendaftaran.length} dari{" "}
                {pendaftaran.length} pendaftaran
              </div>
            )}
          </CardContent>
        </Card>

        {/* Konten Utama */}
        <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold text-slate-800">
              Daftar Pengajuan HKI
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-slate-600 font-medium">
              Pantau status dan kelola semua pendaftaran Anda dari satu tempat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-6 text-red-500">Error: {error.message}</div>
            )}

            {!error && filteredPendaftaran && filteredPendaftaran.length > 0 ? (
              <div className="rounded-xl border border-blue-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-50/80 to-slate-50/50 border-blue-200/30">
                      <TableHead className="w-[35%] font-semibold text-slate-700">
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
                      <TableHead className="text-center font-semibold text-slate-700">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendaftaran.map((item) => {
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
                            {item.jenis_karya || "-"}
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
                              className="gap-1.5 px-3 py-1 font-semibold text-xs"
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {item.status.charAt(0).toUpperCase() +
                                item.status.slice(1).replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <PendaftaranActions pendaftaran={item} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : !error && pendaftaran.length > 0 ? (
              // No results after filtering
              <div className="text-center py-16 px-6 bg-gradient-to-br from-blue-50/50 to-slate-50/30 rounded-xl border border-blue-200/30">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Search className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Tidak Ada Hasil Ditemukan
                </h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Coba ubah kata kunci pencarian atau filter yang Anda gunakan.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-blue-200/50 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                >
                  <X className="mr-2 h-4 w-4" />
                  Hapus Semua Filter
                </Button>
              </div>
            ) : (
              // No data at all
              <div className="text-center py-16 px-6 bg-gradient-to-br from-blue-50/50 to-slate-50/30 rounded-xl border border-blue-200/30">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <GraduationCap className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Anda Belum Memiliki Pendaftaran
                </h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Mulai daftarkan karya pertama Anda untuk melindunginya.
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/dashboard/pendaftaran/baru">
                    <PlusCircle className="mr-2 h-4 w-4" /> Daftarkan HKI
                    Sekarang
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
