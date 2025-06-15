// src/lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// BENAR: Fungsi ini harus ASYNC karena cookies() mengembalikan Promise
export async function createClient() {
  // BENAR: Kita HARUS menggunakan await untuk mendapatkan cookie store
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Diharapkan terjadi di Server Component, diabaikan jika ada middleware
          }
        },
      },
    }
  )
}