// src/lib/types.ts

/**
 * Tipe data untuk merepresentasikan status dalam alur kerja pendaftaran.
 * Sesuai dengan ENUM 'status_pendaftaran' di database.
 */
export type StatusPendaftaran =
  | "draft"
  | "submitted"
  | "review"
  | "revisi"
  | 'diproses_hki'
  | "approved"
  | "rejected";

/**
 * Tipe data untuk merepresentasikan peran pengguna.
 * Sesuai dengan ENUM 'role_pengguna' di database.
 */
export type UserRole = "User" | "Admin";

/**
 * Tipe data untuk merepresentasikan jenis kelamin.
 * Sesuai dengan ENUM 'jenis_kelamin_enum' di database.
 */
export type JenisKelamin = "Laki-laki" | "Perempuan";

/**
 * Merepresentasikan data seorang pencipta.
 * Sesuai dengan tabel 'pencipta' di database.
 */
export interface Pencipta {
  id: string; // uuid
  pendaftaran_id: string; // uuid
  nama_lengkap: string;
  nik: string | null;
  nip_nim: string | null;
  email: string | null;
  jenis_kelamin: JenisKelamin | null;
  no_hp: string | null;
  fakultas: string | null;
  program_studi: string | null;
  kewarganegaraan: string | null;
  negara: string | null;
  provinsi: string | null;
  kota: string | null;
  kecamatan: string | null;
  kelurahan: string | null;
  alamat_lengkap: string | null;
  kode_pos: string | null;
  scan_ktp_url: string | null;
  created_at: string; // timestamptz
}

/**
 * Merepresentasikan data inti dari satu pendaftaran HKI.
 * Sesuai dengan tabel 'pendaftaran' di database.
 */
export interface Pendaftaran {
  id: string; // uuid
  user_id: string; // uuid
  judul: string;
  produk_hasil: string | null;
  jenis_karya: string | null;
  sub_jenis_karya: string | null;
  nilai_aset_karya: number | null; // bigint
  kota_diumumkan: string | null;
  tanggal_diumumkan: string | null; // date
  deskripsi_karya: string | null;
  lampiran_karya_url: string | null;
  bukti_transfer_url: string | null;
  surat_pernyataan_url: string | null;
  surat_pengalihan_url: string | null;
  status: StatusPendaftaran;
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
  catatan_revisi?: string | null;
}

/**
 * Tipe gabungan yang sering digunakan: Pendaftaran beserta semua data penciptanya.
 */
export interface PendaftaranWithPencipta extends Pendaftaran {
  pencipta: Pencipta[];
}

/**
 * Merepresentasikan profil pengguna yang disimpan di tabel 'users'.
 */
export interface UserProfile {
  id: string; // uuid, foreign key ke auth.users
  nama_lengkap: string | null;
  role: UserRole;
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
}

/**
 * Tipe gabungan untuk data pendaftaran beserta data pemohonnya (user).
 */
export interface PendaftaranWithPemohon extends Pendaftaran {
  users: {
    nama_lengkap: string | null;
    email: string | null;
  } | null;
}