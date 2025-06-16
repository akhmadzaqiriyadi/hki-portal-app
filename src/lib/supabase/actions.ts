"use server";


import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { StatusPendaftaran, Pencipta } from "../types";
import { AuthError } from "@supabase/supabase-js";
import type { PendaftaranWithPemohon } from "../types";
import { createClient, createAdminClient } from "./server"; 



//================================================================
// TIPE DATA & SKEMA VALIDASI (ZOD)
//================================================================

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

const PendaftaranBaruSchema = z.object({
  // Informasi Karya
  judul: z.string().min(5, "Judul karya wajib diisi."),
  produk_hasil: z.string().optional(),
  jenis_karya: z.string().min(1, "Jenis karya harus dipilih."),
  sub_jenis_karya: z.string().optional(),
  nilai_aset_karya: z.coerce.number().optional(),
  kota_diumumkan: z.string().optional(),
  tanggal_diumumkan: z.string().min(1, "Tanggal diumumkan wajib diisi."),
  deskripsi_karya: z.string().min(20, "Deskripsi minimal 20 karakter."),
  
  lampiran_karya_url: z.string().optional(),
  bukti_transfer_url: z.string().optional(),
  surat_pernyataan_url: z.string().optional(),
  surat_pengalihan_url: z.string().optional(),
  
  // Data Pencipta
  pencipta: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Minimal harus ada satu pencipta." });
        return z.NEVER;
      }
      return parsed; // Data pencipta akan divalidasi lebih lanjut di level database/RPC jika perlu
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Format data pencipta tidak valid." });
      return z.NEVER;
    }
  })
});

//================================================================
// FUNGSI HELPER (INTERNAL)
//================================================================

async function checkAdmin() {
    // ✅ Gunakan client khusus untuk admin
    const supabase = await createAdminClient(); 

    // ✅ Pengecekan user tetap menggunakan client biasa untuk keamanan
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) throw new Error("Otentikasi diperlukan.");

    // Query ke tabel 'users' sekarang melewati RLS
    const { data: profile, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || profile?.role !== 'Admin') {
      throw new Error('Akses ditolak. Aksi ini hanya untuk admin.');
    }
    return user;
}


//================================================================
// SERVER ACTIONS
//================================================================

/**
 * Action untuk membuat Pendaftaran HKI baru dari form.
 * @param penciptaList - Array data pencipta yang dikelola di state client.
 * @param prevState - State sebelumnya dari `useFormState`.
 * @param formData - Data dari elemen <form> yang memanggil action ini.
 * @returns Object FormState yang berisi status keberhasilan atau kegagalan.
 */

/**
 * Action untuk membuat Pendaftaran HKI baru.
 * Disederhanakan untuk dipanggil sebagai fungsi async biasa dari react-hook-form.
 */
export async function createNewRegistration(formData: FormData): Promise<FormState> {
  // Validasi tetap berjalan seperti biasa
  const validatedFields = PendaftaranBaruSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validasi Gagal.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Cek otentikasi
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Otentikasi diperlukan." };
  }
  
  const { pencipta, ...pendaftaranData } = validatedFields.data;

  // Panggil RPC
  const { error } = await supabase.rpc('handle_new_pendaftaran', {
      user_id_input: user.id,
      pendaftaran_data: pendaftaranData,
      pencipta_data: pencipta
  });

  if (error) {
    console.error("RPC Error:", error);
    return { success: false, message: `Gagal menyimpan data: ${error.message}` };
  }

  // Jika berhasil, revalidasi path dan redirect
  revalidatePath("/dashboard");
  redirect("/dashboard");
}


/**
 * (Hanya Admin) Action untuk mengubah status sebuah pendaftaran.
 * @param pendaftaranId - ID pendaftaran yang akan diubah.
 * @param newStatus - Status baru ('review', 'revisi', 'approved', 'rejected').
 * @returns Object FormState yang berisi status keberhasilan atau kegagalan.
 */
export async function updateRegistrationStatus(
  pendaftaranId: string,
  newStatus: StatusPendaftaran
): Promise<FormState> {
  try {
    await checkAdmin(); // Pastikan hanya admin yang bisa menjalankan ini
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("pendaftaran")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", pendaftaranId);

    if (error) throw error; // Lempar error untuk ditangkap oleh blok catch

    revalidatePath("/admin/pendaftaran"); // Update list di halaman admin
    revalidatePath(`/dashboard/pendaftaran/${pendaftaranId}`); // Update halaman detail
    return { success: true, message: `Status pendaftaran berhasil diubah menjadi ${newStatus}.` };

  } catch (e) {
    const error = e as Error;
    console.error("Update Status Error:", error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Action untuk memperbarui URL file di database setelah berhasil diunggah ke Storage.
 * @param pendaftaranId - ID pendaftaran terkait.
 * @param fileType - Nama kolom di database (contoh: 'bukti_transfer_url').
 * @param fileUrl - URL publik dari file yang baru diunggah.
 * @returns Object FormState yang berisi status keberhasilan atau kegagalan.
 */
export async function updatePendaftaranFileUrl(
    pendaftaranId: string,
    fileType: 'bukti_transfer_url' | 'surat_pernyataan_url' | 'surat_pengalihan_url' | 'lampiran_karya_url',
    fileUrl: string
): Promise<FormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Otentikasi diperlukan." };
    
    // Verifikasi apakah pengguna adalah pemilik pendaftaran tersebut
    const { data: registration, error: ownerError } = await supabase
        .from('pendaftaran')
        .select('user_id')
        .eq('id', pendaftaranId)
        .single();

    if (ownerError || registration?.user_id !== user.id) {
        return { success: false, message: "Akses ditolak. Anda bukan pemilik pendaftaran ini." };
    }

    const { error } = await supabase
        .from('pendaftaran')
        .update({ [fileType]: fileUrl, updated_at: new Date().toISOString() })
        .eq('id', pendaftaranId);

    if (error) {
        console.error("Update File URL Error:", error.message);
        return { success: false, message: `Gagal memperbarui tautan file: ${error.message}` };
    }

    revalidatePath(`/dashboard/pendaftaran/${pendaftaranId}`);
    return { success: true, message: "File berhasil ditautkan." };
}


// Skema validasi untuk form login (tidak berubah)
const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

/**
 * Action untuk menangani login pengguna dengan email dan password.
 * ✅ Diperbarui untuk mengarahkan pengguna berdasarkan peran (Admin/User).
 */
export async function login(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Data tidak valid.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // 1. Lakukan proses login ke Supabase
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    if (loginError instanceof AuthError && loginError.message.includes("Invalid login credentials")) {
        return { success: false, message: "Email atau Password salah." };
    }
    console.error("Login Error:", loginError);
    return { success: false, message: "Terjadi kesalahan pada server. Coba lagi nanti." };
  }

  // ✅ LANGKAH BARU: Jika login berhasil, cek peran pengguna
  if (loginData.user) {
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", loginData.user.id)
      .single();

    // Revalidasi path untuk memastikan sesi diperbarui di seluruh aplikasi
    revalidatePath("/", "layout");

    // ✅ Arahkan berdasarkan peran
    if (userProfile?.role === 'Admin') {
      console.log("User is Admin, redirecting to admin dashboard.");
      redirect("/admin/dashboard");
    } else {
      console.log("User is a regular User, redirecting to user dashboard.");
      redirect("/dashboard");
    }
  }

  return { success: false, message: "Gagal mendapatkan data pengguna setelah login." };
}


// Skema validasi untuk form registrasi
const RegisterSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(8, "Password minimal 8 karakter."),
  confirmPassword: z.string()
})
// Gunakan .refine untuk validasi kustom (memastikan password cocok)
.refine(data => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok.",
    path: ["confirmPassword"], // Menentukan field mana yang akan menampilkan error
});


/**
 * Action untuk menangani registrasi pengguna baru.
 * @param prevState - State sebelumnya dari `useActionState`.
 * @param formData - Data dari elemen <form> yang memanggil action ini.
 * @returns Object FormState yang berisi status keberhasilan atau kegagalan.
 */
export async function register(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validasi input menggunakan Zod
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Data tidak valid.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const supabase = await createClient();
  const { nama_lengkap, email, password } = validatedFields.data;
  
  // 2. Lakukan proses signUp ke Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Data tambahan yang akan disimpan saat user dibuat
      // Ini akan memicu trigger di Supabase untuk mengisi tabel `users` (profiles)
      data: {
        nama_lengkap: nama_lengkap,
        role: 'User' // Set role default
      }
    }
  });

  if (error) {
    console.error("Register Error:", error);
    // Cek jika error karena email sudah terdaftar
    if (error.message.includes("User already registered")) {
        return { success: false, message: "Email ini sudah terdaftar. Silakan gunakan email lain."};
    }
    return { success: false, message: `Terjadi kesalahan: ${error.message}` };
  }

  // 3. Cek apakah email konfirmasi perlu dikirim
  // data.user.identities[0].identity_data.email
  if (data.user && data.user.identities && data.user.identities.length > 0) {
      return { success: true, message: "Registrasi berhasil! Silakan periksa inbox email Anda untuk verifikasi." };
  }

  return { success: false, message: "Terjadi kesalahan yang tidak diketahui. Coba lagi." };
}


/**
 * Mengambil semua data pendaftaran HKI yang diajukan oleh pengguna
 * yang sedang login saat ini.
 * Ini adalah fungsi 'read-only' untuk mengambil data.
 * @returns Object yang berisi `data` (array pendaftaran) atau `error`.
 */
export async function getMyRegistrations() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Sebenarnya ini tidak akan terjadi karena halaman dashboard sudah diproteksi,
      // namun ini adalah praktik pengamanan yang baik.
      throw new Error("User tidak terautentikasi.");
    }

    const { data, error } = await supabase
      .from("pendaftaran")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      // Lempar error jika query ke database gagal
      throw error;
    }

    // Jika berhasil, kembalikan datanya
    return { data, error: null };

  } catch (e) {
    const error = e as Error;
    console.error("Gagal mengambil data pendaftaran:", error.message);
    // Kembalikan format yang konsisten
    return { data: null, error: { message: error.message } };
  }
}


/**
 * Action untuk logout pengguna.
 * Menghapus sesi pengguna dan mengarahkannya ke halaman utama.
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Menghapus satu data pendaftaran berdasarkan ID.
 * Termasuk pengecekan keamanan untuk memastikan pengguna adalah pemilik data.
 */
export async function deleteRegistration(pendaftaranId: string): Promise<FormState> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Otentikasi diperlukan.");
    }

    // Keamanan: Ambil data dulu untuk memastikan user adalah pemiliknya
    const { data: existingData, error: fetchError } = await supabase
      .from("pendaftaran")
      .select("id, user_id")
      .eq("id", pendaftaranId)
      .single();

    if (fetchError || !existingData) {
      throw new Error("Pendaftaran tidak ditemukan.");
    }

    if (existingData.user_id !== user.id) {
      throw new Error("Akses ditolak. Anda bukan pemilik pendaftaran ini.");
    }

    // Jika semua pengecekan lolos, hapus data
    const { error: deleteError } = await supabase
      .from("pendaftaran")
      .delete()
      .eq("id", pendaftaranId);
      
    if (deleteError) {
      throw deleteError;
    }

    // Revalidasi halaman ini agar data di tabel diperbarui
    revalidatePath("/dashboard/pendaftaran");
    return { success: true, message: "Pendaftaran berhasil dihapus." };

  } catch (e) {
    const error = e as Error;
    return { success: false, message: error.message };
  }
}

export async function getRegistrationById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pendaftaran")
    .select("*, pencipta(*)") // Bintang `*` di pencipta berarti "ambil semua kolom"
    .eq("id", id)
    .single(); 

  // ... (error handling)
  return { data, error };
}


/**
 * Memfinalisasi pendaftaran, mengubah status dari 'draft' menjadi 'submitted'.
 * Termasuk pengecekan keamanan untuk memastikan hanya pemilik yang bisa finalisasi.
 */
export async function finalizeRegistration(pendaftaranId: string): Promise<FormState> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Otentikasi diperlukan.");
    }

    // Keamanan: Ambil data untuk memastikan user adalah pemilik & statusnya adalah 'draft'
    const { data: existingData, error: fetchError } = await supabase
      .from("pendaftaran")
      .select("user_id, status")
      .eq("id", pendaftaranId)
      .single();

    if (fetchError || !existingData) {
      throw new Error("Pendaftaran tidak ditemukan.");
    }

    if (existingData.user_id !== user.id) {
      throw new Error("Akses ditolak.");
    }
    
    if (existingData.status !== 'draft') {
      throw new Error("Hanya pendaftaran dengan status 'draft' yang bisa difinalisasi.");
    }

    // Jika semua pengecekan lolos, update status
    const { error: updateError } = await supabase
      .from("pendaftaran")
      .update({ status: 'submitted', updated_at: new Date().toISOString() })
      .eq("id", pendaftaranId);
      
    if (updateError) {
      throw updateError;
    }

    // Revalidasi halaman agar statusnya terupdate di UI
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/pendaftaran");
    revalidatePath(`/dashboard/pendaftaran/${pendaftaranId}`);
    return { success: true, message: "Pendaftaran berhasil difinalisasi dan dikirim." };

  } catch (e) {
    const error = e as Error;
    return { success: false, message: error.message };
  }
}


/**
 * Action untuk UPDATE pendaftaran yang sudah ada.
 */
export async function updateRegistration(
  pendaftaranId: string,
  formData: FormData
): Promise<FormState> {
  // Validasi data baru menggunakan skema yang sama
  const validatedFields = PendaftaranBaruSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validasi Gagal.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Otentikasi diperlukan." };
  }
  
  const { pencipta, ...pendaftaranData } = validatedFields.data;

  // Panggil RPC function yang baru untuk update
  const { error } = await supabase.rpc('handle_update_pendaftaran', {
      p_id: pendaftaranId,
      pendaftaran_data: pendaftaranData,
      pencipta_data: pencipta
  });

  if (error) {
    console.error("RPC Update Error:", error);
    return { success: false, message: `Gagal memperbarui data: ${error.message}` };
  }

  // Revalidasi semua halaman terkait dan redirect ke halaman detail
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pendaftaran");
  revalidatePath(`/dashboard/pendaftaran/${pendaftaranId}`);
  redirect(`/dashboard/pendaftaran/${pendaftaranId}`);
}

/**
 * (Hanya Admin) Mengambil SEMUA data pendaftaran dari seluruh pengguna,
 * KECUALI yang masih berstatus 'draft'.
 */
export async function getAllRegistrations() {
  try {
    await checkAdmin();
    
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pendaftaran")
      .select(`
        *,
        users ( nama_lengkap )
      `)
      // ✅ PERBAIKAN: Tambahkan filter ini untuk tidak menyertakan status 'draft'
      .neq('status', 'draft') 
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return { data: data as PendaftaranWithPemohon[], error: null };

  } catch (e) {
    const error = e as Error;
    console.error("Gagal mengambil semua data pendaftaran:", error.message);
    return { data: null, error: { message: error.message } };
  }
}


/**
 * (Hanya Admin) Mengambil detail satu pendaftaran berdasarkan ID.
 * Termasuk data pemohon dan semua data pencipta.
 */
export async function getRegistrationByIdForAdmin(pendaftaranId: string) {
  try {
    // Keamanan: Pastikan hanya admin yang bisa menjalankan ini
    await checkAdmin();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pendaftaran")
      // ✅ Hapus 'email' dari select, karena tidak ada di tabel 'users'
      .select(`
        *,
        users ( nama_lengkap, email ),
        pencipta ( * )
      `)
      .eq("id", pendaftaranId)
      .single();

    if (error) {
      throw error;
    }

    // Tipe PendaftaranWithPemohon sudah tidak memerlukan email, jadi ini aman
    return { data: data as PendaftaranWithPemohon & { pencipta: Pencipta[] }, error: null };
    
  } catch (e) {
    const error = e as Error;
    console.error("Gagal mengambil detail pendaftaran untuk admin:", error.message);
    return { data: null, error: { message: error.message } };
  }
}