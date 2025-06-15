import { getRegistrationById } from "@/lib/supabase/actions";
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
  Edit,
} from "lucide-react";
import type { StatusPendaftaran } from "@/lib/types";
import { FinalizeButton } from "@/components/features/pendaftaran/FinalizeButton";

// Helper untuk Badge Status
const getStatusVariant = (status: StatusPendaftaran) => {
  switch (status) {
    case "approved":
      return "success";
    case "revisi":
      return "destructive";
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 py-2 border-b">
      <dt className="text-sm font-semibold text-muted-foreground">{label}</dt>
      <dd className="text-sm col-span-2">{value}</dd>
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
      <div className="p-4 border rounded-lg text-center bg-muted/50">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          Tidak ada file yang diunggah.
        </p>
      </div>
    );
  }

  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].some((ext) =>
    url.toLowerCase().endsWith(ext)
  );

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="border rounded-lg p-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isImage ? (
            <ImageIcon className="h-8 w-8 text-primary" />
          ) : (
            <FileText className="h-8 w-8 text-primary" />
          )}
          <span
            className="text-sm truncate max-w-[200px]"
            title={url.split("/").pop()?.split("_").slice(1).join("_")}
          >
            {url.split("/").pop()?.split("_").slice(1).join("_")}
          </span>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={url} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" /> Lihat
          </Link>
        </Button>
      </div>
      {isImage && (
        <div className="relative w-full h-48 rounded-md overflow-hidden border">
          <Image
            src={url}
            alt={`Preview ${label}`}
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}
    </div>
  );
}

export default async function DetailPendaftaranPage({
  params,
}: {
  // Tipe props tidak perlu diubah, Next.js menangani ini secara internal
  params: { id: string };
}) {
  // ✅ PERBAIKAN UTAMA: 'await' params sebelum mengambil propertinya
  const { id } = await params;

  // Gunakan 'id' yang sudah di-await untuk mengambil data
  const { data: pendaftaran, error } = await getRegistrationById(id);

  if (error || !pendaftaran) {
    notFound();
  }

  const isDraft = pendaftaran.status === "draft";

  return (
    <div className="space-y-6">
      {/* --- Bagian Header Utama --- */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {pendaftaran.judul}
          </h1>
          <p className="text-muted-foreground">
            Diajukan pada:{" "}
            {new Date(pendaftaran.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {isDraft ? (
          <div className="flex items-center gap-2 flex-shrink-0 mt-2">
            <Button asChild variant="outline">
              <Link href={`/dashboard/pendaftaran/${pendaftaran.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <FinalizeButton pendaftaranId={pendaftaran.id} />
          </div>
        ) : (
          <Badge
            variant={getStatusVariant(pendaftaran.status)}
            className="text-base py-1 px-3 capitalize"
          >
            {pendaftaran.status}
          </Badge>
        )}
      </div>

      {/* --- Detail Karya --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" /> Informasi Karya
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-1">
            <DetailItem label="Produk Hasil" value={pendaftaran.produk_hasil} />
            <DetailItem label="Jenis Karya" value={pendaftaran.jenis_karya} />
            <DetailItem
              label="Sub-Jenis Karya"
              value={pendaftaran.sub_jenis_karya}
            />
            <DetailItem
              label="Nilai Aset (Rp)"
              value={pendaftaran.nilai_aset_karya?.toLocaleString("id-ID")}
            />
            <DetailItem
              label="Kota Diumumkan"
              value={pendaftaran.kota_diumumkan}
            />
            <DetailItem
              label="Tanggal Diumumkan"
              value={
                pendaftaran.tanggal_diumumkan
                  ? new Date(pendaftaran.tanggal_diumumkan).toLocaleDateString(
                      "id-ID",
                      { year: "numeric", month: "long", day: "numeric" }
                    )
                  : null
              }
            />
            <DetailItem label="Deskripsi" value={pendaftaran.deskripsi_karya} />
          </dl>
        </CardContent>
      </Card>

      {/* --- Detail Pencipta --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" /> Data Pencipta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {pendaftaran.pencipta.map((p, index) => (
            <div
              key={p.id}
              className="border p-4 rounded-lg bg-muted/20 space-y-4"
            >
              <h3 className="font-semibold text-lg">Pencipta {index + 1}</h3>
              <dl className="space-y-1">
                <DetailItem label="Nama Lengkap" value={p.nama_lengkap} />
                <DetailItem label="NIK" value={p.nik} />
                <DetailItem label="NIP / NIM" value={p.nip_nim} />
                <DetailItem label="Email" value={p.email} />
                <DetailItem label="No. HP" value={p.no_hp} />
                <DetailItem label="Jenis Kelamin" value={p.jenis_kelamin} />
                <DetailItem label="Fakultas" value={p.fakultas} />
                <DetailItem label="Program Studi" value={p.program_studi} />
                <DetailItem label="Alamat" value={p.alamat_lengkap} />
                <DetailItem label="Kewarganegaraan" value={p.kewarganegaraan} />
              </dl>
              {/* ✅ TAMBAHAN: Menampilkan preview Scan KTP untuk setiap pencipta */}
              <div className="pt-4 border-t">
                <FilePreviewLink
                  url={p.scan_ktp_url}
                  label="Scan KTP Pencipta"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* --- Dokumen Terlampir --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5" /> Dokumen Pendaftaran
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <FilePreviewLink
            url={pendaftaran.lampiran_karya_url}
            label="Lampiran Contoh Karya"
          />
          <FilePreviewLink
            url={pendaftaran.bukti_transfer_url}
            label="Bukti Transfer Pembayaran"
          />
          <FilePreviewLink
            url={pendaftaran.surat_pernyataan_url}
            label="Surat Pernyataan"
          />
          <FilePreviewLink
            url={pendaftaran.surat_pengalihan_url}
            label="Surat Pengalihan Hak"
          />
        </CardContent>
      </Card>
    </div>
  );
}
