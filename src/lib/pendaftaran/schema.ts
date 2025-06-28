// src/lib/pendaftaran/schema.ts

import { z } from "zod";

export const pemilikOptions = ["Civitas Akademik UTY", "Umum"] as const;

export const formSchema = z
  .object({
    // 1. Field baru ditambahkan
    jenis_pemilik: z.enum(pemilikOptions, {
      required_error: "Jenis pemilik wajib dipilih.",
    }),
    judul: z.string().min(5, "Judul karya wajib diisi."),
    produk_hasil: z.string().min(1, "Produk hasil wajib diisi."),
    jenis_karya: z.string().min(1, "Jenis karya harus dipilih."),
    sub_jenis_karya: z.string().min(1, "Sub-jenis karya wajib diisi."),
    nilai_aset_karya: z.coerce.number().min(1, "Nilai aset karya wajib diisi."),
    kota_diumumkan: z.string().min(1, "Kota diumumkan wajib diisi."),
    tanggal_diumumkan: z.date({
      required_error: "Tanggal diumumkan wajib diisi.",
    }),
    deskripsi_karya: z.string().min(20, "Deskripsi minimal 20 karakter."),

    // 2. Field upload dibuat wajib dan KTP kolektif ditambahkan
    lampiran_karya_url: z
      .string()
      .min(1, "Lampiran contoh karya wajib diunggah."),
    bukti_transfer_url: z.string().min(1, "Bukti transfer wajib diunggah."),
    surat_pernyataan_url: z.string().min(1, "Surat pernyataan wajib diunggah."),
    scan_ktp_kolektif_url: z
      .string()
      .min(1, "Scan KTP kolektif wajib diunggah."),
    surat_pengalihan_url: z.string().optional(),

    pencipta: z
      .array(
        z.object({
          nama_lengkap: z.string().min(3, "Nama lengkap wajib diisi."),
          nik: z
            .string()
            .min(16, "NIK harus 16 digit.")
            .max(16, "NIK harus 16 digit."),
          nip_nim: z.string().min(1, "NIP/NIM wajib diisi."),
          email: z.string().email("Format email tidak valid."),
          jenis_kelamin: z.string().min(1, "Jenis kelamin wajib dipilih."),
          no_hp: z.string().min(10, "No HP minimal 10 digit."),
          fakultas: z.string().min(1, "Fakultas wajib diisi."),
          program_studi: z.string().min(1, "Program studi wajib diisi."),
          kewarganegaraan: z.string().min(1, "Kewarganegaraan wajib diisi."),
          negara: z.string().min(1, "Negara wajib diisi."),
          provinsi: z.string().min(1, "Provinsi wajib diisi."),
          kota: z.string().min(1, "Kota wajib diisi."),
          kecamatan: z.string().min(1, "Kecamatan wajib diisi."),
          kelurahan: z.string().min(1, "Kelurahan wajib diisi."),
          alamat_lengkap: z.string().min(10, "Alamat lengkap wajib diisi."),
          kode_pos: z.string().min(5, "Kode pos wajib diisi."),
        })
      )
      .min(1, "Minimal harus ada satu pencipta."),
  })
  // 4. Validasi kondisional ditambahkan
  .superRefine((data, ctx) => {
    if (data.jenis_pemilik === "Umum" && !data.surat_pengalihan_url) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Surat Pengalihan Hak wajib diunggah untuk pendaftar Umum.",
        path: ["surat_pengalihan_url"],
      });
    }
  });

export type FormValues = z.infer<typeof formSchema>;

export const defaultPencipta = {
  nama_lengkap: "",
  nik: "",
  nip_nim: "",
  email: "",
  jenis_kelamin: "",
  no_hp: "",
  fakultas: "",
  program_studi: "",
  kewarganegaraan: "Indonesia",
  negara: "Indonesia",
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  alamat_lengkap: "",
  kode_pos: "",
};