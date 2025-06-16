// Lokasi File: src/lib/supabase/server.ts

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat Supabase client untuk penggunaan di sisi server (Server Components, Server Actions).
 * Menggunakan kredensial pengguna biasa (ANON KEY).
 * Menghormati RLS.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Diharapkan terjadi di Server Component, diabaikan jika ada middleware
          }
        },
      },
    }
  );
}

/**
 * Membuat Supabase client KHUSUS ADMIN untuk penggunaan di sisi server.
 * Menggunakan SERVICE ROLE KEY untuk melewati semua kebijakan RLS.
 * HANYA digunakan untuk operasi server yang terpercaya (seperti memeriksa peran).
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ✅ Menggunakan service role key
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ...
          }
        },
      },
      // Penting untuk memberitahu Supabase bahwa client ini punya hak istimewa
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}