import { getRegistrationById } from "@/lib/supabase/actions";
import { notFound } from "next/navigation";
import { PendaftaranBaruForm } from "@/components/features/pendaftaran/PendaftaranBaruForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Pencipta } from "@/lib/types";

// Tipe props halaman tidak perlu diubah
type EditPendaftaranPageProps = {
  params: {
    id: string;
  };
};

export default async function EditPendaftaranPage({
  params,
}: EditPendaftaranPageProps) {
  // ✅ PERBAIKAN: 'await' params sebelum digunakan untuk mendapatkan 'id'
  const { id } = await params;

  // Gunakan 'id' yang sudah di-await
  const { data: pendaftaran, error } = await getRegistrationById(id);

  if (error || !pendaftaran) {
    notFound();
  }

  // Keamanan: Hanya izinkan edit jika statusnya 'draft'
  if (pendaftaran.status !== "draft") {
    return (
      <div className="container mx-auto max-w-2xl py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Akses Ditolak</AlertTitle>
          <AlertDescription>
            Pendaftaran ini sudah tidak bisa diubah karena telah difinalisasi
            atau sedang dalam proses review.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Transformasi data untuk mencegah error 'uncontrolled input'
  const formInitialData = {
    judul: pendaftaran.judul || "",
    produk_hasil: pendaftaran.produk_hasil || "",
    jenis_karya: pendaftaran.jenis_karya || "",
    sub_jenis_karya: pendaftaran.sub_jenis_karya || "",
    nilai_aset_karya: pendaftaran.nilai_aset_karya || undefined,
    kota_diumumkan: pendaftaran.kota_diumumkan || "",
    deskripsi_karya: pendaftaran.deskripsi_karya || "",
    tanggal_diumumkan: pendaftaran.tanggal_diumumkan
      ? new Date(pendaftaran.tanggal_diumumkan)
      : undefined,
    lampiran_karya_url: pendaftaran.lampiran_karya_url || undefined,
    bukti_transfer_url: pendaftaran.bukti_transfer_url || undefined,
    surat_pernyataan_url: pendaftaran.surat_pernyataan_url || undefined,
    surat_pengalihan_url: pendaftaran.surat_pengalihan_url || undefined,
    pencipta: pendaftaran.pencipta.map((p: Pencipta) => ({
      nama_lengkap: p.nama_lengkap || "",
      nik: p.nik || "",
      nip_nim: p.nip_nim || "",
      email: p.email || "",
      jenis_kelamin: p.jenis_kelamin || "",
      no_hp: p.no_hp || "",
      fakultas: p.fakultas || "",
      program_studi: p.program_studi || "",
      kewarganegaraan: p.kewarganegaraan || "Indonesia",
      negara: p.negara || "Indonesia",
      provinsi: p.provinsi || "",
      kota: p.kota || "",
      kecamatan: p.kecamatan || "",
      kelurahan: p.kelurahan || "",
      alamat_lengkap: p.alamat_lengkap || "",
      kode_pos: p.kode_pos || "",
      scan_ktp_url: p.scan_ktp_url || undefined,
    })),
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Pendaftaran HKI</h1>
      <PendaftaranBaruForm
        initialData={formInitialData}
        pendaftaranId={pendaftaran.id}
      />
    </div>
  );
}