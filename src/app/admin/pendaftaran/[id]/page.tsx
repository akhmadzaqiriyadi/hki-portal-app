import { getRegistrationByIdForAdmin } from "@/lib/supabase/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  User,
  ImageIcon,
  Download,
  UploadCloud,
  MessageSquareWarning,
  Clock,
  ArrowLeft,
  Calendar,
  Hash,
} from "lucide-react";
import type { StatusPendaftaran } from "@/lib/types";
import { AdminStatusActions } from "@/components/features/admin/AdminStatusActions";
import { DownloadPDFButton } from "@/components/features/admin/DownloadPDFButton";
import { SertifikatUpload } from "@/components/features/admin/SertifikatUpload";

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

// Helper untuk menampilkan item detail agar rapi
function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 py-3 border-b border-blue-100/50 last:border-b-0">
      <dt className="text-sm font-semibold text-slate-600">{label}</dt>
      <dd className="text-sm col-span-2 text-slate-800">{value}</dd>
    </div>
  );
}

// Helper untuk menampilkan preview atau link file lampiran
function FilePreviewLink({
  url,
  label,
}: {
  url?: string | null;
  label: string;
}) {
  if (!url) {
    return (
      <div className="p-6 border border-blue-200/50 rounded-xl text-center bg-gradient-to-br from-slate-50/50 to-blue-50/30">
        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-700 mb-1">{label}</p>
        <p className="text-xs text-slate-500">
          Tidak ada file yang diunggah.
        </p>
      </div>
    );
  }

  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].some((ext) =>
    url.toLowerCase().endsWith(ext)
  );

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        {isImage ? (
          <ImageIcon className="h-4 w-4 text-blue-600" />
        ) : (
          <FileText className="h-4 w-4 text-blue-600" />
        )}
        {label}
      </p>
      <div className="border border-blue-200/50 rounded-xl p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            {isImage ? (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-5 w-5 text-blue-600" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
            )}
            <span
              className="text-sm font-medium text-slate-700 truncate"
              title={url.split("/").pop()?.split("_").slice(1).join("_")}
            >
              {url.split("/").pop()?.split("_").slice(1).join("_")}
            </span>
          </div>
          <Button 
            asChild 
            variant="outline" 
            size="sm" 
            className="flex-shrink-0 border-blue-200 hover:bg-blue-50"
          >
            <Link href={url} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" /> Lihat
            </Link>
          </Button>
        </div>
        {isImage && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-blue-200/50 mt-4">
            <Image
              src={url}
              alt={`Preview ${label}`}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface AdminDetailPendaftaranPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminDetailPendaftaranPage({
  params,
}: AdminDetailPendaftaranPageProps) {
  const { id } = await params;
  const { data: pendaftaran, error } = await getRegistrationByIdForAdmin(id);

  if (error || !pendaftaran) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-slate-800/3 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative space-y-6">
        {/* Header Section */}
        <div className="relative">
          <div className="flex flex-col gap-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Link 
                href="/admin/dashboard" 
                className="hover:text-blue-600 transition-colors font-medium"
              >
                Dashboard Admin
              </Link>
              <span className="text-slate-400">/</span>
              <Link 
                href="/admin/pendaftaran" 
                className="hover:text-blue-600 transition-colors font-medium"
              >
                Verifikasi Pendaftaran
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Detail Review</span>
            </div>

            {/* Main Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={getStatusVariant(pendaftaran.status)} 
                      className="capitalize shadow-sm text-sm px-3 py-1"
                    >
                      {pendaftaran.status}
                    </Badge>
                  </div>
                </div>
                
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent mb-4 leading-tight">
                  {pendaftaran.judul}
                </h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-200/50">
                    <User className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="text-slate-600 text-xs mb-1">Diajukan oleh</div>
                      <div className="font-semibold text-blue-800">
                        {pendaftaran.users?.nama_lengkap || "N/A"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {pendaftaran.users?.email || "N/A"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-200/50">
                    <Calendar className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="text-slate-600 text-xs mb-1">Tanggal Pengajuan</div>
                      <div className="font-semibold text-slate-800">
                        {new Date(pendaftaran.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(pendaftaran.created_at).toLocaleTimeString("id-ID", {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-200/50 sm:col-span-2">
                    <Hash className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <div>
                      <div className="text-slate-600 text-xs mb-1">ID Pendaftaran</div>
                      <div className="font-mono text-sm text-slate-800 break-all">
                        {pendaftaran.id}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-auto">
                <DownloadPDFButton 
                  pendaftaran={pendaftaran}
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                />
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-blue-200 hover:bg-blue-50 bg-white/80 backdrop-blur-sm"
                >
                  <Link href="/admin/pendaftaran">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions Component */}
        <Card className="border-orange-200/50 bg-gradient-to-br from-orange-50/80 to-white backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MessageSquareWarning className="h-5 w-5 text-orange-600" />
              Aksi Admin
            </CardTitle>
            <CardDescription className="text-slate-600">
              Kelola status dan berikan feedback untuk pendaftaran ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminStatusActions
              pendaftaranId={pendaftaran.id}
              currentStatus={pendaftaran.status}
              currentRevisionNote={pendaftaran.catatan_revisi}
            />
          </CardContent>
        </Card>

        {/* Revision Note Card (Only show if status is revision and has note) */}
        {pendaftaran.status === "revisi" && pendaftaran.catatan_revisi && (
          <Card className="border-red-200/50 bg-gradient-to-br from-red-50/80 to-white backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-red-800 flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5" />
                Catatan Revisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-red-50/50 rounded-lg border border-red-200/50">
                <p className="text-sm text-red-800 leading-relaxed">
                  {pendaftaran.catatan_revisi}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informasi Karya */}
          <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Informasi Karya
              </CardTitle>
              <CardDescription className="text-slate-600">
                Detail informasi karya yang didaftarkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-0">
                <DetailItem label="Judul Karya" value={pendaftaran.judul} />
                <DetailItem label="Produk Hasil" value={pendaftaran.produk_hasil} />
                <DetailItem label="Jenis Karya" value={pendaftaran.jenis_karya} />
                <DetailItem label="Sub Jenis Karya" value={pendaftaran.sub_jenis_karya} />
                <DetailItem label="Deskripsi Karya" value={pendaftaran.deskripsi_karya} />
                <DetailItem 
                  label="Tanggal Diumumkan" 
                  value={pendaftaran.tanggal_diumumkan 
                    ? new Date(pendaftaran.tanggal_diumumkan).toLocaleDateString("id-ID")
                    : "Belum diumumkan"
                  } 
                />
                <DetailItem 
                  label="Kota Diumumkan" 
                  value={pendaftaran.kota_diumumkan || "Belum diumumkan"} 
                />
                <DetailItem 
                  label="Nilai Aset Karya" 
                  value={pendaftaran.nilai_aset_karya 
                    ? `Rp ${pendaftaran.nilai_aset_karya.toLocaleString('id-ID')}`
                    : "Tidak ditetapkan"
                  } 
                />
              </dl>
            </CardContent>
          </Card>

          {/* Data Pencipta */}
          <Card className="border-green-200/50 bg-gradient-to-br from-white to-green-50/30 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Data Pencipta
              </CardTitle>
              <CardDescription className="text-slate-600">
                Informasi lengkap pencipta karya
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendaftaran.pencipta && pendaftaran.pencipta.length > 0 ? (
                <div className="space-y-6">
                  {pendaftaran.pencipta.map((pencipta, index) => (
                    <div key={pencipta.id} className="space-y-4">
                      {pendaftaran.pencipta.length > 1 && (
                        <h4 className="font-semibold text-slate-700 border-b border-slate-200 pb-2">
                          Pencipta {index + 1}
                        </h4>
                      )}
                      <dl className="space-y-0">
                        <DetailItem label="Nama Lengkap" value={pencipta.nama_lengkap} />
                        <DetailItem label="NIK" value={pencipta.nik} />
                        <DetailItem label="NIP/NIM" value={pencipta.nip_nim} />
                        <DetailItem label="Email" value={pencipta.email} />
                        <DetailItem label="No. HP" value={pencipta.no_hp} />
                        <DetailItem label="Jenis Kelamin" value={pencipta.jenis_kelamin} />
                        <DetailItem label="Fakultas" value={pencipta.fakultas} />
                        <DetailItem label="Program Studi" value={pencipta.program_studi} />
                        <DetailItem label="Kewarganegaraan" value={pencipta.kewarganegaraan} />
                        <DetailItem label="Negara" value={pencipta.negara} />
                        <DetailItem label="Provinsi" value={pencipta.provinsi} />
                        <DetailItem label="Kota" value={pencipta.kota} />
                        <DetailItem label="Kecamatan" value={pencipta.kecamatan} />
                        <DetailItem label="Kelurahan" value={pencipta.kelurahan} />
                        <DetailItem label="Alamat Lengkap" value={pencipta.alamat_lengkap} />
                        <DetailItem label="Kode Pos" value={pencipta.kode_pos} />
                      </dl>
                      {pencipta.scan_ktp_url && (
                        <div className="mt-4">
                          <FilePreviewLink
                            url={pencipta.scan_ktp_url}
                            label={`Scan KTP ${pencipta.nama_lengkap}`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <User className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p>Data pencipta belum tersedia</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* File Attachments */}
        <Card className="border-purple-200/50 bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-purple-600" />
              File Lampiran
            </CardTitle>
            <CardDescription className="text-slate-600">
              Dokumen pendukung yang diunggah pemohon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FilePreviewLink
                url={pendaftaran.lampiran_karya_url}
                label="Lampiran Karya"
              />
              <FilePreviewLink
                url={pendaftaran.bukti_transfer_url}
                label="Bukti Transfer"
              />
              <FilePreviewLink
                url={pendaftaran.surat_pernyataan_url}
                label="Surat Pernyataan"
              />
              <FilePreviewLink
                url={pendaftaran.surat_pengalihan_url}
                label="Surat Pengalihan"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sertifikat HKI Upload Section - Only show for approved status */}
        {pendaftaran.status === "approved" && (
          <SertifikatUpload
            pendaftaranId={pendaftaran.id}
            currentSertifikat={{
              url: pendaftaran.sertifikat_hki_url || null,
              filename: pendaftaran.sertifikat_hki_filename || null,
              uploadedAt: pendaftaran.sertifikat_uploaded_at || null,
              uploadedBy: pendaftaran.sertifikat_uploaded_by || null
            }}
          />
        )}
      </div>
    </div>
  );
}
