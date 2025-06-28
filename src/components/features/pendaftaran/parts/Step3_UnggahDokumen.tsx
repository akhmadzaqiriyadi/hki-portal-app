// src/components/features/pendaftaran/parts/Step3_UnggahDokumen.tsx

"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { UploadCloud, FileText, CreditCard, AlertCircle } from "lucide-react";

import { usePendaftaranFee } from "@/components/hooks/usePendaftaranFee";
import { FormValues, pemilikOptions } from "@/lib/pendaftaran/schema";
import { FileUpload } from "../FileUpload";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

export function Step3UnggahDokumen() {
  const { control, watch } = useFormContext<FormValues>();

  // Memantau nilai 'jenis_pemilik' dan 'jenis_karya' untuk perhitungan biaya
  const jenisPemilik = watch("jenis_pemilik");
  const jenisKarya = watch("jenis_karya");

  // Menggunakan custom hook untuk mendapatkan biaya pendaftaran secara reaktif
  const biayaPendaftaran = usePendaftaranFee(jenisPemilik, jenisKarya);

  return (
    <div className="w-full max-w-full space-y-6">
      {/* Header Card */}
      <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-blue-200/10 rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>
        
        <CardHeader className="pb-3 sm:pb-4 relative">
          <CardTitle className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                3. Unggah Dokumen Pendukung
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Unggah semua file yang diperlukan dalam format yang ditentukan (Maks 5MB per file)
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-start gap-2 sm:gap-3 pb-3 border-b border-blue-200/50">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">
                Status Kepemilikan & Dokumen
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Tentukan status kepemilikan dan lengkapi dokumen pendukung
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Pemilik Card */}
      <Card className="border-slate-200/50 bg-gradient-to-br from-white to-slate-50/30 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-100/20 to-slate-200/10 rounded-full -translate-y-12 translate-x-12 pointer-events-none"></div>
        
        <CardHeader className="pb-4 relative">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-3 h-3 text-white" />
            </div>
            Status Pemilik Hak Cipta
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <FormField
            control={control}
            name="jenis_pemilik"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel className="font-semibold text-slate-700">
                  Status Pemilik Hak Cipta *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue placeholder="Pilih status Anda..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pemilikOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Payment Information Card */}
      <Card className="border-blue-300/50 bg-gradient-to-br from-blue-50/50 to-blue-100/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-blue-300/10 rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>
        
        <CardHeader className="pb-4 relative">
          <CardTitle className="flex items-start gap-3 text-blue-900">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold">Informasi Pembayaran</h3>
              <p className="text-sm text-blue-700 font-medium">
                Detail biaya dan rekening tujuan
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
            <p className="text-blue-800 font-medium mb-2">
              Silakan lakukan pembayaran sejumlah:
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
              Rp {biayaPendaftaran.toLocaleString("id-ID")},-
            </p>
            <div className="pt-3 border-t border-blue-200/50">
              <p className="text-blue-800 font-medium mb-2">Ke rekening tujuan:</p>
              <div className="bg-blue-900/5 rounded-lg p-3 border border-blue-200/30">
                <p className="font-bold text-blue-900">BANK MANDIRI: 1234-5678-9012-3456</p>
                <p className="text-blue-800 font-medium">
                  Atas Nama: <span className="font-bold">Yayasan Universitas Teknologi Yogyakarta</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Documents Card */}
      <Card className="border-slate-200/50 bg-gradient-to-br from-white to-slate-50/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100/20 to-slate-200/10 rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>
        
        <CardHeader className="pb-4 relative">
          <CardTitle className="flex items-start gap-3 text-slate-800">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold">Dokumen Pendukung</h3>
              <p className="text-sm text-slate-600 font-medium">
                Unggah semua dokumen yang diperlukan
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full">
              <FormField
                control={control}
                name="bukti_transfer_url"
                render={({ field }) => (
                  <FormItem className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-300">
                    <FormLabel className="font-semibold text-slate-700 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Bukti Transfer Pembayaran *
                    </FormLabel>
                    <FormControl>
                      <FileUpload field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="w-full">
              <FormField
                control={control}
                name="scan_ktp_kolektif_url"
                render={({ field }) => (
                  <FormItem className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-300">
                    <FormLabel className="font-semibold text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      Scan KTP Semua Pencipta (1 PDF) *
                    </FormLabel>
                    <FormControl>
                      <FileUpload field={field} />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-600 mt-2">
                      Gabungkan semua KTP dalam satu file PDF.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="w-full">
              <FormField
                control={control}
                name="lampiran_karya_url"
                render={({ field }) => (
                  <FormItem className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-300">
                    <FormLabel className="font-semibold text-slate-700 flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-purple-600" />
                      Lampiran Contoh Karya *
                    </FormLabel>
                    <FormControl>
                      <FileUpload field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="w-full">
              <FormField
                control={control}
                name="surat_pernyataan_url"
                render={({ field }) => (
                  <FormItem className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-300">
                    <FormLabel className="font-semibold text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-600" />
                      Surat Pernyataan (PDF) *
                    </FormLabel>
                    <FormControl>
                      <FileUpload field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Conditional Field untuk Umum */}
          {jenisPemilik === "Umum" && (
            <Card className="border-yellow-300/50 bg-gradient-to-br from-yellow-50/50 to-yellow-100/30 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-200/20 to-yellow-300/10 rounded-full -translate-y-12 translate-x-12 pointer-events-none"></div>
              
              <CardHeader className="pb-4 relative">
                <CardTitle className="flex items-center gap-3 text-yellow-800">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                    <AlertCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-base font-bold">Dokumen Khusus untuk Status Umum</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative">
                <div className="w-full">
                  <FormField
                    control={control}
                    name="surat_pengalihan_url"
                    render={({ field }) => (
                      <FormItem className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-yellow-200/50">
                        <FormLabel className="font-semibold text-yellow-800 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-yellow-600" />
                          Surat Pengalihan Hak (Wajib untuk Umum) *
                        </FormLabel>
                        <FormControl>
                          <FileUpload field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}