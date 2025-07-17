'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HKIAnalyticsCards } from "@/components/features/analytics/HKIAnalyticsCards";
import { 
  FileText, 
  TrendingUp, 
  Calendar,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from "lucide-react";
import { getAllRegistrations } from "@/lib/supabase/actions";
import type { PendaftaranWithPemohon } from "@/lib/types";

export default function AdminAnalyticsPage() {
  const [pendaftaran, setPendaftaran] = useState<PendaftaranWithPemohon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await getAllRegistrations();
        setPendaftaran(data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate analytics data
  const totalPendaftaran = pendaftaran.length;
  const approvedCount = pendaftaran.filter(p => p.status === 'approved').length;
  const submittedCount = pendaftaran.filter(p => p.status === 'submitted').length;
  const revisiCount = pendaftaran.filter(p => p.status === 'revisi').length;
  const draftCount = pendaftaran.filter(p => p.status === 'draft').length;

  // Monthly data for trends
  const monthlyData = pendaftaran.reduce((acc, item) => {
    const month = new Date(item.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Category breakdown
  const categoryData = pendaftaran.reduce((acc, item) => {
    const category = item.jenis_karya || 'Tidak Diketahui';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent activity (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentActivity = pendaftaran.filter(p => new Date(p.created_at) >= thirtyDaysAgo).length;

  // Conversion rate (approved / total submitted)
  const totalSubmitted = pendaftaran.filter(p => p.status !== 'draft').length;
  const conversionRate = totalSubmitted > 0 ? ((approvedCount / totalSubmitted) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-slate-50/50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-8 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
                Analytics HKI
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Dashboard analisis dan statistik pendaftaran Hak Kekayaan Intelektual
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Cards Component */}
        <HKIAnalyticsCards />

        {/* Additional Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Conversion Rate */}
          <Card className="relative overflow-hidden border-green-200/50 bg-gradient-to-br from-green-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 bg-green-500/5 rounded-full -translate-y-6 translate-x-6"></div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Tingkat Persetujuan
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {loading ? "..." : `${conversionRate}%`}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {approvedCount} dari {totalSubmitted} disetujui
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="relative overflow-hidden border-purple-200/50 bg-gradient-to-br from-purple-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/5 rounded-full -translate-y-6 translate-x-6"></div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Aktivitas 30 Hari
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {loading ? "..." : recentActivity}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Pendaftaran baru
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Activity className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Processing Time */}
          <Card className="relative overflow-hidden border-orange-200/50 bg-gradient-to-br from-orange-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 bg-orange-500/5 rounded-full -translate-y-6 translate-x-6"></div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Rata-rata Proses
                  </p>
                  <p className="text-2xl font-bold text-orange-700">
                    {loading ? "..." : "7"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Hari kerja
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card className="relative overflow-hidden border-cyan-200/50 bg-gradient-to-br from-cyan-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/5 rounded-full -translate-y-6 translate-x-6"></div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Total Pengguna
                  </p>
                  <p className="text-2xl font-bold text-cyan-700">
                    {loading ? "..." : new Set(pendaftaran.map(p => p.users?.email)).size}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Pengguna unik
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <Card className="border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tren Pendaftaran Bulanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-6 bg-slate-100 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(monthlyData)
                    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                    .slice(-6)
                    .map(([month, count]) => (
                      <div key={month} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">{month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min((count / Math.max(...Object.values(monthlyData))) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            {count}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Kategori Karya
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-6 bg-slate-100 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(categoryData)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count], index) => {
                      const colors = [
                        'from-blue-500 to-blue-600',
                        'from-green-500 to-green-600', 
                        'from-purple-500 to-purple-600',
                        'from-orange-500 to-orange-600',
                        'from-red-500 to-red-600'
                      ];
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600 truncate max-w-[150px]" title={category}>
                            {category}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                                style={{ width: `${Math.min((count / Math.max(...Object.values(categoryData))) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-800">
                              {count}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Distribution */}
        <Card className="border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Distribusi Status Pendaftaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-slate-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50/50 rounded-lg border border-green-200/50">
                  <div className="text-2xl font-bold text-green-700">{approvedCount}</div>
                  <div className="text-sm text-slate-600">Disetujui</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {totalPendaftaran > 0 ? ((approvedCount / totalPendaftaran) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50/50 rounded-lg border border-blue-200/50">
                  <div className="text-2xl font-bold text-blue-700">{submittedCount}</div>
                  <div className="text-sm text-slate-600">Review</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {totalPendaftaran > 0 ? ((submittedCount / totalPendaftaran) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50/50 rounded-lg border border-red-200/50">
                  <div className="text-2xl font-bold text-red-700">{revisiCount}</div>
                  <div className="text-sm text-slate-600">Revisi</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {totalPendaftaran > 0 ? ((revisiCount / totalPendaftaran) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div className="text-center p-4 bg-slate-50/50 rounded-lg border border-slate-200/50">
                  <div className="text-2xl font-bold text-slate-700">{draftCount}</div>
                  <div className="text-sm text-slate-600">Draft</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {totalPendaftaran > 0 ? ((draftCount / totalPendaftaran) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
