import { getRegistrationById } from "@/lib/supabase/actions";
import { notFound } from "next/navigation";
import { PendaftaranBaruForm } from "@/components/features/pendaftaran/PendaftaranBaruForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Pencipta } from "@/lib/types";

// ✅ PERBAIKAN: Gunakan `params` langsung seperti biasa di Server Component
export default async function EditPendaftaranPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // PENTING: Pastikan fungsi ini melakukan SELECT pada semua kolom yang dibutuhkan!
  const { data: pendaftaran, error } = await getRegistrationById(id);

  if (error || !pendaftaran) {
    notFound();
  }

  // Jika status bukan 'draft' atau 'revisi', tolak akses edit
  if (pendaftaran.status !== "draft" && pendaftaran.status !== "revisi") {
    return (
      <div className="container mx-auto max-w-2xl py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Akses Ditolak</AlertTitle>
          <AlertDescription>
            Pendaftaran dengan status "{pendaftaran.status}" sudah tidak bisa
            diubah lagi.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // ====================================================================
  // ▼▼▼ PERBAIKAN UTAMA DI SINI ▼▼▼
  // ====================================================================
  // Transformasi data untuk memastikan semua field ada dan mencegah error.
  const formInitialData = {
    // Data yang sudah ada di kode Anda
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

    // --- KOLOM YANG HILANG DITAMBAHKAN DI SINI ---
    jenis_pemilik: pendaftaran.jenis_pemilik || undefined,
    scan_ktp_kolektif_url: pendaftaran.scan_ktp_kolektif_url || undefined,
    // ---------------------------------------------

    // Perbaikan pada mapping 'pencipta'
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
      provinsi: p.provinsi || "", // Ini akan diisi dengan nama, bukan ID, jika data lama
      kota: p.kota || "",
      kecamatan: p.kecamatan || "",
      kelurahan: p.kelurahan || "",
      alamat_lengkap: p.alamat_lengkap || "",
      kode_pos: p.kode_pos || "",
      // 'scan_ktp_url' perorangan sudah tidak ada, jadi kita hapus
    })),
  };
  // ====================================================================
  // ▲▲▲ BATAS AKHIR PERBAIKAN ▲▲▲
  // ====================================================================

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Pendaftaran Hak Cipta</h1>
        <p className="text-muted-foreground">
          Perbarui detail pendaftaran Anda di bawah ini.
        </p>
      </div>
      <PendaftaranBaruForm
        initialData={formInitialData}
        pendaftaranId={pendaftaran.id}
      />
    </div>
  );
}