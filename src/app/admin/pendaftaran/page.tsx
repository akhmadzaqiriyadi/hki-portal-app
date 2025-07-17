"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getAllRegistrations } from "@/lib/supabase/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Eye, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Search,
  Download,
  X,
  SortAsc,
  SortDesc,
  CalendarDays,
  RefreshCw,
  RotateCcw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { StatusPendaftaran, PendaftaranWithPemohon } from "@/lib/types";
import { QuickDownloadButton } from "@/components/features/admin/DownloadPDFButton";

// Helper untuk Badge Status
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

export default function AdminPendaftaranPage() {
  const [pendaftaran, setPendaftaran] = useState<PendaftaranWithPemohon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "title" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await getAllRegistrations();
        if (error) {
          setError(error.message);
        } else {
          setPendaftaran(data || []);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = pendaftaran.filter((item) => {
      const matchesSearch = 
        item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.users?.nama_lengkap || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.users?.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const itemDate = new Date(item.created_at);
        const now = new Date();
        
        switch (dateFilter) {
          case "today":
            matchesDate = itemDate.toDateString() === now.toDateString();
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = itemDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = itemDate >= monthAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sort data
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "title":
          comparison = a.judul.localeCompare(b.judul);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [pendaftaran, searchTerm, statusFilter, sortBy, sortOrder, dateFilter]);

  // Stats calculation
  const totalPendaftaran = pendaftaran.length;
  const approvedCount = pendaftaran.filter((p) => p.status === "approved").length;
  const submittedCount = pendaftaran.filter((p) => p.status === "submitted").length;
  const revisiCount = pendaftaran.filter((p) => p.status === "revisi").length;

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAllRegistrations();
      if (error) {
        setError(error.message);
      } else {
        setPendaftaran(data || []);
        setError(null);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setSortBy("date");
    setSortOrder("desc");
  };

  return (
    <div className="relative min-h-screen">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-slate-800/3 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>

              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                  Verifikasi Pendaftaran
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  Review dan kelola semua pendaftaran HKI yang masuk dari pengguna
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table with Integrated Search & Filter */}
        <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-700" />
                  Daftar Pendaftaran HKI
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-600 font-medium">
                  Kelola dan review semua pendaftaran yang masuk
                </CardDescription>
              </div>
              <div className="text-sm text-slate-600 flex items-center">
                <FileText className="mr-1 h-4 w-4" />
                {filteredAndSortedData.length} dari {totalPendaftaran} pendaftaran
              </div>
            </div>

            {/* Integrated Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari berdasarkan judul karya, nama pemohon, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>

            {/* Collapsible Filter Section */}
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto border-slate-200 hover:bg-slate-50 justify-center sm:justify-start"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>

              {showFilters && (
                <div className="space-y-4 p-4 bg-slate-50/50 rounded-lg border border-slate-200/50">
                  {/* Filters Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Status Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="revisi">Revisi</SelectItem>
                          <SelectItem value="diproses_hki">Diproses HKI</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Periode</label>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Waktu</SelectItem>
                          <SelectItem value="today">Hari Ini</SelectItem>
                          <SelectItem value="week">7 Hari Terakhir</SelectItem>
                          <SelectItem value="month">30 Hari Terakhir</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Urutkan</label>
                      <Select value={sortBy} onValueChange={(value: "date" | "title" | "status") => setSortBy(value)}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Tanggal</SelectItem>
                          <SelectItem value="title">Judul</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort Order */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Urutan</label>
                      <Button
                        variant="outline"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="w-full justify-start bg-white border-slate-200 hover:bg-slate-50"
                      >
                        {sortOrder === "asc" ? (
                          <SortAsc className="mr-2 h-4 w-4" />
                        ) : (
                          <SortDesc className="mr-2 h-4 w-4" />
                        )}
                        {sortOrder === "asc" ? "A-Z / Lama" : "Z-A / Baru"}
                      </Button>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="border-slate-200 hover:bg-slate-50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reset Filter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={loading}
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      Refresh Data
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-50/80 to-white p-3 rounded-lg border border-blue-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-1">Total</p>
                    <p className="text-lg font-bold text-blue-900">
                      {loading ? "..." : totalPendaftaran}
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-blue-900 rounded-md flex items-center justify-center">
                    <FileText className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50/80 to-white p-3 rounded-lg border border-green-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-1">Disetujui</p>
                    <p className="text-lg font-bold text-green-700">
                      {loading ? "..." : approvedCount}
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50/80 to-white p-3 rounded-lg border border-amber-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-1">Review</p>
                    <p className="text-lg font-bold text-amber-700">
                      {loading ? "..." : submittedCount}
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-amber-600 rounded-md flex items-center justify-center">
                    <Clock className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50/80 to-white p-3 rounded-lg border border-red-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-1">Revisi</p>
                    <p className="text-lg font-bold text-red-700">
                      {loading ? "..." : revisiCount}
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center">
                    <AlertCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="p-6">
                <Card className="border-red-200 bg-red-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Error: {error}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {!error && filteredAndSortedData && filteredAndSortedData.length > 0 ? (
              <div className="rounded-xl border border-blue-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-50/80 to-slate-50/50 border-blue-200/30">
                      <TableHead className="text-xs sm:text-sm font-semibold text-slate-700 w-[35%]">
                        Judul Karya
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm font-semibold text-slate-700">
                        Pemohon
                      </TableHead>
                      <TableHead className="hidden lg:table-cell text-xs sm:text-sm font-semibold text-slate-700">
                        Tanggal Diajukan
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
                    {filteredAndSortedData.map((item) => (
                      <TableRow 
                        key={item.id}
                        className="hover:bg-blue-50/30 transition-colors border-blue-100/30"
                      >
                        <TableCell className="font-medium text-slate-800 text-xs sm:text-sm">
                          <div className="max-w-[200px] sm:max-w-[300px]">
                            <div className="truncate font-semibold" title={item.judul}>
                              {item.judul}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              ID: {item.id.substring(0, 8)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-slate-600" />
                            </div>
                            <div>
                              <div className="font-medium">{item.users?.nama_lengkap || 'N/A'}</div>
                              <div className="text-xs text-slate-500">{item.users?.email || ''}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs sm:text-sm text-slate-600">
                          <div>
                            <div className="font-medium">
                              {new Date(item.created_at).toLocaleDateString("id-ID")}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(item.created_at).toLocaleTimeString("id-ID", {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge 
                              variant={getStatusVariant(item.status)} 
                              className="text-xs capitalize shadow-sm flex items-center gap-1 w-fit"
                            >
                              {(() => {
                                const Icon = getStatusIcon(item.status);
                                return <Icon className="h-3 w-3" />;
                              })()}
                              {item.status}
                            </Badge>
                            {/* Badge sertifikat jika sudah approved dan ada sertifikat */}
                            {item.status === 'approved' && item.sertifikat_hki_url && (
                              <Badge 
                                variant="secondary" 
                                className="text-xs bg-green-100 text-green-800 border-green-200 flex items-center gap-1 w-fit"
                              >
                                <FileText className="h-3 w-3" />
                                Sertifikat
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              asChild 
                              size="sm" 
                              variant="outline"
                              className="bg-gradient-to-r from-blue-50/50 to-white border-blue-200/50 hover:from-blue-100/50 hover:to-blue-50/30 hover:border-blue-300/50 transition-all duration-200 shadow-sm hover:shadow-md text-xs h-8 px-3"
                            >
                              <Link href={`/admin/pendaftaran/${item.id}`}>
                                <Eye className="mr-2 h-3 w-3" /> 
                                <span className="hidden sm:inline">Review</span>
                                <span className="sm:hidden">Detail</span>
                              </Link>
                            </Button>
                            <QuickDownloadButton 
                              pendaftaran={{
                                ...item,
                                pencipta: []
                              } as any}
                              className="h-8 w-8"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : !error && (
              <div className="text-center py-16 px-6 bg-gradient-to-br from-slate-50/50 to-blue-50/30 rounded-xl border border-blue-200/30 m-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
                  {searchTerm || statusFilter !== 'all' || sortBy !== 'date' ? 
                    'Tidak Ada Data Sesuai Filter' : 
                    'Belum Ada Pendaftaran Masuk'
                  }
                </h3>
                <p className="text-sm sm:text-base text-slate-500 mb-4">
                  {searchTerm || statusFilter !== 'all' || sortBy !== 'date' ? 
                    'Tidak ada pendaftaran yang sesuai dengan kriteria pencarian atau filter yang dipilih.' :
                    'Saat ini belum ada data pendaftaran dari pengguna yang perlu direview.'
                  }
                </p>
                {(searchTerm || statusFilter !== 'all' || sortBy !== 'date') && (
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="border-blue-200 text-blue-900 hover:bg-blue-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Filter
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}